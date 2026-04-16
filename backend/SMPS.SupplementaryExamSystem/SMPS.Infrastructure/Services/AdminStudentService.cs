using Microsoft.EntityFrameworkCore;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class AdminStudentService : IAdminStudentService
    {
        private readonly IApplicationDbContext _context;

        public AdminStudentService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StudentAdminDto>> GetAllStudentsAsync()
        {
            var students = await _context.Students
                // Include bookings so we can count them
                .Include(s => s.Bookings)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return students.Select(s => new StudentAdminDto
            {
                Id = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName,
                RegistrationNumber = s.RegistrationNumber,
                Email = s.Email,
                BookingsCount = s.Bookings.Count, // Relational count
                CreatedAt = s.CreatedAt
            });
        }
    }
}