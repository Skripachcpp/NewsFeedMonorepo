using Domain;
using Domain.DTOs;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure;

public class UserRepository(DpContext dpContext): IUserRepository
{
    public async Task<int> AddUserAsync(
        string name,
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var createdAt = DateTime.UtcNow;
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        // language=PostgreSQL
        var id = await dpContext.QuerySingleAsync<int>(
            @"
              INSERT INTO user_accounts (user_name, email, password_hash, created_at) 
              VALUES (@Name, @Email, @PasswordHash, @CreatedAt)
              RETURNING id;
              ",
            parameters: new { Name = name, Email = email, PasswordHash = passwordHash, CreatedAt = createdAt },
            cancellationToken: cancellationToken);

        return id;
    }

    public async Task<bool> CheckLoginAndEmailAsync(
        string name,
        string email,
        CancellationToken cancellationToken = default)
    {
        // language=PostgreSQL
        var id = await dpContext.QueryFirstOrDefaultAsync<int?>(
            @"SELECT id FROM user_accounts WHERE email = @Email or user_name = @Name",
            parameters: new { Email = email, Name = name },
            cancellationToken: cancellationToken);

        return id != null;
    }

    public async Task<UserDto?> GetUserAsync(
        string name,
        string password,
        CancellationToken cancellationToken = default)
    {
        // language=PostgreSQL
        var user = await dpContext.QueryFirstOrDefaultAsync<User?>(
            @"
      SELECT 
          id as Id, 
          user_name as Username, 
          email as Email, 
          password_hash as PasswordHash,
          created_at as CreatedAt
      FROM user_accounts 
      WHERE user_name = @Name
      ",
            parameters: new { Name = name },
            cancellationToken: cancellationToken);

        if (user == null) return null;

        var valid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        if (!valid) return null;

        return new UserDto
        {
            Id = user.Id,
            Name = user.Username,
            Email = user.Email,
        };
    }
}
