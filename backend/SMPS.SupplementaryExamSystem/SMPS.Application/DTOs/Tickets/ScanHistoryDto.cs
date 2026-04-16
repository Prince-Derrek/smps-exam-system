using System;

namespace SMPS.Application.DTOs.Tickets
{
    public class ScanHistoryDto
    {
        public Guid TicketId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string UnitTitle { get; set; } = string.Empty;
        public string UnitCode { get; set; } = string.Empty;
        public DateTime ScannedAt { get; set; }
    }
}