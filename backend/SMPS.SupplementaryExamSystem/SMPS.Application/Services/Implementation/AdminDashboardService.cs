using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SMPS.Application.Services.Interfaces;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.Interfaces;
using SMPS.Domain.Enums;

namespace SMPS.Infrastructure.Services
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IApplicationDbContext _context;

        public AdminDashboardService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync()
        {
            // Perform asynchronous aggregations directly on the database
            var totalStudents = await _context.Students.CountAsync();

            var totalBookings = await _context.Bookings.CountAsync();

            // Only sum up money that has actually been successfully paid
            var totalRevenue = await _context.PaymentRecords
                .Where(p => p.Status == PaymentStatus.Completed)
                .SumAsync(p => p.Amount);

            var verifiedTickets = await _context.VerificationTickets
                .Where(t => t.IsUsed == true)
                .CountAsync();

            return new AdminDashboardStatsDto
            {
                TotalStudents = totalStudents,
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                VerifiedTickets = verifiedTickets
            };
        }
        public async Task<IEnumerable<AdminTrendDto>> GetBookingTrendsAsync(int days = 30)
        {
            var startDate = System.DateTime.UtcNow.AddDays(-days);

            // 1. Fetch the raw data within the time window
            var recentBookings = await _context.Bookings
                .Include(b => b.ExamUnit)
                .Where(b => b.CreatedAt >= startDate)
                .Select(b => new
                {
                    b.CreatedAt,
                    b.Status,
                    Fee = b.ExamUnit.StandardFee
                })
                .ToListAsync();

            // 2. Group the data by Date in memory to ensure perfect formatting
            var trends = recentBookings
                .GroupBy(b => b.CreatedAt.Date)
                .OrderBy(g => g.Key)
                .Select(g => new AdminTrendDto
                {
                    DateLabel = g.Key.ToString("MMM dd"), // e.g., "Nov 14"
                    BookingCount = g.Count(),
                    Revenue = g.Where(b => b.Status == Domain.Enums.BookingStatus.Paid).Sum(b => b.Fee)
                })
                .ToList();

            return trends;
        }
    }
}