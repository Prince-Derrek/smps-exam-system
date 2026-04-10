using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Persistence;

namespace SMPS.Infrastructure.Repositories
{
    public class ExamUnitRepository : IExamUnitRepository
    {
        private readonly ApplicationDbContext _context;

        public ExamUnitRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ExamUnit?> GetByIdAsync(Guid id)
            => await _context.ExamUnits.FindAsync(id);

        public async Task<IEnumerable<ExamUnit>> GetAllAsync()
            => await _context.ExamUnits.OrderBy(e => e.UnitCode).ToListAsync();
    }
}