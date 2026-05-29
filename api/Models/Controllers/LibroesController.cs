using LibreriaAPIV6.DTOs;
using LibreriaAPIV6.Models;
using LibreriaAPIV6.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LibreriaAPIV6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibrosController : ControllerBase
    {
        private readonly ILibroRepository _repository;

        public LibrosController(ILibroRepository repository)
        {
            _repository = repository;
        }

        // GET: api/libros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LibroReadDto>>> GetAll()
        {
            var libros = await _repository.GetAllAsync();

            var response = libros.Select(l => new LibroReadDto
            {
                Id = l.Id,
                Isbn = l.Isbn,
                Titulo = l.Titulo,
                Autor = l.Autor,
                Editorial = l.Editorial,
                Formato = l.Formato,
                Edicion = l.Edicion,
                Precio = l.Precio,
                ImagenUrl = l.ImagenUrl,
                Stock = l.Stock,
                Sinopsis = l.Sinopsis
            });

            return Ok(response);
        }

        // GET: api/libros/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LibroReadDto>> GetById(int id)
        {
            var libro = await _repository.GetByIdAsync(id);

            if (libro == null)
                return NotFound();

            var response = new LibroReadDto
            {
                Id = libro.Id,
                Isbn = libro.Isbn,
                Titulo = libro.Titulo,
                Autor = libro.Autor,
                Editorial = libro.Editorial,
                Formato = libro.Formato,
                Edicion = libro.Edicion,
                Precio = libro.Precio,
                ImagenUrl = libro.ImagenUrl,
                Stock = libro.Stock,
                Sinopsis = libro.Sinopsis
            };

            return Ok(response);
        }

        // GET: api/libros/isbn/123456
        [HttpGet("isbn/{isbn}")]
        public async Task<ActionResult<LibroReadDto>> GetByIsbn(string isbn)
        {
            var libro = await _repository.GetByIsbnAsync(isbn);

            if (libro == null)
                return NotFound();

            var response = new LibroReadDto
            {
                Id = libro.Id,
                Isbn = libro.Isbn,
                Titulo = libro.Titulo,
                Autor = libro.Autor,
                Editorial = libro.Editorial,
                Formato = libro.Formato,
                Edicion = libro.Edicion,
                Precio = libro.Precio,
                ImagenUrl = libro.ImagenUrl,
                Stock = libro.Stock,
                Sinopsis = libro.Sinopsis
            };

            return Ok(response);
        }

        // POST
        [HttpPost]
        public async Task<ActionResult> Create(LibroRequestDto dto)
        {
            if (await _repository.ExistsByIsbnAsync(dto.Isbn))
                return BadRequest("El ISBN ya existe");

            var libro = new Libro
            {
                Isbn = dto.Isbn,
                Titulo = dto.Titulo,
                Autor = dto.Autor,
                Editorial = dto.Editorial,
                Formato = dto.Formato,
                Edicion = dto.Edicion,
                Precio = dto.Precio,
                ImagenUrl = dto.ImagenUrl,
                Stock = dto.Stock,
                Sinopsis = dto.Sinopsis
            };

            await _repository.AddAsync(libro);
            await _repository.SaveAsync();

            return CreatedAtAction(nameof(GetById), new { id = libro.Id }, null);
        }

        // PUT por ID
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, LibroRequestDto dto)
        {
            var libro = await _repository.GetByIdAsync(id);

            if (libro == null)
                return NotFound();

            libro.Isbn = dto.Isbn;
            libro.Titulo = dto.Titulo;
            libro.Autor = dto.Autor;
            libro.Editorial = dto.Editorial;
            libro.Formato = dto.Formato;
            libro.Edicion = dto.Edicion;
            libro.Precio = dto.Precio;
            libro.ImagenUrl = dto.ImagenUrl;
            libro.Stock = dto.Stock;
            libro.Sinopsis = dto.Sinopsis;

            _repository.Update(libro);
            await _repository.SaveAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var libro = await _repository.GetByIdAsync(id);

            if (libro == null)
                return NotFound();

            _repository.Delete(libro);
            await _repository.SaveAsync();

            return NoContent();
        }
    }
}