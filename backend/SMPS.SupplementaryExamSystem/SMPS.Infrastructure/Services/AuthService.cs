using Microsoft.EntityFrameworkCore;
using SMPS.Application.DTOs.Auth;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using SMPS.Domain.Entities;
using SMPS.Infrastructure.Security; // Assuming your TokenService lives here
using System;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IApplicationDbContext _context;
        private readonly TokenService _tokenService;

        public AuthService(IApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<Admin?> GetAdminByEmailAsync(string email)
            => await _context.Admins
                .FirstOrDefaultAsync(i => i.Email == email);

        public async Task<AuthResponseDto> AdminLoginAsync(AdminLoginRequestDto request)
        {
            // 1. Find Admin by Email
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == request.Email);
            if (admin == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // 2. Verify Password using BCrypt
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash);
            if (!isPasswordValid)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // 3. Generate JWT Token (Hardcoding the "Admin" role)
            var token = _tokenService.GenerateToken(admin.Id, admin.Email, admin.Role);

            // 4. Return the payload expected by React
            return new AuthResponseDto
            {
                Token = token,
                Name = $"{admin.FirstName} {admin.LastName}".Trim(),
                Email = admin.Email
            };
        }
    }
}