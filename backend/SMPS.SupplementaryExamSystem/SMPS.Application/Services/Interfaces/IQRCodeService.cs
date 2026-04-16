namespace SMPS.Application.Services.Interfaces
{
    public interface IQRCodeService
    {
        // Takes our TicketId string and returns a Base64 image string
        string GenerateQRCodeAsBase64(string payload);
    }
}