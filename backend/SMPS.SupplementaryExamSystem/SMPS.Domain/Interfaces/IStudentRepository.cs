using SMPS.Domain.Entities;

namespace SMPS.Domain.Interfaces
{
    public interface IStudentRepository
    {
        Task<Student?> GetStudentByEmailAsync(string email);
        Task<bool> StudentExistsByEmailAsync(string email);
        Task AddStudentAsync(Student student);
    }
}
