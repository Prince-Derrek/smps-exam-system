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
    }
}