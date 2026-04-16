using Microsoft.EntityFrameworkCore;
using SMPS.Application.Interfaces;
using SMPS.Domain.Entities;

namespace SMPS.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<ExamUnit> ExamUnits { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<PaymentRecord> PaymentRecords { get; set; }
        public DbSet<VerificationTicket> VerificationTickets { get; set; }
        public DbSet<Invigilator> Invigilators { get; set; }
        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --------------------------------------------------------
            // 1. STATELESS IDEMPOTENCY (Anti-Double Booking Constraint)
            // --------------------------------------------------------
            modelBuilder.Entity<Booking>()
                .HasIndex(b => new { b.StudentId, b.ExamUnitId })
                .IsUnique()
                .HasDatabaseName("IX_Booking_Student_ExamUnit_Unique");

            // --------------------------------------------------------
            // 2. RELATIONSHIPS
            // --------------------------------------------------------

            // Student -> Bookings (1-to-Many)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Student)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // ExamUnit -> Bookings (1-to-Many)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.ExamUnit)
                .WithMany() // No navigation property needed on ExamUnit
                .HasForeignKey(b => b.ExamUnitId)
                .OnDelete(DeleteBehavior.Restrict);

            // Booking -> PaymentRecord (1-to-1)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<PaymentRecord>(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Booking -> VerificationTicket (1-to-1)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Ticket)
                .WithOne(t => t.Booking)
                .HasForeignKey<VerificationTicket>(t => t.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Invigilator -> VerificationTickets (1-to-Many)
            modelBuilder.Entity<VerificationTicket>()
                .HasOne(t => t.Invigilator)
                .WithMany(i => i.ScannedTickets)
                .HasForeignKey(t => t.InvigilatorId)
                .OnDelete(DeleteBehavior.SetNull); // If an invigilator leaves, don't delete the scan history

            modelBuilder.Entity<Admin>()
                .HasIndex(a => a.Email)
                .IsUnique();

            // --------------------------------------------------------
            // 3. PRECISION FORMATTING (PostgreSQL optimization)
            // --------------------------------------------------------
            modelBuilder.Entity<ExamUnit>()
                .Property(e => e.StandardFee)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<PaymentRecord>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");

            // --------------------------------------------------------
            // 4. GLOBAL QUERY FILTERS (Soft Deletes)
            // --------------------------------------------------------
            modelBuilder.Entity<Booking>().HasQueryFilter(b => !b.IsDeleted);
            modelBuilder.Entity<PaymentRecord>().HasQueryFilter(p => !p.IsDeleted);
            modelBuilder.Entity<VerificationTicket>().HasQueryFilter(t => !t.IsDeleted);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Deleted:
                        // Prevent hard delete, switch to soft delete
                        entry.State = EntityState.Modified;
                        entry.Entity.IsDeleted = true;
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}