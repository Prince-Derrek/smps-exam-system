using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SMPS.Application.DTOs.Mpesa
{
    // 1. Response from the STK Push Request
    public class DarajaPushResponse
    {
        public string? MerchantRequestID { get; set; }
        public string? CheckoutRequestID { get; set; }
        public string? ResponseCode { get; set; }
        public string? ResponseDescription { get; set; }
        public string? CustomerMessage { get; set; }
    }

    // 2. The incoming Webhook Payload Structure
    public class DarajaCallbackRoot
    {
        public DarajaBody? Body { get; set; }
    }

    public class DarajaBody
    {
        public DarajaStkCallback? stkCallback { get; set; }
    }

    public class DarajaStkCallback
    {
        public string? MerchantRequestID { get; set; }
        public string? CheckoutRequestID { get; set; }
        public int ResultCode { get; set; }
        public string? ResultDesc { get; set; }
        public DarajaCallbackMetadata? CallbackMetadata { get; set; }
    }

    public class DarajaCallbackMetadata
    {
        public List<DarajaItem>? Item { get; set; }
    }

    public class DarajaItem
    {
        public string? Name { get; set; }
        public object? Value { get; set; }
    }
}