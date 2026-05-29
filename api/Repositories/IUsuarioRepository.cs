using LibreriaAPIV6.Models;

public interface IUsuarioRepository
{
    Task<IEnumerable<Usuario>> GetAllAsync();
    Task<Usuario?> GetByNameAsync(string name);
    Task<Usuario?> GetByNameAndPasswordAsync(string name, string password);
    Task AddAsync(Usuario usuario);
    void Update(Usuario usuario);
    void Delete(Usuario usuario);
    Task<bool> ExistsByNameAsync(string name);
    Task SaveAsync();
}