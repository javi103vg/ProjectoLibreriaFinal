using LibreriaAPIV6.Data;
using LibreriaAPIV6.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LibreriaAPIV6
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<LibreriaContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("LibreriaConnection")));

            builder.Services.AddScoped<ILibroRepository, LibroRepository>();

            // CORS para Angular
            builder.Services.AddCors(opt =>
                opt.AddDefaultPolicy(p =>
                    p.WithOrigins("http://localhost:4200")
                     .AllowAnyHeader()
                     .AllowAnyMethod()));

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(); // <-- debe ir antes de UseAuthorization y MapControllers

            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}