using System;
using System.Threading.Tasks;
using SMPS.Application.DTOs.Tickets;

namespace SMPS.Application.Interfaces
{
    public interface ITicketVerificationService
    {
        // We pass the invigilatorId for audit logging purposes
        Task<TicketVerificationResponseDto> VerifyAndConsumeTicketAsync(Guid ticketId, Guid invigilatorId);
        Task<IEnumerable<ScanHistoryDto>> GetScanHistoryAsync(Guid invigilatorId);
    }
}