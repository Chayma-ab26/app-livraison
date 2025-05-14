using System.ComponentModel.DataAnnotations;

namespace application_Livraison.Models
{
    public class User
    {

        public int Id { get; set; }

        public string? Nom { get; set; }

        [Required(ErrorMessage = "L'email est obligatoire")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Le mot de passe est obligatoire")]

        public string MotDePasse { get; set; }

        // "Admin" ou "Chauffeur"
        public string? Role { get; set; }

        // Champs spécifiques aux Chauffeurs
        public string? Localisation { get; set; }

        // Relations
        public ICollection<Notification> NotificationsEnvoyees { get; set; } = new List<Notification>();
        public ICollection<Notification> NotificationsRecues { get; set; } = new List<Notification>();
        public ICollection<Livraison> LivraisonsCreees { get; set; } = new List<Livraison>();
        public ICollection<Livraison> LivraisonsAttribuees { get; set; } = new List<Livraison>();
    }
}