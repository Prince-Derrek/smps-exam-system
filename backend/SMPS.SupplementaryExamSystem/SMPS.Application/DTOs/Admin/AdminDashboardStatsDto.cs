namespace SMPS.Application.DTOs.Admin
{
    public class AdminDashboardStatsDto
    {
        public int TotalStudents { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int VerifiedTickets { get; set; }
    }
}