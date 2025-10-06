import { NextResponse } from 'next/server';
import { searchMovies } from '@/utils/tmdb';
import { generateSearchTerms } from '@/utils/gemini';

export async function POST(request: Request) {
  // Check for required API keys
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    console.error('TMDB API key is missing in environment');
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 500 }
    );
  }

  try {
    const data = await request.json();
    const description = data?.description;
    console.log('Received description:', description);

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Generate search terms using Gemini AI
    console.log('Generating search terms with Gemini for description:', description);
    let searchTerms;
    let usingFallback = false;
    
    try {
      searchTerms = await generateSearchTerms(description);
      console.log('Gemini generated search terms:', searchTerms);
    } catch (error) {
      console.error('Gemini API failed, using description directly:', error);
      searchTerms = description;
      usingFallback = true;
    }

    // Search movies with generated terms
    console.log('Searching movies with terms:', searchTerms);
    const movies = await searchMovies(searchTerms);

    console.log('Search results:', {
      originalDescription: description,
      searchTerms,
      usingFallback,
      totalResults: movies.length,
      firstMovie: movies[0]?.title
    });

    // Return results with search metadata
    return NextResponse.json({
      success: true,
      movies,
      totalResults: movies.length,
      searchMetadata: {
        originalDescription: description,
        searchTerms,
        usingGemini: !usingFallback,
        usingFallback
      }
    });

  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to search movies',
        success: false
      },
      { status: 500 }
    );
  }
}