using System;

namespace SMPS.Application.DTOs.Admin
{
    public class AdminPaymentDto
    {
        public Guid Id { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string UnitTitle { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? MpesaReceiptNumber { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
    }
}