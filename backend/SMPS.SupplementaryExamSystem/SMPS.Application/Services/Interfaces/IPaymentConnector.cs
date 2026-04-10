using SMPS.Application.DTOs.Mpesa; 
using System.Threading.Tasks;

namespace SMPS.Application.Interfaces
{
    public interface IPaymentConnector
    {
        string ProviderName { get; }

        // Triggers the STK Push to the user's phone
        Task<PaymentConnectorResponse> InitiatePaymentAsync(decimal amount, string phoneNumber, string reference, string description);
    }
}