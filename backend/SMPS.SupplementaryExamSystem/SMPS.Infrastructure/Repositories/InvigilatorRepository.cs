using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Persistence;

namespace SMPS.Infrastructure.Repositories
{
    public class InvigilatorRepository : IInvigilatorRepository
    {
        private readonly ApplicationDbContext _context;

        public InvigilatorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Invigilator?> GetInvigilatorByEmailAsync(string email)
            => await _context.Invigilators
                .FirstOrDefaultAsync(i => i.Email == email);

        public async Task<bool> InvigilatorExistsByEmailAsync(string email)
            => await _context.Invigilators
                .AnyAsync(i => i.Email == email);

        public async Task AddInvigilatorAsync(Invigilator invigilator)
            => await _context.Invigilators.AddAsync(invigilator);
    }
}
