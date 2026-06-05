import { useState } from 'react';
import { FileDown, FileSpreadsheet, FileJson, Upload } from 'lucide-react';
import { exporterRapportPDF, exporterTableauExcel, exporterSauvegardeJSON, importerDepuisJSON } from '../../utils/exportService';
import toast from 'react-hot-toast';

export default function ExportButtons({ titre = 'export', colonnes = [], lignes = [], data = [] }) {
  const [importing, setImporting] = useState(false);

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    importerDepuisJSON(file)
      .then(() => { toast.success('Données importées avec succès'); window.location.reload(); })
      .catch(err => toast.error(err.message))
      .finally(() => setImporting(false));
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => exporterRapportPDF(titre, colonnes, lignes)}
        className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
        <FileDown size={16} /> PDF
      </button>
      <button onClick={() => exporterTableauExcel(titre, data.length > 0 ? data : lignes.map(l => {
        const obj = {};
        colonnes.forEach((c, i) => obj[c] = l[i]);
        return obj;
      }))}
        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
        <FileSpreadsheet size={16} /> Excel
      </button>
      <button onClick={() => exporterSauvegardeJSON()}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">
        <FileJson size={16} /> Backup JSON
      </button>
      <label className={`flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${importing ? 'opacity-50' : ''}`}>
        <Upload size={16} /> Importer JSON
        <input type="file" accept=".json" onChange={handleImport} className="hidden" disabled={importing} />
      </label>
    </div>
  );
}
