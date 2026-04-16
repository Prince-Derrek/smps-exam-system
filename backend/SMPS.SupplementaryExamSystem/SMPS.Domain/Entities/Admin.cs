using System;

namespace SMPS.Domain.Entities
{
    public class Admin : BaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // Defaulting to Admin, but useful if you ever introduce SuperAdmins later
        public string Role { get; set; } = "Admin";
    }
}