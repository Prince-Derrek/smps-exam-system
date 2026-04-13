using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using SMPS.Application.Services.Interfaces;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailWithAttachmentAsync(string toEmail, string subject, string htmlBody, byte[] attachmentBytes, string attachmentName)
        {
            // 1. Build the Email Message
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_config["EmailSettings:SenderName"], _config["EmailSettings:SenderEmail"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            // 2. Build the Body (HTML)
            var builder = new BodyBuilder { HtmlBody = htmlBody };

            // 3. Attach the PDF
            if (attachmentBytes != null && attachmentBytes.Length > 0)
            {
                builder.Attachments.Add(attachmentName, attachmentBytes, ContentType.Parse("application/pdf"));
            }

            email.Body = builder.ToMessageBody();

            // 4. Connect to Gmail and Send
            using var smtp = new SmtpClient();

            // Port 587 with StartTLS is the standard secure way to connect to Gmail
            await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], int.Parse(_config["EmailSettings:SmtpPort"]), SecureSocketOptions.StartTls);

            // Authenticate using your App Password!
            await smtp.AuthenticateAsync(_config["EmailSettings:SenderEmail"], _config["EmailSettings:AppPassword"]);

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}