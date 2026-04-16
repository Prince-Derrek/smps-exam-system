using System;

namespace SMPS.Application.DTOs.Admin
{
    // For fetching (GET)
    public class AdminInvigilatorDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string StaffNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int ScannedCount { get; set; }
    }

    // For creating (POST)
    public class CreateInvigilatorDto
    {
        public string FullName { get; set; } = string.Empty;
        public string StaffNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}