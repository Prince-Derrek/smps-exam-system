namespace SMPS.Domain.Entities
{
    public class ExamUnit
    {
        public Guid Id { get; set; } // Primary Key
        public string UnitCode { get; set; } = string.Empty;
        public string UnitTitle { get; set; } = string.Empty;
        public decimal StandardFee { get; set; } // e.g. 1000.00
    }
}