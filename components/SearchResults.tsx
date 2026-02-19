'use client';
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface seaerchResultsProps {
  movies: Movie[];
}

export default function SearchResults( { movies }: seaerchResultsProps ) {
  // TODO: Add recommendation engine to show similar movies based on current results
  // TODO: Add filtering controls UI for genre, year, and rating filters
  // TODO: Add sorting options (by rating, release date, etc.)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          overview={movie.overview}
          posterPath={movie.poster_path || ''}
          releaseDate={movie.release_date}
          voteAverage={movie.vote_average}
        />
      ))}
    </div>
  );
}