using application_Livraison.Models;

namespace application_Livraison.Services
{
    public interface INotificationService
    {
        public interface INotificationService
        {
            Task SendAssignmentNotificationAsync(int chauffeurId, string livraisonId);
            Task SendAssignmentNotificationAsync(User chauffeur, string livraisonId);
        }

    }
}
