using MediatR;
using Microsoft.EntityFrameworkCore;
using SMPS.Application.Interfaces; // Assuming this holds IApplicationDbContext
using SMPS.Domain.Enums; // Assuming this holds Booking and related entities

namespace SMPS.Application.Features.Students.Queries.GetDashboard;

public class GetStudentDashboardQueryHandler : IRequestHandler<GetStudentDashboardQuery, StudentDashboardDto>
{
    private readonly IApplicationDbContext _context;

    public GetStudentDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentDashboardDto> Handle(GetStudentDashboardQuery request, CancellationToken cancellationToken)
    {
        var bookings = await _context.Bookings
            .Include(b => b.ExamUnit)
            .Where(b => b.StudentId == request.StudentId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);

        // Calculate counts based on your domain Enums/Status strings
        var dto = new StudentDashboardDto
        {
            ActiveCount = bookings.Count(b => b.Status == BookingStatus.Pending),
            PaidCount = bookings.Count(b => b.Status == BookingStatus.Paid),
            FailedCount = bookings.Count(b => b.Status == BookingStatus.Failed),
            AvailableUnitsCount = await _context.ExamUnits.CountAsync(cancellationToken), // Or filter by student's course
            RecentBookings = bookings.Take(5).Select(b => new RecentBookingDto
            {
                Id = b.Id,
                UnitCode = b.ExamUnit.UnitCode,
                UnitTitle = b.ExamUnit.UnitTitle,
                Status = b.Status.ToString()
            }).ToList()
        };

        return dto;
    }
}