using SMPS.Domain.Enums;

namespace SMPS.Domain.Entities
{
    public class PaymentRecord
    {
        public Guid Id { get; set; } // Primary Key

        // Foreign Key (1-to-1 with Booking)
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; } = null!;

        // M-Pesa Data
        public string PhoneNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string CheckoutRequestId { get; set; } = string.Empty; // Used to match the async callback
        public string? MpesaReceiptNumber { get; set; } // The actual code (e.g. QEH123456)

        public PaymentStatus Status { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    }
}