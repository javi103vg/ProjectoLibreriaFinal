using LibreriaAPIV6.DTOs;
using LibreriaAPIV6.Models;
using LibreriaAPIV6.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LibreriaAPIV6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioRepository _repository;

        public UsuariosController(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        // GET: api/usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioReadDTO>>> GetAll()
        {
            var usuarios = await _repository.GetAllAsync();

            var response = usuarios.Select(u => new UsuarioReadDTO
            {
                Name = u.Name,
                Rol = u.Rol
            });

            return Ok(response);
        }

        // GET: api/usuarios/{name}
        [HttpGet("{name}")]
        public async Task<ActionResult<UsuarioReadDTO>> GetByName(string name)
        {
            var usuario = await _repository.GetByNameAsync(name);

            if (usuario == null)
                return NotFound();

            var response = new UsuarioReadDTO
            {
                Name = usuario.Name,
                Rol = usuario.Rol
            };

            return Ok(response);
        }

        // POST: api/usuarios/login
        [HttpPost("login")]
        public async Task<ActionResult<UsuarioReadDTO>> Login(UsuarioLoginDTO dto)
        {
            var usuario = await _repository.GetByNameAndPasswordAsync(dto.Name, dto.Password);

            if (usuario == null)
                return Unauthorized("Credenciales incorrectas");

            var response = new UsuarioReadDTO
            {
                Name = usuario.Name,
                Rol = usuario.Rol
            };

            return Ok(response);
        }

        // POST: api/usuarios
        [HttpPost]
        public async Task<ActionResult> Create(UsuarioRequestDTO dto)
        {
            if (await _repository.ExistsByNameAsync(dto.Name))
                return BadRequest("El usuario ya existe");

            var usuario = new Usuario
            {
                Name = dto.Name,
                Password = dto.Password,
                Rol = dto.Rol
            };

            await _repository.AddAsync(usuario);
            await _repository.SaveAsync();

            return CreatedAtAction(nameof(GetByName), new { name = usuario.Name }, null);
        }

        // PUT: api/usuarios/{name}
        [HttpPut("{name}")]
        public async Task<IActionResult> Update(string name, UsuarioRequestDTO dto)
        {
            var usuario = await _repository.GetByNameAsync(name);

            if (usuario == null)
                return NotFound();

            usuario.Password = dto.Password;
            usuario.Rol = dto.Rol;

            _repository.Update(usuario);
            await _repository.SaveAsync();

            return NoContent();
        }

        // DELETE: api/usuarios/{name}
        [HttpDelete("{name}")]
        public async Task<IActionResult> Delete(string name)
        {
            var usuario = await _repository.GetByNameAsync(name);

            if (usuario == null)
                return NotFound();

            _repository.Delete(usuario);
            await _repository.SaveAsync();

            return NoContent();
        }
    }
}