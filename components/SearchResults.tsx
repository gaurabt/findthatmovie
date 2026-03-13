'use client';
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
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
    <div className="w-full flex justify-center px-4">
      <div className="w-full sm:w-[75%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              overview={movie.overview}
              posterPath={movie.poster_path || ''}
              backdropPath={movie.backdrop_path || ''}
              releaseDate={movie.release_date}
              voteAverage={movie.vote_average}
            />
          ))}
        </div>
      </div>
    </div>
  );
}