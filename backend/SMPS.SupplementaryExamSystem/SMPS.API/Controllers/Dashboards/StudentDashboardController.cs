using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMPS.Application.Features.Students.Queries.GetDashboard;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SMPS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
//[Authorize] // Ensure JWT validation is active
public class StudentsDashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public StudentsDashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<StudentDashboardDto>> GetDashboard()
    {
        // Extract Student ID securely from the JWT token (Do not trust client ID passing)
        var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                  ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(studentIdClaim) || !Guid.TryParse(studentIdClaim, out Guid studentId))
        {
            // Helpful debugging output so you know exactly what is inside the token
            var availableClaims = string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}"));
            return Unauthorized($"Invalid token claims. Available claims: {availableClaims}");
        }

        var query = new GetStudentDashboardQuery(studentId);
        var result = await _mediator.Send(query);

        return Ok(result);
    }
}