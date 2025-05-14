using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace application_Livraison.Migrations
{
    /// <inheritdoc />
    public partial class newuse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Utilisateurs_ChauffeurId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "ChauffeurId",
                table: "Notifications",
                newName: "DestinataireId");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_ChauffeurId",
                table: "Notifications",
                newName: "IX_Notifications_DestinataireId");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "Notifications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Utilisateurs_DestinataireId",
                table: "Notifications",
                column: "DestinataireId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Utilisateurs_DestinataireId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "DestinataireId",
                table: "Notifications",
                newName: "ChauffeurId");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_DestinataireId",
                table: "Notifications",
                newName: "IX_Notifications_ChauffeurId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Utilisateurs_ChauffeurId",
                table: "Notifications",
                column: "ChauffeurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
