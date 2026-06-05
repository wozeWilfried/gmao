import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import storageService from './storageService';

export function exporterRapportPDF(titre, colonnes, lignes) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('GMAO Simplifiée', 14, 15);
  doc.setFontSize(12);
  doc.text(titre, 14, 25);
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 32);
  autoTable(doc, {
    startY: 40,
    head: [colonnes],
    body: lignes,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { font: 'helvetica', fontSize: 9 },
  });
  doc.save(`${titre.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`);
}

export function exporterTableauExcel(titre, data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, titre.substring(0, 31));
  XLSX.writeFile(wb, `${titre.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.xlsx`);
}

export function exporterSauvegardeJSON() {
  const backup = storageService.exportAll();
  const blob = new Blob([backup], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gmao_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importerDepuisJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        storageService.importAll(e.target.result);
        resolve(true);
      } catch (err) {
        reject(new Error('Format de fichier invalide'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsText(file);
  });
}
