using Microsoft.AspNetCore.Mvc;
using SMPS.Application.DTOs;
using SMPS.Application.DTOs.Auth;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Security;

namespace SMPS.API.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/student")]
    public class StudentAuthController : ControllerBase
    {
        private readonly IStudentRepository _students;
        private readonly IUnitOfWork _uow;
        private readonly TokenService _tokenService;

        public StudentAuthController(
            IStudentRepository students,
            IUnitOfWork uow,
            TokenService tokenService)
        {
            _students = students;
            _uow = uow;
            _tokenService = tokenService;
        }

        // POST api/auth/student/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] StudentRegisterRequest req)
        {
            if (await _students.StudentExistsByEmailAsync(req.Email))
                return Conflict(new { message = "Email already registered." });

            var student = new Student
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = req.RegistrationNumber,
                Email = req.Email,
                FirstName = req.FirstName,
                LastName = req.LastName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            await _students.AddStudentAsync(student);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var token = _tokenService.GenerateToken(student.Id, student.Email, "Student");
            return Ok(new AuthResponse(token, student.Email, "Student", student.FirstName));
        }

        // POST api/auth/student/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var student = await _students.GetStudentByEmailAsync(req.Email);

            if (student is null || !BCrypt.Net.BCrypt.Verify(req.Password, student.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials." });

            var token = _tokenService.GenerateToken(student.Id, student.Email, "Student");
            return Ok(new AuthResponse(token, student.Email, "Student", student.FirstName));
        }
    }
}
