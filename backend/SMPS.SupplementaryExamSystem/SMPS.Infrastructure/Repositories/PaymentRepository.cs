using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Persistence; // Ensure this matches where your DbContext is
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentRecord?> GetByCheckoutRequestIdAsync(string checkoutRequestId)
        {
            // We use FirstOrDefaultAsync to find the exact payment Safaricom is talking about
            return await _context.PaymentRecords
                .FirstOrDefaultAsync(p => p.CheckoutRequestId == checkoutRequestId);
        }

        public async Task AddAsync(PaymentRecord payment)
        {
            await _context.PaymentRecords.AddAsync(payment);
            // Note: Saving is handled by your Unit of Work
        }

        public void Update(PaymentRecord payment)
        {
            _context.PaymentRecords.Update(payment);
            // Note: Saving is handled by your Unit of Work
        }
    }
}