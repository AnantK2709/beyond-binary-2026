import React from 'react';

export default function StatsCard({ icon, label, value, color }) {
  return (
    <div className="card animate-scale-in">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-3 shadow-md`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}