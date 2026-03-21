using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;

namespace SMPS.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
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

            // --------------------------------------------------------
            // 3. PRECISION FORMATTING (PostgreSQL optimization)
            // --------------------------------------------------------
            modelBuilder.Entity<ExamUnit>()
                .Property(e => e.StandardFee)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<PaymentRecord>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");
        }
    }
}