import { useState } from 'react';
import storageService from '../utils/storageService';
import { useStocks } from '../hooks/useEquipements';
import { useAppData } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import { usePermissions } from '../components/layout/ProtectedRoute';
import DataTable from '../components/shared/DataTable';
import SearchBar from '../components/shared/SearchBar';
import Modal from '../components/shared/Modal';
import StatusBadge from '../components/shared/StatusBadge';
import AlertBanner from '../components/shared/AlertBanner';
import ExportButtons from '../components/shared/ExportButtons';
import { Plus, Edit, Trash2, ArrowUpDown, AlertTriangle, DollarSign, Package } from 'lucide-react';
import { InventoryIllustration } from '../components/shared/Illustrations';
import toast from 'react-hot-toast';

export default function StocksPage() {
  const { articles, articlesFiltres, mouvements, filtres, setFiltres, refresh } = useStocks();
  const { utilisateur } = useAuth();
  const { peutCreer, peutModifier, peutSupprimer, peutMouvement, role } = usePermissions('stocks');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showMouvement, setShowMouvement] = useState(false);
  const [articleMouv, setArticleMouv] = useState(null);
  const [mouvData, setMouvData] = useState({ type: 'entree', quantite: 1, motif: '' });
  const [formData, setFormData] = useState({
    reference: '', designation: '', description: '', unite: 'piece', categorie: 'consommable',
    equipementsCompatibles: [], stockActuel: 0, stockMinimum: 0, stockMaximum: 0,
    quantiteCommandeEconomique: 0, delaiLivraisonJours: 0, coutUnitaire: 0,
    methodeValorisation: 'CMUP', fournisseurs: [],
  });

  const articlesAlerte = articles.filter(a => a.stockActuel <= a.stockMinimum);

  function handleEdit(art) {
    if (!peutModifier) { toast.error('Action non autorisee'); return; }
    setFormData({ ...art });
    setEditing(art.id);
    setShowForm(true);
  }

  function handleNew() {
    if (!peutCreer) { toast.error('Action non autorisee'); return; }
    setFormData({
      reference: '', designation: '', description: '', unite: 'piece', categorie: 'consommable',
      equipementsCompatibles: [], stockActuel: 0, stockMinimum: 0, stockMaximum: 0,
      quantiteCommandeEconomique: 0, delaiLivraisonJours: 0, coutUnitaire: 0,
      methodeValorisation: 'CMUP', fournisseurs: [],
    });
    setEditing(null);
    setShowForm(true);
  }

  function handleSave() {
    if (!formData.designation || !formData.reference) { toast.error('Designation et reference requises'); return; }
    try {
      if (editing) {
        storageService.update('articles', editing, formData);
        logActivity('ARTICLE_UPDATE', `Article ${editing} modifie`, utilisateur?.id);
        toast.success('Article modifie');
      } else {
        const created = storageService.create('articles', formData);
        logActivity('ARTICLE_CREATE', `Article ${created.id} cree`, utilisateur?.id);
        toast.success('Article cree');
      }
      setShowForm(false);
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  function handleDelete(id) {
    if (!peutSupprimer) { toast.error('Action non autorisee'); return; }
    if (window.confirm('Supprimer cet article ?')) {
      try {
        storageService.remove('articles', id);
        logActivity('ARTICLE_DELETE', `Article ${id} supprime`, utilisateur?.id);
        toast.success('Article supprime');
        refresh();
      } catch (err) { toast.error(err.message); }
    }
  }

  function openMouvement(art) {
    if (!peutMouvement) { toast.error('Action non autorisee'); return; }
    setArticleMouv(art);
    setMouvData({ type: 'entree', quantite: 1, motif: '' });
    setShowMouvement(true);
  }

  function handleMouvement() {
    if (!articleMouv) return;
    if (mouvData.quantite <= 0) { toast.error('Quantite invalide'); return; }
    try {
      const avant = articleMouv.stockActuel;
      const apres = mouvData.type === 'entree' ? avant + mouvData.quantite : avant - mouvData.quantite;
      if (apres < 0) { toast.error('Stock insuffisant'); return; }
      const mvt = storageService.create('mouvements', {
        articleId: articleMouv.id, type: mouvData.type, quantite: mouvData.quantite,
        quantiteAvant: avant, quantiteApres: apres, motif: mouvData.motif || mouvData.type,
        date: new Date().toISOString(), utilisateurId: utilisateur?.id,
        coutUnitaireApplique: articleMouv.coutMoyenUnitairePondere || articleMouv.coutUnitaire,
      });
      storageService.update('articles', articleMouv.id, { stockActuel: apres });
      logActivity('MOUVEMENT_STOCK', `Mouvement ${mouvData.type} x${mouvData.quantite} - ${articleMouv.designation}`, utilisateur?.id);
      toast.success(`Mouvement enregistre: ${mvt.id}`);
      setShowMouvement(false);
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Gestion des stocks</h1>
          <p className="text-gray-500 mt-1 text-sm">{articles.length} article(s) - {mouvements.length} mouvement(s)</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <ExportButtons titre="Articles"
            colonnes={['Reference', 'Designation', 'Stock', 'Min', 'Max', 'Cout']}
            lignes={articles.map(a => [a.reference, a.designation, a.stockActuel, a.stockMinimum, a.stockMaximum, a.coutUnitaire])}
            data={articles} />
          {peutCreer && (
            <button onClick={handleNew} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors whitespace-nowrap">
              <Plus size={18} /> <span className="hidden sm:inline">Nouvel article</span><span className="sm:hidden">Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {articlesAlerte.length > 0 && (
        <AlertBanner variant="danger" title={`${articlesAlerte.length} article(s) sous seuil minimum - Reapprovisionnement necessaire`}>
          {articlesAlerte.map(a => (
            <p key={a.id}>{a.designation} - Stock: {a.stockActuel} / Min: {a.stockMinimum} - Valeur: {(a.stockActuel * (a.coutMoyenUnitairePondere || a.coutUnitaire)).toFixed(2)} FCFA</p>
          ))}
        </AlertBanner>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar value={filtres.recherche} onChange={v => setFiltres(f => ({ ...f, recherche: v }))} placeholder="Rechercher..." className="w-full sm:max-w-xs" />
        <select value={filtres.categorie} onChange={e => setFiltres(f => ({ ...f, categorie: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Toutes categories</option>
          <option value="consommable">Consommable</option>
          <option value="piece_rechange">Piece rechange</option>
          <option value="outillage">Outillage</option>
        </select>
      </div>

      {articlesFiltres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-xl">
          <InventoryIllustration className="w-48 h-48 object-cover rounded-xl opacity-30" />
          <h3 className="text-lg font-semibold text-gray-500 mt-4">Aucun article trouve</h3>
          <p className="text-sm text-gray-400 mt-1">Modifiez vos filtres ou creez un nouvel article</p>
        </div>
      ) : (
      <DataTable
        columns={[
          { Header: 'Reference', accessor: 'reference', cell: row => <span className="font-mono text-xs font-semibold text-purple-600">{row.reference}</span> },
          { Header: 'Designation', accessor: 'designation', cell: row => <span className="font-medium text-gray-900">{row.designation}</span> },
          { Header: 'Stock', accessor: 'stockActuel', cell: row => {
            const isLow = row.stockActuel <= row.stockMinimum;
            return <span className={`font-bold text-sm ${isLow ? 'text-red-600' : 'text-green-600'}`}>{row.stockActuel}</span>;
          }},
          { Header: 'Seuil min', accessor: 'stockMinimum' },
          { Header: 'Cout unitaire', accessor: 'coutUnitaire', cell: row => `${row.coutUnitaire} FCFA` },
          { Header: 'Categorie', accessor: 'categorie', cell: row => <StatusBadge status={row.categorie} /> },
        ]}
        data={articlesFiltres}
        actions={row => (
          <>
            {peutMouvement && (
              <button onClick={() => openMouvement(row)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Mouvement de stock"><ArrowUpDown size={16} /></button>
            )}
            {peutModifier && <button onClick={() => handleEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Modifier"><Edit size={16} /></button>}
            {peutSupprimer && <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Supprimer"><Trash2 size={16} /></button>}
          </>
        )}
      />)}
 
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? "Modifier l'article" : 'Nouvel article'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Reference</label>
            <input type="text" value={formData.reference} onChange={e => setFormData(f => ({ ...f, reference: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
            <input type="text" value={formData.designation} onChange={e => setFormData(f => ({ ...f, designation: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Categorie</label>
            <select value={formData.categorie} onChange={e => setFormData(f => ({ ...f, categorie: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="consommable">Consommable</option><option value="piece_rechange">Piece rechange</option><option value="outillage">Outillage</option>
            </select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Unite</label>
            <input type="text" value={formData.unite} onChange={e => setFormData(f => ({ ...f, unite: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Stock actuel</label>
            <input type="number" min="0" value={formData.stockActuel} onChange={e => setFormData(f => ({ ...f, stockActuel: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Stock minimum</label>
            <input type="number" min="0" value={formData.stockMinimum} onChange={e => setFormData(f => ({ ...f, stockMinimum: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Stock maximum</label>
            <input type="number" min="0" value={formData.stockMaximum} onChange={e => setFormData(f => ({ ...f, stockMaximum: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Cout unitaire (FCFA)</label>
            <input type="number" min="0" step="0.01" value={formData.coutUnitaire} onChange={e => setFormData(f => ({ ...f, coutUnitaire: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Annuler</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Modifier' : 'Creer'}</button>
        </div>
      </Modal>

      <Modal isOpen={showMouvement} onClose={() => setShowMouvement(false)} title={`Mouvement de stock - ${articleMouv?.designation || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Stock actuel: <strong>{articleMouv?.stockActuel}</strong> {articleMouv?.unite}</p>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select value={mouvData.type} onChange={e => setMouvData(f => ({ ...f, type: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="entree">Entree</option>
                <option value="sortie">Sortie</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantite</label>
              <input type="number" min="1" value={mouvData.quantite} onChange={e => setMouvData(f => ({ ...f, quantite: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Motif (optionnel)</label>
            <input type="text" value={mouvData.motif} onChange={e => setMouvData(f => ({ ...f, motif: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Reapprovisionnement, utilisation OT..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowMouvement(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Annuler</button>
            <button onClick={handleMouvement} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Valider le mouvement</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
