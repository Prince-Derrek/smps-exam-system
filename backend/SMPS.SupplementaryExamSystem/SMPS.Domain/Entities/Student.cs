namespace SMPS.Domain.Entities
{
    public class Student
    {
        public Guid Id { get; set; } // Primary Key
        public string RegistrationNumber { get; set; } = string.Empty; // e.g. SCM211-0297/2020
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}