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

        public async Task<Student?> GetByEmailAsync(string email)
            => await _context.Students
                .FirstOrDefaultAsync(s => s.Email == email);

        public async Task<bool> ExistsByEmailAsync(string email)
            => await _context.Students
                .AnyAsync(s => s.Email == email);

        public async Task AddAsync(Student student)
            => await _context.Students.AddAsync(student);
    }
}
