using System.ComponentModel.DataAnnotations;
using application_Livraison.Data;
using application_Livraison.Models;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace application_Livraison.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactureController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private object facture;

        public FactureController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET : api/Facture
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Facture>>> GetFactures()
        {
            return await _context.Factures
                .Include(f => f.Livraison)
                .ToListAsync();
        }

        // ✅ GET : api/Facture/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Facture>> GetFacture(int id)
        {
            var facture = await _context.Factures
                .Include(f => f.Livraison)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (facture == null)
                return NotFound();

            return Ok(facture);
        }

        // ✅ POST : Créer une nouvelle facture
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateFacture([FromBody] FactureDto dto)
        {
            var livraison = await _context.Livraisons.FindAsync(dto.LivraisonId);
            if (livraison == null)
                return NotFound("Livraison introuvable");

            var facture = new Facture
            {
                LivraisonId = dto.LivraisonId,
                PrixProduit = dto.PrixProduit,
                PrixLivraison = dto.PrixLivraison,
                DateEmission = dto.DateEmission
            };

            _context.Factures.Add(facture);
            await _context.SaveChangesAsync();

            return Ok(facture);
        }

        // ✅ DELETE : Supprimer une facture
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFacture(int id)
        {
            var facture = await _context.Factures.FindAsync(id);
            if (facture == null)
                return NotFound();

            _context.Factures.Remove(facture);
            await _context.SaveChangesAsync();

            return Ok("Facture supprimée.");
        }

        // ✅ PUT : Modifier une facture existante
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFacture(int id, [FromBody] Facture updatedFacture)
        {
            var facture = await _context.Factures.FindAsync(id);
            if (facture == null)
                return NotFound("Facture non trouvée.");

            facture.PrixProduit = updatedFacture.PrixProduit;
            facture.PrixLivraison = updatedFacture.PrixLivraison;
            facture.DateEmission = updatedFacture.DateEmission;
            facture.LivraisonId = updatedFacture.LivraisonId;

            await _context.SaveChangesAsync();
            return Ok(facture);
        }

        public IActionResult ExportPdf(int factureId, [FromServices] IConverter converter, object facture)
        {
            return ExportPdf(factureId, converter, facture);
        }

        [HttpGet("export-pdf/{factureId}")]
        public IActionResult ExportPdf(int factureId, [FromServices] IConverter converter)
        {
            var facture = _context.Factures
                .Include(f => f.Livraison)
                .FirstOrDefault(f => f.Id == factureId);

            if (facture == null)
                return NotFound("Facture introuvable.");

            // Calculs
            decimal sousTotal = facture.PrixProduit + facture.PrixLivraison;
            decimal tva = sousTotal * 0.19m;
            decimal totalTTC = sousTotal + tva;

            string html = $@"
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body {{
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      color: #333;
      margin: 40px;
    }}
    .header {{
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #0d6efd;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }}
    .company-info {{
      font-weight: bold;
    }}
    h1 {{
      color: #0d6efd;
      margin: 0;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }}
    table th, table td {{
      border: 1px solid #ccc;
      padding: 10px;
      text-align: left;
    }}
    table th {{
      background-color: #f8f8f8;
    }}
    .totals {{
      margin-top: 30px;
      width: 100%;
      text-align: right;
    }}
    .totals td {{
      padding: 6px;
    }}
    .footer {{
      margin-top: 60px;
      text-align: center;
      color: #777;
      font-size: 12px;
    }}
  </style>
</head>
<body>

  <div class='header'>
    <div class='company-info'>
      <h1>Votre Société</h1>
      <p> Tunis</p>
      <p>Email : contact@societe.com</p>
      <p>Tél : +216 00 000 000</p>
    </div>
    <div>
      <p><strong>Facture N° :</strong> {facture.Id}</p>
      <p><strong>Date :</strong> {facture.DateEmission:dd/MM/yyyy}</p>
    </div>
  </div>

  <div>
    <h3>Informations client</h3>
    <p><strong>Client :</strong> {facture.Client}</p>
    <p><strong>Adresse de livraison :</strong> {facture.AdresseLivraison}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantité</th>
        <th>Prix Unitaire (TND)</th>
        <th>Total (TND)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{facture.Produit}</td>
        <td>1</td>
        <td>{facture.PrixProduit:F2}</td>
        <td>{facture.PrixProduit:F2}</td>
      </tr>
      <tr>
        <td>Frais de Livraison</td>
        <td>-</td>
        <td>{facture.PrixLivraison:F2}</td>
        <td>{facture.PrixLivraison:F2}</td>
      </tr>
    </tbody>
  </table>

  <table class='totals'>
    <tr>
      <td><strong>Sous-total :</strong> {sousTotal:F2} TND</td>
    </tr>
    <tr>
      <td><strong>TVA (19%) :</strong> {tva:F2} TND</td>
    </tr>
    <tr>
      <td><strong>Total TTC :</strong> {totalTTC:F2} TND</td>
    </tr>
  </table>

  <div class='footer'>
    Cette facture est générée automatiquement. Aucune signature n’est requise.
  </div>

</body>
</html>";

            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
            PaperSize = PaperKind.A4,
            Orientation = Orientation.Portrait,
            DocumentTitle = $"Facture_{facture.Id}"
        },
                Objects = {
            new ObjectSettings()
            {
                HtmlContent = html,
                WebSettings = { DefaultEncoding = "utf-8" }
            }
        }
            };

            byte[] pdf = converter.Convert(doc);
            return File(pdf, "application/pdf", $"Facture_{facture.Id}.pdf");
        }



        /* [HttpGet("export-pdf/{factureId}")]
         public IActionResult ExportPdf(int factureId, [FromServices] IConverter converter)
         {
             var facture = _context.Factures
                 .Include(f => f.Livraison)
                 .FirstOrDefault(f => f.Id == factureId);

             if (facture == null)
                 return NotFound("Facture introuvable.");

            string html = $@"

         <h1>Facture #{facture.Id}</h1>
         <p><strong>Client:</strong> {facture.Client}</p>
         <p><strong>Adresse de livraison:</strong> {facture.AdresseLivraison}</p>
         <p><strong>Produit:</strong> {facture.Produit}</p>
         <p><strong>Prix Produit:</strong> {facture.PrixProduit} TND</p>
         <p><strong>Frais Livraison:</strong> {facture.PrixLivraison} TND</p>
         <p><strong>Total:</strong> {facture.PrixTotal} TND</p>
         <p><strong>Date d'émission:</strong> {facture.DateEmission.ToShortDateString()}</p>";

             var doc = new HtmlToPdfDocument()
             {
                 GlobalSettings = {
                 PaperSize = PaperKind.A4,
                 Orientation = Orientation.Portrait,
                 DocumentTitle = $"Facture_{facture.Id}"
             },
                 Objects = {
                 new ObjectSettings()
                 {
                     HtmlContent = html,
                     WebSettings = { DefaultEncoding = "utf-8" }
                 }
             }
             };

             byte[] pdf = converter.Convert(doc);
             return File(pdf, "application/pdf", $"Facture_{facture.Id}.pdf");
         }
         */
        public class FactureDto
        {

            [Required]
                 public int LivraisonId { get; set; }

                [Required]
                public decimal PrixProduit { get; set; }

                [Required]
                public decimal PrixLivraison { get; set; }
            [Required]

            public DateTime DateEmission { get; set; }


        }

    }
}