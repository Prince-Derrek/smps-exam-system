namespace SMPS.Application.DTOs.Auth
{
    public record LoginRequest(string Email, string Password);

    public record StudentRegisterRequest(
        string RegistrationNumber,
        string Email,
        string FirstName,
        string LastName,
        string Password
    );

    public record InvigilatorRegisterRequest(
        string StaffNumber,
        string Email,
        string FullName,
        string Password
    );

    public record AuthResponse(string Token, string Email, string Role);
}
