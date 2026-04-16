using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.DTOs.Booking; // Reusing ExamUnitDto from Phase 1

namespace SMPS.Application.Services.Interfaces
{
    public interface IAdminExamUnitService
    {
        Task<IEnumerable<ExamUnitDto>> GetAllExamUnitsAsync();
        Task<ExamUnitDto> CreateExamUnitAsync(CreateUpdateExamUnitDto dto);
        Task<ExamUnitDto> UpdateExamUnitAsync(Guid id, CreateUpdateExamUnitDto dto);
    }
}