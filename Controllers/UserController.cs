using application_Livraison.Data;
using application_Livraison.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace application_Livraison.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Admin peut voir tous les utilisateurs
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Utilisateurs
                                       .Select(u => new UserDto
                                       {
                                           Id = u.Id,
                                           Nom = u.Nom,
                                           Email = u.Email,
                                           Role = u.Role
                                       })
                                       .ToListAsync();
            return Ok(users);
        }

        // ✅ Admin peut voir un utilisateur par ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Utilisateurs
                                     .Where(u => u.Id == id)
                                     .Select(u => new UserDto
                                     {
                                         Id = u.Id,
                                         Nom = u.Nom,
                                         Email = u.Email,
                                         Role = u.Role
                                     })
                                     .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "Utilisateur non trouvé." });
            }

            return Ok(user);
        }

        // ✅ Admin peut créer un utilisateur
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> PostUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Utilisateurs.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest(new { message = "Un utilisateur avec cet email existe déjà." });
            }

            _context.Utilisateurs.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Nom = user.Nom,
                Email = user.Email,
                MotDePasse = user.MotDePasse,

                Role = user.Role
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
        }

        // ✅ Admin peut modifier un utilisateur
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutUser(int id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest(new { message = "L'ID de l'utilisateur ne correspond pas." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Utilisateurs.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound(new { message = "Utilisateur non trouvé." });
            }

            // Si le mot de passe n'est pas modifié (si motDePasse est null ou vide), on garde l'ancien mot de passe
            if (string.IsNullOrEmpty(user.MotDePasse))
            {
                user.MotDePasse = existingUser.MotDePasse;  // Conserver l'ancien mot de passe
            }

            // Applique les autres modifications sans toucher au mot de passe si ce dernier n'est pas fourni
            _context.Entry(existingUser).CurrentValues.SetValues(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Utilisateurs.AnyAsync(e => e.Id == id))
                {
                    return NotFound(new { message = "Utilisateur non trouvé." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // ✅ Admin peut supprimer un utilisateur
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Utilisateurs.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Utilisateur non trouvé." });
            }

            _context.Utilisateurs.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Profil de l'utilisateur connecté
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            var username = User.Identity?.Name;
            var user = await _context.Utilisateurs
                                      .Where(u => u.Nom == username)
                                      .Select(u => new UserDto
                                      {
                                          Id = u.Id,
                                          Nom = u.Nom,
                                          Email = u.Email,
                                          Role = u.Role
                                      })
                                      .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "Profil non trouvé." });
            }

            return Ok(user);
        }

        // ✅ Route de test pour afficher tous les utilisateurs
        [HttpGet("test")]
        public async Task<IActionResult> TestUsers()
        {
            var users = await _context.Utilisateurs
                                       .Select(u => new UserDto
                                       {
                                           Id = u.Id,
                                           Nom = u.Nom,
                                           Email = u.Email,
                                           Role = u.Role
                                       })
                                       .ToListAsync();
            return Ok(users);
        }

        [HttpGet("count-chauffeurs")]
        public async Task<IActionResult> GetNombreChauffeurs()
        {
            var count = await _context.Utilisateurs.CountAsync(u => u.Role == "Chauffeur");
            return Ok(new { total = count });
        }


        [HttpGet("chauffeurs")]
        public async Task<IActionResult> GetChauffeurs()
        {
            var chauffeurs = await _context.Utilisateurs
                .Where(u => u.Role == "chauffeur")  // Filtrer les utilisateurs avec le rôle "chauffeur"
                .ToListAsync();

            if (chauffeurs == null || !chauffeurs.Any())
            {
                return NotFound(new { message = "Aucun chauffeur trouvé." });
            }

            return Ok(chauffeurs);
        }
    }
    public class UserDto
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public string Email { get; set; }
        public string MotDePasse { get; set; }

        public string Role { get; set; }

    }
}
