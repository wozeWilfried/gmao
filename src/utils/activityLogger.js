import storageService from './storageService';

export function logActivity(action, details, utilisateurId = null) {
  const userId = utilisateurId || storageService.get('session')?.userId || 'SYSTEM';
  const entry = {
    id: `ACT-${Date.now().toString(36).toUpperCase()}`,
    utilisateurId: userId,
    action,
    details: typeof details === 'string' ? details : JSON.stringify(details),
    timestamp: new Date().toISOString(),
  };
  const logs = storageService.getAll('activity_logs');
  logs.unshift(entry);
  if (logs.length > 1000) logs.length = 1000;
  localStorage.setItem('gmao_activity_logs', JSON.stringify(logs));
  return entry;
}

export function getActivityLogs(filters = {}) {
  return storageService.query('activity_logs', filters);
}

export function getRecentActivity(limit = 20) {
  return storageService.getAll('activity_logs').slice(0, limit);
}
