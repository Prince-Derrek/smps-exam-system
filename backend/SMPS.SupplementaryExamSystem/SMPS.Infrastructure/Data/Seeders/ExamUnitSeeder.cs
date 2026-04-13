using Microsoft.EntityFrameworkCore;
using SMPS.Domain.Entities;
using SMPS.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SMPS.Infrastructure.Data.Seeders
{
    public static class ExamUnitSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // 1. Force the 1 Bob Test Unit into the DB if it is missing
            if (!await context.ExamUnits.AnyAsync(u => u.UnitCode == "CS609"))
            {
                var testUnit = new ExamUnit
                {
                    Id = Guid.NewGuid(),
                    UnitCode = "CS609",
                    UnitTitle = "Operating Systems 2",
                    StandardFee = 1.00m
                };

                await context.ExamUnits.AddAsync(testUnit);
                await context.SaveChangesAsync();
            }

            // 2. Check if the original batch is already there (using CS101 as the anchor)
            if (await context.ExamUnits.AnyAsync(u => u.UnitCode == "CS101"))
                return; // The main units are already seeded, stop here.

            // 3. Seed the rest if they are missing
            var units = new List<ExamUnit>
            {
                new() { Id = Guid.NewGuid(), UnitCode = "CS101", UnitTitle = "Introduction to Programming", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS202", UnitTitle = "Data Structures & Algorithms", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS303", UnitTitle = "Database Systems", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS404", UnitTitle = "Software Engineering", StandardFee = 1000.00m },
                new() { Id = Guid.NewGuid(), UnitCode = "CS505", UnitTitle = "Computer Networks", StandardFee = 1000.00m }
            };

            await context.ExamUnits.AddRangeAsync(units);
            await context.SaveChangesAsync();
        }
    }
}