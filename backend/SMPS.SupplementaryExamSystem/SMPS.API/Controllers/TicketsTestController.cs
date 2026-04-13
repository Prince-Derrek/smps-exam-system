using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Services;
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
        private readonly IEmailService _emailService; // 👈 NEW

        public TicketsTestController(
            IVerificationTicketRepository tickets,
            IQRCodeService qrCodeService,
            IPdfDocumentService pdfService, // 👈 NEW
            IEmailService emailService) // 👈 NEW
        {
            _tickets = tickets;
            _qrCodeService = qrCodeService;
            _pdfService = pdfService;
            _emailService = emailService;
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
        [HttpGet("{bookingId}/send-email")]
        public async Task<IActionResult> SendTicketEmail(Guid bookingId)
        {
            var ticket = await _tickets.GetByBookingIdAsync(bookingId);

            if (ticket == null)
                return NotFound("No ticket found for this booking.");

            // 1. Generate the QR Code
            string base64Image = _qrCodeService.GenerateQRCodeAsBase64(ticket.Id.ToString());
            byte[] qrBytes = Convert.FromBase64String(base64Image);

            // 2. Extract Data
            string studentName = $"{ticket.Booking.Student.FirstName} {ticket.Booking.Student.LastName}";
            string regNumber = ticket.Booking.Student.RegistrationNumber ?? "N/A";
            string unitCode = ticket.Booking.ExamUnit.UnitCode;
            string unitTitle = ticket.Booking.ExamUnit.UnitTitle;

            // ⚠️ IMPORTANT: For this test, you might want to hardcode your personal email address here 
            // so you can actually check your inbox, unless the Student in the DB already has your real email!
            string studentEmail = ticket.Booking.Student.Email;
            // string studentEmail = "your.personal.email@gmail.com"; // Uncomment to override

            // 3. Generate the PDF bytes
            byte[] pdfBytes = _pdfService.GenerateExamTicketPdf(studentName, regNumber, unitCode, unitTitle, qrBytes);

            // 4. Construct the Email Body
            string subject = $"Your Exam Ticket: {unitCode} - {unitTitle}";
            string htmlBody = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2>Hi {studentName},</h2>
                    <p>Your payment was successful! Attached is your official entrance ticket for <strong>{unitCode}</strong>.</p>
                    <p>Please download the PDF to your phone or print it. You will need to present the QR code to the invigilator at the door.</p>
                    <br/>
                    <p>Best of luck,</p>
                    <p><strong>SMPS Exam Portal Team</strong></p>
                </div>";

            // 5. Send it!
            await _emailService.SendEmailWithAttachmentAsync(
                toEmail: studentEmail,
                subject: subject,
                htmlBody: htmlBody,
                attachmentBytes: pdfBytes,
                attachmentName: $"ExamTicket_{unitCode}.pdf"
            );

            return Ok(new { Message = $"Email successfully sent to {studentEmail}!" });
        }
    }
}