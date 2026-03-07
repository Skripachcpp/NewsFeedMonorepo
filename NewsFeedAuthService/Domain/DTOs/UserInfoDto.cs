namespace Domain.DTOs;

public sealed record UserInfoDto
{
    public required string Name { get; init; }
}