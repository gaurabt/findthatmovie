import Image from 'next/image';

interface MovieCardProps {
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
}

export default function MovieCard({
  title,
  overview,
  posterPath,
  backdropPath,
  releaseDate,
  voteAverage,
}: MovieCardProps) {
  // TODO: Add share functionality - implement share button for social media
  // TODO: Add save to favorites - persist to user account when authentication is implemented
  // TODO: Add related movies recommendations when recommendation feature is added

  // Image URL fallback chain: poster → backdrop → default placeholder
  const getImageUrl = () => {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    } else if (backdropPath) {
      return `https://image.tmdb.org/t/p/w500${backdropPath}`;
    } else {
      return '/no-poster.png';
    }
  };

  const hasNoPoster = !posterPath && !backdropPath;
  const ratingColor = voteAverage >= 7 ? 'text-yellow-400' : voteAverage >= 5 ? 'text-orange-400' : 'text-red-400';

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg shadow-lg hover:shadow-2xl hover:shadow-blue-900/50 overflow-hidden h-full flex flex-col transition-all duration-300 border border-[var(--border-color)] hover:border-[var(--accent-primary)] relative group">
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-[var(--bg-hover)] flex items-center justify-center">
        <Image
          src={getImageUrl()}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {hasNoPoster && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-hover)]/80 backdrop-blur-sm">
            <p className="text-[var(--text-secondary)] text-center font-semibold text-lg px-4">No Poster</p>
          </div>
        )}
      </div>
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[var(--text-primary)] line-clamp-2">{title}</h3>
        <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-1">
          Released: {new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
        <p className={`text-sm sm:text-base font-semibold mb-3 flex items-center gap-1 ${ratingColor}`}>
          ★ {voteAverage.toFixed(1)}/10
        </p>
        <p className="text-[var(--text-secondary)] line-clamp-3 text-sm flex-grow">{overview}</p>
      </div>
    </div>
  );
}