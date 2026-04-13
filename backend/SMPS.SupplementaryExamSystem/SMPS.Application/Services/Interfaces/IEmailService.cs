namespace SMPS.Application.Services.Interfaces
{
    public interface IEmailService
    {
        // A generic email sender. Notice how it takes a byte[] for the PDF!
        Task SendEmailWithAttachmentAsync(string toEmail, string subject, string htmlBody, byte[] attachmentBytes, string attachmentName);
    }
}
