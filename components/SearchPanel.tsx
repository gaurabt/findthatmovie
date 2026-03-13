'use client';
import React, { useState } from 'react';
import Searchbar from './SearchBar';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

interface SearchPanelProps {
  onMoviesUpdate: (movies: Movie[]) => void;
}

export default function SearchPanel({ onMoviesUpdate }: SearchPanelProps) {
  // TODO: Add authentication context to display user-specific saved searches
  // TODO: Add language selector for multilingual support
  // TODO: Add filter panel for advanced search with genre, year, rating filters

  return (
    <div className="w-full">
      <Searchbar onMoviesUpdate={onMoviesUpdate} />
    </div>
  );
}
