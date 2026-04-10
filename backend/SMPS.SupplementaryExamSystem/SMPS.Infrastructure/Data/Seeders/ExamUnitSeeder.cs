using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Infrastructure.Persistence;

namespace SMPS.Infrastructure.Data.Seeders
{
    public static class ExamUnitSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Only seed if the table is completely empty
            if (await context.ExamUnits.AnyAsync()) return;

            var units = new List<ExamUnit>
            {
                new() { Id = Guid.NewGuid(), UnitCode = "CS101", UnitTitle = "Introduction to Programming", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS202", UnitTitle = "Data Structures & Algorithms", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS303", UnitTitle = "Database Systems", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS404", UnitTitle = "Software Engineering", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS505", UnitTitle = "Computer Networks", StandardFee = 1000.00m },
            };

            await context.ExamUnits.AddRangeAsync(units);
            await context.SaveChangesAsync();
        }
    }
}