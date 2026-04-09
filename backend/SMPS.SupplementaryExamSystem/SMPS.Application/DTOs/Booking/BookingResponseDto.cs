namespace SMPS.Application.DTOs.Booking
{
    public class BookingResponseDto
    {
        public Guid BookingId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Message { get; set; } 
        public string? PaymentReference { get; set; }
        public string UnitCode {get;set;} = string.Empty;
        public string UnitTitle {get;set;} = string.Empty;
        public decimal Fee {get;set;}
    }
}