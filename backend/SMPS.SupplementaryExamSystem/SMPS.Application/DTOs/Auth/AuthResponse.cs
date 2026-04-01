namespace SMPS.Application.DTOs
{
    public record AuthResponse(string Token, string Email, string Role, string Name);
}