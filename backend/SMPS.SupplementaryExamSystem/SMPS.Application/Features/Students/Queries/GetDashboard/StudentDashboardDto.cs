namespace SMPS.Application.Features.Students.Queries.GetDashboard;

public class StudentDashboardDto
{
    public int ActiveCount { get; set; }
    public int PaidCount { get; set; }
    public int FailedCount { get; set; }
    public int AvailableUnitsCount { get; set; }
    public List<RecentBookingDto> RecentBookings { get; set; } = new();
}

public class RecentBookingDto
{
    public Guid Id { get; set; }
    public string UnitCode { get; set; } = string.Empty;
    public string UnitTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}