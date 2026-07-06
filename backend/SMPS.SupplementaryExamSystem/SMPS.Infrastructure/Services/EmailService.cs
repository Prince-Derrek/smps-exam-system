using Microsoft.Extensions.Configuration;
using SMPS.Application.Services.Interfaces;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        // We use a static HttpClient to prevent socket exhaustion in production
        private static readonly HttpClient _httpClient = new HttpClient();

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailWithAttachmentAsync(string toEmail, string subject, string htmlBody, byte[] attachmentBytes, string attachmentName)
        {
            // 1. Build the exact JSON payload Resend expects
            var payload = new
            {
                // Formats as: "SMPS Exam Portal <onboarding@resend.dev>"
                from = $"{_config["EmailSettings:SenderName"]} <{_config["EmailSettings:SenderEmail"]}>",
                to = new[] { toEmail },
                subject = subject,
                html = htmlBody,

                // Convert the PDF bytes to a Base64 string for the API
                attachments = attachmentBytes != null && attachmentBytes.Length > 0 ? new[]
                {
                    new
                    {
                        filename = attachmentName,
                        content = Convert.ToBase64String(attachmentBytes)
                    }
                } : null
            };

            // Safely ignore null attachments so the API doesn't complain
            var jsonString = JsonSerializer.Serialize(payload, new JsonSerializerOptions
            {
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            });

            // 2. Prepare the HTTP POST Request
            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
            request.Content = new StringContent(jsonString, Encoding.UTF8, "application/json");

            // Inject your API Key (AppPassword) as a Bearer token
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _config["EmailSettings:AppPassword"]);

            // 3. Fire the request over Port 443! (Bypasses the Render SMTP Firewall)
            var response = await _httpClient.SendAsync(request);

            // 4. Error Handling
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Resend API Error: {response.StatusCode} - {error}");
            }
        }
    }
}