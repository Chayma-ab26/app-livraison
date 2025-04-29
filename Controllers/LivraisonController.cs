using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using application_Livraison.Data;
using application_Livraison.Models;

namespace application_Livraison.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LivraisonController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LivraisonController(ApplicationDbContext context)
        {
            _context = context;
        }




        // ✅ ADMIN : Voir toutes les livraisons
        // ✅ CHAUFFEUR : Voir seulement ses livraisons
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Livraison>>> GetLivraisons()
        {
            // Récupère l'ID de l'utilisateur connecté (c'est l'ID dans le JWT)
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Récupère le rôle de l'utilisateur (c'est le rôle dans le JWT)
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Vérifie si le rôle est présent dans le JWT
            if (string.IsNullOrEmpty(userRole))
            {
                return Unauthorized(new { message = "Rôle non autorisé" });
            }

            // Crée une requête de base qui inclut les données du chauffeur et de l'admin
            IQueryable<Livraison> query = _context.Livraisons
                .Include(l => l.Chauffeur)
                .Include(l => l.Admin)
                .Include(l => l.Itineraire);  // Inclure les itinéraires, si nécessaire

            // Si l'utilisateur est un chauffeur, restreindre les résultats à ses livraisons
            if (userRole == "Chauffeur")
            {
                query = query.Where(l => l.ChauffeurId == userId);
            }

            // L'admin peut voir toutes les livraisons, pas besoin de restriction supplémentaire
            if (userRole == "Admin")
            {
                // Pas de restriction à ajouter ici car l'admin peut voir toutes les livraisons
            }

            // Exécuter la requête et récupérer les résultats
            var livraisons = await query.ToListAsync();

            // Retourner la liste des livraisons en fonction du rôle
            return Ok(livraisons);
        }
        // Créer une livraison
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Livraison>> CreateLivraison([FromBody] LivraisonCreateDto livraisonDto)
        {
            var adminId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
            if (adminId == 0)
            {
                return BadRequest("UserId invalide.");
            }

            Console.WriteLine($"Données reçues: Client={livraisonDto.Client}, ChauffeurId={livraisonDto.ChauffeurId}");

            var livraison = new Livraison
            {
                Client = livraisonDto.Client,
                AdresseLivraison = livraisonDto.AdresseLivraison,
                produit = livraisonDto.Produit,
                Statut = livraisonDto.Statut,
                ChauffeurId = livraisonDto.ChauffeurId,
                AdminId = adminId,
            };

            _context.Livraisons.Add(livraison);
            await _context.SaveChangesAsync();

            // Récupère les détails de la livraison avec chauffeur et admin
            var livraisonAvecDetails = await _context.Livraisons
                .Include(l => l.Chauffeur)
                .Include(l => l.Admin)
                .FirstOrDefaultAsync(l => l.Id == livraison.Id);

            return Ok(livraisonAvecDetails);
        }

        // Récupérer la liste des chauffeurs
        [HttpGet("chauffeurs")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetChauffeurs()
        {
            try
            {
                var chauffeurs = await _context.Utilisateurs
                    .Where(u => u.Role == "Chauffeur")  // Filtrer par rôle "Chauffeur"
                    .Select(u => new { u.Id, u.Nom })   // Sélectionner l'ID et le nom du chauffeur
                    .ToListAsync();

                if (chauffeurs == null || !chauffeurs.Any())
                {
                    return NotFound("Aucun chauffeur trouvé.");
                }

                return Ok(chauffeurs);
            }
            catch (Exception ex)
            {
                // Si une erreur se produit, retourner une erreur interne
                return StatusCode(500, $"Erreur lors de la récupération des chauffeurs : {ex.Message}");
            }
        }
        /*
        // ✅ ADMIN et CHAUFFEUR : Voir une livraison spécifique
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Livraison>> GetLivraisonById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var livraison = await _context.Livraisons
                .Include(l => l.Chauffeur)
                .Include(l => l.Admin)
                .Include(l => l.Itineraire)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (livraison == null)
                return NotFound();

            // Chauffeur ne peut voir que ses propres livraisons
            if (userRole == "Chauffeur" && livraison.ChauffeurId != userId)
                return Forbid("Vous ne pouvez voir que vos propres livraisons.");

            return Ok(livraison);
        }
        [HttpGet("mes-livraisons")]
        [Authorize(Roles = "Chauffeur")]
        public async Task<ActionResult<IEnumerable<Livraison>>> GetMesLivraisons()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var mesLivraisons = await _context.Livraisons
                .Include(l => l.Chauffeur)
                .Include(l => l.Admin)
                .Include(l => l.Itineraire)
                .Where(l => l.ChauffeurId == userId)
                .ToListAsync();

            return Ok(mesLivraisons);
        }
        */
        // ✅ ADMIN et CHAUFFEUR : Voir une livraison spécifique
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Livraison>> GetLivraisonById(int id)
        {
            // Récupérer l'ID de l'utilisateur connecté et son rôle
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Log de l'ID de l'utilisateur pour le debug
            Console.WriteLine($"User ID connecté : {userId}");
            Console.WriteLine($"Rôle de l'utilisateur : {userRole}");

            // Chercher la livraison spécifique
            var livraison = await _context.Livraisons
                .Include(l => l.Chauffeur)
                .Include(l => l.Admin)
                .Include(l => l.Itineraire)
                .FirstOrDefaultAsync(l => l.Id == id);

            // Si la livraison n'existe pas
            if (livraison == null)
            {
                Console.WriteLine("Livraison non trouvée");
                return NotFound("Livraison non trouvée");
            }

            // Si l'utilisateur est un chauffeur, vérifier qu'il peut voir la livraison
            if (userRole == "Chauffeur" && livraison.ChauffeurId != userId)
            {
                Console.WriteLine("Accès interdit: le chauffeur ne peut voir que ses livraisons");
                return Forbid("Vous ne pouvez voir que vos propres livraisons.");
            }

            // Retourner la livraison trouvée
            return Ok(livraison);
        }

        // ✅ ADMIN et CHAUFFEUR : Voir les livraisons du chauffeur connecté
        [HttpGet("mes-livraisons")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Livraison>>> GetMesLivraisons()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var mesLivraisons = await _context.Livraisons
                .Include(l => l.Admin)
                .Include(l => l.Chauffeur)
                .Include(l => l.Itineraire)
                .Where(l => l.ChauffeurId == userId)
                .ToListAsync();

            if (!mesLivraisons.Any())
            {
                return NotFound("Aucune livraison trouvée pour ce chauffeur.");
            }

            return Ok(mesLivraisons);
        }


        // ✅ ADMIN : Réassigner un chauffeur
        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignChauffeur(int id, [FromBody] int chauffeurId)
        {
            var livraison = await _context.Livraisons.FindAsync(id);
            if (livraison == null)
                return NotFound("Livraison non trouvée.");

            livraison.ChauffeurId = chauffeurId;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Chauffeur réassigné." });
        }

        // ✅ CHAUFFEUR : Modifier uniquement le statut
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Chauffeur")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var livraison = await _context.Livraisons.FindAsync(id);
            if (livraison == null)
                return NotFound("Livraison non trouvée.");

            if (livraison.ChauffeurId != userId)
                return Forbid("Vous ne pouvez modifier que vos propres livraisons.");

            livraison.Statut = newStatus;
            await _context.SaveChangesAsync();

            return Ok("Statut mis à jour.");
        }

        // ✅ ADMIN : Supprimer une livraison
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteLivraison(int id)
        {
            var livraison = await _context.Livraisons.FindAsync(id);
            if (livraison == null)
                return NotFound("Livraison non trouvée.");

            _context.Livraisons.Remove(livraison);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Livraison supprimée avec succès" });
        }
    }
    public class LivraisonCreateDto
    {
        public string Client { get; set; }
        public string AdresseLivraison { get; set; }
        public string Produit { get; set; }
        public string Statut { get; set; }
        public int? ChauffeurId { get; set; }
       // public string NomChauffeur { get; set; }
       // public string NomAdmin { get; set; }
       // public int? Itineraire { get; set; }


    }

}

