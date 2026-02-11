import React from 'react';
import IconRenderer from '../../common/IconRenderer';

export default function StatsCard({ icon, label, value, color }) {
  return (
    <div className="card animate-scale-in">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
        <IconRenderer name={icon} size={24} className="text-white" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}