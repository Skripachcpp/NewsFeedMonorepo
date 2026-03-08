using Domain.DTOs;

namespace Domain;

public interface IUserRepository
{
    Task<int> AddUserAsync(string name, string email, string password, CancellationToken cancellationToken = default);

    Task<bool> CheckLoginAndEmailAsync(string name, string email, CancellationToken cancellationToken = default);

    Task<UserDto?> GetUserAsync(string name, string password, CancellationToken cancellationToken = default);
}
