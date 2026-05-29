using LibreriaAPIV6.Data;
using LibreriaAPIV6.Models;
using Microsoft.EntityFrameworkCore;

namespace LibreriaAPIV6.Repositories
{
    public class LibroRepository : ILibroRepository
    {
        private readonly LibreriaContext _context;

        public LibroRepository(LibreriaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Libro>> GetAllAsync()
        {
            return await _context.Libros.ToListAsync();
        }

        public async Task<Libro?> GetByIdAsync(int id)
        {
            return await _context.Libros.FindAsync(id);
        }

        // 🔹 IMPLEMENTADO: Buscar libro por ISBN
        public async Task<Libro?> GetByIsbnAsync(string isbn)
        {
            return await _context.Libros
                .FirstOrDefaultAsync(l => l.Isbn == isbn);
        }

        // 🔹 IMPLEMENTADO: Verificar si existe ISBN
        public async Task<bool> ExistsByIsbnAsync(string isbn)
        {
            return await _context.Libros
                .AnyAsync(l => l.Isbn == isbn);
        }

        public async Task AddAsync(Libro libro)
        {
            await _context.Libros.AddAsync(libro);
        }

        public void Update(Libro libro)
        {
            _context.Libros.Update(libro);
        }

        public void Delete(Libro libro)
        {
            _context.Libros.Remove(libro);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}