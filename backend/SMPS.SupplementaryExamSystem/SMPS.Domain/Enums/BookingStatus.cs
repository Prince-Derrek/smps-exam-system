namespace SMPS.Domain.Enums
{
    public enum BookingStatus
    {
        Pending = 1,          // Initial state when unit is selected
        AwaitingPayment = 2,  // STK Push triggered, waiting for user to enter PIN
        Paid = 3,             // Safaricom callback received with success
        Failed = 4,           // Payment failed or timed out
        Consumed = 5          // QR code scanned at the exam venue (Replay Protection enforced)
    }
}