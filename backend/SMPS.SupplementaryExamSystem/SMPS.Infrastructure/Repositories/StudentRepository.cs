using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Persistence;

namespace SMPS.Infrastructure.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> GetStudentByEmailAsync(string email)
            => await _context.Students
                .FirstOrDefaultAsync(s => s.Email == email);

        public async Task<bool> StudentExistsByEmailAsync(string email)
            => await _context.Students
                .AnyAsync(s => s.Email == email);

        public async Task AddStudentAsync(Student student)
            => await _context.Students.AddAsync(student);
    }
}
