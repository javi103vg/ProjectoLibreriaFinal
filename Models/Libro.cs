using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaAPIV6.Models
{
    public class Libro
    {
        public int Id { get; set; }
        public string? Isbn { get; set; }
        public string? Titulo { get; set; }
        public string? Autor { get; set; }
        public string? Editorial { get; set; }
        public string? Formato { get; set; }
        public string? Edicion { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        public string? ImagenUrl { get; set; }
        public int Stock { get; set; }
        public string? Sinopsis { get; set; }
    }
}