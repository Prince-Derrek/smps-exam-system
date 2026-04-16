using System.Threading.Tasks;
using System.Collections.Generic;
using SMPS.Application.DTOs.Admin;

namespace SMPS.Application.Services.Interfaces
{
    public interface IAdminDashboardService
    {
        Task<AdminDashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<AdminTrendDto>> GetBookingTrendsAsync(int days = 30);
    }
}