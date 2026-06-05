import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storageService from '../utils/storageService';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../utils/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { utilisateur } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!utilisateur) return;
    charger();
    const interval = setInterval(charger, 15000);
    return () => clearInterval(interval);
  }, [utilisateur]);

  function charger() {
    if (!utilisateur) return;
    const notifs = getNotifications(utilisateur.id);
    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => !n.lue).length);
  }

  const lire = useCallback((id) => {
    markAsRead(id);
    charger();
  }, []);

  const toutLire = useCallback(() => {
    markAllAsRead(utilisateur?.id);
    charger();
  }, [utilisateur]);

  const supprimer = useCallback((id) => {
    deleteNotification(id);
    charger();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, lire, toutLire, supprimer, charger }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
