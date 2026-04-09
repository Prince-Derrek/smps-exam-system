using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IBookingRepository
    {
        Task<Booking?> GetByIdAsync(Guid id);
        
        Task<IEnumerable<Booking>> GetByStudentIdAsync(Guid studentId);
        
        // Polished: Explicitly check for an active/pending booking to prevent duplicates
        Task<bool> HasExistingBookingAsync(Guid studentId, Guid examUnitId);
        
        // NEW: Highly optimized query to get just the IDs of units they already booked
        Task<IEnumerable<Guid>> GetActiveBookedUnitIdsAsync(Guid studentId);
        
        Task AddAsync(Booking booking);
        
        void Update(Booking booking);
    }
}