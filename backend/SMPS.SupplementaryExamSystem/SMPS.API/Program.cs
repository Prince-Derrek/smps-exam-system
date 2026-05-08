using Hangfire;
using Hangfire.Redis;
using Hangfire.Redis.StackExchange;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SMPS.Application.Features.Students.Queries.GetDashboard;
using SMPS.Application.Interfaces;
using SMPS.Application.Services.Implementation;
using SMPS.Application.Services.Interfaces;
using SMPS.Application.Settings;
using SMPS.Domain.Interfaces;
using SMPS.Infrastructure.Data.Seeders;
using SMPS.Infrastructure.Persistence;
using SMPS.Infrastructure.Repositories;
using SMPS.Infrastructure.Security;
using SMPS.Infrastructure.Services;
using StackExchange.Redis;
using System.Security.Claims;
using System.Text;


QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;


var builder = WebApplication.CreateBuilder(args);

// -------------------------------------------------------
// 1. DATABASE
// -------------------------------------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// 1. FAIL FAST: If Render didn't load the variable, crash with a clear message, not a cryptic index 0 error.
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("CRITICAL SYSTEM HALT: The DefaultConnection string is empty. Check Render Environment Variables!");
}

// 2. THE PARSER: Handle both 'postgres://' and 'postgresql://' safely
if (connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) || 
    connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
{
    var uri = new Uri(connectionString);
    var userInfo = uri.UserInfo.Split(':');
    
    var username = userInfo.Length > 0 ? userInfo[0] : "";
    var password = userInfo.Length > 1 ? userInfo[1] : "";

    // Rebuild into the strict ADO.NET format that Npgsql demands
    connectionString = $"Host={uri.Host};Port={(uri.Port > 0 ? uri.Port : 5432)};Database={uri.AbsolutePath.TrimStart('/')};Username={username};Password={password};Ssl Mode=Require;Trust Server Certificate=true;";
}
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IApplicationDbContext>(provider =>
    provider.GetRequiredService<ApplicationDbContext>());

var redisConnectionString = builder.Configuration.GetConnectionString("RedisConnection");
if (!string.IsNullOrEmpty(redisConnectionString) && redisConnectionString.StartsWith("redis"))
{
    var uri = new Uri(redisConnectionString);

    // Extract password (Render URLs usually format as redis://red-user:password@host:port)
    var userInfo = uri.UserInfo.Split(':');
    var password = userInfo.Length > 1 ? userInfo[1] : string.Empty;

    // Check if it's secure Redis (rediss://)
    bool useSsl = uri.Scheme.Equals("rediss", StringComparison.OrdinalIgnoreCase);

    // Rebuild the string into the exact format StackExchange demands
    redisConnectionString = $"{uri.Host}:{uri.Port},password={password},ssl={useSsl},abortConnect=False";
}

builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseRedisStorage(redisConnectionString, new RedisStorageOptions
    {
        Prefix = "hangfire:",
        SucceededListSize = 1000,
        DeletedListSize = 1000
    }));

// 2. Add the Hangfire Server
builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = 1; // CRITICAL for 512MB Render containers!
});

// -------------------------------------------------------
// 2. REPOSITORIES & UNIT OF WORK
// -------------------------------------------------------
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IInvigilatorRepository, InvigilatorRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IExamUnitRepository, ExamUnitRepository>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IPaymentConnector, MpesaConnector>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IVerificationTicketRepository, VerificationTicketRepository>();
builder.Services.AddSingleton<IQRCodeService, QRCodeService>();
builder.Services.AddScoped<IPdfDocumentService, PdfDocumentService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(GetStudentDashboardQuery).Assembly);
});
builder.Services.AddScoped<ITicketVerificationService, TicketVerificationService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminExamUnitService, AdminExamUnitService>();
builder.Services.AddScoped<IAdminStudentService, AdminStudentService>();
builder.Services.AddScoped<IAdminBookingService, AdminBookingService>();
builder.Services.AddScoped<IAdminPaymentService, AdminPaymentService>();
builder.Services.AddScoped<IAdminInvigilatorService, AdminInvigilatorService>();


// -------------------------------------------------------
// 3. JWT
// -------------------------------------------------------
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddSingleton<TokenService>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Creates the "student" policy that your controller is looking for
    options.AddPolicy("student", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("Student");
    });
});

// -------------------------------------------------------
// 4. API
// -------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token. Example: Bearer eyJhbGci..."
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowRenderFrontend",
        policy => policy
            // REPLACE THIS with your actual React frontend URL from Render
            .WithOrigins("https://smps-portal.onrender.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

builder.Services.Configure<AdminSeedSettings>(
    builder.Configuration.GetSection("AdminSeeding"));
builder.Services.AddTransient<AdminSeeder>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowRenderFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ---------------------------------------------------------
// DATABASE MIGRATION & SEEDING BLOCK
// ---------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // 1. Grab the database context from the DI container
        var context = services.GetRequiredService<ApplicationDbContext>();
        var adminSeeder = services.GetRequiredService<AdminSeeder>();

        // 2. (Highly Recommended) Automatically apply any pending migrations
        await context.Database.MigrateAsync();

        // 3. Run your custom seeder!
        await adminSeeder.SeedAsync();
        await SMPS.Infrastructure.Data.Seeders.ExamUnitSeeder.SeedAsync(context);

        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Database seeded successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}
// ---------------------------------------------------------

app.Run();