using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IBookingRepository
    {
        Task<Booking?> GetByIdAsync(Guid id);
        Task<bool> HasExistingBookingAsync(Guid studentId, Guid examUnitId); // App-level idempotency check
        Task AddAsync(Booking booking);
        void Update(Booking booking);
    }
}