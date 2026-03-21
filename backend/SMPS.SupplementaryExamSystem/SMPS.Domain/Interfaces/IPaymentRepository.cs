using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IPaymentRepository
    {
        Task<PaymentRecord?> GetByCheckoutRequestIdAsync(string checkoutRequestId);
        Task AddAsync(PaymentRecord payment);
        void Update(PaymentRecord payment);
    }
}