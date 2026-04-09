using System.Data;
using System.Text;
using Domain;
using Infrastructure;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// bd _
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (connectionString == null) throw new ConstraintException("Отсутствует connection string: DefaultConnectio");

builder.Services.AddDbContext<EfContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddScoped<DpContext>(_ => new DpContext(connectionString));
// bd ^
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtToken, JwtToken>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new ConstraintException("Отсутствует JwtSettings:SecretKey");
var issuer = jwtSettings["Issuer"] ?? throw new ConstraintException("Отсутствует JwtSettings:Issuer");
var audience = jwtSettings["Audience"] ?? throw new ConstraintException("Отсутствует JwtSettings:Audience");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
    };
});

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddOpenApiDocument(settings =>
{
    settings.Title = "NewsFeedAuthService API";
    settings.Description = "API для работы с авторизацией";
}); // swagger

builder.Services.AddOpenApi();

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});

// мониторим доступность баз данных
builder.Services.AddHealthChecks()
  .AddNpgSql(connectionString, name: "postgres");

var app = builder.Build();

// метрики
app.MapMetrics("/metrics");

// отчитываемся о том что живы здоровы
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
});
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,  // только проверка что приложение запущено
});

// автозапуск миграций
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var context = scope.ServiceProvider.GetRequiredService<EfContext>();

    try
    {
        logger.LogInformation("Применение миграций базы данных");
        context.Database.Migrate();
        logger.LogInformation("Миграции успешно применены.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Ошибка при применении миграций");
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.Urls.Add("http://localhost:5164");
}

// свагер пусть будет и в продакшене
app.UseOpenApi();
app.UseSwaggerUi();

app.UseCors();

app.UseHttpsRedirection();

// Prometheus HTTP метрики
app.UseHttpMetrics();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();