import { jsPDF } from "jspdf";
import logo from "../assets/logo.png";

export default function OrdonnancePDF({ ordonnance, clinicInfo }) {
  const sanitizeFilename = (name = "patient") =>
    name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");

  const drawHeader = (pdf, pageWidth, margin) => {
  const headerHeight = 100; // Hauteur réduite du cadre
  pdf.setFillColor(238, 244, 255);
  pdf.rect(margin, 40, pageWidth - margin * 2, headerHeight, "F");

  // Logo
  try {
    pdf.addImage(logo, "PNG", margin + 20, 50, 50, 50);
  } catch (e) {}

  pdf.setFontSize(10);
  pdf.setTextColor(80, 90, 115);

  // Infos cabinet avec emojis
  const clinicName = clinicInfo?.name || "Clinique Exemple";
  const clinicAddress = clinicInfo?.address || "Adresse non disponible";
  const clinicPhone = clinicInfo?.phone || "Tél: N/A";
  const clinicRpps = clinicInfo?.rpps || "—";

  pdf.text(` Clinique : ${clinicName}`, pageWidth - margin - 10, 55, { align: "right" });
  pdf.text(` Adresse : ${clinicAddress}`, pageWidth - margin - 10, 70, { align: "right" });
  pdf.text(` Téléphone : ${clinicPhone}`, pageWidth - margin - 10, 85, { align: "right" });

  // TITRE CENTRAL
  pdf.setFontSize(24);
  pdf.setTextColor(30, 50, 90);
  pdf.setFont(undefined, "bold");
  pdf.text("ORDONNANCE MÉDICALE", pageWidth / 2, 120, { align: "center" });

  pdf.setDrawColor(160, 180, 210);
  pdf.setLineWidth(1);
  pdf.line(pageWidth / 2 - 120, 160, pageWidth / 2 + 120, 160);
};


  const generatePDF = () => {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    let y = 160;

    // Cadres extérieurs et intérieurs
    pdf.setDrawColor(120, 150, 190);
    pdf.setLineWidth(2.2);
    pdf.roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 18, 18);
    pdf.setDrawColor(190, 205, 230);
    pdf.setLineWidth(1);
    pdf.roundedRect(30, 30, pageWidth - 60, pageHeight - 60, 12, 12);

    // Watermark discret
    pdf.setFontSize(60);
    pdf.setTextColor(220, 225, 235);
    pdf.setFont(undefined, "bold");
    pdf.text("ORDONNANCE", pageWidth / 2, pageHeight / 2, { align: "center", angle: -35 });

    // Header
    drawHeader(pdf, pageWidth, margin);

    // Carte d’informations (patient / médecin / date)
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(180, 195, 220);
    pdf.setLineWidth(1.2);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 120, 12, 12, "FD");

    const infoX = margin + 18;
    const infoY = y + 30;

    pdf.setFontSize(11);
    pdf.setTextColor(110, 120, 140);
    pdf.setFont(undefined, "normal");
    pdf.text("Patient", infoX, infoY);
    pdf.text("Médecin", infoX + 140, infoY);
    pdf.text("Date", infoX + 360, infoY);

    pdf.setFont(undefined, "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(28, 46, 80);
    pdf.text(ordonnance.patientName || "—", infoX, infoY + 22);
    pdf.text(ordonnance.doctorName || "—", infoX + 140, infoY + 22);

    // Réajustement de la date pour qu'elle ne dépasse pas
    const dateStr = ordonnance.date
      ? new Date(ordonnance.date).toLocaleDateString("fr-FR")
      : new Date().toLocaleDateString("fr-FR");
    pdf.text(dateStr, infoX + 360, infoY + 22, { maxWidth: 80 });

 y += 180; 

    // Section Traitement
    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor(28, 46, 80);
    pdf.text("Traitement prescrit", margin + 6, y);
    pdf.setDrawColor(170, 190, 215);
    pdf.setLineWidth(1);
    pdf.line(margin + 6, y + 8, margin + 220, y + 8);
    y += 28;

    // Gestion espace pour sauts de page
    const ensureSpace = (needed) => {
      if (y + needed > pageHeight - margin - 140) {
        pdf.addPage();
        drawHeader(pdf, pageWidth, margin);
        y = 160;
      }
    };

    // Liste médicaments
    if (ordonnance.items?.length) {
      ordonnance.items.forEach((item, idx) => {
        ensureSpace(72);
        pdf.setFillColor(idx % 2 === 0 ? 250 : 245, 248, 255);
        pdf.setDrawColor(185, 200, 225);
        pdf.roundedRect(margin + 6, y - 6, pageWidth - (margin + 6) * 2, 64, 10, 10, "F");

        // Pastille Rx
        pdf.setDrawColor(70, 90, 150);
        pdf.setFillColor(70, 90, 150);
        pdf.circle(margin + 28, y + 22, 10, "F");
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont(undefined, "bold");
        pdf.text("Rx", margin + 24, y + 25);

        // Nom médicament
        pdf.setFontSize(14);
        pdf.setTextColor(28, 46, 80);
        pdf.setFont(undefined, "bold");
        pdf.text(item.name || "—", margin + 50, y + 10);

        // Détails
        pdf.setFontSize(11);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(95, 100, 120);
        const details = [];
        if (item.dose) details.push(item.dose);
        if (item.frequency) details.push(item.frequency);
        if (item.duration) details.push(`Durée: ${item.duration}`);
        if (item.notes) details.push(item.notes);
        pdf.text(details.join(" • "), margin + 50, y + 28, { maxWidth: pageWidth - (margin + 6) * 2 - 90 });

        y += 78;
      });
    } else {
      pdf.setFontSize(12);
      pdf.setTextColor(140, 140, 150);
      pdf.text("Aucun médicament prescrit", margin + 10, y);
      y += 30;
    }

    y += 40; 
    // Recommandations
    if (ordonnance.instructions) {
      ensureSpace(110);
      pdf.setFont(undefined, "bold");
      pdf.setTextColor(28, 46, 80);
      pdf.setFontSize(16);
      pdf.text("Recommandations", margin + 6, y);
      pdf.setDrawColor(170, 190, 215);
      pdf.line(margin + 6, y + 8, margin + 200, y + 8);
      y += 28;

      pdf.setFontSize(11);
      pdf.setFont(undefined, "normal");
      pdf.setTextColor(80, 80, 90);
      const lines = pdf.splitTextToSize(ordonnance.instructions, pageWidth - margin * 2 - 20);
      lines.forEach((l) => {
        ensureSpace(18);
        pdf.text(l, margin + 12, y);
        y += 18;
      });
      y += 6;
    }

    // Signature
    ensureSpace(120);
    const sigY = pageHeight - 120;
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.8);
    pdf.line(pageWidth - margin - 180, sigY, pageWidth - margin, sigY);
    pdf.setFontSize(11);
    pdf.setTextColor(110, 110, 110);
    pdf.text("Signature du médecin", pageWidth - margin - 90, sigY + 18, { align: "center" });

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(140, 140, 145);
    pdf.text(
      "Document généré électroniquement — Conforme et authentique sans signature manuscrite",
      pageWidth / 2,
      pageHeight - 36,
      { align: "center" }
    );

    // Enregistrement
    const filename = `ordonnance_${sanitizeFilename(ordonnance.patientName)}.pdf`;
    pdf.save(filename);
  };

  return (
    <button className="patient-download-btn" onClick={generatePDF}>
      📥 Télécharger Ordonnance
    </button>
  );
}
