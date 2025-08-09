import { GoogleGenAI } from "@google/genai";

// We DO NOT create the client here anymore.

export async function generateAiInsights(webpageText) {
  // Create the Gemini client INSIDE the function (after env vars are loaded)
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

  // const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are an expert SEO and Content Strategist. Your task is to analyze the provided webpage content and generate a structured JSON object with actionable insights.

Based on the text below, please provide the following:
1.  **Semantic Clarity Score**: An estimated score from 0 to 100 indicating how clear and easy the content is for an AI to understand and summarize. Provide a brief justification for your score.
2.  **AI Summary**: A concise, one-paragraph summary of the content, written as if for a search engine's AI-powered answer snippet.
3.  **Optimized Meta Title**: A compelling meta title, under 60 characters.
4.  **Optimized Meta Description**: An engaging meta description, under 155 characters.
5.  **Suggested FAQs**: Three relevant "Frequently Asked Questions" with concise answers, derived *only* from the provided text.

CRITICAL: You must return ONLY a valid JSON object. Do not include any other text, explanation, or markdown formatting before or after the JSON object.

The JSON object must follow this exact structure:
{
  "semanticClarity": {
    "score": 90,
    "justification": "The content is well-written and easy to understand."
  },
  "aiSummary": "A concise summary of the webpage content.",
  "optimizedTitle": "A catchy and optimized meta title.",
  "optimizedDescription": "An engaging and optimized meta description.",
  "suggestedFaqs": [
    {
      "question": "What is the main topic?",
      "answer": "The main topic is..."
    },
    {
      "question": "What services are offered?",
      "answer": "The services offered are..."
    },
    {
      "question": "How can I get started?",
      "answer": "You can get started by..."
    }
  ]
}

--- WEBPAGE CONTENT ---
${webpageText.substring(0, 8000)}
--- END OF CONTENT ---
`;

  try {
    const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contentType: "application/json",
    contents: prompt,
  });
    const text = result.text;
    console.log("Gemini Response:", text);

    // Attempt to parse JSON from Gemini output
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const jsonString = text.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Gemini Error:', error);
    return {
      error: true,
      message: 'Failed to get AI insights from Gemini.',
      details: error.message,
    };
  }
}
