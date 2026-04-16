using Microsoft.EntityFrameworkCore;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class AdminBookingService : IAdminBookingService
    {
        private readonly IApplicationDbContext _context;

        public AdminBookingService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AdminBookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Student)
                .Include(b => b.ExamUnit)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings.Select(b => new AdminBookingDto
            {
                Id = b.Id,
                StudentName = $"{b.Student.FirstName} {b.Student.LastName}".Trim(),
                RegistrationNumber = b.Student.RegistrationNumber,
                UnitTitle = b.ExamUnit.UnitTitle,
                UnitCode = b.ExamUnit.UnitCode,
                Status = b.Status.ToString(),
                Amount = b.ExamUnit.StandardFee, // Pulling the fee from the unit
                CreatedAt = b.CreatedAt
            });
        }
    }
}