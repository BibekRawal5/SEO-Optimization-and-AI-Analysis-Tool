import React from 'react';
import { Globe, AlertTriangle, CheckCircle } from 'lucide-react';

interface InternalPage {
  url: string;
  suggestions: string[];
}

interface InternalPagesAnalysisProps {
  internalPages: InternalPage[];
}

export default function InternalPagesAnalysis({ internalPages }: InternalPagesAnalysisProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Internal Pages Analysis</h2>
      </div>

      <div className="space-y-6">
        {internalPages.map((page, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-lg ${page.suggestions.length > 0 ? 'bg-orange-100' : 'bg-emerald-100'}`}>
                {page.suggestions.length > 0 ? (
                  <AlertTriangle className="text-orange-600" size={20} />
                ) : (
                  <CheckCircle className="text-emerald-600" size={20} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {page.url.replace('https://', '').replace('http://', '')}
                </h3>
                <a 
                  href={page.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {page.url}
                </a>
              </div>
            </div>

            {page.suggestions.length > 0 ? (
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">Suggested Improvements:</h4>
                <ul className="space-y-1">
                  {page.suggestions.map((suggestion, suggestionIndex) => (
                    <li key={suggestionIndex} className="text-sm text-orange-700 flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-sm text-emerald-700 font-medium">✓ No issues found for this page</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}