namespace LibreriaAPIV6.DTOs
{
    public class UsuarioRequestDTO
    {
        public string Name { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Rol { get; set; } = null!;
    }
}