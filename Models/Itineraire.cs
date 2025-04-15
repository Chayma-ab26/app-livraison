namespace application_Livraison.Models
{
    public class Itineraire
    {
        public int Id { get; set; }
        public List<string> PointsDePassage { get; set; }
        // ou liste de points GPS en JSON
        public double Distance { get; set; }
        public TimeSpan DureeEstimee { get; set; }

        // Relation 1-1 avec Livraison
        public int LivraisonId { get; set; }
        public Livraison Livraison { get; set; }
    }
}
