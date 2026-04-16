using QRCoder;
using SMPS.Application.Services.Interfaces;
using System;

namespace SMPS.Infrastructure.Services
{
    public class QRCodeService : IQRCodeService
    {
        public string GenerateQRCodeAsBase64(string payload)
        {
            using var qrGenerator = new QRCodeGenerator();

            // ECCLevel.Q provides a great balance between data density and error correction (scannability)
            using var qrCodeData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);

            // PngByteQRCode is lightweight and perfect for web APIs
            using var qrCode = new PngByteQRCode(qrCodeData);

            // Generate the image byte array (Pixels per module = 20 gives a nice crisp image)
            byte[] qrCodeImage = qrCode.GetGraphic(20);

            // Convert to Base64 so React can read it natively
            return Convert.ToBase64String(qrCodeImage);
        }
    }
}