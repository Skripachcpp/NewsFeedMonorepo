namespace Domain;

public interface IJwtToken
{
    string Generate(int id, string name, string email);

    bool Validate(string token);
}
