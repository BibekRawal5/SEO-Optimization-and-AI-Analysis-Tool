import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  BookOpen,
  Construction as Structure,
  CheckCircle,
  XCircle,
  FileDown
} from 'lucide-react';

import AnalysisForm from './components/AnalysisForm';
import MetricsCard from './components/MetricsCard';
import KeywordDensity from './components/KeywordDensity';
import InternalPagesAnalysis from './components/InternalPagesAnalysis';
import AIInsights from './components/AIInsights';
import { AnalysisResponse } from './types/analysis';

const backendBaseURL = import.meta.env.VITE_BACKEND_URL;
const API_ENDPOINT = 'http://localhost:5000/api/analyze';

const analyzeWebsite = async (url: string, keywords: string[]): Promise<AnalysisResponse> => {
  try {
    // const response = await fetch(API_ENDPOINT, {
    const response = await fetch(`${backendBaseURL.replace(/\/$/, '')}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        keywords
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: AnalysisResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to analyze website. Please check your connection and try again.');
  }
};

function App() {
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string, keywords: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeWebsite(url, keywords);
      setAnalysisData(data);
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <AnalysisForm onSubmit={handleAnalyze} loading={loading} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {analysisData && (
          <div className="space-y-8">
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Page Speed Score"
                value={analysisData.analysis.pageSpeed.score}
                subtitle="Google PageSpeed Score"
                color={getScoreColor(analysisData.analysis.pageSpeed.score)}
                icon={<Monitor size={20} />}
                progress={analysisData.analysis.pageSpeed.score}
              />

              <MetricsCard
                title="Readability Score"
                value={analysisData.analysis.readabilityScore.toFixed(1)}
                subtitle="Flesch Reading Ease"
                color={getScoreColor(analysisData.analysis.readabilityScore)}
                icon={<BookOpen size={20} />}
                progress={analysisData.analysis.readabilityScore}
              />

              <MetricsCard
                title="Mobile Friendly"
                value={analysisData.analysis.mobileFriendly ? "Yes" : "No"}
                subtitle="Mobile Optimization"
                color={analysisData.analysis.mobileFriendly ? 'green' : 'red'}
                icon={<Smartphone size={20} />}
              />

              <MetricsCard
                title="Structured Data"
                value={analysisData.analysis.structuredDataPresent ? "Present" : "Missing"}
                subtitle="Schema Markup"
                color={analysisData.analysis.structuredDataPresent ? 'green' : 'red'}
                icon={analysisData.analysis.structuredDataPresent ?
                  <CheckCircle size={20} /> : <XCircle size={20} />}
              />
            </div>

            {/* Meta Tags */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Structure className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Meta Tags Analysis</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Title Tag</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{analysisData.analysis.metaTags.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Length: {analysisData.analysis.metaTags.title.length} characters
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Meta Description</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">{analysisData.analysis.metaTags.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Length: {analysisData.analysis.metaTags.description.length} characters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Density */}
            <KeywordDensity keywordDensity={analysisData.analysis.keywordDensity} />

            {/* Internal Pages Analysis */}
            {analysisData.analysis.internalPagesSuggestions.length > 0 && (
              <InternalPagesAnalysis internalPages={analysisData.analysis.internalPagesSuggestions} />
            )}

            {/* Homepage Suggestions */}
            {analysisData.analysis.homepageSuggestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Homepage Suggestions</h2>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {analysisData.analysis.homepageSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-orange-700 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* AI Insights */}
            <AIInsights
              aiInsights={analysisData.analysis.aiInsights}
              rewrittenParagraph={analysisData.analysis.rewrittenParagraph}
            />

            {/* Download PDF Report Button */}
            {analysisData.reportURL && (
              <div className="mt-6">
                <a
                  // href={`http://localhost:5000${analysisData.reportURL}`}
                  href={`${backendBaseURL.replace(/\/$/, '')}${analysisData.reportURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <FileDown size={18} />
                  Download PDF Report
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
