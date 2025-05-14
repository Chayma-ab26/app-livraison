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
        public object Users { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Notification>()
       .HasOne(n => n.Expediteur)
       .WithMany(u => u.NotificationsEnvoyees)
       .HasForeignKey(n => n.ExpediteurId)
       .OnDelete(DeleteBehavior.Restrict); // Évite les suppressions en cascade involontaires
/*
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
        */

        // Configuration des Livraisons
        modelBuilder.Entity<Livraison>(entity =>
            {
                entity.HasOne(l => l.Admin)
                      .WithMany(u => u.LivraisonsCreees)
                      .HasForeignKey(l => l.AdminId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(l => l.Chauffeur)
                      .WithMany(u => u.LivraisonsAttribuees)
                      .HasForeignKey(l => l.ChauffeurId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configuration Itineraire (1-1 avec Livraison)
            modelBuilder.Entity<Itineraire>()
                .HasOne(i => i.Livraison)
                .WithOne(l => l.Itineraire)
                .HasForeignKey<Itineraire>(i => i.LivraisonId);

            // Configuration Facture (1-1 avec Livraison)
            modelBuilder.Entity<Facture>()
                .HasOne(f => f.Livraison)
                .WithOne(l => l.Facture)
                .HasForeignKey<Facture>(f => f.LivraisonId);
        }
    }
}