import type { Word } from "$lib/types";

/**
 * Calculate the Optimal Recognition Point (ORP) for a given word.
 * The ORP is the character index that should be highlighted in red.
 * Based on user feedback:
 * - 1-2 chars: position 0 (first char)
 * - 3 chars: position 1 (middle)
 * - 4-8 chars: lean towards middle but nearer to front
 * - 9+ chars: position 2-5 is acceptable
 */
export function calculateORP(word: string): number {
  // Find the start and end of the actual word (alphanumeric characters)
  const firstAlphaMatch = word.match(/[a-zA-Z0-9]/);
  const lastAlphaMatch = word.match(/[a-zA-Z0-9][^a-zA-Z0-9]*$/);

  if (!firstAlphaMatch || !lastAlphaMatch) {
    return Math.floor(word.length / 2);
  }

  const startIdx = firstAlphaMatch.index!;
  const endIdx = lastAlphaMatch.index!;
  const cleanLen = endIdx - startIdx + 1;

  let cleanORP = 0;
  if (cleanLen <= 2) {
    cleanORP = 0;
  } else if (cleanLen === 3) {
    cleanORP = 1;
  } else if (cleanLen <= 8) {
    cleanORP = Math.floor(cleanLen / 3);
  } else {
    const ideal = Math.floor(cleanLen / 3);
    cleanORP = Math.min(Math.max(ideal, 2), 5);
  }

  return startIdx + cleanORP;
}

/**
 * Calculate pause duration in milliseconds based on word characteristics
 */
export function calculatePauseDuration(
  word: string,
  leadingPunctuation: string,
  trailingPunctuation: string
): number {
  let pause = 0;
  const allPunc = leadingPunctuation + trailingPunctuation;

  if (!allPunc && word.length < 8) return 0;

  // Pause at sentence endings
  if (/[.!/?]/.test(trailingPunctuation)) {
    pause += 300;
  }

  // Pause at hyphens, en dashes, em dashes, semicolons, colons
  if (/[—–\-;:]/.test(allPunc)) {
    pause += 200;
  }

  // Pause at quotation marks (various types: " “ ” „ « » )
  if (/["“”„«»]/.test(allPunc)) {
    pause += 200;
  }

  // Pause at parentheses and brackets
  if (/[()\[\]{}]/.test(allPunc)) {
    pause += 100;
  }

  // Pause at commas
  if (allPunc.includes(",")) {
    pause += 150;
  }

  // Extra pause for long words (8+ characters)
  if (word.length >= 8) {
    pause += 50;
  }
  if (word.length >= 12) {
    pause += 50;
  }

  return pause;
}

/**
 * Extract punctuation from both ends of a word
 */
function extractPunctuation(word: string): {
  cleanWord: string;
  leadingPunctuation: string;
  trailingPunctuation: string;
} {
  const leadingRegex = /^([([{"“„«'‘]+)/;
  const trailingRegex = /([.!?;,\-—–:)\]}"“”„«»'‘]+)$/;

  let leadingPunctuation = "";
  let trailingPunctuation = "";
  let cleanWord = word;

  const leadingMatch = word.match(leadingRegex);
  if (leadingMatch) {
    leadingPunctuation = leadingMatch[1];
    cleanWord = cleanWord.slice(leadingPunctuation.length);
  }

  const trailingMatch = cleanWord.match(trailingRegex);
  if (trailingMatch) {
    trailingPunctuation = trailingMatch[1];
    cleanWord = cleanWord.slice(0, -trailingPunctuation.length);
  }

  return { leadingPunctuation, trailingPunctuation, cleanWord };
}

/**
 * Parse text into an array of Word objects.
 * - Preserves quotation marks and diacritics
 * - Doesn't split on apostrophes (contractions)
 * - Calculates ORP and pause duration for each word
 */
export function parseText(text: string): Word[] {
  if (!text || !text.trim()) return [];

  // Split on whitespace while preserving the words
  const rawWords = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  return rawWords.map((rawWord) => {
    const { leadingPunctuation, trailingPunctuation } =
      extractPunctuation(rawWord);

    return {
      text: rawWord,
      orp: calculateORP(rawWord),
      pauseAfter: calculatePauseDuration(
        rawWord,
        leadingPunctuation,
        trailingPunctuation
      ),
      punctuation: trailingPunctuation, // Keep trailing for semantic punctuation field if needed
    };
  });
}
