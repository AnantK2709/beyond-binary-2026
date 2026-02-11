import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function MonthlyReportBanner() {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="card mb-8 animate-slide-up-fade"
      style={{
        background: 'linear-gradient(135deg, rgba(137, 207, 240, 0.2), rgba(107, 155, 209, 0.2))',
        border: '2px solid rgba(107, 155, 209, 0.3)',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="animate-float">
          <BarChart3 size={40} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              Your {currentMonth} Report is Ready!
            </h3>
            <span className="badge-new text-xs">NEW</span>
          </div>
          <p className="text-gray-600 mb-4">
            See your mood trends, social connections, and personalized insights for this month.
          </p>
          <Link
            to="/profile"
            className="btn-secondary inline-block"
          >
            View Report →
          </Link>
        </div>
      </div>
    </div>
  );
}
