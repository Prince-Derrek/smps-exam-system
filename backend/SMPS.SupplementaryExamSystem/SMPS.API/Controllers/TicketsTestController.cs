using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMPS.Application.Interfaces;
using SMPS.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace SMPS.API.Controllers
{
    [ApiController]
    [Route("api/test-tickets")]
    [AllowAnonymous] // We use AllowAnonymous so you can easily test this in a normal web browser!
    public class TicketsTestController : ControllerBase
    {
        private readonly IVerificationTicketRepository _tickets;
        private readonly IQRCodeService _qrCodeService;

        public TicketsTestController(IVerificationTicketRepository tickets, IQRCodeService qrCodeService)
        {
            _tickets = tickets;
            _qrCodeService = qrCodeService;
        }

        [HttpGet("{bookingId}/view-qr")]
        public async Task<IActionResult> ViewQrCode(Guid bookingId)
        {
            // 1. Find the ticket using the Booking ID
            var ticket = await _tickets.GetByBookingIdAsync(bookingId);

            if (ticket == null)
                return NotFound($"No ticket found for Booking ID: {bookingId}. Did the M-Pesa webhook fire?");

            // 2. Generate the Base64 string
            string base64Image = _qrCodeService.GenerateQRCodeAsBase64(ticket.Id.ToString());

            // 3. Convert Base64 back to raw image bytes for the browser to display
            byte[] imageBytes = Convert.FromBase64String(base64Image);

            // 4. Return as a physical PNG file!
            return File(imageBytes, "image/png");
        }
    }
}