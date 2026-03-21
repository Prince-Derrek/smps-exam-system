using SMPS.Domain.Enums;

namespace SMPS.Domain.Entities
{
    public class Booking
    {
        public Guid Id { get; set; } // Primary Key

        // Foreign Keys
        public Guid StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public Guid ExamUnitId { get; set; }
        public ExamUnit ExamUnit { get; set; } = null!;

        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public PaymentRecord? Payment { get; set; }
        public VerificationTicket? Ticket { get; set; }
    }
}