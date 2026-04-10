using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMPS.Application.Interfaces;
using SMPS.Application.DTOs.Booking;

namespace SMPS.API.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    [Authorize(Roles = "Student")] // Restored V1's strict role authorization
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        // We only inject the Service now, keeping the controller perfectly clean!
        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // GET api/bookings/units
        [HttpGet("availableunits")]
        public async Task<IActionResult> GetAvailableUnits()
        {
            var studentId = GetCurrentStudentId();
            if (studentId == Guid.Empty) return Unauthorized();

            var units = await _bookingService.GetAvailableExamUnitsAsync(studentId);
            return Ok(units);
        }

        // GET api/bookings/my
        // Restored from V1!
        [HttpGet("mybookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var studentId = GetCurrentStudentId();
            if (studentId == Guid.Empty) return Unauthorized();

            // The service now handles fetching and mapping to DTOs
            var bookings = await _bookingService.GetMyBookingsAsync(studentId);
            return Ok(bookings);
        }

        // POST api/bookings
        [HttpPost("createbooking")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto req)
        {
            var studentId = GetCurrentStudentId();
            if (studentId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _bookingService.CreateBookingAsync(studentId, req);
                return Ok(response);
            }
            catch (InvalidOperationException ex) 
            {
                // Maps to V1's Conflict logic (Duplicate booking)
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex) 
            {
                // Maps to V1's NotFound logic (Unit doesn't exist)
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST api/bookings/{id}/pay
        [HttpPost("{id}/pay")]
        public async Task<IActionResult> InitiatePayment(Guid id, [FromBody] InitiatePaymentRequestDto req)
        {
            var studentId = GetCurrentStudentId();
            if (studentId == Guid.Empty) return Unauthorized();

            try
            {
                // Pass the phone number into the service!
                var response = await _bookingService.InitiatePaymentAsync(studentId, id, req.PhoneNumber);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ----------------------------------------------------------------
        // V1's robust ID extractor is much safer than V2's simple Parse
        private Guid GetCurrentStudentId()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            
            return Guid.TryParse(sub, out var id) ? id : Guid.Empty;
        }
    }
}