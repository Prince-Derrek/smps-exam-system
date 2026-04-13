using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using SMPS.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace SMPS.API.Controllers
{
    [ApiController]
    [Route("api/test-tickets")]
    [AllowAnonymous]
    public class TicketsTestController : ControllerBase
    {
        private readonly IVerificationTicketRepository _tickets;
        private readonly IQRCodeService _qrCodeService;
        private readonly IPdfDocumentService _pdfService; // 👈 NEW

        public TicketsTestController(
            IVerificationTicketRepository tickets,
            IQRCodeService qrCodeService,
            IPdfDocumentService pdfService) // 👈 NEW
        {
            _tickets = tickets;
            _qrCodeService = qrCodeService;
            _pdfService = pdfService;
        }

        [HttpGet("{bookingId}/download-pdf")]
        public async Task<IActionResult> DownloadTicketPdf(Guid bookingId)
        {
            var ticket = await _tickets.GetByBookingIdAsync(bookingId);

            if (ticket == null)
                return NotFound("No ticket found for this booking.");

            // 1. Get the QR Code image bytes
            string base64Image = _qrCodeService.GenerateQRCodeAsBase64(ticket.Id.ToString());
            byte[] qrBytes = Convert.FromBase64String(base64Image);

            // 2. Extract Student Data (Assuming your Student entity has these fields. Adjust if your DB fields are named differently!)
            string studentName = $"{ticket.Booking.Student.FirstName} {ticket.Booking.Student.LastName}";
            string regNumber = ticket.Booking.Student.RegistrationNumber ?? "N/A";
            string unitCode = ticket.Booking.ExamUnit.UnitCode;
            string unitTitle = ticket.Booking.ExamUnit.UnitTitle;

            // 3. Generate the PDF
            byte[] pdfBytes = _pdfService.GenerateExamTicketPdf(studentName, regNumber, unitCode, unitTitle, qrBytes);

            // 4. Return as a downloadable PDF file
            return File(pdfBytes, "application/pdf", $"ExamTicket_{unitCode}.pdf");
        }
    }
}