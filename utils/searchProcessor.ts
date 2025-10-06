interface MoviePattern {
  pattern: RegExp;
  handler: (matches: RegExpMatchArray, description: string) => string[];
}

// Common patterns in movie descriptions
const MOVIE_PATTERNS: MoviePattern[] = [
  // Anime pattern: "<title> anime"
  {
    pattern: /^(.+?)\s+anime/i,
    handler: (matches) => {
      const title = matches[1];
      // For anime titles, try both original and English patterns
      if (title.match(/^[A-Za-z\s]+$/)) {
        // If English title, add common Japanese title patterns
        return [title, `${title.toLowerCase().replace(/\s+/g, '')}`];
      }
      return [title];
    }
  },
  // Year pattern: "movie from <year>" or "released in <year>" or just "<year>"
  {
    pattern: /(?:from|in|released|year)?\s*((?:19|20)\d{2})/i,
    handler: (matches) => [matches[1]]
  },
  // Director pattern: "directed by <name>" or "by director <name>"
  {
    pattern: /(?:directed\s+by|director)\s+([A-Za-z\s]+)/i,
    handler: (matches) => [matches[1].trim()]
  },
  // Studio pattern: "by <studio>" or "from <studio>"
  {
    pattern: /(?:by|from)\s+((?:Studio\s+)?[A-Za-z]+)\s+(?:studios?|productions?|animations?)/i,
    handler: (matches) => [matches[1].trim()]
  },
  // Genre pattern: "<genre> movie/film"
  {
    pattern: /\b(action|comedy|drama|horror|thriller|sci-fi|animation|documentary)\s+(?:movie|film)/i,
    handler: (matches) => [matches[1]]
  },
  // Actor pattern: "starring <name>" or "with <name>"
  {
    pattern: /(?:starring|with)\s+([A-Za-z\s]+)/i,
    handler: (matches) => [matches[1].trim()]
  }
];

// Common stop words to filter out
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'movie', 'film', 'about', 'where', 'this', 'want', 'looking'
]);

function extractKeyPhrases(text: string): string[] {
  // Convert to lowercase for better matching
  const normalizedText = text.toLowerCase();
  
  // Array to store all extracted terms
  const terms: string[] = [];
  
  // First, check for any specific patterns
  MOVIE_PATTERNS.forEach(({ pattern, handler }) => {
    const matches = normalizedText.match(pattern);
    if (matches) {
      terms.push(...handler(matches, normalizedText));
    }
  });
  
  // If it's a very short query (likely a title), add it as is
  if (text.split(' ').length <= 3) {
    terms.unshift(text.trim());
    return terms;
  }
  
  // Split into words and filter stop words
  const words = normalizedText
    .split(/\s+/)
    .filter(word => !STOP_WORDS.has(word));
  
  // Extract potential key phrases (2-3 word combinations)
  for (let i = 0; i < words.length; i++) {
    // Single words (if they're long enough to be meaningful)
    if (words[i].length > 3) {
      terms.push(words[i]);
    }
    
    // Two-word phrases
    if (i < words.length - 1) {
      terms.push(`${words[i]} ${words[i + 1]}`);
    }
    
    // Three-word phrases
    if (i < words.length - 2) {
      terms.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }
  
  return Array.from(new Set(terms)); // Remove duplicates
}

export function generateSearchQueries(description: string): string {
  if (!description?.trim()) {
    throw new Error('Description is required');
  }

  const searchTerms = extractKeyPhrases(description);
  const words = description.toLowerCase().split(/\s+/);
  
  // If it's a very short query that looks like a title
  if (description.split(' ').length <= 3) {
    // Return the full description for exact matching
    return description;
  }
  
  // For queries with quotes, prioritize the quoted text
  const quotedMatch = description.match(/"([^"]+)"/);
  if (quotedMatch) {
    return quotedMatch[1];
  }

  // Check for specific patterns
  const yearMatch = description.match(/(?:19|20)\d{2}/);
  const genreMatch = description.match(/\b(action|adventure|comedy|drama|horror|thriller|sci-fi|science\s*fiction|animation|animated|documentary|romance|romantic|fantasy|superhero|musical|western|crime|mystery|family)\b/i);
  
  // Build search query based on patterns found
  let queryParts = [];
  
  // Add the first meaningful phrase (potential title or main concept)
  if (searchTerms.length > 0) {
    queryParts.push(searchTerms[0]);
  }
  
  // Add year if found
  if (yearMatch) {
    queryParts.push(yearMatch[0]);
  }
  
  // Add genre if found
  if (genreMatch) {
    queryParts.push(genreMatch[1]);
  }
  
  // If we have too few terms, add more meaningful phrases
  if (queryParts.length < 2 && searchTerms.length > 1) {
    queryParts.push(searchTerms[1]);
  }
  
  // For descriptions mentioning specific details (plot, characters, etc)
  const plotIndicators = ['about', 'where', 'story', 'plot', 'follows'];
  if (plotIndicators.some(indicator => words.includes(indicator))) {
    // Find the part after these indicators
    const plotPart = description
      .toLowerCase()
      .split(/\b(about|where|story|plot|follows)\b/)
      .pop()
      ?.trim()
      .split(/[,.]/)
      [0];
    
    if (plotPart && plotPart.length > 3) {
      queryParts.push(plotPart);
    }
  }
  
  // Return unique terms, prioritizing the most specific ones
  return Array.from(new Set(queryParts))
    .slice(0, 3)
    .join(', ');
}