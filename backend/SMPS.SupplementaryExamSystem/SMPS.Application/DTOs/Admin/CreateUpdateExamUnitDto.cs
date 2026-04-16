namespace SMPS.Application.DTOs.Admin
{
    public class CreateUpdateExamUnitDto
    {
        public string UnitCode { get; set; } = string.Empty;
        public string UnitTitle { get; set; } = string.Empty;
        public decimal StandardFee { get; set; }
    }
}