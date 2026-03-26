using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface ITicketRepository
    {
        Task<VerificationTicket?> GetByIdAsync(Guid ticketId);
        Task AddAsync(VerificationTicket ticket);
        void Update(VerificationTicket ticket);
    }
}