using LibreriaAPIV6.Models;

namespace LibreriaAPIV6.Repositories
{
    public interface ILibroRepository
    {
        Task<IEnumerable<Libro>> GetAllAsync();
        Task<Libro?> GetByIdAsync(int id);
        Task<Libro?> GetByIsbnAsync(string isbn);
        Task<bool> ExistsByIsbnAsync(string isbn);

        Task AddAsync(Libro libro);
        void Update(Libro libro);
        void Delete(Libro libro);

        Task SaveAsync(); // 🔹 AÑADIDO: necesario para guardar cambios en BD
    }
}