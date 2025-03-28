namespace application_Livraison.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Contenu { get; set; }

        public int ExpediteurId { get; set; }
        public User Expediteur { get; set; }

        public int DestinataireId { get; set; }
        public User Destinataire { get; set; }
    }
}
