'use client';
import { useState, useRef, useEffect } from 'react';
import SearchPanel from "@/components/SearchPanel";
import SearchResults from "@/components/SearchResults";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

// TODO: Add language selector/switcher for multiple language support
// TODO: Add user authentication header/nav when user login feature is implemented
// TODO: Add navigation menu for saved searches and user preferences

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when movies are found
  useEffect(() => {
    if (movies.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [movies]);

  return (
    <>
      {/* Header and Search Section */}
      <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-4 sm:p-8 pb-16 sm:pb-20 gap-8 sm:gap-16">
        {/* Background gradient overlay */}
        <style>{`
          main::before {
            content: '';
            position: fixed;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.05), transparent 50%);
            pointer-events: none;
            z-index: -1;
          }
        `}</style>

        <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl mx-auto relative">
          <div className="w-full flex flex-col gap-4 sm:gap-6 items-center sm:items-start">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-['BBH_Sans_Hegarty',sans-serif] font-bold text-[var(--text-primary)] tracking-tight leading-tight sm:text-left text-center">
                Find That
                <br />
                <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] text-transparent bg-clip-text">Movie</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] sm:text-left text-center max-w-2xl font-['Inter',sans-serif] leading-relaxed">
              Lost a movie in your memory?{' '}
              <span className="text-[var(--text-primary)] font-semibold">Just describe what you remember</span> — our AI-powered search will match your description to the right film,{' '}
              <span className="text-[var(--accent-primary)] font-semibold">fast and easy</span>.
            </p>

            <div className="w-full mt-2 sm:mt-4">
              <SearchPanel onMoviesUpdate={setMovies} />
            </div>
          </div>
        </main>
      </div>

      {/* Results Section - Full Width */}
      {movies.length > 0 && (
        <div ref={resultsRef} className="w-full bg-[var(--bg-primary)] py-12 sm:py-16">
          <div className="w-full flex flex-col items-center gap-8 sm:gap-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[var(--text-primary)] px-4">Search Results</h2>
            <SearchResults movies={movies} />
          </div>
        </div>
      )}
    </>
  );
}
