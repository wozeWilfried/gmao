import storageService from './storageService';

export function createNotification({ type, title, message, lien, destinataireId = null }) {
  const notif = {
    id: `NOTIF-${Date.now().toString(36).toUpperCase()}`,
    type,
    title,
    message,
    lien: lien || null,
    destinataireId,
    lue: false,
    date: new Date().toISOString(),
  };
  const notifications = storageService.getAll('notifications');
  notifications.unshift(notif);
  if (notifications.length > 200) notifications.length = 200;
  localStorage.setItem('gmao_notifications', JSON.stringify(notifications));
  return notif;
}

export function getNotifications(utilisateurId) {
  return storageService.getAll('notifications').filter(n =>
    !n.destinataireId || n.destinataireId === utilisateurId
  );
}

export function getUnreadCount(utilisateurId) {
  return getNotifications(utilisateurId).filter(n => !n.lue).length;
}

export function markAsRead(notifId) {
  try {
    storageService.update('notifications', notifId, { lue: true });
  } catch {}
}

export function deleteNotification(notifId) {
  try {
    storageService.delete('notifications', notifId);
  } catch {}
}

export function markAllAsRead(utilisateurId) {
  const notifs = storageService.getAll('notifications');
  notifs.forEach(n => {
    if (!n.destinataireId || n.destinataireId === utilisateurId) n.lue = true;
  });
  localStorage.setItem('gmao_notifications', JSON.stringify(notifs));
}

export function generateAlertesNotifications(equipements, articles) {
  const existing = storageService.getAll('notifications');
  const existingKeys = new Set(existing.map(n => `${n.title}-${n.message}`));

  equipements.forEach(eq => {
    if (!eq.dateFinGarantie) return;
    const joursRestants = Math.ceil((new Date(eq.dateFinGarantie) - new Date()) / (1000 * 60 * 60 * 24));
    if (joursRestants <= 30 && joursRestants >= 0) {
      const msg = `${eq.designation} - Garantie expire le ${new Date(eq.dateFinGarantie).toLocaleDateString('fr-FR')} (${joursRestants} jours)`;
      const key = `Fin de garantie imminente-${msg}`;
      if (!existingKeys.has(key)) {
        createNotification({
          type: 'warning', title: 'Fin de garantie imminente',
          message: msg,
          lien: '/equipements',
        });
      }
    }
  });

  articles.forEach(art => {
    if (art.stockActuel <= art.stockMinimum) {
      const msg = `${art.designation} - Stock: ${art.stockActuel} / Seuil: ${art.stockMinimum}`;
      const key = `Stock critique-${msg}`;
      if (!existingKeys.has(key)) {
        createNotification({
          type: 'danger', title: 'Stock critique',
          message: msg,
          lien: '/stocks',
        });
      }
    }
  });
}
