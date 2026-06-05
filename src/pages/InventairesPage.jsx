import { useState, useMemo } from 'react';
import storageService from '../utils/storageService';
import { useAppData } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/activityLogger';
import Modal from '../components/shared/Modal';
import StatusBadge from '../components/shared/StatusBadge';
import { ClipboardList, Plus, Eye, CheckCircle, XCircle, AlertTriangle, Calendar, User, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InventairesPage() {
  const { inventaires, articles, refresh } = useAppData();
  const { utilisateur } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [newInventaire, setNewInventaire] = useState({ notes: '' });

  const canCreate = utilisateur?.role === 'admin' || utilisateur?.role === 'responsable_stock';

  function handleCreate() {
    if (!canCreate) { toast.error('Action non autorisee'); return; }
    if (articles.length === 0) { toast.error('Aucun article en stock'); return; }
    try {
      const lignes = articles.map(a => ({
        articleId: a.id,
        stockTheorique: a.stockActuel,
        stockReel: a.stockActuel,
        ecart: 0,
        commentaire: '',
      }));
      storageService.create('inventaires', {
        date: new Date().toISOString(),
        utilisateurId: utilisateur?.id,
        statut: 'en_cours',
        notes: newInventaire.notes || `Inventaire du ${new Date().toLocaleDateString('fr-FR')}`,
        lignes,
      });
      logActivity('INVENTAIRE_CREATE', 'Nouvel inventaire cree', utilisateur?.id);
      toast.success('Inventaire cree');
      setShowNew(false);
      setNewInventaire({ notes: '' });
      refresh();
    } catch (err) { toast.error(err.message); }
  }

  function handleUpdateLigne(invId, articleId, field, value) {
    const inv = inventaires.find(i => i.id === invId);
    if (!inv || inv.statut !== 'en_cours') return;
    const updatedLignes = inv.lignes.map(l =>
      l.articleId === articleId ? { ...l, [field]: field === 'stockReel' ? Math.max(0, parseInt(value) || 0) : value, ecart: field === 'stockReel' ? (Math.max(0, parseInt(value) || 0) - l.stockTheorique) : l.ecart } : l
    );
    storageService.update('inventaires', invId, { lignes: updatedLignes });
    refresh();
  }

  function handleValidate(invId) {
    const inv = inventaires.find(i => i.id === invId);
    if (!inv) return;
    const hasNegative = inv.lignes.some(l => (l.stockReel - l.stockTheorique) < 0);
    if (!window.confirm(`Valider cet inventaire ?${hasNegative ? ' Attention: des ecarts negatifs ont ete detectes.' : ''}`)) return;
    inv.lignes.forEach(l => {
      if (l.stockReel !== l.stockTheorique) {
        const article = articles.find(a => a.id === l.articleId);
        if (article) {
          const ecart = l.stockReel - l.stockTheorique;
          storageService.update('articles', l.articleId, { stockActuel: l.stockReel });
          storageService.create('mouvements', {
            articleId: l.articleId, type: ecart > 0 ? 'entree' : 'sortie',
            quantite: Math.abs(ecart), quantiteAvant: l.stockTheorique, quantiteApres: l.stockReel,
            coutUnitaireApplique: article.coutMoyenUnitairePondere || article.coutUnitaire,
            motif: `Ajustement inventaire ${inv.id}`, utilisateurId: utilisateur?.id, date: new Date().toISOString(),
          });
        }
      }
    });
    storageService.update('inventaires', invId, { statut: 'valide', date: new Date().toISOString() });
    logActivity('INVENTAIRE_VALIDATE', `Inventaire ${invId} valide`, utilisateur?.id);
    toast.success('Inventaire valide et stocks ajustes');
    refresh();
  }

  function handleCancel(invId) {
    if (!window.confirm('Annuler cet inventaire ?')) return;
    storageService.update('inventaires', invId, { statut: 'annule' });
    toast.success('Inventaire annule');
    refresh();
  }

  const stats = useMemo(() => {
    const total = inventaires.length;
    const valides = inventaires.filter(i => i.statut === 'valide').length;
    const enCours = inventaires.filter(i => i.statut === 'en_cours').length;
    const totalEcarts = inventaires.filter(i => i.statut === 'valide').reduce((sum, inv) =>
      sum + inv.lignes.reduce((s, l) => s + Math.abs(l.ecart), 0), 0);
    return { total, valides, enCours, totalEcarts };
  }, [inventaires]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClipboardList size={28} className="text-purple-600 flex-shrink-0" />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Inventaires</h1>
            <p className="text-gray-500 mt-1 text-sm">{stats.total} inventaire(s)</p>
          </div>
        </div>
        {canCreate && (
          <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors whitespace-nowrap">
            <Plus size={18} /> Nouvel inventaire
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4"><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-sm text-gray-500">Total inventaires</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-2xl font-bold text-green-600">{stats.valides}</p><p className="text-sm text-gray-500">Valides</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-2xl font-bold text-amber-600">{stats.enCours}</p><p className="text-sm text-gray-500">En cours</p></div>
      </div>

      <div className="space-y-3">
        {inventaires.length === 0 ? (
          <div className="text-center py-16 bg-white border rounded-xl">
            <ClipboardList size={48} className="mx-auto text-gray-200" />
            <p className="text-gray-500 mt-3 font-medium">Aucun inventaire</p>
            <p className="text-gray-400 text-sm mt-1">Creez votre premier inventaire pour commencer</p>
          </div>
        ) : [...inventaires].sort((a, b) => new Date(b.date) - new Date(a.date)).map(inv => (
          <div key={inv.id} className="bg-white border rounded-xl overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50" onClick={() => setDetailId(detailId === inv.id ? null : inv.id)}>
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={20} className="text-purple-500" />
                <div>
                  <p className="font-semibold text-gray-900">{inv.notes}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <Calendar size={12} /> {new Date(inv.date).toLocaleDateString('fr-FR')}
                    <User size={12} /> {inv.utilisateurId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={inv.statut === 'valide' ? 'cloture' : inv.statut === 'en_cours' ? 'en_cours' : 'annule'} />
                {inv.statut === 'en_cours' && (
                  <div className="flex gap-1 ml-2">
                    <button onClick={(e) => { e.stopPropagation(); handleValidate(inv.id); }} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Valider"><CheckCircle size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleCancel(inv.id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Annuler"><XCircle size={16} /></button>
                  </div>
                )}
              </div>
            </div>
            {detailId === inv.id && (
              <div className="border-t border-gray-100 p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead><tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Article</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Theorique</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Reel</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Ecart</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Commentaire</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {inv.lignes.map(l => {
                        const art = articles.find(a => a.id === l.articleId);
                        return (
                          <tr key={l.articleId} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium text-gray-900">{art?.designation || l.articleId}</td>
                            <td className="px-3 py-2 text-right text-gray-600">{l.stockTheorique}</td>
                            <td className="px-3 py-2 text-right">
                              {inv.statut === 'en_cours' ? (
                                <input type="number" min="0" value={l.stockReel}
                                  onChange={e => handleUpdateLigne(inv.id, l.articleId, 'stockReel', e.target.value)}
                                  className="w-20 text-right border border-gray-300 rounded px-2 py-1 text-sm" />
                              ) : (
                                <span className={l.ecart !== 0 ? 'font-bold text-amber-600' : ''}>{l.stockReel}</span>
                              )}
                            </td>
                            <td className={`px-3 py-2 text-right font-bold ${l.ecart < 0 ? 'text-red-600' : l.ecart > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                              {l.ecart > 0 ? '+' : ''}{l.ecart}
                            </td>
                            <td className="px-3 py-2">
                              {inv.statut === 'en_cours' ? (
                                <input type="text" value={l.commentaire}
                                  onChange={e => handleUpdateLigne(inv.id, l.articleId, 'commentaire', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="Commentaire..." />
                              ) : (
                                <span className="text-gray-500">{l.commentaire || '-'}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {inv.lignes.some(l => l.ecart !== 0) && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-2">
                    <AlertTriangle size={14} /> {inv.lignes.filter(l => l.ecart !== 0).length} ligne(s) avec ecart
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Nouvel inventaire">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Un inventaire va etre cree pour l'ensemble des {articles.length} article(s) en stock. Les stocks theoriques seront pre-remplis.</p>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea value={newInventaire.notes} onChange={e => setNewInventaire(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Inventaire mensuel..." /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Annuler</button>
            <button onClick={handleCreate} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">Creer l'inventaire</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
