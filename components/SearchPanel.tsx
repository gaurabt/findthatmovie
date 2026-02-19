'use client';
import React, { useState } from 'react';
import Searchbar from './SearchBar';
import SearchResults from './SearchResults';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function SearchPanel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // TODO: Add authentication context to display user-specific saved searches
  // TODO: Add language selector for multilingual support
  // TODO: Add filter panel for advanced search with genre, year, rating filters

  return (
    <>
      {/* Search Form Section */}
      <div className="w-full">
        <Searchbar setMovies={setMovies} />
      </div>

      {/* Results Section - Rendered separately below */}
      {movies.length > 0 && (
        <div className="w-full mt-16 py-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Search Results</h2>
          <SearchResults movies={movies} />
        </div>
      )}
    </>
  );
}
