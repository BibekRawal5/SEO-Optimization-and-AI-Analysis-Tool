export async function generateParagraphRewrite(paragraph) {
  const OpenAI = (await import('openai')).default;

  // Create OpenAI client inside the function to ensure API key is loaded
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Rewrite the following paragraph to improve its clarity, engagement, and SEO value. Return only the rewritten paragraph.\n\nOriginal Paragraph:\n"${paragraph}"`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error in paragraph rewrite:", error.message);
    return "Could not rewrite paragraph.";
  }
}
