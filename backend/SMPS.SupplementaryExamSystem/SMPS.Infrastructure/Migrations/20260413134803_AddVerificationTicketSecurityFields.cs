using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SMPS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVerificationTicketSecurityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ScannedAt",
                table: "VerificationTickets",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScannedAt",
                table: "VerificationTickets");
        }
    }
}
