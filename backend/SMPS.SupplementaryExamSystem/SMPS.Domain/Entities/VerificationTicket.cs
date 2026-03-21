namespace SMPS.Domain.Entities
{
    public class VerificationTicket : BaseEntity
    {
        public Guid Id { get; set; } // This is the cryptographic "Nonce" inside the QR code

        // Foreign Key (1-to-1 with Booking)
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; } = null!;

        // Audit Trail
        public bool IsUsed { get; set; } = false;
        
        //Lecturer who scanned the ticket
        public Guid? InvigilatorId { get; set; }
        public Invigilator? Invigilator { get; set; }
    }
}