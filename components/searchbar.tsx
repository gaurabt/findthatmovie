'use client';
import React, { useState, useEffect } from 'react';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

interface SearchbarProps {
  onMoviesUpdate: (movies: Movie[]) => void;
}

export default function Searchbar({ onMoviesUpdate }: SearchbarProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // TODO: Add advanced filters state (genre, year, rating) for future filter enhancement
  // TODO: Add user authentication state for future saved searches functionality
  // TODO: Add language preference state for multiple language support

  // Clear results when search input is empty after a delay
  useEffect(() => {
    if (description.trim() === '') {
      const timeout = setTimeout(() => {
        onMoviesUpdate([]);
        setError('');
      }, 500); // Clear after 500ms

      return () => clearTimeout(timeout);
    }
  }, [description, onMoviesUpdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to search movies');
      }

      const data = await response.json();
      onMoviesUpdate(data.movies);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="w-full flex sm:justify-center mb-8">
        <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-3 sm:gap-2">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            name="description"
            placeholder="e.g., A space adventure with a lovable robot"
            className="flex-grow px-4 py-3 sm:py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent hover:border-[var(--accent-primary)] transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-6 sm:px-4 py-3 sm:py-2 bg-[var(--accent-primary)] text-white font-bold rounded-lg hover:bg-[var(--accent-hover)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 cursor-pointer transition-all duration-200 whitespace-nowrap ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="text-red-400 text-center mb-4 text-sm font-semibold">{error}</div>
      )}
    </div>
  );
};
