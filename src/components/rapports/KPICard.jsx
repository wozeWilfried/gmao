export default function KPICard({ icon: Icon, label, value, subtitle, color = 'blue', onClick }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600', indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600', green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600', cyan: 'bg-cyan-50 text-cyan-600',
    red: 'bg-red-50 text-red-600', orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 transition-all ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-200' : 'hover:shadow-md'}`} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && <div className={`p-2.5 rounded-lg ${colors[color] || colors.blue}`}><Icon size={22} /></div>}
      </div>
    </div>
  );
}
