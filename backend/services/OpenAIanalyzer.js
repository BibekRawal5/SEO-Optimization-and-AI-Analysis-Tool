import OpenAI from 'openai';

// We DO NOT create the client here anymore.

export async function generateAiInsights(webpageText) {
  // THE FIX: Create the OpenAI client INSIDE the function.
  // This guarantees it only runs AFTER the .env file is loaded.
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Full OpenAI Error:', error);
    return {
      error: true,
      message: 'Failed to get AI insights.',
      details: error.message,
    };
  }
}