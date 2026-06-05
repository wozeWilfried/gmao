export default function EquipementForm({ formData, setFormData, equipements, onSave, onCancel, isEditing }) {
  const update = (field, value) => setFormData(f => ({ ...f, [field]: value }));
  const updateLoc = (field, value) => setFormData(f => ({ ...f, localisation: { ...f.localisation, [field]: value } }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Désignation *</label>
          <input type="text" value={formData.designation} onChange={e => update('designation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={formData.description} onChange={e => update('description', e.target.value)} rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
          <select value={formData.categorie} onChange={e => update('categorie', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="">Sélectionner...</option>
            <option value="compresseur">Compresseur</option>
            <option value="pompe">Pompe</option>
            <option value="moteur_electrique">Moteur électrique</option>
            <option value="convoyeur">Convoyeur</option>
            <option value="centrifugeuse">Centrifugeuse</option>
            <option value="laser">Laser</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select value={formData.statut} onChange={e => update('statut', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="en_service">En service</option>
            <option value="en_panne">En panne</option>
            <option value="en_maintenance">En maintenance</option>
            <option value="hors_service">Hors service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Constructeur</label>
          <input type="text" value={formData.constructeur} onChange={e => update('constructeur', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
          <input type="text" value={formData.modele} onChange={e => update('modele', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">N° de série</label>
          <input type="text" value={formData.numeroSerie} onChange={e => update('numeroSerie', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date mise en service</label>
          <input type="date" value={formData.dateMiseEnService} onChange={e => update('dateMiseEnService', e.target.value)}
            max={formData.dateFinGarantie || undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durée de vie estimée (ans)</label>
          <input type="number" value={formData.dureeVieEstimee} onChange={e => update('dureeVieEstimee', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date fin garantie</label>
          <input type="date" value={formData.dateFinGarantie} onChange={e => update('dateFinGarantie', e.target.value)}
            min={formData.dateMiseEnService || undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Périodicité maintenance</label>
          <select value={formData.periodicite} onChange={e => update('periodicite', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="">Aucune</option>
            <option value="hebdomadaire">Hebdomadaire</option>
            <option value="mensuelle">Mensuelle</option>
            <option value="trimestrielle">Trimestrielle</option>
            <option value="semestrielle">Semestrielle</option>
            <option value="annuelle">Annuelle</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Équipement parent</label>
          <select value={formData.parentId} onChange={e => update('parentId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="">Aucun (racine)</option>
            {equipements.map(eq => <option key={eq.id} value={eq.id}>{eq.designation}</option>)}
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Localisation</h4>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Site</label><input type="text" value={formData.localisation?.site} onChange={e => updateLoc('site', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Bâtiment</label><input type="text" value={formData.localisation?.batiment} onChange={e => updateLoc('batiment', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Salle</label><input type="text" value={formData.localisation?.salle} onChange={e => updateLoc('salle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Ligne</label><input type="text" value={formData.localisation?.ligne} onChange={e => updateLoc('ligne', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" /></div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
        <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {isEditing ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </div>
  );
}
