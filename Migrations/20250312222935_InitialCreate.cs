using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace application_Livraison.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotDePasse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Localisation = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Livraisons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Client = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdresseLivraison = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdminId = table.Column<int>(type: "int", nullable: false),
                    ChauffeurId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Livraisons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Livraisons_Utilisateurs_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Livraisons_Utilisateurs_ChauffeurId",
                        column: x => x.ChauffeurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Contenu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpediteurId = table.Column<int>(type: "int", nullable: false),
                    DestinataireId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Utilisateurs_DestinataireId",
                        column: x => x.DestinataireId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Notifications_Utilisateurs_ExpediteurId",
                        column: x => x.ExpediteurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Itineraires",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PointsDePassage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Distance = table.Column<double>(type: "float", nullable: false),
                    DureeEstimee = table.Column<TimeSpan>(type: "time", nullable: false),
                    LivraisonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Itineraires", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Itineraires_Livraisons_LivraisonId",
                        column: x => x.LivraisonId,
                        principalTable: "Livraisons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Itineraires_LivraisonId",
                table: "Itineraires",
                column: "LivraisonId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Livraisons_AdminId",
                table: "Livraisons",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_Livraisons_ChauffeurId",
                table: "Livraisons",
                column: "ChauffeurId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_DestinataireId",
                table: "Notifications",
                column: "DestinataireId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ExpediteurId",
                table: "Notifications",
                column: "ExpediteurId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Itineraires");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Livraisons");

            migrationBuilder.DropTable(
                name: "Utilisateurs");
        }
    }
}
