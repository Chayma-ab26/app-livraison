namespace application_Livraison.Models
{
    public class Livraison
    {
        public int Id { get; set; }

        public string Client { get; set; }
        public string AdresseLivraison { get; set; }
        public string produit { get; set; }
        public string Statut { get; set; } // Exemple : "En cours", "Terminée"

        // Créée par Admin
        public int? AdminId { get; set; }

        public User Admin { get; set; }

        // Assignée au Chauffeur
        public int? ChauffeurId { get; set; }
        public User Chauffeur { get; set; }

        // Itinéraire lié
        public Itineraire Itineraire { get; set; }
    }
}
