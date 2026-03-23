using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IStudentRepository
    {
        Task<Student?> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task AddAsync(Student student);
    }
}
