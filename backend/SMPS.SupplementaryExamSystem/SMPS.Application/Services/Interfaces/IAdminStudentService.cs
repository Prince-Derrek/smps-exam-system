using System.Collections.Generic;
using System.Threading.Tasks;
using SMPS.Application.DTOs.Admin;

namespace SMPS.Application.Services.Interfaces
{
    public interface IAdminStudentService
    {
        Task<IEnumerable<StudentAdminDto>> GetAllStudentsAsync();
    }
}