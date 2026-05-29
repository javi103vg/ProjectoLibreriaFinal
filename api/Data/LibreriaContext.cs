using LibreriaAPIV6.Models;
using Microsoft.EntityFrameworkCore;

namespace LibreriaAPIV6.Data
{
    public class LibreriaContext : DbContext
    {
        public LibreriaContext(DbContextOptions<LibreriaContext> options)
            : base(options)
        {
        }

        // DbSet para libros
        public DbSet<Libro> Libros => Set<Libro>();

        // DbSet para usuarios
        public DbSet<Usuario> Usuarios => Set<Usuario>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔹 Índice único en ISBN de libros
            modelBuilder.Entity<Libro>()
                .HasIndex(l => l.Isbn)
                .IsUnique();

            // 🔹 Índice único en Name de usuarios
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Name)
                .IsUnique();
        }
    }
}