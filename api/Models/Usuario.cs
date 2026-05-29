using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaAPIV6.Models
{
    public class Usuario
    {
        [Key]
        [MaxLength(10)]
        public string Name { get; set; } = null!;

        [MaxLength(10)]
        public string Password { get; set; } = null!;

        [MaxLength(10)]
        public string Rol { get; set; } = null!;
    }
}