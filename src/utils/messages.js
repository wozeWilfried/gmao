import storageService from './storageService';

export function sendMessage(senderId, receiverId, content) {
  if (!content.trim()) return null;
  const msg = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    senderId,
    receiverId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  const messages = storageService.getAll('messages');
  messages.push(msg);
  if (messages.length > 1000) messages.splice(0, messages.length - 1000);
  localStorage.setItem('gmao_messages', JSON.stringify(messages));
  return msg;
}

export function getMessages(userId1, userId2) {
  return storageService.getAll('messages').filter(m =>
    (m.senderId === userId1 && m.receiverId === userId2) ||
    (m.senderId === userId2 && m.receiverId === userId1)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function getConversations(utilisateurId, allUsers) {
  const messages = storageService.getAll('messages');
  const userMap = {};
  allUsers.forEach(u => { userMap[u.id] = u; });

  const convMap = {};
  messages.forEach(m => {
    const otherId = m.senderId === utilisateurId ? m.receiverId : m.senderId;
    if (!otherId) return;
    if (!convMap[otherId] || new Date(m.createdAt) > new Date(convMap[otherId].lastMessage.createdAt)) {
      convMap[otherId] = { lastMessage: m };
    }
  });

  const conversations = Object.entries(convMap).map(([userId, data]) => {
    const user = userMap[userId];
    if (!user) return null;
    const unread = messages.filter(m =>
      m.senderId === userId && m.receiverId === utilisateurId && !m.read
    ).length;
    return {
      userId,
      user,
      lastMessage: data.lastMessage,
      unread,
    };
  }).filter(Boolean);

  const messagedIds = new Set(conversations.map(c => c.userId));
  allUsers.forEach(u => {
    if (u.id !== utilisateurId && !messagedIds.has(u.id)) {
      conversations.push({
        userId: u.id,
        user: u,
        lastMessage: null,
        unread: 0,
      });
    }
  });

  conversations.sort((a, b) => {
    if (a.lastMessage && b.lastMessage) return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    if (a.lastMessage) return -1;
    if (b.lastMessage) return 1;
    return a.user.prenom.localeCompare(b.user.prenom);
  });

  return conversations;
}

export function markMessagesAsRead(utilisateurId, otherUserId) {
  const messages = storageService.getAll('messages');
  let changed = false;
  messages.forEach(m => {
    if (m.senderId === otherUserId && m.receiverId === utilisateurId && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) localStorage.setItem('gmao_messages', JSON.stringify(messages));
}

export function getTotalUnreadCount(utilisateurId) {
  return storageService.getAll('messages').filter(m =>
    m.receiverId === utilisateurId && !m.read
  ).length;
}
