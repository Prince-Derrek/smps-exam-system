using Microsoft.EntityFrameworkCore;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using SMPS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class AdminInvigilatorService : IAdminInvigilatorService
    {
        private readonly IApplicationDbContext _context;

        public AdminInvigilatorService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AdminInvigilatorDto>> GetAllInvigilatorsAsync()
        {
            var invigilators = await _context.Invigilators
                .Include(i => i.ScannedTickets)
                .OrderBy(i => i.FullName)
                .ToListAsync();

            return invigilators.Select(i => new AdminInvigilatorDto
            {
                Id = i.Id,
                FullName = i.FullName,
                StaffNumber = i.StaffNumber,
                Email = i.Email,
                ScannedCount = i.ScannedTickets.Count
            });
        }

        public async Task<AdminInvigilatorDto> CreateInvigilatorAsync(CreateInvigilatorDto dto)
        {
            // Prevent duplicate emails or staff numbers
            if (await _context.Invigilators.AnyAsync(i => i.Email == dto.Email || i.StaffNumber == dto.StaffNumber))
                throw new InvalidOperationException("An invigilator with this Email or Staff Number already exists.");

            var invigilator = new Invigilator
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                StaffNumber = dto.StaffNumber,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Invigilators.Add(invigilator);
            await _context.SaveChangesAsync(default);

            return new AdminInvigilatorDto
            {
                Id = invigilator.Id,
                FullName = invigilator.FullName,
                StaffNumber = invigilator.StaffNumber,
                Email = invigilator.Email,
                ScannedCount = 0
            };
        }
    }
}