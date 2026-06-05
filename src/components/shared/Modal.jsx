import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative bg-white lg:rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[95vh] lg:max-h-[90vh] overflow-auto rounded-t-2xl lg:rounded-t-xl animate-slide-up`}>
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl lg:rounded-t-xl">
          <div className="flex items-center justify-between px-5 py-3.5">
            <h3 className="text-base lg:text-lg font-semibold truncate pr-2">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
