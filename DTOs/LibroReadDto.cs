namespace LibreriaAPIV6.DTOs
{
    public class LibroReadDto //o LibroReadDto.cs
 {
 public int Id { get; set; }
    public string Isbn { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
    public string Editorial { get; set; } = string.Empty;
    public string Formato { get; set; } = string.Empty;
    public string Edicion { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public string ImagenUrl { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string Sinopsis { get; set; } = string.Empty;
}
}
