using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SMPS.Application.Services.Interfaces;
using System;

namespace SMPS.Infrastructure.Services
{
    public class PdfDocumentService : IPdfDocumentService
    {
        public byte[] GenerateExamTicketPdf(string studentName, string registrationNumber, string unitCode, string unitTitle, byte[] qrCodeImage)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12).FontFamily(Fonts.Arial));

                    // 1. The Header
                    page.Header().BorderBottom(1).PaddingBottom(5).Row(row =>
                    {
                        row.RelativeItem().Column(column =>
                        {
                            column.Item().Text("OFFICIAL EXAM ENTRANCE TICKET").FontSize(20).SemiBold().FontColor(Colors.Blue.Darken2);
                            column.Item().Text("Supplementary Exam Management System").FontSize(14).FontColor(Colors.Grey.Medium);
                        });

                        row.ConstantItem(100).AlignRight().Text($"Date: {DateTime.Now:MMM dd, yyyy}").FontSize(10);
                    });

                    // 2. The Main Content (Body)
                    page.Content().PaddingVertical(1, Unit.Centimetre).Column(column =>
                    {
                        column.Spacing(20);

                        column.Item().Text("Please present this ticket to the invigilator at the exam hall. The QR code must be scanned for entry.").Italic();

                        // A two-column row: Text on left, QR on right
                        column.Item().Row(row =>
                        {
                            // Left Column: Student & Exam Details
                            row.RelativeItem().Column(details =>
                            {
                                details.Spacing(5);
                                details.Item().Text("Student Details").SemiBold().Underline();
                                details.Item().Text($"Name: {studentName}");
                                details.Item().Text($"Reg No: {registrationNumber}");

                                details.Item().PaddingTop(10).Text("Exam Details").SemiBold().Underline();
                                details.Item().Text($"Unit Code: {unitCode}");
                                details.Item().Text($"Unit Title: {unitTitle}");
                                details.Item().Text("Status: PAID").FontColor(Colors.Green.Medium).SemiBold();
                            });

                            // Right Column: The QR Code Image
                            row.ConstantItem(150).Column(qrCol =>
                            {
                                qrCol.Item().Image(qrCodeImage);
                                qrCol.Item().AlignCenter().Text("Scan for Entry").FontSize(9).FontColor(Colors.Grey.Medium);
                            });
                        });
                    });

                    // 3. The Footer
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                        x.Span(" of ");
                        x.TotalPages();
                    });
                });
            });

            // Generate and return the raw PDF bytes
            return document.GeneratePdf();
        }
    }
}