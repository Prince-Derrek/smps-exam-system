namespace SMPS.Application.DTOs.Booking
{
    public class PaymentCallbackDto
    {
        // How the payment gateway identifies your specific transaction
        public string TransactionReference { get; set; } = string.Empty; 
        
        // This could map to your BookingId or a separate Payment tracking ID
        public Guid ReferenceId { get; set; } 
        
        public decimal AmountPaid { get; set; }
        public bool IsSuccessful { get; set; }
        public string? GatewayMessage { get; set; }
    }
}