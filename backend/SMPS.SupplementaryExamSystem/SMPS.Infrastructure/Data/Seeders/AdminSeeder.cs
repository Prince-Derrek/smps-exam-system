using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SMPS.Application.Interfaces;
using SMPS.Application.Settings;
using SMPS.Domain.Entities;
using BCrypt.Net; // Assuming you use BCrypt for passwords

namespace SMPS.Infrastructure.Data.Seeders
{
    public class AdminSeeder
    {
        private readonly IApplicationDbContext _context;
        private readonly AdminSeedSettings _settings;

        public AdminSeeder(IApplicationDbContext context, IOptions<AdminSeedSettings> settings)
        {
            _context = context;
            _settings = settings.Value;
        }

        public async Task SeedAsync()
        {
            // 1. Check if the admin already exists
            var adminExists = await _context.Admins.AnyAsync(a => a.Email == _settings.Email);

            if (!adminExists)
            {
                // 2. Hash the password securely
                // Replace this with however you hash passwords for Students/Invigilators
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(_settings.Password);

                // 3. Create the Admin entity
                var admin = new Admin
                {
                    Id = Guid.NewGuid(),
                    Email = _settings.Email,
                    FirstName = _settings.FirstName,
                    LastName = _settings.LastName,
                    PasswordHash = passwordHash,
                    Role = "Admin" // If your system requires an explicit role string
                };

                // 4. Save to database
                _context.Admins.Add(admin);
                await _context.SaveChangesAsync(default);
            }
        }
    }
}