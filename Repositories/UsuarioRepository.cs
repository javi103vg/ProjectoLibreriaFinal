using LibreriaAPIV6.Data;
using LibreriaAPIV6.Models;
using Microsoft.EntityFrameworkCore;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly LibreriaContext _context;

    public UsuarioRepository(LibreriaContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Usuario>> GetAllAsync() =>
        await _context.Usuarios.ToListAsync();

    public async Task<Usuario?> GetByNameAsync(string name) =>
        await _context.Usuarios.FirstOrDefaultAsync(u => u.Name == name);

    public async Task<Usuario?> GetByNameAndPasswordAsync(string name, string password) =>
        await _context.Usuarios.FirstOrDefaultAsync(u => u.Name == name && u.Password == password);

    public async Task AddAsync(Usuario usuario) =>
        await _context.Usuarios.AddAsync(usuario);

    public void Update(Usuario usuario) =>
        _context.Usuarios.Update(usuario);

    public void Delete(Usuario usuario) =>
        _context.Usuarios.Remove(usuario);

    public async Task<bool> ExistsByNameAsync(string name) =>
        await _context.Usuarios.AnyAsync(u => u.Name == name);

    public async Task SaveAsync() =>
        await _context.SaveChangesAsync();
}