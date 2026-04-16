using System.Collections.Generic;
using System.Threading.Tasks;
using SMPS.Application.DTOs.Admin;

namespace SMPS.Application.Services.Interfaces
{
    public interface IAdminInvigilatorService
    {
        Task<IEnumerable<AdminInvigilatorDto>> GetAllInvigilatorsAsync();
        Task<AdminInvigilatorDto> CreateInvigilatorAsync(CreateInvigilatorDto dto);
    }
}