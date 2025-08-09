
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export function generatePdfReport(analysisData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      // Ensure the directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      doc.fontSize(20).text('SEO AI Analysis Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`URL: ${analysisData.url}`);
      doc.text(`Keywords: ${analysisData.keywords.join(', ')}`);
      doc.moveDown();

      const analysis = analysisData.analysis;

      doc.fontSize(16).text('Meta Tags:');
      doc.fontSize(12).text(`Title: ${analysis.metaTags.title || 'N/A'}`);
      doc.text(`Description: ${analysis.metaTags.description || 'N/A'}`);
      doc.moveDown();

      doc.fontSize(16).text('Keyword Density:');
      for (const [keyword, density] of Object.entries(analysis.keywordDensity)) {
        doc.text(`${keyword}: ${density.toFixed(2)}%`);
      }
      doc.moveDown();

      doc.fontSize(16).text('Page Speed Score:');
      doc.fontSize(12).text(`${analysis.pageSpeed.score !== null ? analysis.pageSpeed.score : 'N/A'}`);
      doc.moveDown();

      doc.fontSize(16).text('Readability Score:');
      doc.fontSize(12).text(`${analysis.readabilityScore.toFixed(2)}`);
      doc.moveDown();

      doc.fontSize(16).text('Semantic Clarity:');
      doc.fontSize(12).text(analysis.semanticClarity || 'N/A');
      doc.moveDown();

      doc.fontSize(16).text('Suggestions for Homepage:');
      analysis.homepageSuggestions.forEach((suggestion, idx) => {
        doc.text(`${idx + 1}. ${suggestion}`);
      });
      doc.moveDown();

      doc.fontSize(16).text('AI Summary:');
      doc.fontSize(12).text(analysis.aiInsights.aiSummary || 'N/A');
      doc.moveDown();

      doc.fontSize(16).text('Optimized Meta Title:');
      doc.fontSize(12).text(analysis.aiInsights.optimizedTitle || 'N/A');
      doc.moveDown();

      doc.fontSize(16).text('Optimized Meta Description:');
      doc.fontSize(12).text(analysis.aiInsights.optimizedDescription || 'N/A');
      doc.moveDown();

      doc.fontSize(16).text('Suggested FAQs:');
      analysis.aiInsights.suggestedFaqs.forEach((faq, idx) => {
        doc.text(`${idx + 1}. Q: ${faq.question}`);
        doc.text(`   A: ${faq.answer}`);
      });
      doc.moveDown();

      doc.fontSize(16).text('Sample Paragraph Rewrite:');
      doc.fontSize(12).text(`Original: ${analysis.sampleParagraph || 'N/A'}`);
      doc.moveDown();
      doc.fontSize(12).text(`Rewritten: ${analysis.rewrittenParagraph || 'N/A'}`);

      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });
    } catch (error) {
      reject(error);
    }
  });
}
