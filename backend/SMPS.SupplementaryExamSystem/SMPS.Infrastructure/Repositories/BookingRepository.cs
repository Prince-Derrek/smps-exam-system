using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Persistence;
using SMPS.Domain.Enums;

namespace SMPS.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Booking?> GetByIdAsync(Guid id)
            => await _context.Bookings
                .Include(b => b.ExamUnit)
                .Include(b => b.Student)
                .FirstOrDefaultAsync(b => b.Id == id);

        public async Task<bool> HasExistingBookingAsync(Guid studentId, Guid examUnitId)
            => await _context.Bookings
                .AnyAsync(b => b.StudentId == studentId && b.ExamUnitId == examUnitId);

        public async Task AddAsync(Booking booking)
            => await _context.Bookings.AddAsync(booking);

        public void Update(Booking booking)
            => _context.Bookings.Update(booking);

        public async Task<IEnumerable<Booking>> GetByStudentIdAsync(Guid studentId)
            => await _context.Bookings
                .Include(b => b.ExamUnit)
                .Where(b => b.StudentId == studentId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

        public async Task<IEnumerable<Guid>> GetActiveBookedUnitIdsAsync(Guid studentId)
            => await _context.Bookings
                .Where(b => b.StudentId == studentId && 
                b.Status != BookingStatus.Failed)
                .Select(b => b.ExamUnitId)
                .ToListAsync();        
    }
}