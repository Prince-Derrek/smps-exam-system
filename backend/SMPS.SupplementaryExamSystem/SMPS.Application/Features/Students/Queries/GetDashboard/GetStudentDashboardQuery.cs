using MediatR;

namespace SMPS.Application.Features.Students.Queries.GetDashboard;

public record GetStudentDashboardQuery(Guid StudentId) : IRequest<StudentDashboardDto>;