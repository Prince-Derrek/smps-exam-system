using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Npgsql.Internal;
using RestSharp;
using SMPS.Application.DTOs.Mpesa;
using SMPS.Application.Interfaces;
using System;
using System.Text;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class MpesaConnector : IPaymentConnector
    {
        private readonly IConfiguration _configuration;
        private readonly RestClient _client;

        public string ProviderName => "MPESA";

        public MpesaConnector(IConfiguration configuration)
        {
            _configuration = configuration;

            var baseUrl = _configuration["Mpesa:BaseUrl"];
            if (string.IsNullOrEmpty(baseUrl))
                throw new ArgumentNullException("Mpesa:BaseUrl", "Base URL is missing from appsettings.json");

            _client = new RestClient(baseUrl);
        }

        public async Task<PaymentConnectorResponse> InitiatePaymentAsync(decimal amount, string phoneNumber, string reference, string description)
        {
            // 1. Get Auth Token
            var token = await GetAccessTokenAsync();
            if (string.IsNullOrEmpty(token))
            {
                return new PaymentConnectorResponse { IsSuccessful = false, Message = "Auth Failed: Could not get Token." };
            }

            // 2. Prepare Data
            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var transactionType = _configuration["Mpesa:TransactionType"];
            var businessShortCode = _configuration["Mpesa:ShortCode"];
            var passKey = _configuration["Mpesa:PassKey"];

            // Generate the Base64 Password
            var rawPassword = $"{businessShortCode}{passKey}{timestamp}";
            var password = Convert.ToBase64String(Encoding.UTF8.GetBytes(rawPassword));

            var sanitizedPhone = SanitizePhoneNumber(phoneNumber);

            // 3. Construct Payload
            var payload = new
            {
                Password = password,
                BusinessShortCode = businessShortCode,
                Timestamp = timestamp,
                TransactionType = transactionType,
                Amount = ((int)amount).ToString(), // Daraja expects a whole number string
                PartyA = sanitizedPhone,
                PartyB = businessShortCode,
                PhoneNumber = sanitizedPhone,
                AccountReference = reference, // Usually the BookingId or UnitCode
                TransactionDesc = description,
                CallBackURL = _configuration["Mpesa:CallbackUrl"]
            };

            string jsonString = JsonConvert.SerializeObject(payload);

            // 4. Send Request
            var restRequest = new RestRequest("/mpesa/stkpush/v1/processrequest", Method.Post);
            restRequest.AddHeader("Authorization", $"Bearer {token}");
            restRequest.AddHeader("Content-Type", "application/json");
            restRequest.AddStringBody(jsonString, RestSharp.DataFormat.Json);

            try
            {
                var response = await _client.ExecuteAsync(restRequest);

                if (response.IsSuccessful && response.Content != null)
                {
                    // Deserialize into our exact Daraja model
                    var mpesaResponse = JsonConvert.DeserializeObject<DarajaPushResponse>(response.Content);

                    if (mpesaResponse != null && mpesaResponse.ResponseCode == "0")
                    {
                        return new PaymentConnectorResponse
                        {
                            IsSuccessful = true,
                            Message = "Payment initiated. Please check your phone.",
                            CheckoutRequestID = mpesaResponse.CheckoutRequestID // WE NEED THIS TO SAVE TO DB
                        };
                    }

                    // If Safaricom sent a 200 OK but rejected the prompt (e.g., invalid amount)
                    return new PaymentConnectorResponse
                    {
                        IsSuccessful = false,
                        Message = mpesaResponse?.CustomerMessage ?? mpesaResponse?.ResponseDescription ?? "Unknown M-Pesa Error"
                    };
                }

                return new PaymentConnectorResponse { IsSuccessful = false, Message = $"HTTP Error: {response.StatusCode} - {response.Content}" };
            }
            catch (Exception ex)
            {
                return new PaymentConnectorResponse { IsSuccessful = false, Message = $"Exception: {ex.Message}" };
            }
        }

        // --- Helpers ---
        private async Task<string?> GetAccessTokenAsync()
        {
            var consumerKey = _configuration["Mpesa:ConsumerKey"];
            var consumerSecret = _configuration["Mpesa:ConsumerSecret"];

            var authString = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{consumerKey}:{consumerSecret}"));

            var request = new RestRequest("/oauth/v1/generate", Method.Get);
            request.AddQueryParameter("grant_type", "client_credentials");
            request.AddHeader("Authorization", $"Basic {authString}");

            var response = await _client.ExecuteAsync(request);

            if (!response.IsSuccessful)
                return null;

            var data = JsonConvert.DeserializeObject<dynamic>(response.Content!);
            return data?.access_token;
        }

        private string SanitizePhoneNumber(string phone)
        {
            var clean = phone.Replace("+", "").Replace(" ", "").Replace("-", "");
            if (clean.StartsWith("07")) return "254" + clean.Substring(1);
            if (clean.StartsWith("01")) return "254" + clean.Substring(1);
            return clean;
        }
    }
}