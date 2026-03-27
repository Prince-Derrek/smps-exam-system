using Microsoft.AspNetCore.Mvc;
using SMPS.Application.DTOs.Auth;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Security;

namespace SMPS.API.Controllers
{
    [ApiController]
    [Route("api/auth/invigilator")]
    public class InvigilatorAuthController : ControllerBase
    {
        private readonly IInvigilatorRepository _invigilators;
        private readonly IUnitOfWork _uow;
        private readonly TokenService _tokenService;

        public InvigilatorAuthController(
            IInvigilatorRepository invigilators,
            IUnitOfWork uow,
            TokenService tokenService)
        {
            _invigilators = invigilators;
            _uow = uow;
            _tokenService = tokenService;
        }

        // POST api/auth/invigilator/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] InvigilatorRegisterRequest req)
        {
            if (await _invigilators.InvigilatorExistsByEmailAsync(req.Email))
                return Conflict(new { message = "Email already registered." });

            var invigilator = new Invigilator
            {
                Id = Guid.NewGuid(),
                StaffNumber = req.StaffNumber,
                Email = req.Email,
                FullName = req.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            await _invigilators.AddInvigilatorAsync(invigilator);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var token = _tokenService.GenerateToken(invigilator.Id, invigilator.Email, "Invigilator");
            return Ok(new AuthResponse(token, invigilator.Email, "Invigilator", invigilator.FullName));
        }

        // POST api/auth/invigilator/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var invigilator = await _invigilators.GetInvigilatorByEmailAsync(req.Email);

            if (invigilator is null || !BCrypt.Net.BCrypt.Verify(req.Password, invigilator.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials." });

            var token = _tokenService.GenerateToken(invigilator.Id, invigilator.Email, "Invigilator");
            return Ok(new AuthResponse(token, invigilator.Email, "Invigilator", invigilator.FullName));
        }
    }
}
