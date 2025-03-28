using application_Livraison.Data;
using application_Livraison.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace application_Livraison.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginUser)
        {
            if (string.IsNullOrWhiteSpace(loginUser.Email) || string.IsNullOrWhiteSpace(loginUser.MotDePasse))
            {
                return BadRequest(new { message = "Email et mot de passe sont requis." });
            }

            var user = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Email == loginUser.Email && u.MotDePasse == loginUser.MotDePasse);

            if (user == null)
            {
                return Unauthorized(new { message = "Identifiants incorrects." });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Nom ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role ?? ""),
                new Claim("UserId", user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = tokenString,
                nom = user.Nom,
                email = user.Email,
                role = user.Role
            });
        }

      



    }
}
