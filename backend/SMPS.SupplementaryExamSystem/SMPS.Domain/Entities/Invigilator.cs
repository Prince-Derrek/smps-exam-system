namespace SMPS.Domain.Entities
{
    public class Invigilator
    {
        public Guid Id { get; set; }
        public string StaffNumber { get; set; } = string.Empty; // e.g., JKUAT-1234
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation: An invigilator can scan many tickets
        public ICollection<VerificationTicket> ScannedTickets { get; set; } = new List<VerificationTicket>();
    }
}