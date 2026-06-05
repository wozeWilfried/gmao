function Img({ src, alt, className = '' }) {
  return (
    <img src={src} alt={alt} className={className}
      loading="lazy" onError={e => { e.target.style.display = 'none' }} />
  );
}

export function MaintenanceIllustration({ className = "w-64 h-64 object-cover rounded-2xl shadow-lg" }) {
  return <Img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop&crop=center" alt="Maintenance industrielle" className={className} />;
}

export function AnalyticsIllustration({ className = "w-64 h-64 object-cover rounded-2xl shadow-lg" }) {
  return <Img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center" alt="Analytique et rapports" className={className} />;
}

export function InventoryIllustration({ className = "w-64 h-64 object-cover rounded-2xl shadow-lg" }) {
  return <Img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=400&fit=crop&crop=center" alt="Gestion des stocks" className={className} />;
}

export function EmptyStateIllustration({ className = "w-48 h-48 object-contain opacity-40" }) {
  return <Img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop&crop=center" alt="Aucune donnee" className={className} />;
}

export function LoadingSpinner({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 50 50" className={`animate-spin ${className}`}>
      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.1" />
      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
        strokeDasharray="80 200" strokeDashoffset="0" />
    </svg>
  );
}
