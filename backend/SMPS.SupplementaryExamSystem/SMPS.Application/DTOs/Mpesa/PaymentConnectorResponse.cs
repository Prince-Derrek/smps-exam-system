namespace SMPS.Application.DTOs.Mpesa
{
    public class PaymentConnectorResponse
    {
        public bool IsSuccessful { get; set; }
        public string Message { get; set; } = string.Empty;

        // This is the golden ticket Safaricom gives us to track the transaction
        public string? CheckoutRequestID { get; set; }
    }
}