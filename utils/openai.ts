import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple rate limiting
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms
const MAX_REQUESTS = 50; // Maximum requests per day
let requestCount = 0;
let windowStart = Date.now();

// Utility function for intelligent keyword extraction without AI
function extractKeywords(description: string): string {
  // Reset rate limit window if needed
  if (Date.now() - windowStart > RATE_LIMIT_WINDOW) {
    requestCount = 0;
    windowStart = Date.now();
  }
  
  const words = description.toLowerCase().split(' ');
  
  // Special handling for anime
  if (words.includes('anime')) {
    // If it looks like a title followed by "anime" (e.g., "your name anime")
    const titleWords = words.slice(0, words.indexOf('anime'));
    if (titleWords.length <= 3) {
      return titleWords.join(' ');
    }
  }
  
  // Extract potential year
  const yearMatch = description.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : '';
  
  // For short queries (likely a title), return as is
  if (words.length <= 3) {
    return year ? `${description}, ${year}` : description;
  }
  
  // For longer queries, extract key terms
  const keywords = words
    .filter(word => word.length > 2) // Skip short words
    .slice(0, 3) // Take first 3 meaningful words
    .join(' ');
    
  return year ? `${keywords}, ${year}` : keywords;
}

export async function generateSearchTerms(description: string) {
  try {
    if (!description?.trim()) {
      throw new Error('Description is required');
    }

    // Check rate limit
    if (requestCount >= MAX_REQUESTS) {
      console.log('OpenAI rate limit reached, using fallback search');
      return extractKeywords(description);
    }

    // Increment request count
    requestCount++;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a movie search term generator. BE VERY CONCISE. Return only essential keywords as comma-separated values.
For movies, prioritize in this order:
1. Exact title (both English and original if foreign film)
2. Release year
3. One key unique identifier (director/studio for anime)
Example input: "Your Name anime movie"
Example output: "Your Name, Kimi no Na wa, 2016"
KEEP IT SHORT - return maximum 3-4 terms.`
        },
        {
          role: "user",
          content: description
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3, // Lower temperature for more focused results
      max_tokens: 30,   // Reduced token limit to save credits
    });

    const searchTerms = completion.choices[0]?.message?.content;
    if (!searchTerms) {
      throw new Error('Failed to generate search terms');
    }

    return searchTerms;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    // If OpenAI fails, try to extract meaningful search terms from the description
    const words = description.split(' ');
    
    // If the description is short (likely a title), return it as is
    if (words.length <= 3) {
      return description;
    }

    // Look for years in the description (e.g., 2023, '99)
    const years = description.match(/\b(19|20)\d{2}\b|'\d{2}\b/g);
    const potentialTitle = words.slice(0, 3).join(' ');
    
    // If we found a year, combine it with the potential title
    if (years?.length) {
      return `${potentialTitle}, ${years[0]}`;
    }

    // Otherwise return just the potential title
    return potentialTitle;
  }
}