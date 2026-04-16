using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMPS.Application.Interfaces;

namespace SMPS.API.Controllers
{
    [ApiController]
    [Route("api/tickets")]
    //[Authorize(Roles = "Invigilator,Admin")] // Restrict to authorized scanning personnel
    public class TicketsController : ControllerBase
    {
        private readonly ITicketVerificationService _verificationService;

        public TicketsController(ITicketVerificationService verificationService)
        {
            _verificationService = verificationService;
        }

        [HttpPost("{ticketId}/verify")]
        public async Task<IActionResult> VerifyTicket(Guid ticketId)
        {
            var invigilatorId = GetCurrentUserId();
            if (invigilatorId == Guid.Empty) return Unauthorized("Invalid token claims.");

            try
            {
                var result = await _verificationService.VerifyAndConsumeTicketAsync(ticketId, invigilatorId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                // Ticket already used or unpaid (Maps to frontend's 'message' error handling)
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // Ticket doesn't exist
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "A system error occurred during verification." });
            }
        }
        [HttpGet("history")]
        public async Task<IActionResult> GetScanHistory()
        {
            var invigilatorId = GetCurrentUserId();
            if (invigilatorId == Guid.Empty) return Unauthorized("Invalid token claims.");

            var history = await _verificationService.GetScanHistoryAsync(invigilatorId);
            return Ok(history);
        }

        private Guid GetCurrentUserId()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            return Guid.TryParse(sub, out var id) ? id : Guid.Empty;
        }
    }
}