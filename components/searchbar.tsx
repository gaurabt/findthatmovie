'use client';
import React, { useState, useEffect } from 'react';

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Update searchTerm when input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    // Cleanup timeout if component unmounts or searchTerm changes
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Effect that runs when debouncedTerm changes
  useEffect(() => {
    if (debouncedTerm) {
      console.log('Making search with:', debouncedTerm);
      // Make your API call here
    }
  }, [debouncedTerm]);

  return(
          <div className="w-full flex justify-center sm:justify-start">
            <form action="" method="get" className="flex w-full max-w-xl gap-2">
              <input
                value={searchTerm}
                onChange={handleChange}
                type="text"
                name="q"
                placeholder="e.g., A space adventure with a lovable robot"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </form>
          </div>
  )
};
