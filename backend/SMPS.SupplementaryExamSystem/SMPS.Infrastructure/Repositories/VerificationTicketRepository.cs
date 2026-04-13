using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Persistence;
using System;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Repositories
{
    public class VerificationTicketRepository : IVerificationTicketRepository
    {
        private readonly ApplicationDbContext _context;

        public VerificationTicketRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(VerificationTicket ticket)
        {
            await _context.VerificationTickets.AddAsync(ticket);
            // SaveChangesAsync is handled by your UnitOfWork!
        }

        public async Task<VerificationTicket?> GetByIdAsync(Guid ticketId)
        {
            return await _context.VerificationTickets
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Student) // We need the student's name for the invigilator
                .Include(t => t.Booking)
                    .ThenInclude(b => b.ExamUnit) // We need the unit name too
                .FirstOrDefaultAsync(t => t.Id == ticketId);
        }
    }
}