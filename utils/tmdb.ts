const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

async function searchWithQuery(query: string): Promise<Movie[]> {
  try {
    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY is undefined');
      console.error('Available env vars:', {
        TMDB_API_KEY: !!process.env.NEXT_PUBLIC_TMDB_API_KEY,
        TMDB_API_URL: !!process.env.NEXT_PUBLIC_TMDB_API_URL
      });
      throw new Error('TMDB API key is not configured');
    }

    console.log('Searching with query:', query);

    const url = new URL(`${TMDB_BASE_URL}/search/movie`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('query', query);
    url.searchParams.append('language', 'en-US');
    url.searchParams.append('page', '1');
    url.searchParams.append('include_adult', 'false');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch {
        errorText = await response.text();
      }
      
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      });
      
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data: MovieSearchResponse = await response.json();
    if (!data || !Array.isArray(data.results)) {
      console.error('Invalid TMDB API response:', data);
      throw new Error('Invalid response from TMDB API');
    }

    console.log('TMDB API Response:', {
      total_results: data.total_results,
      page: data.page,
      total_pages: data.total_pages,
      results_count: data.results.length
    });
    
    return data.results;
  } catch (error) {
    console.error('Movie search error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
}

export async function searchMovies(queryInput: string): Promise<Movie[]> {
  // Split input into individual search terms
  const searchTerms = queryInput.split(',').map(term => term.trim());

  // Search with each term and combine results
  const searchPromises = searchTerms.map(term => searchWithQuery(term));
  const searchResults = await Promise.all(searchPromises);

  // Combine results and remove duplicates
  const uniqueMovies = new Map<number, Movie>();
  searchResults.flat().forEach(movie => {
    if (!uniqueMovies.has(movie.id)) {
      uniqueMovies.set(movie.id, movie);
    }
  });

  return Array.from(uniqueMovies.values());
}

export type { Movie };