namespace SMPS.Application.Services.Interfaces
{
    public interface IPdfDocumentService
    {
        // Takes the exam details + QR code, and returns the raw PDF file as a byte array
        byte[] GenerateExamTicketPdf(string studentName, string registrationNumber, string unitCode, string unitTitle, byte[] qrCodeImage);
    }
}
