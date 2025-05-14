using application_Livraison.Data;
using application_Livraison.Models;
using System;
using System.Threading.Tasks;

namespace application_Livraison.Services
{

    public class NotificationService : INotificationService
    {/*
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Méthode pour envoyer une notification d'assignation à partir des ID
        public async Task SendAssignmentNotificationAsync(int chauffeurId, string livraisonId)
        {
            var notification = new Notification
            {
                Message = "Nouvelle livraison attribuée",
                ExpediteurId = User.id, // Doit exister dans Utilisateurs
                ChauffeurId = chauffeurId,
                SentAt = DateTime.Now,
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }


        // Méthode alternative pour envoyer une notification en passant un objet User
        public async Task SendAssignmentNotificationAsync(User chauffeur, string livraisonId)
        {
            if (chauffeur == null || chauffeur.Id == 0)
                throw new ArgumentException("Chauffeur non valide.");

            var notification = new Notification
            {
                ChauffeurId = chauffeur.Id,
                Message = $"Vous avez été assigné à la livraison #{livraisonId}.",
                SentAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }*/
    }
}