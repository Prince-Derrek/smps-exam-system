using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using SMPS.Application.DTOs.Booking;
using SMPS.Domain.Entities;
using SMPS.Domain.Enums;
using SMPS.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace SMPS.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        // Notice: No DbContext here! Just clean, testable interfaces.
        private readonly IBookingRepository _bookings;
        private readonly IExamUnitRepository _examUnits;
        private readonly IUnitOfWork _uow;
        private readonly IPaymentRepository _payments;      
        private readonly IPaymentConnector _mpesaConnector;
        private readonly IVerificationTicketRepository _tickets;
        private readonly ITicketService _ticketService;

        public BookingService(
            IBookingRepository bookings, 
            IExamUnitRepository examUnits, 
            IUnitOfWork uow,
            IPaymentRepository payments,
            IPaymentConnector mpesaConnector,
            IVerificationTicketRepository tickets,
            ITicketService ticketService)
        {
            _bookings = bookings;
            _examUnits = examUnits;
            _uow = uow;
            _payments = payments;
            _mpesaConnector = mpesaConnector;
            _tickets = tickets;
            _ticketService = ticketService;
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
                Status = b.Status.ToString(),
                PaymentReference = b.Payment?.CheckoutRequestId,
                Message = b.Status == BookingStatus.Pending? "Awaiting Payment" : "Tracked",
                CreatedAt = b.CreatedAt
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
                Message = "Booking created successfully. Proceeding to payment...",
                UnitCode = examUnit.UnitCode,
                UnitTitle = examUnit.UnitTitle,
                Fee = examUnit.StandardFee
            };
        }

        public async Task<BookingResponseDto> InitiatePaymentAsync(Guid studentId, Guid bookingId, string phoneNumber)
        {
            // 1. Fetch the booking (Ensure your Repository uses .Include(b => b.ExamUnit) for this!)
            var booking = await _bookings.GetByIdAsync(bookingId);
            if (booking == null || booking.StudentId != studentId)
                throw new ArgumentException("Booking not found.");

            // 2. Enforce State Rules
            if (booking.Status != BookingStatus.Pending && booking.Status != BookingStatus.Failed)
                throw new InvalidOperationException("This booking cannot be paid for in its current state.");

            // 3. Create the Payment Record (Pending State)
            var paymentRecord = new PaymentRecord
            {
                Id = Guid.NewGuid(),
                BookingId = bookingId,
                PhoneNumber = phoneNumber,
                Amount = booking.ExamUnit.StandardFee,
                Status = PaymentStatus.Pending,
                CheckoutRequestId = "PENDING_STK_PUSH" // Temporary placeholder
            };

            await _payments.AddAsync(paymentRecord);

            // 4. Trigger the Safaricom STK Push!
            var mpesaResponse = await _mpesaConnector.InitiatePaymentAsync(
                amount: paymentRecord.Amount,
                phoneNumber: phoneNumber,
                reference: booking.ExamUnit.UnitCode,
                description: $"Fee for {booking.ExamUnit.UnitTitle}"
            );

            // 5. Handle the Daraja Response
            if (mpesaResponse.IsSuccessful)
            {
                // STK Push was sent to the phone! 
                // Save the golden ticket ID and update status.
                paymentRecord.CheckoutRequestId = mpesaResponse.CheckoutRequestID!;
                booking.Status = BookingStatus.AwaitingPayment;

                await _uow.SaveChangesAsync(CancellationToken.None);

                return new BookingResponseDto
                {
                    BookingId = booking.Id,
                    Status = booking.Status.ToString(),
                    Message = mpesaResponse.Message,
                    PaymentReference = mpesaResponse.CheckoutRequestID
                };
            }
            else
            {
                // Safaricom rejected the request (e.g., invalid phone number)
                paymentRecord.Status = PaymentStatus.Failed;

                // REMOVED _payments.Update(paymentRecord); !!!

                await _uow.SaveChangesAsync(CancellationToken.None);

                throw new InvalidOperationException($"M-Pesa Error: {mpesaResponse.Message}");
            }
        }
        public async Task<bool> ConfirmPaymentAsync(string checkoutRequestId, int resultCode, string resultDesc, string? receiptNumber)
        {
            var payment = await _payments.GetByCheckoutRequestIdAsync(checkoutRequestId);
            if (payment == null) return false;

            var booking = await _bookings.GetByIdAsync(payment.BookingId);
            if (booking == null) return false;

            if (resultCode == 0)
            {
                // 1. Handle DB state changes (Mint Ticket, Update Statuses)
                await FinalizePaymentAndMintTicketAsync(booking, payment, receiptNumber);

                // 2. Hand off the heavy lifting to the Hangfire Queue!
                _ticketService.EnqueueTicketGeneration(booking.Id);
            }
            else if (resultCode == 1032)
            {
                payment.Status = PaymentStatus.Cancelled;
                booking.Status = BookingStatus.Failed;
                await _uow.SaveChangesAsync(System.Threading.CancellationToken.None);
            }
            else
            {
                payment.Status = PaymentStatus.Failed;
                booking.Status = BookingStatus.Failed;
                await _uow.SaveChangesAsync(System.Threading.CancellationToken.None);
            }

            return true;
        }
        private async Task FinalizePaymentAndMintTicketAsync(Booking booking, PaymentRecord payment, string receiptNumber)
        {
            // Update existing records
            payment.Status = PaymentStatus.Completed;
            payment.MpesaReceiptNumber = receiptNumber;
            booking.Status = BookingStatus.Paid;

            // Mint the new ticket token
            var ticket = new VerificationTicket
            {
                Id = Guid.NewGuid(),
                BookingId = booking.Id,
                IsUsed = false
            };

            await _tickets.AddAsync(ticket);

            // One single save to commit the Payment, Booking, and Ticket updates simultaneously!
            await _uow.SaveChangesAsync(System.Threading.CancellationToken.None);
        }
    }
}