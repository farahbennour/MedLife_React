import { jsPDF } from "jspdf";
import logo from "../assets/logo.png";
import "../components/Patient/DossiersMedicaux/PatientDossier.css";

export const generateInvoicePDFReceptionist = (payment, clinicInfo) => {
  const sanitizeFilename = (name = "patient") =>
    name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  let y = 40;

  // Cadre extérieur
  pdf.setDrawColor(120, 150, 190);
  pdf.setLineWidth(2);
  pdf.roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 18, 18);

  pdf.setDrawColor(190, 205, 230);
  pdf.setLineWidth(1);
  pdf.roundedRect(30, 30, pageWidth - 60, pageHeight - 60, 12, 12);

  // Watermark discret
  pdf.setFontSize(60);
  pdf.setTextColor(220, 225, 235);
  pdf.setFont(undefined, "bold");
  pdf.text("FACTURE", pageWidth / 2, pageHeight / 2, { align: "center", angle: -35 });

  // Header avec logo + infos clinique
  const headerHeight = 100;
  pdf.setFillColor(238, 244, 255);
  pdf.roundedRect(margin, y, pageWidth - 2 * margin, headerHeight, 12, 12, "F");

  try {
    pdf.addImage(logo, "PNG", margin + 20, y + 15, 70, 60);
  } catch (e) {}

  pdf.setFontSize(11);
  pdf.setTextColor(60, 70, 90);
  const clinicName = clinicInfo?.name || "Clinique Exemple";
  const clinicAddress = clinicInfo?.address || "Adresse N/A";
  const clinicPhone = clinicInfo?.phone || "Tél N/A";

pdf.text(`Clinique : ${clinicName}`, pageWidth - margin - 10, y + 30, { align: "right" });
pdf.text(`Adresse : ${clinicAddress}`, pageWidth - margin - 10, y + 50, { align: "right" });
pdf.text(`Téléphone : ${clinicPhone}`, pageWidth - margin - 10, y + 70, { align: "right" });


  // Titre central
  pdf.setFontSize(22);
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(30, 50, 90);
  pdf.text("FACTURE PATIENT", pageWidth / 2, y + 125, { align: "center" });

  // Ligne séparatrice
  pdf.setDrawColor(160, 180, 210);
  pdf.setLineWidth(1);
  pdf.line(pageWidth / 2 - 120, y + 140, pageWidth / 2 + 120, y + 140);

 // ... (tout le début identique)
y += 160;

// Carte info facture
pdf.setFillColor(245, 248, 255);
pdf.roundedRect(margin, y, pageWidth - 2 * margin, 160, 12, 12, "F");
pdf.setFontSize(12);
pdf.setTextColor(50, 50, 60);

// Infos principales
const lineHeight = 20; // espace entre les lignes
let lineY = y + 25; // point de départ

pdf.text(`ID Facture: ${payment.id ?? '—'}`, margin + 15, lineY);
lineY += lineHeight;

pdf.text(
  `Date de consultation: ${
    payment.consultationDate
      ? new Date(payment.consultationDate).toLocaleDateString()
      : "N/A"
  }`,
  margin + 15,
  lineY
);
lineY += lineHeight;


pdf.text(`Montant: ${payment.totalAmount} TND`, margin + 15, lineY);
lineY += lineHeight;

pdf.text(`Service: ${payment.serviceName || "—"}`, margin + 15, lineY);
lineY += lineHeight;

pdf.text(`Statut: ${payment.status}`, margin + 15, lineY);
lineY += lineHeight;

pdf.text(
  `Date de création: ${new Date(payment.createdAt).toLocaleDateString()}`,
  margin + 15,
  lineY
);



// Tableau des items
if (payment.items?.length) {
  const tableData = payment.items.map(
    (item, i) => [`${i + 1}. ${item.description} — ${item.amount} TND`]
  );

  pdf.autoTable({
    startY: y,
    head: [["Liste des prestations / articles"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [238, 244, 255],
      textColor: [30, 50, 90],
      fontStyle: "bold",
    },
    bodyStyles: { textColor: [50, 50, 60], fontSize: 11 },
    margin: { left: margin, right: margin },
    styles: { cellPadding: 6 },
  });

  y = pdf.lastAutoTable.finalY + 20;
}

// Footer
pdf.setFontSize(10);
pdf.setTextColor(120, 120, 125);
pdf.text(
  "Document généré électroniquement — Conforme et authentique",
  pageWidth / 2,
  pageHeight - 36,
  { align: "center" }
);

// Enregistrement PDF
const filename = `facture_Receptionniste_${payment.id}_${
  payment.patientName }.pdf`;
pdf.save(filename);
};
