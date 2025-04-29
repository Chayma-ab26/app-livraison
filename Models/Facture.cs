using Microsoft.EntityFrameworkCore;

namespace application_Livraison.Models
{
    public class Facture
    {
        public int Id { get; set; }

        // 🔗 Relation vers Livraison
        public int LivraisonId { get; set; }
        public Livraison Livraison { get; set; }

        // 💰 Champs spécifiques à la facture
        [Precision(18, 2)]
        public decimal PrixProduit { get; set; }
        [Precision(18, 2)]
        public decimal PrixLivraison { get; set; }

        // ✅ Calcul automatique du total
        public decimal PrixTotal => PrixProduit + PrixLivraison;

        public DateTime DateEmission { get; set; }

        // 📦 Infos issues de la livraison liée (lecture seule)
        public string Client => Livraison?.Client;
        public string AdresseLivraison => Livraison?.AdresseLivraison;
        public string Produit => Livraison?.produit;
    }
}

