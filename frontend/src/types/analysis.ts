export interface MetaTags {
  title: string;
  description: string;
}

export interface PageSpeed {
  score: number;
  mobileFriendly: boolean;
}

export interface SemanticClarity {
  score: number;
  justification: string;
}

export interface PageData {
  meta: MetaTags;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  altTags: string[];
}

export interface InternalPage {
  url: string;
  pageData: PageData;
  hasStructuredData: boolean;
  content: string;
}

export interface InternalPageSuggestion {
  url: string;
  suggestions: string[];
}

export interface AIInsights {
  semanticClarity: SemanticClarity;
  aiSummary: string;
  optimizedTitle: string;
  optimizedDescription: string;
  suggestedFaqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface AnalysisResponse {
  url: string;
  keywords: string[];
  reportURL: string; 
  analysis: {
    metaTags: MetaTags;
    keywordDensity: Record<string, number>;
    pageSpeed: PageSpeed;
    mobileFriendly: boolean;
    readabilityScore: number;
    semanticClarity: SemanticClarity;
    internalPages: InternalPage[];
    internalPagesSuggestions: InternalPageSuggestion[];
    homepageSuggestions: string[];
    structuredDataPresent: boolean;
    sampleParagraph: string;
    rewrittenParagraph: string;
    aiInsights: AIInsights;
  };
}