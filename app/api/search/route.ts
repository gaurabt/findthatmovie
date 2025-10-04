import { NextResponse } from 'next/server';
import { searchMovies } from '@/utils/tmdb';
import { generateSearchTerms } from '@/utils/openai';

export const runtime = 'edge';

export async function POST(request: Request) {
  if (!process.env.TMDB_API_KEY) {
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

    // Try to generate optimized search terms using OpenAI
    console.log('Generating search terms for description:', description);
    let searchTerms;
    try {
      searchTerms = await generateSearchTerms(description);
      console.log('Generated search terms:', searchTerms);
    } catch (error) {
      console.warn('Failed to generate search terms:', error);
      // Fall back to direct search
      searchTerms = description;
    }

    // Search movies with generated terms
    console.log('Searching movies with terms:', searchTerms);
    const movies = await searchMovies(searchTerms);

    console.log('Search results:', {
      originalDescription: description,
      searchTerms,
      count: movies.length,
      firstMovie: movies[0]?.title
    });

    // Return results
    // Return results with search metadata
    return NextResponse.json({
      success: true,
      movies,
      totalResults: movies.length,
      searchMetadata: {
        originalDescription: description,
        searchTerms,
        usedOpenAI: searchTerms !== description
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