using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using application_Livraison.Models;

public class Notification
{
    public int Id { get; set; }

    [Required]
    public string Message { get; set; }

    public DateTime SentAt { get; set; } = DateTime.Now;

    public bool IsRead { get; set; } = false;

    // Clés étrangères
    public int ExpediteurId { get; set; }

    [ForeignKey("ExpediteurId")]
    public User Expediteur { get; set; }

    public int DestinataireId { get; set; }

    [ForeignKey("DestinataireId")]
    public User Destinataire { get; set; }
}
