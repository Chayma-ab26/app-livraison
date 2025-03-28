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
                                           Role=u.Role
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
                                         Role =u.Role
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
                MotDePasse=user.MotDePasse,

                 Role=user.Role
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
                                          Role=u.Role
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
                                           Role= u.Role
                                       })
                                       .ToListAsync();
            return Ok(users);
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

/*using application_Livraison.Data;
using application_Livraison.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Utilisateurs.ToListAsync();
        }

        // ✅ Admin peut voir un utilisateur par ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Utilisateurs.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        // ✅ Admin peut créer un utilisateur
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Utilisateurs.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // ✅ Admin peut modifier un utilisateur
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id) return BadRequest();

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Utilisateurs.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // ✅ Admin peut supprimer un utilisateur
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Utilisateurs.FindAsync(id);
            if (user == null) return NotFound();

            _context.Utilisateurs.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Exemple : route accessible à tous (sans restriction de rôle)
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<User>> GetProfile()
        {
            var username = User.Identity?.Name;
            var user = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.Nom == username);
            if (user == null) return NotFound();
            return user;
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestUsers()
        {
            var users = await _context.Utilisateurs.ToListAsync();
            return Ok(users);
        }
    }
    }*/
/*
using application_Livraison.Data;
using application_Livraison.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Utilisateurs.ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Utilisateurs.FindAsync(id);
            if (user == null)
                return NotFound();

            return user;
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.Utilisateurs.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.Id)
                return BadRequest();

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Utilisateurs.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Utilisateurs.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
*/