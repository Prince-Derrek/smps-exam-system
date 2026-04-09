using SMPS.Application.Interfaces;
using SMPS.Application.DTOs.Booking;
using SMPS.Domain.Entities;
using SMPS.Domain.Enums;
using SMPS.Domain.Interfaces;

namespace SMPS.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        // Notice: No DbContext here! Just clean, testable interfaces.
        private readonly IBookingRepository _bookings;
        private readonly IExamUnitRepository _examUnits;
        private readonly IUnitOfWork _uow;

        public BookingService(
            IBookingRepository bookings, 
            IExamUnitRepository examUnits, 
            IUnitOfWork uow)
        {
            _bookings = bookings;
            _examUnits = examUnits;
            _uow = uow;
        }

        public async Task<IEnumerable<ExamUnitDto>> GetAvailableExamUnitsAsync(Guid studentId)
        {
            // 1. Get IDs of units the student already actively owns
            var alreadyBookedIds = await _bookings.GetActiveBookedUnitIdsAsync(studentId);

            // 2. Fetch all units from the catalog
            var allUnits = await _examUnits.GetAllAsync();

            // 3. Filter in memory and map to DTOs
            return allUnits
                .Where(eu => !alreadyBookedIds.Contains(eu.Id))
                .Select(eu => new ExamUnitDto
                {
                    Id = eu.Id,
                    UnitCode = eu.UnitCode,
                    UnitTitle = eu.UnitTitle,
                    StandardFee = eu.StandardFee
                });
        }

        public async Task<IEnumerable<BookingResponseDto>> GetMyBookingsAsync(Guid studentId)
        {
            var bookings = await _bookings.GetByStudentIdAsync(studentId);

            // Mapping domain entities to the response DTO
           return bookings.Select(b => new BookingResponseDto
            {
                BookingId = b.Id,
                UnitCode = b.ExamUnit.UnitCode,
                UnitTitle = b.ExamUnit.UnitTitle,
                Fee = b.ExamUnit.StandardFee,
                Status = b.Status.ToString() // Convert the Enum to a String for the JSON!
            });
        }

        public async Task<BookingResponseDto> CreateBookingAsync(Guid studentId, CreateBookingRequestDto request)
        {
            // 1. Validate the exam unit exists
            var examUnit = await _examUnits.GetByIdAsync(request.ExamUnitId);
            if (examUnit == null) 
                throw new ArgumentException("The selected exam unit does not exist.");

            // 2. Safely check for duplicates using your repository method
            if (await _bookings.HasExistingBookingAsync(studentId, request.ExamUnitId))
                throw new InvalidOperationException($"You already have an active booking for {examUnit.UnitCode}.");

            // 3. Construct the Domain Entity
            var booking = new Booking
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                ExamUnitId = request.ExamUnitId,
                Status = BookingStatus.Pending
            };

            // 4. Save via Unit of Work
            await _bookings.AddAsync(booking);
            await _uow.SaveChangesAsync(CancellationToken.None);

            return new BookingResponseDto 
            { 
                BookingId = booking.Id, 
                Status = booking.Status.ToString(), 
                Message = "Booking created successfully. Proceeding to payment..." 
            };
        }

        public async Task<BookingResponseDto> InitiatePaymentAsync(Guid studentId, Guid bookingId)
        {
            // 1. Fetch and validate
            var booking = await _bookings.GetByIdAsync(bookingId);
            if (booking == null || booking.StudentId != studentId) 
                throw new ArgumentException("Booking not found.");

            // 2. Enforce State Machine rules
            if (booking.Status != BookingStatus.Pending && booking.Status != BookingStatus.Failed)
                throw new InvalidOperationException("This booking cannot be paid for in its current state.");

            // 3. Mutate State
            booking.Status = BookingStatus.AwaitingPayment;
            
            // 4. Save via Unit of Work
            _bookings.Update(booking);
            await _uow.SaveChangesAsync(CancellationToken.None);

            return new BookingResponseDto 
            { 
                BookingId = booking.Id, 
                Status = booking.Status.ToString(), 
                Message = "Payment initiated. Please check your phone." 
            };
        }
        public async Task<bool> ConfirmPaymentAsync(Guid bookingId, string transactionReference)
        {
            var booking = await _bookings.GetByIdAsync(bookingId);
            if (booking == null) return false;

            booking.Status = BookingStatus.Paid;
            _bookings.Update(booking);
            await _uow.SaveChangesAsync(CancellationToken.None);

            return true;
        }
    }
}