using Domain.DTOs;

namespace Domain;

public interface IJwtToken
{
    string Generate(int id, string name, string email);

    bool Validate(string token);

    /// <summary>
    /// Валидирует токен и возвращает данные пользователя из claims, либо null при невалидном токене.
    /// </summary>
    UserDto? GetUserFromToken(string token);
}
