export function validerEquipement(data) {
  const erreurs = {};
  if (!data.designation?.trim()) erreurs.designation = 'La désignation est requise';
  if (!data.categorie) erreurs.categorie = 'La catégorie est requise';
  if (data.dateMiseEnService && isNaN(Date.parse(data.dateMiseEnService))) erreurs.dateMiseEnService = 'Date invalide';
  if (data.dateFinGarantie && isNaN(Date.parse(data.dateFinGarantie))) erreurs.dateFinGarantie = 'Date invalide';
  if (data.dateMiseEnService && data.dateFinGarantie && new Date(data.dateFinGarantie) < new Date(data.dateMiseEnService)) {
    erreurs.dateFinGarantie = 'La fin de garantie ne peut pas preceder la mise en service';
  }
  return erreurs;
}

export function validerOT(data) {
  const erreurs = {};
  if (!data.description?.trim()) erreurs.description = 'La description est requise';
  if (!data.type) erreurs.type = 'Le type d\'OT est requis';
  if (!data.equipementId) erreurs.equipementId = 'L\'équipement est requis';
  if (!data.priorite) erreurs.priorite = 'La priorité est requise';
  if (data.datePlanifiee && isNaN(Date.parse(data.datePlanifiee))) erreurs.datePlanifiee = 'Date planifiée invalide';
  if (data.dateLimite && isNaN(Date.parse(data.dateLimite))) erreurs.dateLimite = 'Date limite invalide';
  if (data.datePlanifiee && data.dateLimite && new Date(data.dateLimite) < new Date(data.datePlanifiee)) {
    erreurs.dateLimite = 'La date limite ne peut pas preceder la date planifiée';
  }
  return erreurs;
}

export function validerArticle(data) {
  const erreurs = {};
  if (!data.reference?.trim()) erreurs.reference = 'La référence est requise';
  if (!data.designation?.trim()) erreurs.designation = 'La désignation est requise';
  if (!data.categorie) erreurs.categorie = 'La catégorie est requise';
  if (data.stockActuel < 0) erreurs.stockActuel = 'Le stock ne peut pas être négatif';
  if (data.stockMinimum < 0) erreurs.stockMinimum = 'Le seuil minimum ne peut pas être négatif';
  return erreurs;
}

export function validerMouvement(data, article) {
  const erreurs = {};
  if (!data.type) erreurs.type = 'Le type de mouvement est requis';
  if (data.quantite <= 0) erreurs.quantite = 'La quantité doit être positive';
  if (data.type === 'sortie' && article && data.quantite > article.stockActuel) {
    erreurs.quantite = 'Stock insuffisant';
  }
  return erreurs;
}
