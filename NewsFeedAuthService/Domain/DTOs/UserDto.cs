namespace Domain.DTOs;

public sealed record UserDto
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public required string Email { get; init; }
}