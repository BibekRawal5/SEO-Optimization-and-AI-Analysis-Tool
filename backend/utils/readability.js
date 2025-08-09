export function calculateFleschKincaid(text) {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const syllables = countSyllables(text);

  if (sentences === 0 || words === 0) return 0;

  // Flesch-Kincaid Grade Level formula
  const score = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return Math.round(score * 100) / 100;
}

function countSyllables(text) {
  text = text.toLowerCase();
  if (text.length === 0) return 0;

  const words = text.split(/\s+/);
  let syllableCount = 0;

  for (const word of words) {
    syllableCount += countSyllablesInWord(word);
  }

  return syllableCount;
}

function countSyllablesInWord(word) {
  word = word.toLowerCase();
  if(word.length <= 3) { return 1; }
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}
