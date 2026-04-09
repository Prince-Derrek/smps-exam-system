using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IExamUnitRepository
    {
        Task<ExamUnit?> GetByIdAsync(Guid id);
        Task<IEnumerable<ExamUnit>> GetAllAsync();
    }
}