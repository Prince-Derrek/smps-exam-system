namespace SMPS.Application.DTOs.Auth
{
    public record InvigilatorRegisterRequest(
        string StaffNumber,
        string Email,
        string FullName,
        string Password
    );
}