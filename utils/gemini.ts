import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateSearchTerms(description: string): Promise<string> {
  try {
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('GEMINI_API_KEY status:', apiKey ? 'Present' : 'Missing');
    console.log('API Key length:', apiKey?.length || 0);
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    if (!description?.trim()) {
      throw new Error('Description is required');
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using the stable model name

    // Create a focused prompt for movie search term generation
    const prompt = `You are a movie search expert. Given a movie description, identify the specific movie and generate the BEST single search term to find it.

Movie description: "${description}"

If you can identify the exact movie:
- Return ONLY the movie title (include year if helpful for disambiguation)
- If it's a non-English movie, include the English title

If you cannot identify the exact movie:
- Generate ONE specific search phrase that captures the most distinctive elements
- Focus on unique plot points, character names, or memorable scenes
- Avoid generic terms like "action", "comedy", "animated"

Examples:
- "animated movie from 2016 about body switching" → "Your Name"
- "sci-fi movie with dreams within dreams" → "Inception"
- "zombie movie with Will Smith" → "I Am Legend"
- "movie about a fish looking for his son" → "Finding Nemo"
- "robot movie with Wall-E" → "Wall-E"

Return ONLY ONE search term, nothing else:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const searchTerms = response.text().trim();

    if (!searchTerms) {
      throw new Error('No search terms generated');
    }

    return searchTerms;

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Improved fallback logic
    const words = description.toLowerCase().split(' ');
    
    // If the description is short (likely a title), return it as is
    if (words.length <= 4) {
      return description.trim();
    }

    // Look for movie-specific keywords and extract the most relevant phrase
    const movieKeywords = ['movie', 'film', 'anime', 'animation', 'documentary'];
    const actionWords = ['about', 'where', 'with', 'starring', 'directed', 'from'];
    
    // Try to extract the core description after action words
    for (const action of actionWords) {
      const actionIndex = words.indexOf(action);
      if (actionIndex !== -1 && actionIndex < words.length - 1) {
        // Take the next 2-4 words after the action word
        const relevantWords = words.slice(actionIndex + 1, actionIndex + 4);
        if (relevantWords.length > 0) {
          return relevantWords.join(' ');
        }
      }
    }
    
    // If no action words found, take the middle portion (skip common movie descriptors)
    const filteredWords = words.filter(word => 
      !movieKeywords.includes(word) && 
      word.length > 2 && 
      !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word)
    );
    
    // Return the first 2-3 meaningful words
    return filteredWords.slice(0, 3).join(' ');
  }
}