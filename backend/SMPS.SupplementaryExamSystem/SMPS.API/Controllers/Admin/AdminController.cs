using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.DTOs.Auth;
using SMPS.Application.Services.Interfaces;
using SMPS.Domain.Entities;
using SMPS.Infrastructure.Security;
using System.Threading.Tasks;

namespace SMPS.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")] // Strictly Admin only
    public class AdminController : ControllerBase
    {
        private readonly IAdminDashboardService _dashboardService;
        private readonly IAuthService _authService; 
        private readonly IAdminExamUnitService _examUnitService;
        private readonly IAdminStudentService _studentService;

        public AdminController(IAdminDashboardService dashboardService, IAuthService authService, IAdminExamUnitService examUnitService, IAdminStudentService studentService)
        {
            _dashboardService = dashboardService;
            _authService = authService;
            _examUnitService = examUnitService;
            _studentService = studentService;
        }

        
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _dashboardService.GetDashboardStatsAsync();
            return Ok(stats);
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> AdminLogin([FromBody] AdminLoginRequestDto req)
        {
            try
            {
                // 👇 3. Just return the response from the service. It already contains the Token, Name, and Email!
                var response = await _authService.AdminLoginAsync(req);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred during login." });
            }
        }
        
        [HttpGet("exam-units")]
        public async Task<IActionResult> GetExamUnits()
        {
            var units = await _examUnitService.GetAllExamUnitsAsync();
            return Ok(units);
        }
        
        [HttpPost("exam-units")]
        public async Task<IActionResult> CreateExamUnit([FromBody] CreateUpdateExamUnitDto dto)
        {
            try
            {
                var unit = await _examUnitService.CreateExamUnitAsync(dto);
                return Ok(unit);
            }
            catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
        }
        
        [HttpPut("exam-units/{id}")]
        public async Task<IActionResult> UpdateExamUnit(Guid id, [FromBody] CreateUpdateExamUnitDto dto)
        {
            try
            {
                var unit = await _examUnitService.UpdateExamUnitAsync(id, dto);
                return Ok(unit);
            }
            catch (ArgumentException ex) { return NotFound(new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
        }

        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _studentService.GetAllStudentsAsync();
            return Ok(students);
        }
    }
}