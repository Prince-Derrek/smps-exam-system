using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IInvigilatorRepository
    {
        Task<Invigilator?> GetInvigilatorByEmailAsync(string email);
        Task<bool> InvigilatorExistsByEmailAsync(string email);
        Task AddInvigilatorAsync(Invigilator invigilator);
    }
}
