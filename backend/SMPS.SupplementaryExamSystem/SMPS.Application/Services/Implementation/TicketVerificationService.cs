using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SMPS.Application.Interfaces;
using SMPS.Application.DTOs.Tickets;
using SMPS.Domain.Enums;

namespace SMPS.Application.Services.Implementation
{
    public class TicketVerificationService : ITicketVerificationService
    {
        private readonly IApplicationDbContext _context;

        public TicketVerificationService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TicketVerificationResponseDto> VerifyAndConsumeTicketAsync(Guid ticketId, Guid invigilatorId)
        {
            // 1. Fetch the ticket with ALL related data needed for the UI
            var ticket = await _context.VerificationTickets
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Student)
                .Include(t => t.Booking)
                    .ThenInclude(b => b.ExamUnit)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            // 2. Validate existence
            if (ticket == null)
                throw new ArgumentException("Ticket not found in the system.");

            // 3. Security Check 1: Has it been used?
            if (ticket.IsUsed)
                throw new InvalidOperationException("This ticket is invalid. It has already been used.");

            // 4. Security Check 2: Was it actually paid for? (Defense in depth)
            if (ticket.Booking.Status != BookingStatus.Paid)
                throw new InvalidOperationException("This ticket belongs to an unpaid or failed booking.");

            // 5. ATOMIC UPDATE: Consume the ticket
            ticket.IsUsed = true;

            // Assuming your VerificationTicket entity has these properties (add them if not!)
            ticket.ScannedAt = DateTime.UtcNow;
            ticket.InvigilatorId = invigilatorId;

            await _context.SaveChangesAsync(default);

            // 6. Return mapped data to the frontend
            return new TicketVerificationResponseDto
            {
                StudentName = $"{ticket.Booking.Student.FirstName} {ticket.Booking.Student.LastName}".Trim(),
                RegistrationNumber = ticket.Booking.Student.RegistrationNumber,
                UnitTitle = ticket.Booking.ExamUnit.UnitTitle,
                UnitCode = ticket.Booking.ExamUnit.UnitCode
            };
        }
        public async Task<IEnumerable<ScanHistoryDto>> GetScanHistoryAsync(Guid invigilatorId)
        {
            var tickets = await _context.VerificationTickets
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Student)
                .Include(t => t.Booking)
                    .ThenInclude(b => b.ExamUnit)
                .Where(t => t.InvigilatorId == invigilatorId && t.IsUsed == true)
                .OrderByDescending(t => t.ScannedAt)
                .ToListAsync();

            return tickets.Select(t => new ScanHistoryDto
            {
                TicketId = t.Id,
                StudentName = $"{t.Booking.Student.FirstName} {t.Booking.Student.LastName}".Trim(),
                RegistrationNumber = t.Booking.Student.RegistrationNumber,
                UnitTitle = t.Booking.ExamUnit.UnitTitle,
                UnitCode = t.Booking.ExamUnit.UnitCode,
                ScannedAt = t.ScannedAt ?? DateTime.UtcNow // Fallback
            });
        }
    }
}