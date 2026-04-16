using Microsoft.EntityFrameworkCore;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.DTOs.Booking;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using SMPS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class AdminExamUnitService : IAdminExamUnitService
    {
        private readonly IApplicationDbContext _context;

        public AdminExamUnitService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExamUnitDto>> GetAllExamUnitsAsync()
        {
            var units = await _context.ExamUnits
                .OrderBy(e => e.UnitCode)
                .ToListAsync();

            return units.Select(e => new ExamUnitDto
            {
                Id = e.Id,
                UnitCode = e.UnitCode,
                UnitTitle = e.UnitTitle,
                StandardFee = e.StandardFee
            });
        }

        public async Task<ExamUnitDto> CreateExamUnitAsync(CreateUpdateExamUnitDto dto)
        {
            if (await _context.ExamUnits.AnyAsync(e => e.UnitCode.ToLower() == dto.UnitCode.ToLower()))
                throw new InvalidOperationException($"An exam unit with code '{dto.UnitCode}' already exists.");

            var newUnit = new ExamUnit
            {
                Id = Guid.NewGuid(),
                UnitCode = dto.UnitCode,
                UnitTitle = dto.UnitTitle,
                StandardFee = dto.StandardFee
            };

            _context.ExamUnits.Add(newUnit);
            await _context.SaveChangesAsync(default);

            return new ExamUnitDto { Id = newUnit.Id, UnitCode = newUnit.UnitCode, UnitTitle = newUnit.UnitTitle, StandardFee = newUnit.StandardFee };
        }

        public async Task<ExamUnitDto> UpdateExamUnitAsync(Guid id, CreateUpdateExamUnitDto dto)
        {
            var unit = await _context.ExamUnits.FindAsync(id);
            if (unit == null) throw new ArgumentException("Exam unit not found.");

            // Ensure we aren't changing the code to one that already exists on another record
            if (await _context.ExamUnits.AnyAsync(e => e.UnitCode.ToLower() == dto.UnitCode.ToLower() && e.Id != id))
                throw new InvalidOperationException($"An exam unit with code '{dto.UnitCode}' already exists.");

            unit.UnitCode = dto.UnitCode;
            unit.UnitTitle = dto.UnitTitle;
            unit.StandardFee = dto.StandardFee;

            await _context.SaveChangesAsync(default);

            return new ExamUnitDto { Id = unit.Id, UnitCode = unit.UnitCode, UnitTitle = unit.UnitTitle, StandardFee = unit.StandardFee };
        }
    }
}