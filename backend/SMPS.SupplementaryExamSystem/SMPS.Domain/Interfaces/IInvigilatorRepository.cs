using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IInvigilatorRepository
    {
        Task<Invigilator?> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task AddAsync(Invigilator invigilator);
    }
}
