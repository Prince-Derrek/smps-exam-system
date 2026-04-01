namespace SMPS.Application.DTOs.Auth
{
    public record StudentRegisterRequest(
        string RegistrationNumber,
        string Email,
        string FirstName,
        string LastName,
        string Password
    );

}