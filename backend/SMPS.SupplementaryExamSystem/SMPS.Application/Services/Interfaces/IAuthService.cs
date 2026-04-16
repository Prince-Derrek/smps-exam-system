using SMPS.Application.DTOs.Auth;
using SMPS.Domain.Entities;
using System.Threading.Tasks;

namespace SMPS.Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> AdminLoginAsync(AdminLoginRequestDto request);Task<Admin?> GetAdminByEmailAsync(string email);
    }

    // Standard response format for your frontend
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}