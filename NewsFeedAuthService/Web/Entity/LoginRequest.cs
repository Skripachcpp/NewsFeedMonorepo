using Web.Application;

namespace Web.Entity;

public sealed record LoginRequest
{
    [Validate(Required = true)]
    public required string Username { get; init; }
    [Validate(Required = true)]
    public required string Password { get; init; }
}