import React from 'react';
import { Brain, Lightbulb, HelpCircle } from 'lucide-react';

interface AIInsight {
  semanticClarity: {
    score: number;
    justification: string;
  };
  aiSummary: string;
  optimizedTitle: string;
  optimizedDescription: string;
  suggestedFaqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface AIInsightsProps {
  aiInsights: AIInsight;
  rewrittenParagraph: string;
}

export default function AIInsights({ aiInsights, rewrittenParagraph }: AIInsightsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* AI Summary and Semantic Clarity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="text-blue-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900">AI Insights & Analysis</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Semantic Clarity Score</h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-bold text-gray-900">{aiInsights.semanticClarity.score}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(aiInsights.semanticClarity.score)}`}>
                {aiInsights.semanticClarity.score >= 80 ? 'Excellent' : 
                 aiInsights.semanticClarity.score >= 60 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiInsights.semanticClarity.score}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{aiInsights.semanticClarity.justification}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">AI Summary</h3>
            <p className="text-gray-600">{aiInsights.aiSummary}</p>
          </div>
        </div>
      </div>

      {/* Optimized Content Suggestions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Content Optimization Suggestions</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Optimized Title</h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800">{aiInsights.optimizedTitle}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Optimized Description</h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800">{aiInsights.optimizedDescription}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Rewritten Content Sample</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm leading-relaxed">{rewrittenParagraph}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested FAQs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="text-emerald-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Suggested FAQs</h2>
        </div>

        <div className="space-y-4">
          {aiInsights.suggestedFaqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}