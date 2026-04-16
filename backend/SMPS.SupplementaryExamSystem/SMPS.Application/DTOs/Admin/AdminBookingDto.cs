using System;

namespace SMPS.Application.DTOs.Admin
{
    public class AdminBookingDto
    {
        public Guid Id { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string UnitTitle { get; set; } = string.Empty;
        public string UnitCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}