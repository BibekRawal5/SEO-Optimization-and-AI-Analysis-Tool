 import puppeteer from 'puppeteer';
import axios from 'axios';
// We DO NOT import or initialize OpenAI here.
import { calculateFleschKincaid } from '../utils/readability.js';
// We ONLY import the function from our service file.
import { generateAiInsights } from '../services/analyzer.js';
import { generateParagraphRewrite } from '../services/paragraphRewriter.js';
import { generatePdfReport } from '../services/reportGenerator.js';

// Helper to extract meta tags, headings, and image alt tags from page
async function extractPageData(page) {
  return await page.evaluate(() => {
    const meta = {};
    const title = document.querySelector('title');
    meta.title = title ? title.innerText : '';
    const descriptionTag = document.querySelector('meta[name="description"]');
    meta.description = descriptionTag ? descriptionTag.getAttribute('content') : '';

    // Extract headings h1 to h3
    const headings = {};
    ['h1', 'h2', 'h3'].forEach(tag => {
      const elements = Array.from(document.querySelectorAll(tag));
      headings[tag] = elements.map(el => el.innerText.trim());
    });

    // Extract image alt attributes
    const images = Array.from(document.querySelectorAll('img'));
    const altTags = images.map(img => img.getAttribute('alt') || '').filter(alt => alt.length > 0);

    return { meta, headings, altTags };
  });
}

// Helper to calculate keyword density
function calculateKeywordDensity(text, keywords) {
  const wordArray = text.toLowerCase().match(/\b\w+\b/g) || [];
  const totalWords = wordArray.length;
  const density = {};
  keywords.forEach(keyword => {
    const count = wordArray.filter(word => word === keyword.toLowerCase()).length;
    density[keyword] = totalWords > 0 ? (count / totalWords) * 100 : 0;
  });
  return density;
}

// Helper to get internal links (up to maxLinks)
async function getInternalLinks(page, baseUrl, maxLinks = 5) {
  const links = await page.evaluate((origin) => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map(a => a.href)
      .filter(href => href.startsWith(origin));
  }, page.url());
  const uniqueLinks = [...new Set(links)].filter(link => link !== baseUrl);
  return uniqueLinks.slice(0, maxLinks);
}

// Helper to call Google PageSpeed Insights API
async function getPageSpeedData(url) {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    const lighthouseResult = data.lighthouseResult || {};
    const categories = lighthouseResult.categories || {};
    const performance = categories.performance || {};
    return {
      score: performance.score ? performance.score * 100 : null,
      mobileFriendly: true,
    };
  } catch (error) {
    console.error('PageSpeed API error:', error.message);
    return { score: null, mobileFriendly: null };
  }
}

// The main controller function
export const analyze = async (req, res) => {
  const { url, keywords } = req.body;
  if (!url || !keywords || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Missing or invalid url or keywords in request body' });
  }

  const browser = await puppeteer.launch({
  headless: true,
  executablePath: puppeteer.executablePath(), // <-- explicitly specify Chromium
  args: ['--no-sandbox', '--disable-setuid-sandbox'], // <-- required on Render
});
  const page = await browser.newPage();

  // Helper to detect structured data markup (Schema.org)
  async function detectStructuredData(page) {
    return await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const script of scripts) {
        try {
          const json = JSON.parse(script.textContent);
          if (json['@context'] && json['@context'].includes('schema.org')) {
            return true;
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
      return false;
    });
  }

  try {
    // --- CRAWLING ---
    await page.goto(url, { waitUntil: 'networkidle2' });
    const pageData = await extractPageData(page);
    const hasStructuredData = await detectStructuredData(page);
    const content = await page.evaluate(() => document.body.innerText);
    const internalLinks = await getInternalLinks(page, url, 5);

    const internalPagesData = [];
    for (const link of internalLinks) {
      try {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
        const pageDataInternal = await extractPageData(page);
        const hasStructuredDataInternal = await detectStructuredData(page);
        const text = await page.evaluate(() => document.body.innerText);
        internalPagesData.push({ url: link, pageData: pageDataInternal, hasStructuredData: hasStructuredDataInternal, content: text });
      } catch (err) {
        console.error(`Failed to crawl ${link}:`, err.message);
      }
    }

    const allContent = [content, ...internalPagesData.map(p => p.content)].join(' ');

    // --- ANALYSIS ---

    // 1. Local Analysis
    const keywordDensity = calculateKeywordDensity(allContent, keywords);
    const readabilityScore = calculateFleschKincaid(allContent);

    // Generate suggestions for improvements
    function generateSuggestions(pageData, keywords) {
      const suggestions = [];

      // Check for missing or multiple h1 tags
      if (!pageData.headings.h1 || pageData.headings.h1.length === 0) {
        suggestions.push('Add at least one H1 heading to improve SEO.');
      } else if (pageData.headings.h1.length > 1) {
        suggestions.push('Use only one H1 heading per page for better SEO.');
      }

      // Check keyword presence in headings
      const headingText = Object.values(pageData.headings).flat().join(' ').toLowerCase();
      keywords.forEach(keyword => {
        if (!headingText.includes(keyword.toLowerCase())) {
          suggestions.push(`Include the keyword "${keyword}" in your headings.`);
        }
      });

      // Check for images without alt tags
      if (pageData.altTags.length === 0) {
        suggestions.push('Add alt attributes to images for better accessibility and SEO.');
      }

      return suggestions;
    }

    // Generate suggestions for homepage and internal pages
    const homepageSuggestions = generateSuggestions(pageData, keywords);
    const internalPagesSuggestions = internalPagesData.map(p => ({
      url: p.url,
      suggestions: generateSuggestions(p.pageData, keywords),
    }));

    // Generate sample paragraph rewrite
    const sampleParagraph = content.split('\n').find(p => p.trim().length > 100) || '';
    const rewrittenParagraph = sampleParagraph ? await generateParagraphRewrite(sampleParagraph) : null;

    // 2. External API Calls (run in parallel for speed)
    const [pageSpeed, aiInsights] = await Promise.all([
        getPageSpeedData(url),
        generateAiInsights(allContent) // The single, powerful AI call
    ]);

    await browser.close();

    // Generate PDF report asynchronously
    const reportFilename = `report_${Date.now()}.pdf`;
    const outputPath = `./reports/${reportFilename}`;
    generatePdfReport({ url, keywords, analysis: {
      metaTags: pageData.meta,
      keywordDensity,
      pageSpeed,
      mobileFriendly: pageSpeed.mobileFriendly,
      readabilityScore,
      semanticClarity: aiInsights.semanticClarity || "AI analysis failed.",
      internalPages: internalPagesData,
      internalPagesSuggestions,
      homepageSuggestions,
      structuredDataPresent: hasStructuredData,
      sampleParagraph,
      rewrittenParagraph,
      aiInsights,
    }}, outputPath)
    .then(() => {
      console.log(`PDF report generated at ${outputPath}`);
    })
    .catch(err => {
      console.error('Failed to generate PDF report:', err);
    });

    const reportURL = `/reports/${reportFilename}`;
    // --- RESPONSE ---
    res.json({
      url,
      keywords,
      reportURL,
      analysis: {
        metaTags: pageData.meta,
        keywordDensity,
        pageSpeed,
        mobileFriendly: pageSpeed.mobileFriendly,
        readabilityScore,
        // Pull semanticClarity from the aiInsights object
        semanticClarity: aiInsights.semanticClarity || "AI analysis failed.",
        internalPages: internalPagesData,
        internalPagesSuggestions,
        homepageSuggestions,
        structuredDataPresent: hasStructuredData,
        sampleParagraph,
        rewrittenParagraph,
        // The rest of the AI insights
        aiInsights,
      },
    });

  } catch (error) {
    if (browser) await browser.close();
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze the website' });
  }
};
