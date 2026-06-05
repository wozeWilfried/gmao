const PREFIX = 'gmao_';

const ID_PREFIXES = {
  equipements: 'EQ',
  ordres_travail: 'OT',
  articles: 'ART',
  mouvements: 'MVT',
  utilisateurs: 'USR',
  sites: 'SITE',
  inventaires: 'INV',
};

function generateId(collection) {
  const prefix = ID_PREFIXES[collection] || 'ID';
  const timestamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${rand}`;
}

const storageService = {
  getAll(collection) {
    try {
      const data = localStorage.getItem(PREFIX + collection);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getById(collection, id) {
    return this.getAll(collection).find(item => item.id === id) || null;
  },

  create(collection, data) {
    const items = this.getAll(collection);
    const newItem = {
      ...data,
      id: generateId(collection),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    localStorage.setItem(PREFIX + collection, JSON.stringify(items));
    return newItem;
  },

  update(collection, id, data) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error(`${collection}/${id} introuvable`);
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(PREFIX + collection, JSON.stringify(items));
    return items[index];
  },

  delete(collection, id) {
    const items = this.getAll(collection).filter(item => item.id !== id);
    localStorage.setItem(PREFIX + collection, JSON.stringify(items));
  },

  query(collection, filters = {}) {
    return this.getAll(collection).filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') return true;
        const itemValue = key.includes('.')
          ? key.split('.').reduce((o, k) => o?.[k], item)
          : item[key];
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      })
    );
  },

  exportAll() {
    const keys = ['equipements', 'ordres_travail', 'articles', 'mouvements', 'utilisateurs', 'sites', 'inventaires', 'activity_logs', 'notifications'];
    const backup = {};
    keys.forEach(k => { backup[k] = this.getAll(k); });
    return JSON.stringify(backup, null, 2);
  },

  importAll(jsonString) {
    const data = JSON.parse(jsonString);
    Object.entries(data).forEach(([collection, items]) => {
      localStorage.setItem(PREFIX + collection, JSON.stringify(items));
    });
  },

  get(key) {
    try { return JSON.parse(localStorage.getItem(PREFIX + key)); }
    catch { return null; }
  },

  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },

  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};

export default storageService;
