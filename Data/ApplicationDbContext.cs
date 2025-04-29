using application_Livraison.Models;
using Microsoft.EntityFrameworkCore;

namespace application_Livraison.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Utilisateurs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Livraison> Livraisons { get; set; }
        public DbSet<Itineraire> Itineraires { get; set; }
        public DbSet<Facture> Factures { get; set; }

        public object User { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relations Notification
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Expediteur)
                .WithMany(u => u.NotificationsEnvoyees)
                .HasForeignKey(n => n.ExpediteurId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Destinataire)
                .WithMany(u => u.NotificationsRecues)
                .HasForeignKey(n => n.DestinataireId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relations Livraison
            modelBuilder.Entity<Livraison>()
                .HasOne(l => l.Admin)
                .WithMany(u => u.LivraisonsCreees)
                .HasForeignKey(l => l.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Livraison>()
                .HasOne(l => l.Chauffeur)
                .WithMany(u => u.LivraisonsAttribuees)
                .HasForeignKey(l => l.ChauffeurId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relation 1-1 Livraison <-> Itineraire
            modelBuilder.Entity<Itineraire>()
                .HasOne(i => i.Livraison)
                .WithOne(l => l.Itineraire)
                .HasForeignKey<Itineraire>(i => i.LivraisonId);

            modelBuilder.Entity<Livraison>()
               .HasOne(l => l.Facture)
               .WithOne(f => f.Livraison)
               .HasForeignKey<Facture>(f => f.LivraisonId);
        }
    }
}
