export const seedUtilisateurs = [
  { id: 'USR-001', nom: 'Dupont', prenom: 'Marie', login: 'm.dupont', motDePasseHash: btoa('admin123'), role: 'admin', email: 'm.dupont@entreprise.fr', actif: true, createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z' },
  { id: 'USR-002', nom: 'Martin', prenom: 'Thomas', login: 't.martin', motDePasseHash: btoa('tech123'), role: 'technicien', email: 't.martin@entreprise.fr', actif: true, createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z' },
  { id: 'USR-003', nom: 'Petit', prenom: 'Sophie', login: 's.petit', motDePasseHash: btoa('resp123'), role: 'responsable_maintenance', email: 's.petit@entreprise.fr', actif: true, createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z' },
  { id: 'USR-004', nom: 'Bernard', prenom: 'Luc', login: 'l.bernard', motDePasseHash: btoa('stock123'), role: 'responsable_stock', email: 'l.bernard@entreprise.fr', actif: true, createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z' },
  { id: 'USR-005', nom: 'Moreau', prenom: 'Claire', login: 'c.moreau', motDePasseHash: btoa('dir123'), role: 'direction', email: 'c.moreau@entreprise.fr', actif: true, createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z' },
];

export const seedEquipements = [
  {
    id: 'EQ-001', designation: 'Compresseur d\'air Atlas Copco GA15',
    description: 'Compresseur a vis pour atelier de production - debit 2.8 m3/min, pression 7.5 bar',
    categorie: 'compresseur',
    localisation: { site: 'Usine principale', batiment: 'Atelier A', salle: 'Local technique', ligne: 'Ligne 1' },
    dateMiseEnService: '2020-03-15', dureeVieEstimee: 15, constructeur: 'Atlas Copco', modele: 'GA15',
    numeroSerie: 'ATL-2020-4521', statut: 'en_service', dateFinGarantie: '2023-03-15', parentId: null,
    periodicite: 'trimestrielle', documents: [],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'EQ-002', designation: 'Pompe centrifuge Grundfos CR 32',
    description: 'Pompe centrifuge multicellulaire pour circuit de refroidissement',
    categorie: 'pompe',
    localisation: { site: 'Usine principale', batiment: 'Atelier A', salle: 'Local pompage', ligne: 'Ligne 1' },
    dateMiseEnService: '2021-06-01', dureeVieEstimee: 12, constructeur: 'Grundfos', modele: 'CR 32-2',
    numeroSerie: 'GRU-2021-7892', statut: 'en_service', dateFinGarantie: '2024-06-01', parentId: null,
    periodicite: 'mensuelle', documents: [],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'EQ-003', designation: 'Moteur electrique Siemens 22kW',
    description: 'Moteur asynchrone triphase 22kW, 1500 tr/min', categorie: 'moteur_electrique',
    localisation: { site: 'Usine principale', batiment: 'Atelier B', salle: 'Zone convoyeur', ligne: 'Ligne 2' },
    dateMiseEnService: '2022-01-20', dureeVieEstimee: 20, constructeur: 'Siemens', modele: '1LE1003-1DC4',
    numeroSerie: 'SIE-2022-1234', statut: 'en_panne', dateFinGarantie: '2025-01-20', parentId: 'EQ-001',
    periodicite: 'annuelle', documents: [],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-04-15T14:30:00Z',
  },
  {
    id: 'EQ-004', designation: 'Convoyeur a bande FlexLink',
    description: 'Convoyeur automatise de 12 metres pour ligne d\'assemblage',
    categorie: 'convoyeur',
    localisation: { site: 'Usine principale', batiment: 'Atelier B', salle: 'Zone assemblage', ligne: 'Ligne 2' },
    dateMiseEnService: '2021-09-10', dureeVieEstimee: 10, constructeur: 'FlexLink', modele: 'X85W',
    numeroSerie: 'FLX-2021-5678', statut: 'en_service', dateFinGarantie: '2024-09-10', parentId: null,
    periodicite: 'mensuelle', documents: [],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'EQ-005', designation: 'Centrifugeuse industrielle FERRUM',
    description: 'Centrifugeuse pour traitement des effluents - capacite 500 L/h',
    categorie: 'centrifugeuse',
    localisation: { site: 'Usine principale', batiment: 'Atelier C', salle: 'Station traitement', ligne: 'Ligne 3' },
    dateMiseEnService: '2023-02-01', dureeVieEstimee: 18, constructeur: 'Ferrum', modele: 'KSA-500',
    numeroSerie: 'FER-2023-9012', statut: 'en_maintenance', dateFinGarantie: '2026-02-01', parentId: null,
    periodicite: 'trimestrielle', documents: [],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-05-20T11:00:00Z',
  },
  {
    id: 'EQ-006', designation: 'Table de marquage laser Trumpf',
    description: 'Machine de marquage laser fibre 20W pour codes-barres et serigraphie',
    categorie: 'laser',
    localisation: { site: 'Usine satellite', batiment: 'Batiment B', salle: 'Salle finition', ligne: 'Ligne 4' },
    dateMiseEnService: '2023-11-15', dureeVieEstimee: 8, constructeur: 'Trumpf', modele: 'TruMark 3020',
    numeroSerie: 'TRU-2023-3456', statut: 'en_service', dateFinGarantie: '2026-11-15', parentId: null,
    periodicite: 'annuelle', documents: [],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z',
  },
];

export const seedOrdresTravail = [
  {
    id: 'OT-2024-001', type: 'preventif_systematique', statut: 'cloture',
    equipementId: 'EQ-001', priorite: 'haute',
    description: 'Vidange huile et remplacement filtre air compresseur GA15',
    technicienIds: ['USR-002'], responsableId: 'USR-001',
    dateCreation: '2024-04-01T08:00:00Z', datePlanifiee: '2024-04-10T08:00:00Z',
    dureeEstimee: 120, dateLimite: '2024-04-15T17:00:00Z',
    articlesNecessaires: [{ articleId: 'ART-001', quantite: 1 }, { articleId: 'ART-002', quantite: 2 }],
    instructionsSecurite: 'Couper l alimentation electrique avant intervention. Porter les EPI.',
    coutEstime: 180,
    rapportCloture: { actionsRealisees: 'Vidange huile effectuee. Filtre air remplace. Controle OK.', dureeEffective: 95, observations: 'Usure normale des courroies - prevoir remplacement prochain OT', articlesConsommes: [{ articleId: 'ART-001', quantite: 1 }, { articleId: 'ART-002', quantite: 2 }], dateRealisation: '2024-04-10T11:35:00Z' },
    createdAt: '2024-04-01T08:00:00Z', updatedAt: '2024-04-10T11:35:00Z',
  },
  {
    id: 'OT-2024-002', type: 'correctif', statut: 'planifie',
    equipementId: 'EQ-003', priorite: 'urgente',
    description: 'Moteur Siemens 22kW - vibration anormale, roulement endommage',
    technicienIds: ['USR-002'], responsableId: 'USR-003',
    dateCreation: '2024-05-15T09:00:00Z', datePlanifiee: '2024-05-16T08:00:00Z',
    dureeEstimee: 240, dateLimite: '2024-05-18T17:00:00Z',
    articlesNecessaires: [{ articleId: 'ART-003', quantite: 2 }],
    instructionsSecurite: 'Consigner le moteur. Verifier absence de tension.',
    coutEstime: 650,
    rapportCloture: null,
    createdAt: '2024-05-15T09:00:00Z', updatedAt: '2024-05-15T09:00:00Z',
  },
  {
    id: 'OT-2024-003', type: 'preventif_systematique', statut: 'en_cours',
    equipementId: 'EQ-002', priorite: 'normale',
    description: 'Maintenance mensuelle pompe Grundfos - graissage roulements, controle joints',
    technicienIds: ['USR-002'], responsableId: 'USR-003',
    dateCreation: '2024-05-20T08:00:00Z', datePlanifiee: '2024-05-25T08:00:00Z',
    dureeEstimee: 60, dateLimite: '2024-05-28T17:00:00Z',
    articlesNecessaires: [{ articleId: 'ART-004', quantite: 1 }],
    instructionsSecurite: 'Purger la canalisation avant demontage.',
    coutEstime: 90,
    rapportCloture: null,
    createdAt: '2024-05-20T08:00:00Z', updatedAt: '2024-05-25T08:30:00Z',
  },
  {
    id: 'OT-2024-004', type: 'amelioratif', statut: 'demande',
    equipementId: 'EQ-004', priorite: 'basse',
    description: 'Ajout d une station de lubrification automatique sur convoyeur FlexLink',
    technicienIds: [], responsableId: 'USR-003',
    dateCreation: '2024-05-22T10:00:00Z', datePlanifiee: null,
    dureeEstimee: 180, dateLimite: '2024-06-15T17:00:00Z',
    articlesNecessaires: [{ articleId: 'ART-005', quantite: 1 }],
    instructionsSecurite: 'Zone en activite - baliser le perimetre.',
    coutEstime: 420,
    rapportCloture: null,
    createdAt: '2024-05-22T10:00:00Z', updatedAt: '2024-05-22T10:00:00Z',
  },
  {
    id: 'OT-2024-005', type: 'correctif', statut: 'cloture',
    equipementId: 'EQ-005', priorite: 'urgente',
    description: 'Fuite d etancheite sur centrifugeuse KSA-500 - joint SPI defectueux',
    technicienIds: ['USR-002'], responsableId: 'USR-001',
    dateCreation: '2024-05-18T07:30:00Z', datePlanifiee: '2024-05-18T07:30:00Z',
    dureeEstimee: 90, dateLimite: '2024-05-18T17:00:00Z',
    articlesNecessaires: [{ articleId: 'ART-006', quantite: 1 }],
    instructionsSecurite: 'Vidanger la centrifugeuse avant intervention. Produits chimiques - porter gants nitrile.',
    coutEstime: 320,
    rapportCloture: { actionsRealisees: 'Remplacement joint SPI effectue. Test d etancheite OK. Remise en service.', dureeEffective: 75, observations: 'Jeu anormal sur l arbre - a surveiller lors de la prochaine maintenance', articlesConsommes: [{ articleId: 'ART-006', quantite: 1 }], dateRealisation: '2024-05-18T10:15:00Z' },
    createdAt: '2024-05-18T07:30:00Z', updatedAt: '2024-05-18T10:15:00Z',
  },
];

export const seedArticles = [
  { id: 'ART-001', reference: 'HC-OIL-46-5L', referencesFabricant: ['ATLC-OIL-R46'], designation: 'Huile compresseur ISO 46 - bidon 5L', description: 'Huile minerale pour compresseurs a vis Atlas Copco', unite: 'bidon', categorie: 'consommable', equipementsCompatibles: ['EQ-001'], stockActuel: 8, stockMinimum: 3, stockMaximum: 20, quantiteCommandeEconomique: 10, delaiLivraisonJours: 5, coutUnitaire: 24.50, methodeValorisation: 'CMUP', coutMoyenUnitairePondere: 24.50, fournisseurs: [{ fournisseurId: 'FRN-001', nom: 'TechPieces SARL', reference: 'TP-OIL46', prixUnitaire: 24.50, delaiJours: 5 }], createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z' },
  { id: 'ART-002', reference: 'FILTER-AIR-015', referencesFabricant: ['ATLC-F015', 'MANN-F015'], designation: 'Filtre a air compresseur - jeu de 2', description: 'Filtre a air pour compresseur GA15 - cartouche plissee', unite: 'jeu', categorie: 'consommable', equipementsCompatibles: ['EQ-001'], stockActuel: 5, stockMinimum: 2, stockMaximum: 10, quantiteCommandeEconomique: 4, delaiLivraisonJours: 3, coutUnitaire: 18.00, methodeValorisation: 'CMUP', coutMoyenUnitairePondere: 18.00, fournisseurs: [{ fournisseurId: 'FRN-001', nom: 'TechPieces SARL', reference: 'TP-F015', prixUnitaire: 18.00, delaiJours: 3 }], createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z' },
  { id: 'ART-003', reference: 'BEAR-SKF-6205', referencesFabricant: ['SKF-6205-2Z'], designation: 'Roulement a billes SKF 6205-2Z', description: 'Roulement rigide a une rangee de billes - etancheite par flasques plastique', unite: 'piece', categorie: 'piece_rechange', equipementsCompatibles: ['EQ-003', 'EQ-002'], stockActuel: 2, stockMinimum: 4, stockMaximum: 15, quantiteCommandeEconomique: 8, delaiLivraisonJours: 7, coutUnitaire: 12.80, methodeValorisation: 'CMUP', coutMoyenUnitairePondere: 12.80, fournisseurs: [{ fournisseurId: 'FRN-002', nom: 'Roulements SAS', reference: 'RS-6205', prixUnitaire: 12.80, delaiJours: 7 }], createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z' },
  { id: 'ART-004', reference: 'GREASE-LG2-1KG', referencesFabricant: ['SKF-LG2-1'], designation: 'Graisse SKF LG2 1kg - cartouche', description: 'Graisse pour roulements a base de lithium - usage general', unite: 'cartouche', categorie: 'consommable', equipementsCompatibles: ['EQ-002', 'EQ-004'], stockActuel: 12, stockMinimum: 2, stockMaximum: 10, quantiteCommandeEconomique: 6, delaiLivraisonJours: 3, coutUnitaire: 15.00, methodeValorisation: 'CMUP', coutMoyenUnitairePondere: 15.00, fournisseurs: [{ fournisseurId: 'FRN-002', nom: 'Roulements SAS', reference: 'RS-LG2', prixUnitaire: 15.00, delaiJours: 3 }], createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z' },
  { id: 'ART-005', reference: 'LUB-AUTO-KIT', referencesFabricant: ['FLEX-LUB01'], designation: 'Kit lubrification automatique - 6 points', description: 'Kit complet pour installation de lubrification centralisee', unite: 'kit', categorie: 'piece_rechange', equipementsCompatibles: ['EQ-004'], stockActuel: 3, stockMinimum: 1, stockMaximum: 5, quantiteCommandeEconomique: 2, delaiLivraisonJours: 14, coutUnitaire: 185.00, methodeValorisation: 'CMUP', coutMoyenUnitairePondere: 185.00, fournisseurs: [{ fournisseurId: 'FRN-003', nom: 'LubTech Distribution', reference: 'LT-KIT01', prixUnitaire: 185.00, delaiJours: 14 }], createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z' },
  { id: 'ART-006', reference: 'JOINT-SPI-45-62-8', referencesFabricant: ['SPI-45628'], designation: 'Joint SPI 45x62x8 mm', description: 'Joint d etancheite a levre pour arbre tournant', unite: 'piece', categorie: 'piece_rechange', equipementsCompatibles: ['EQ-005'], stockActuel: 1, stockMinimum: 3, stockMaximum: 10, quantiteCommandeEconomique: 5, delaiLivraisonJours: 5, coutUnitaire: 6.50, methodeValorisation: 'CMUP', coutMoyenUnitairePondere: 6.50, fournisseurs: [{ fournisseurId: 'FRN-001', nom: 'TechPieces SARL', reference: 'TP-SPI45', prixUnitaire: 6.50, delaiJours: 5 }], createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z' },
];

export const seedMouvements = [
  { id: 'MVT-2024-001', articleId: 'ART-001', otId: 'OT-2024-001', type: 'sortie', quantite: 1, quantiteAvant: 9, quantiteApres: 8, coutUnitaireApplique: 24.50, motif: 'Vidange compresseur GA15', utilisateurId: 'USR-002', date: '2024-04-10T09:30:00Z' },
  { id: 'MVT-2024-002', articleId: 'ART-002', otId: 'OT-2024-001', type: 'sortie', quantite: 2, quantiteAvant: 7, quantiteApres: 5, coutUnitaireApplique: 18.00, motif: 'Remplacement filtre air GA15', utilisateurId: 'USR-002', date: '2024-04-10T09:35:00Z' },
  { id: 'MVT-2024-003', articleId: 'ART-006', otId: 'OT-2024-005', type: 'sortie', quantite: 1, quantiteAvant: 2, quantiteApres: 1, coutUnitaireApplique: 6.50, motif: 'Remplacement joint SPI centrifugeuse', utilisateurId: 'USR-002', date: '2024-05-18T08:45:00Z' },
  { id: 'MVT-2024-004', articleId: 'ART-001', type: 'entree', quantite: 5, quantiteAvant: 3, quantiteApres: 8, coutUnitaireApplique: 25.00, motif: 'Reapprovisionnement fournisseur', utilisateurId: 'USR-004', date: '2024-05-02T14:00:00Z' },
  { id: 'MVT-2024-005', articleId: 'ART-004', type: 'entree', quantite: 6, quantiteAvant: 6, quantiteApres: 12, coutUnitaireApplique: 15.00, motif: 'Reapprovisionnement fournisseur', utilisateurId: 'USR-004', date: '2024-05-05T10:00:00Z' },
];

export const seedSites = [
  { id: 'SITE-001', nom: 'Usine principale', adresse: '123 Avenue de l\'Industrie', ville: 'Lyon', codePostal: '69000', pays: 'France', contactNom: 'Sophie Petit', contactEmail: 's.petit@entreprise.fr', contactTelephone: '04 78 00 00 01', actif: true, createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z' },
  { id: 'SITE-002', nom: 'Usine satellite', adresse: '456 Rue de la Production', ville: 'Villeurbanne', codePostal: '69100', pays: 'France', contactNom: 'Luc Bernard', contactEmail: 'l.bernard@entreprise.fr', contactTelephone: '04 78 00 00 02', actif: true, createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z' },
  { id: 'SITE-003', nom: 'Entrepot logistique', adresse: '789 Zone Industrielle', ville: 'Saint-Priest', codePostal: '69800', pays: 'France', contactNom: 'Marie Dupont', contactEmail: 'm.dupont@entreprise.fr', contactTelephone: '04 78 00 00 03', actif: true, createdAt: '2024-06-01T09:00:00Z', updatedAt: '2024-06-01T09:00:00Z' },
];

export const seedInventaires = [
  {
    id: 'INV-001', date: '2024-06-01T09:00:00Z', utilisateurId: 'USR-004', statut: 'valide',
    notes: 'Inventaire mensuel juin 2024',
    lignes: [
      { articleId: 'ART-001', stockTheorique: 8, stockReel: 8, ecart: 0, commentaire: 'Conforme' },
      { articleId: 'ART-002', stockTheorique: 5, stockReel: 3, ecart: -2, commentaire: '2 unites perdues non documentees' },
      { articleId: 'ART-003', stockTheorique: 2, stockReel: 2, ecart: 0, commentaire: 'Conforme' },
      { articleId: 'ART-004', stockTheorique: 12, stockReel: 11, ecart: -1, commentaire: '1 cartouche utilisee sans mouvement' },
      { articleId: 'ART-005', stockTheorique: 3, stockReel: 3, ecart: 0, commentaire: 'Conforme' },
      { articleId: 'ART-006', stockTheorique: 1, stockReel: 1, ecart: 0, commentaire: 'Conforme' },
    ],
    createdAt: '2024-06-01T09:00:00Z', updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    id: 'INV-002', date: '2024-05-01T09:00:00Z', utilisateurId: 'USR-004', statut: 'valide',
    notes: 'Inventaire mensuel mai 2024',
    lignes: [
      { articleId: 'ART-001', stockTheorique: 9, stockReel: 9, ecart: 0, commentaire: 'Conforme' },
      { articleId: 'ART-002', stockTheorique: 7, stockReel: 7, ecart: 0, commentaire: 'Conforme' },
      { articleId: 'ART-003', stockTheorique: 2, stockReel: 2, ecart: 0, commentaire: 'Conforme' },
      { articleId: 'ART-006', stockTheorique: 2, stockReel: 2, ecart: 0, commentaire: 'Conforme' },
    ],
    createdAt: '2024-05-01T09:00:00Z', updatedAt: '2024-05-01T11:00:00Z',
  },
];

function dateStr(d) { return d.toISOString(); }
function subDays(date, n) { const d = new Date(date); d.setDate(d.getDate() - n); return d; }

export function seedData() {
  const NEW_COLLECTIONS = [
    { key: 'utilisateurs', data: seedUtilisateurs },
    { key: 'equipements', data: seedEquipements },
    { key: 'ordres_travail', data: seedOrdresTravail },
    { key: 'articles', data: seedArticles },
    { key: 'mouvements', data: seedMouvements },
    { key: 'sites', data: seedSites },
    { key: 'inventaires', data: seedInventaires },
  ];
  NEW_COLLECTIONS.forEach(({ key, data }) => {
    if (!localStorage.getItem(`gmao_${key}`)) {
      localStorage.setItem(`gmao_${key}`, JSON.stringify(data));
    }
  });
  ['activity_logs', 'notifications'].forEach(key => {
    if (!localStorage.getItem(`gmao_${key}`)) {
      localStorage.setItem(`gmao_${key}`, '[]');
    }
  });
  ajouterSimulationRecente();
}

function ajouterSimulationRecente() {
  const now = new Date();
  const ots = JSON.parse(localStorage.getItem('gmao_ordres_travail') || '[]');
  const mouvs = JSON.parse(localStorage.getItem('gmao_mouvements') || '[]');
  const eqs = JSON.parse(localStorage.getItem('gmao_equipements') || '[]');
  const simOTIds = ['OT-SIM-MTBF1', 'OT-SIM-MTBF2', 'OT-SIM-MTBF3', 'OT-SIM-MTBF4', 'OT-SIM-PREV1'];
  if (ots.some(o => simOTIds.includes(o.id))) return;

  const mtbfCorrections = [
    { id: 'OT-SIM-MTBF1', eqId: 'EQ-001', label: 'Corr. roulement compresseur GA15', priorite: 'haute', duree: 130, coutEst: 250, jours: 15, mvt: { artId: 'ART-003', qte: 1 }, pce: 12.80 },
    { id: 'OT-SIM-MTBF2', eqId: 'EQ-002', label: 'Corr. joint pompe Grundfos', priorite: 'normale', duree: 60, coutEst: 180, jours: 35, mvt: null, pce: 0 },
    { id: 'OT-SIM-MTBF3', eqId: 'EQ-003', label: 'Corr. remplacement roulement moteur', priorite: 'urgente', duree: 200, coutEst: 550, jours: 60, mvt: { artId: 'ART-003', qte: 2 }, pce: 25.60 },
    { id: 'OT-SIM-MTBF4', eqId: 'EQ-006', label: 'Corr. panne laser Trumpf', priorite: 'haute', duree: 90, coutEst: 300, jours: 80, mvt: null, pce: 0 },
    { id: 'OT-SIM-PREV1', eqId: 'EQ-004', label: 'Prev. graissage convoyeur FlexLink', priorite: 'normale', duree: 45, coutEst: 120, jours: 20, mvt: { artId: 'ART-004', qte: 1 }, pce: 15.00 },
  ];

  mtbfCorrections.forEach(c => {
    const otDate = subDays(now, c.jours);
    const ot = {
      id: c.id, type: c.id.includes('PREV') ? 'preventif_systematique' : 'correctif',
      statut: 'cloture', equipementId: c.eqId, priorite: c.priorite,
      description: c.label, technicienIds: ['USR-002'], responsableId: 'USR-003',
      dateCreation: dateStr(subDays(otDate, 1)), datePlanifiee: dateStr(otDate),
      dureeEstimee: c.duree, dateLimite: dateStr(subDays(now, c.jours - 5)),
      articlesNecessaires: c.mvt ? [{ articleId: c.mvt.artId, quantite: c.mvt.qte }] : [],
      instructionsSecurite: 'Suivre le plan de maintenance.',
      coutEstime: c.coutEst,
      rapportCloture: {
        actionsRealisees: c.label, dureeEffective: c.duree,
        observations: 'Intervention realisee avec succes.',
        articlesConsommes: c.mvt ? [{ articleId: c.mvt.artId, quantite: c.mvt.qte }] : [],
        dateRealisation: dateStr(subDays(now, c.jours - 1)),
      },
      createdAt: dateStr(subDays(otDate, 1)), updatedAt: dateStr(now),
    };
    ots.push(ot);

    if (c.mvt) {
      const art = eqs.find(e => e.id === c.eqId);
      const mvtId = `MVT-SIM-${c.id}`;
      if (!mouvs.some(m => m.id === mvtId)) {
        mouvs.push({
          id: mvtId, articleId: c.mvt.artId, otId: c.id, type: 'sortie',
          quantite: c.mvt.qte, quantiteAvant: 10, quantiteApres: 10 - c.mvt.qte,
          coutUnitaireApplique: c.pce, motif: c.label,
          utilisateurId: 'USR-002', date: dateStr(otDate),
        });
      }
    }
  });

  localStorage.setItem('gmao_ordres_travail', JSON.stringify(ots));
  localStorage.setItem('gmao_mouvements', JSON.stringify(mouvs));
}
