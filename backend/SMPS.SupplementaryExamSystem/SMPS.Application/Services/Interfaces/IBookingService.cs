using SMPS.Application.DTOs.Booking;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SMPS.Application.Interfaces
{
    public interface IBookingService
    {
        // Step 1: Browse Available Units
        Task<IEnumerable<ExamUnitDto>> GetAvailableExamUnitsAsync(Guid studentId);
        
        // NEW: Fetch the student's existing bookings (Used by the /api/bookings/my endpoint)
        Task<IEnumerable<BookingResponseDto>> GetMyBookingsAsync(Guid studentId);
        
        // Step 2: Book
        Task<BookingResponseDto> CreateBookingAsync(Guid studentId, CreateBookingRequestDto request);
        
        // Step 3: Initiate Payment (e.g., trigger STK push)
        Task<BookingResponseDto> InitiatePaymentAsync(Guid studentId, Guid bookingId);
        
        // Step 4: Confirm Payment (usually called via Webhook/Callback)
        Task<bool> ConfirmPaymentAsync(Guid bookingId, string transactionReference);
    }
}