import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import storageService from '../../utils/storageService';
import { sendMessage, getMessages, getConversations, markMessagesAsRead, getTotalUnreadCount } from '../../utils/messages';
import { X, Send, MessageCircle, ChevronLeft, Check, CheckCheck, Phone, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_LABELS = {
  admin: 'Administrateur', responsable_maintenance: 'Responsable Maintenance',
  technicien: 'Technicien', responsable_stock: 'Responsable Stock', direction: 'Direction',
};
const GRADIENTS = [
  'from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600', 'from-violet-500 to-purple-600', 'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600', 'from-lime-500 to-green-600',
];
function getGradient(id) {
  const num = parseInt(id?.replace(/\D/g, '') || '0', 10);
  return GRADIENTS[num % GRADIENTS.length];
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / (1000 * 60 * 60 * 24);
  if (diff < 1) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (diff < 7) return d.toLocaleDateString('fr-FR', { weekday: 'short' });
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatDateSeparator(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / (1000 * 60 * 60 * 24);
  if (diff < 1) return "Aujourd'hui";
  if (diff < 2) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ChatPanel({ isOpen, onClose }) {
  const { utilisateur: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (selectedUserId && currentUser) {
      const msgs = getMessages(currentUser.id, selectedUserId);
      setMessages(msgs);
      markMessagesAsRead(currentUser.id, selectedUserId);
      refresh();
    }
  }, [selectedUserId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedUserId && inputRef.current) inputRef.current.focus();
  }, [selectedUserId]);

  function refresh() {
    if (!currentUser) return;
    const allUsers = storageService.getAll('utilisateurs');
    const convs = getConversations(currentUser.id, allUsers);
    setConversations(convs);
    setTotalUnread(getTotalUnreadCount(currentUser.id));
    if (selectedUserId) {
      const msgs = getMessages(currentUser.id, selectedUserId);
      setMessages(msgs);
      markMessagesAsRead(currentUser.id, selectedUserId);
    }
  }

  function handleSelectUser(userId) {
    setSelectedUserId(userId);
  }

  function handleSend() {
    if (!input.trim() || !currentUser || !selectedUserId) return;
    sendMessage(currentUser.id, selectedUserId, input);
    setInput('');
    const msgs = getMessages(currentUser.id, selectedUserId);
    setMessages(msgs);
    refresh();
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const selectedUser = conversations.find(c => c.userId === selectedUserId)?.user || null;

  function goBackToList() {
    setSelectedUserId(null);
  }

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-0 sm:pt-0">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl h-screen sm:h-[90vh] sm:mt-6 sm:mb-6 sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up z-10 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {selectedUserId && (
              <button onClick={goBackToList} className="sm:hidden p-1 text-white/80 hover:text-white">
                <ChevronLeft size={20} />
              </button>
            )}
            <MessageCircle size={20} className="text-white" />
            <div>
              <h2 className="text-white font-bold text-sm sm:text-base">Messagerie</h2>
              {!selectedUserId && (
                <p className="text-blue-200 text-xs">{totalUnread > 0 ? `${totalUnread} non lu(s)` : 'Discussion interne'}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className={`${selectedUserId ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-80 lg:w-96 border-r border-gray-200 bg-gray-50 flex-shrink-0`}>
            <div className="p-3 border-b bg-white">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => (
                <button key={conv.userId} onClick={() => handleSelectUser(conv.userId)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white border-b border-gray-100 ${selectedUserId === conv.userId ? 'bg-white shadow-sm' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient(conv.user.id)} flex items-center justify-center text-white text-xs font-bold`}>
                      {conv.user.prenom?.[0]}{conv.user.nom?.[0]}
                    </div>
                    {conv.unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {conv.unread > 9 ? '9+' : conv.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{conv.user.prenom} {conv.user.nom}</p>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{formatTime(conv.lastMessage.createdAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600 leading-none">
                        {ROLE_LABELS[conv.user.role] || conv.user.role}
                      </span>
                      {conv.lastMessage ? (
                        <p className="text-xs text-gray-400 truncate">{conv.lastMessage.content}</p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Aucun message</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`${!selectedUserId ? 'hidden sm:flex' : 'flex'} flex-col flex-1 bg-gray-50`}>
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b bg-white flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getGradient(selectedUser.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedUser.prenom} {selectedUser.nom}</p>
                    <p className="text-xs text-gray-500">{ROLE_LABELS[selectedUser.role] || selectedUser.role}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <MessageCircle size={28} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">Aucun message</p>
                      <p className="text-gray-400 text-xs mt-1">Envoyez votre premier message a {selectedUser.prenom}</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, idx) => {
                        const isMine = msg.senderId === currentUser.id;
                        const showDate = idx === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();
                        return (
                          <div key={msg.id}>
                            {showDate && (
                              <div className="flex justify-center my-3">
                                <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                  {formatDateSeparator(msg.createdAt)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
                              <div className={`max-w-[80%] sm:max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${isMine
                                ? 'bg-emerald-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                              }`}>
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-emerald-100' : 'text-gray-400'}`}>
                                  <span className="text-[10px] leading-none">
                                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {isMine && (
                                    msg.read
                                      ? <CheckCheck size={12} className="text-emerald-300" />
                                      : <Check size={12} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="p-3 sm:p-4 border-t bg-white flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder={`Message a ${selectedUser.prenom}...`}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-gray-50" />
                    <button onClick={handleSend} disabled={!input.trim()}
                      className={`p-2.5 rounded-full transition-colors ${input.trim() ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex flex-col items-center justify-center h-full text-center px-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle size={36} className="text-blue-500" />
                </div>
                <p className="text-gray-600 text-lg font-semibold">Messagerie interne</p>
                <p className="text-gray-400 text-sm mt-1 max-w-sm">Selectionnez une conversation pour discuter avec les membres de l'equipe</p>
                {totalUnread > 0 && (
                  <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    {totalUnread} message{totalUnread > 1 ? 's' : ''} non lu{totalUnread > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
