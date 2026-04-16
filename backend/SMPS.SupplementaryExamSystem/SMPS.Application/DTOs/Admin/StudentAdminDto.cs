using System;

namespace SMPS.Application.DTOs.Admin
{
    public class StudentAdminDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int BookingsCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}