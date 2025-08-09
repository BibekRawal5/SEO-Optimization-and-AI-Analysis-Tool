import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'gray';
  icon?: React.ReactNode;
  progress?: number;
}

export default function MetricsCard({ 
  title, 
  value, 
  subtitle, 
  color = 'blue', 
  icon, 
  progress 
}: MetricsCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    gray: 'border-gray-200 bg-gray-50 text-gray-700'
  };

  const progressColors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500'
  };

  return (
    <div className={`border-2 ${colorClasses[color]} rounded-xl p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>

      {typeof progress === 'number' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${progressColors[color]} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}