export default function OTForm({ formData, setFormData, equipements, articles, utilisateurs, onSave, onCancel, isEditing }) {
  const update = (field, value) => setFormData(f => ({ ...f, [field]: value }));

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea value={formData.description} onChange={e => update('description', e.target.value)} rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none" placeholder="Description de l'intervention..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select value={formData.type} onChange={e => update('type', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="preventif_systematique">Preventif systematique</option>
            <option value="correctif">Correctif</option>
            <option value="amelioratif">Amelioratif</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Priorite</label>
          <select value={formData.priorite} onChange={e => update('priorite', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="basse">Basse</option><option value="normale">Normale</option>
            <option value="haute">Haute</option><option value="urgente">Urgente</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Equipement</label>
          <select value={formData.equipementId} onChange={e => update('equipementId', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Selectionner...</option>
            {equipements.map(eq => <option key={eq.id} value={eq.id}>{eq.designation}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Technicien(s)</label>
          <select value={formData.technicienIds?.[0] || ''} onChange={e => update('technicienIds', e.target.value ? [e.target.value] : [])} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Non assigne</option>
            {utilisateurs.filter(u => u.role === 'technicien').map(t => (
              <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date planifiee</label>
          <input type="date" value={formData.datePlanifiee} onChange={e => update('datePlanifiee', e.target.value)}
            max={formData.dateLimite || undefined} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date limite</label>
          <input type="date" value={formData.dateLimite} onChange={e => update('dateLimite', e.target.value)}
            min={formData.datePlanifiee || undefined} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Duree estimee (min)</label>
          <input type="number" min="5" step="5" value={formData.dureeEstimee} onChange={e => update('dureeEstimee', +e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Cout estime (FCFA)</label>
          <input type="number" min="0" step="10" value={formData.coutEstime} onChange={e => update('coutEstime', +e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Instructions de securite</label>
          <textarea value={formData.instructionsSecurite} onChange={e => update('instructionsSecurite', e.target.value)} rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none" placeholder="Consignes de securite..." />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Annuler</button>
        <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{isEditing ? 'Modifier' : 'Creer'}</button>
      </div>
    </div>
  );
}
