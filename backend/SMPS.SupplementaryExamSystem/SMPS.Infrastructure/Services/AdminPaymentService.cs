using Microsoft.EntityFrameworkCore;
using SMPS.Application.DTOs.Admin;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class AdminPaymentService : IAdminPaymentService
    {
        private readonly IApplicationDbContext _context;

        public AdminPaymentService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AdminPaymentDto>> GetAllPaymentsAsync()
        {
            var payments = await _context.PaymentRecords
                .Include(p => p.Booking)
                    .ThenInclude(b => b.Student)
                .Include(p => p.Booking)
                    .ThenInclude(b => b.ExamUnit)
                .OrderByDescending(p => p.CreatedAt) // Assuming BaseEntity provides CreatedAt
                .ToListAsync();

            return payments.Select(p => new AdminPaymentDto
            {
                Id = p.Id,
                StudentName = $"{p.Booking.Student.FirstName} {p.Booking.Student.LastName}".Trim(),
                PhoneNumber = p.PhoneNumber,
                UnitTitle = p.Booking.ExamUnit.UnitTitle,
                Amount = p.Amount,
                MpesaReceiptNumber = p.MpesaReceiptNumber,
                Status = p.Status.ToString(),
                TransactionDate = p.CreatedAt
            });
        }
    }
}