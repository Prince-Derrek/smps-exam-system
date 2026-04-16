using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;

namespace SMPS.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Student> Students { get; }
        DbSet<ExamUnit> ExamUnits { get; }
        DbSet<Booking> Bookings { get; }
        DbSet<PaymentRecord> PaymentRecords { get; }
        DbSet<VerificationTicket> VerificationTickets { get; }
        DbSet<Invigilator> Invigilators { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}