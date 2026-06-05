// Matrice de permissions granulaire pour chaque role
// true = acces complet | 'lecture' = consultation seule | false = aucun acces

export const PERMISSIONS = {
  admin: {
    dashboard: { consulter: true, exporter: true },
    equipements: { consulter: true, creer: true, modifier: true, supprimer: true },
    interventions: { consulter: true, creer: true, modifier: true, supprimer: true, cloturer: true, annuler: true, assigner: true },
    stocks: { consulter: true, creer: true, modifier: true, supprimer: true, mouvement: true },
    rapports: { consulter: true, exporter: true, tous: true },
    administration: { gererUtilisateurs: true, gererSysteme: true, voirLogs: true },
  },
  responsable_maintenance: {
    dashboard: { consulter: true, exporter: true },
    equipements: { consulter: true, creer: true, modifier: true, supprimer: false },
    interventions: { consulter: true, creer: true, modifier: true, supprimer: false, cloturer: true, annuler: true, assigner: true },
    stocks: { consulter: 'lecture', creer: false, modifier: false, supprimer: false, mouvement: false },
    rapports: { consulter: true, exporter: true, tous: true },
    administration: { gererUtilisateurs: false, gererSysteme: false, voirLogs: false },
  },
  technicien: {
    dashboard: { consulter: true, exporter: false },
    equipements: { consulter: 'lecture', creer: false, modifier: false, supprimer: false },
    interventions: { consulter: true, creer: 'partiel', modifier: false, supprimer: false, cloturer: 'partiel', annuler: false, assigner: false },
    stocks: { consulter: 'lecture', creer: false, modifier: false, supprimer: false, mouvement: false },
    rapports: { consulter: 'partiel', exporter: false, tous: false },
    administration: { gererUtilisateurs: false, gererSysteme: false, voirLogs: false },
  },
  responsable_stock: {
    dashboard: { consulter: true, exporter: 'partiel' },
    equipements: { consulter: 'lecture', creer: false, modifier: false, supprimer: false },
    interventions: { consulter: 'lecture', creer: false, modifier: false, supprimer: false, cloturer: false, annuler: false, assigner: false },
    stocks: { consulter: true, creer: true, modifier: true, supprimer: false, mouvement: true },
    rapports: { consulter: 'partiel', exporter: 'partiel', tous: false },
    administration: { gererUtilisateurs: false, gererSysteme: false, voirLogs: false },
  },
  direction: {
    dashboard: { consulter: true, exporter: true },
    equipements: { consulter: 'lecture', creer: false, modifier: false, supprimer: false },
    interventions: { consulter: 'lecture', creer: false, modifier: false, supprimer: false, cloturer: false, annuler: false, assigner: false },
    stocks: { consulter: 'lecture', creer: false, modifier: false, supprimer: false, mouvement: false },
    rapports: { consulter: true, exporter: true, tous: true },
    administration: { gererUtilisateurs: false, gererSysteme: false, voirLogs: false },
  },
};

export function peutFaire(role, module, action) {
  if (!role || !PERMISSIONS[role]) return false;
  const modulePerm = PERMISSIONS[role][module];
  if (!modulePerm) return false;
  const perm = modulePerm[action];
  return perm === true;
}

export function peutVoir(role, module, action = 'consulter') {
  if (!role || !PERMISSIONS[role]) return false;
  const modulePerm = PERMISSIONS[role][module];
  if (!modulePerm) return false;
  const perm = modulePerm[action];
  return perm === true || perm === 'lecture' || perm === 'partiel';
}

export function peutPartiel(role, module, action) {
  if (!role || !PERMISSIONS[role]) return false;
  const modulePerm = PERMISSIONS[role][module];
  if (!modulePerm) return false;
  return modulePerm[action] === 'partiel' || modulePerm[action] === true;
}

export function getModulesAccessibles(role) {
  if (!role || !PERMISSIONS[role]) return [];
  return Object.entries(PERMISSIONS[role])
    .filter(([, actions]) => Object.values(actions).some(v => v === true || v === 'lecture' || v === 'partiel'))
    .map(([module]) => module);
}

export const ROLE_LABELS = {
  admin: 'Administrateur',
  responsable_maintenance: 'Responsable Maintenance',
  technicien: 'Technicien',
  responsable_stock: 'Responsable Stock',
  direction: 'Direction',
};

export const ROLE_DESCRIPTIONS = {
  admin: 'Acces complet a toutes les fonctionnalites du systeme',
  responsable_maintenance: 'Gere les equipements et planifie les interventions',
  technicien: 'Realise les interventions et remonte les informations terrain',
  responsable_stock: 'Gere les stocks, les reapprovisionnements et les mouvements',
  direction: 'Consulte les indicateurs et rapports de performance',
};
