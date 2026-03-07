using Web.Application;

namespace Web.Entity;

public sealed record RegisterRequest
{
    [Validate(Required = true, Min = 1, Max = 100)]
    public required string Name { get; init; }
    [Validate(Required = true, Min = 1, Max = 254)]
    public required string Email { get; init; }
    [Validate(Required = true, MaxBytes = 72)]
    public required string Password { get; init; }
}