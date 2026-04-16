namespace SMPS.Application.DTOs.Admin
{
    public class AdminTrendDto
    {
        public string DateLabel { get; set; } = string.Empty;
        public int BookingCount { get; set; }
        public decimal Revenue { get; set; }
    }
}