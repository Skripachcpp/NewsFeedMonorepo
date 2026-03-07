using System.Security.Claims;
using Domain;
using Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Application;
using Web.Entity;

namespace Web.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(IUserRepository userRepository, IJwtToken jwtToken): BaseController
{
    [HttpPost("register")]
    public async Task<ActionResult<string>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var email = request.Email;
        var name = request.Name;
        var password = request.Password;

        var userExists = await userRepository.CheckLoginAndEmailAsync(name, email, cancellationToken);
        if (userExists) return this.BadRequest("пользователь с таким именем или email уже существует");

        var id = await userRepository.AddUserAsync(name, email, password, cancellationToken);
        var token = jwtToken.Generate(id, name, email);

        return this.OkResult(token);
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken = default)
    {
        var name = request.Username;
        var password = request.Password;

        var user = await userRepository.GetUserAsync(name, password, cancellationToken);
        if (user == null) return this.BadRequest("пользователь с таким именем и паролем не найден");

        var email = user.Email;
        var id = user.Id;

        var token = jwtToken.Generate(id, name, email);

        return this.OkResult(token);
    }

    [HttpPost("validate")]
    public ActionResult<bool> ValidateToken([FromBody] string token, CancellationToken cancellationToken = default)
    {
        var valid = jwtToken.Validate(token);
        return this.OkResult(valid);
    }
    
    [HttpPost("info")]
    public ActionResult<UserInfoDto> Info(CancellationToken cancellationToken = default)
    {
        var token = this.GetTokenFromHeader();
        if (string.IsNullOrEmpty(token))
            return this.Unauthorized();

        var user = jwtToken.GetUserFromToken(token);
        if (user == null)
            return this.Unauthorized();

        return this.OkResult(new UserInfoDto() { Name = user.Name });
    }

    private string GetTokenFromHeader()
    {
        var authHeader = this.Request.Headers.Authorization.ToString();
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return authHeader.Substring(7).Trim();

        return string.Empty;
    }
}
