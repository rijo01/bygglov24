import type { Orientering } from "./templates";

/**
 * Klientgenererad PDF. Ingenting lagras server-side — jsPDF laddas dynamiskt
 * först när användaren klickar på Ladda ner.
 */
export async function laddaNerPdf(o: Orientering, filnamn = "bygglovskoll.pdf"): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const M = 18;
  const BREDD = 210 - M * 2;
  let y = M;

  const nySida = () => {
    doc.addPage();
    y = M;
    sidhuvud();
  };

  const plats = (h: number) => {
    if (y + h > 297 - M - 12) nySida();
  };

  function sidhuvud() {
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(120);
    doc.text(o.sidhuvud, M, 10);
    doc.setDrawColor(220).line(M, 12, 210 - M, 12);
    doc.setTextColor(0);
    y = Math.max(y, M);
  }

  function skrivBrodtext(text: string, storlek = 10) {
    doc.setFont("helvetica", "normal").setFontSize(storlek).setTextColor(30);
    const rader = doc.splitTextToSize(text, BREDD) as string[];
    for (const rad of rader) {
      plats(5);
      doc.text(rad, M, y);
      y += 4.8;
    }
  }

  function skrivPunkt(text: string) {
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(30);
    const rader = doc.splitTextToSize(text, BREDD - 5) as string[];
    rader.forEach((rad, idx) => {
      plats(5);
      if (idx === 0) doc.text("•", M, y);
      doc.text(rad, M + 5, y);
      y += 4.8;
    });
  }

  sidhuvud();

  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(15);
  doc.text("Bygglovskoll", M, y + 6);
  y += 12;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(90);
  doc.text("Vägledning och underlag — inte ett besked från kommunen.", M, y);
  y += 10;

  for (const avsnitt of o.avsnitt) {
    plats(14);
    y += 3;
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(15);
    doc.text(`${avsnitt.nummer}. ${avsnitt.rubrik}`, M, y);
    y += 6;
    for (const stycke of avsnitt.stycken.filter(Boolean)) {
      skrivBrodtext(stycke);
      y += 2;
    }
    for (const punkt of avsnitt.punkter ?? []) {
      skrivPunkt(punkt);
      y += 1.5;
    }
  }

  // Sidfot med datum och verifieringsstämpel på varje sida.
  const antal = doc.getNumberOfPages();
  for (let s = 1; s <= antal; s++) {
    doc.setPage(s);
    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(130);
    const rader = doc.splitTextToSize(o.sidfot, BREDD) as string[];
    let fy = 297 - M + 2;
    for (const rad of rader.slice(0, 3)) {
      doc.text(rad, M, fy);
      fy += 3;
    }
    doc.text(`${s} / ${antal}`, 210 - M, 297 - M + 2, { align: "right" });
  }

  doc.save(filnamn);
}
