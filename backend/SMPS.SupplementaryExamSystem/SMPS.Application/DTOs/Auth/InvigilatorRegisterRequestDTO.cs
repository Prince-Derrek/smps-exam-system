namespace SMPS.Application.DTOs.Auth
{
    public class InvigilatorRegisterRequest()
    {
        public string StaffNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
   
}