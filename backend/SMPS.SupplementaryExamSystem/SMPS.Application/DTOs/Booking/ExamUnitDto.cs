namespace SMPS.Application.DTOs.Booking
{
    public class ExamUnitDto
    {
        public Guid Id {get; set;}
        public string UnitCode {get;set;} = string.Empty;
        public string UnitTitle {get;set;} = string.Empty;
        public decimal StandardFee {get;set;} = decimal.Zero;

    }
}