using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace LibreriaAPIV6.DTOs
{
    public class LibroRequestDto
    {
        [Required]
        [RegularExpression(@"^\d{13}$", ErrorMessage = "El ISBN debe tener 13 dígitos")]
        public string Isbn { get; set; } = string.Empty;
        [Required]
        [StringLength(150)]
        public string Titulo { get; set; } = string.Empty;
        [Required]
        public string Autor { get; set; } = string.Empty;
        public string Editorial { get; set; } = string.Empty;
        public string Formato { get; set; } = string.Empty;
        public string Edicion { get; set; } = string.Empty;
        [Precision(10, 2)]
        [Range(0.01, 9999)]
        public decimal Precio { get; set; }
        public string ImagenUrl { get; set; } = string.Empty;
        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        public string Sinopsis { get; set; } = string.Empty;
    }
}