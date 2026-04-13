using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SMPS.Application.DTOs.Mpesa;
using SMPS.Application.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace SMPS.API.Controllers
{
    [ApiController]
    [Route("api/mpesa")]
    [AllowAnonymous] // CRITICAL: Safaricom is not a logged-in student!
    public class MpesaWebhookController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ILogger<MpesaWebhookController> _logger;

        public MpesaWebhookController(IBookingService bookingService, ILogger<MpesaWebhookController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        [HttpPost("callback")]
        public async Task<IActionResult> Callback([FromBody] DarajaCallbackRoot payload)
        {
            // 1. Safety check
            var stkCallback = payload?.Body?.stkCallback;
            if (stkCallback == null)
            {
                _logger.LogWarning("Received invalid M-Pesa webhook payload.");
                // We return Ok() anyway so Safaricom doesn't keep retrying and spamming our server
                return Ok(new { ResultCode = 0, ResultDesc = "Received" });
            }

            // 2. Extract Data
            string checkoutRequestId = stkCallback.CheckoutRequestID ?? string.Empty;
            int resultCode = stkCallback.ResultCode;
            string resultDesc = stkCallback.ResultDesc ?? "Unknown";
            string? receiptNumber = null;

            // 3. Extract the actual Receipt Number (e.g. QEH123456) if successful
            if (resultCode == 0 && stkCallback.CallbackMetadata?.Item != null)
            {
                var receiptItem = stkCallback.CallbackMetadata.Item.FirstOrDefault(i => i.Name == "MpesaReceiptNumber");
                receiptNumber = receiptItem?.Value?.ToString();
            }

            _logger.LogInformation($"M-Pesa Webhook Received for {checkoutRequestId}. Result: {resultCode} - {resultDesc}");

            // 4. Update our Database
            await _bookingService.ConfirmPaymentAsync(checkoutRequestId, resultCode, resultDesc, receiptNumber);

            // 5. Tell Safaricom we successfully received the message
            return Ok(new { ResultCode = 0, ResultDesc = "Accepted" });
        }
    }
}