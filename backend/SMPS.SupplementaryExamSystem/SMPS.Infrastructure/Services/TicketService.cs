using Hangfire; //  NEW: Add Hangfire using statement
using SMPS.Application.Services.Interfaces;
using SMPS.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class TicketService : ITicketService
    {
        private readonly IVerificationTicketRepository _tickets;
        private readonly IQRCodeService _qrCodeService;
        private readonly IPdfDocumentService _pdfService;
        private readonly IEmailService _emailService;
        private readonly IBackgroundJobClient _backgroundJobClient; // 👈 NEW

        public TicketService(
            IVerificationTicketRepository tickets,
            IQRCodeService qrCodeService,
            IPdfDocumentService pdfService,
            IEmailService emailService,
            IBackgroundJobClient backgroundJobClient) // 👈 NEW
        {
            _tickets = tickets;
            _qrCodeService = qrCodeService;
            _pdfService = pdfService;
            _emailService = emailService;
            _backgroundJobClient = backgroundJobClient; // 👈 NEW
        }

        // 👇 NEW: The incredibly clean 1-line Hangfire Dispatcher
        public void EnqueueTicketGeneration(Guid bookingId)
        {
            // This instantly saves the job to your Postgres database and returns.
            // Hangfire's background worker will pick it up securely!
            _backgroundJobClient.Enqueue(() => GenerateAndEmailTicketAsync(bookingId));
        }

        public async Task GenerateAndEmailTicketAsync(Guid bookingId)
        {
            // 1. Fetch the ticket and all related Student/Exam data
            var ticket = await _tickets.GetByBookingIdAsync(bookingId);

            if (ticket == null) return; // Safety check

            // 2. Generate the QR Code image
            string base64Image = _qrCodeService.GenerateQRCodeAsBase64(ticket.Id.ToString());
            byte[] qrBytes = Convert.FromBase64String(base64Image);

            // 3. Extract the data for the document
            string studentName = $"{ticket.Booking.Student.FirstName} {ticket.Booking.Student.LastName}";
            string regNumber = ticket.Booking.Student.RegistrationNumber ?? "N/A";
            string unitCode = ticket.Booking.ExamUnit.UnitCode;
            string unitTitle = ticket.Booking.ExamUnit.UnitTitle;
            string studentEmail = ticket.Booking.Student.Email;

            // 4. Generate the PDF
            byte[] pdfBytes = _pdfService.GenerateExamTicketPdf(studentName, regNumber, unitCode, unitTitle, qrBytes);

            // 5. Construct the Email
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

            // 6. Send the Email!
            await _emailService.SendEmailWithAttachmentAsync(
                toEmail: studentEmail,
                subject: subject,
                htmlBody: htmlBody,
                attachmentBytes: pdfBytes,
                attachmentName: $"ExamTicket_{unitCode}.pdf"
            );
        }
    }
}