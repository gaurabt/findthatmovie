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
    const prompt = `You are a movie search expert. Given a movie description, generate the most effective search terms to find that specific movie.

Movie description: "${description}"

Generate 3-4 comma-separated search terms that would help find this exact movie. Focus on:
1. Exact title if clearly mentioned or if you can identify the movie
2. Year if mentioned
3. Director or key cast if obvious from description
4. Distinctive plot elements or themes

Be very specific and avoid generic terms. If you can identify the movie, include both English and original titles.

Examples:
- "animated movie from 2016 about body switching" → "Your Name, Kimi no Na wa, 2016, Makoto Shinkai"
- "sci-fi movie with dreams within dreams" → "Inception, 2010, Christopher Nolan, dream"
- "zombie movie with Will Smith" → "I Am Legend, 2007, Will Smith, zombie"

Return only the search terms, nothing else:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const searchTerms = response.text().trim();

    if (!searchTerms) {
      throw new Error('No search terms generated');
    }

    return searchTerms;

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback to basic extraction if Gemini fails
    const words = description.split(' ');
    
    // If the description is short (likely a title), return it as is
    if (words.length <= 3) {
      return description.trim();
    }

    // Look for year and extract key terms
    const yearMatch = description.match(/\b(19|20)\d{2}\b/);
    const genreMatch = description.match(/\b(animated?|anime|action|comedy|drama|horror|thriller|sci-?fi|romance|fantasy)\b/i);
    
    let fallbackTerms = [];
    
    // Add potential title (first few words)
    fallbackTerms.push(words.slice(0, Math.min(3, words.length)).join(' '));
    
    if (yearMatch) {
      fallbackTerms.push(yearMatch[0]);
    }
    
    if (genreMatch) {
      fallbackTerms.push(genreMatch[1].toLowerCase());
    }
    
    return fallbackTerms.join(', ');
  }
}