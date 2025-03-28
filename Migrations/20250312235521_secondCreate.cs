using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace application_Livraison.Migrations
{
    /// <inheritdoc />
    public partial class secondCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "produit",
                table: "Livraisons",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "produit",
                table: "Livraisons");
        }
    }
}
