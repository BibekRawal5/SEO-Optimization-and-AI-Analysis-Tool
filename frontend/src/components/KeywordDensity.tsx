import React from 'react';
import { TrendingUp } from 'lucide-react';

interface KeywordDensityProps {
  keywordDensity: Record<string, number>;
}

export default function KeywordDensity({ keywordDensity }: KeywordDensityProps) {
  const entries = Object.entries(keywordDensity);

  const getDensityColor = (density: number) => {
    if (density === 0) return 'text-red-600 bg-red-100';
    if (density < 1) return 'text-orange-600 bg-orange-100';
    if (density <= 3) return 'text-emerald-600 bg-emerald-100';
    return 'text-red-600 bg-red-100';
  };

  const getDensityStatus = (density: number) => {
    if (density === 0) return 'Not Found';
    if (density < 1) return 'Low';
    if (density <= 3) return 'Good';
    return 'Too High';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Keyword Density Analysis</h2>
      </div>

      <div className="space-y-4">
        {entries.map(([keyword, density]) => (
          <div key={keyword} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 capitalize">{keyword}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">{density.toFixed(2)}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDensityColor(density)}`}>
                  {getDensityStatus(density)}
                </span>
              </div>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, density * 10)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Optimal Range:</strong> 1-3% keyword density is generally recommended for good SEO performance.
        </p>
      </div>
    </div>
  );
}