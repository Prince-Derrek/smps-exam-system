namespace SMPS.Domain.Entities
{
    public class VerificationTicket
    {
        public Guid Id { get; set; } // This is the cryptographic "Nonce" inside the QR code

        // Foreign Key (1-to-1 with Booking)
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; } = null!;

        // Audit Trail
        public bool IsUsed { get; set; } = false;
        public DateTime? ScannedAt { get; set; }
        public string? VerifiedByLecturerName { get; set; } // Captured from the Invigilator's session
    }
}