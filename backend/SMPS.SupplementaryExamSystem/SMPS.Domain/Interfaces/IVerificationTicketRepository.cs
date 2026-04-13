using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IVerificationTicketRepository
    {
        Task<VerificationTicket?> GetByIdAsync(Guid ticketId);
        Task AddAsync(VerificationTicket ticket);
    }
}