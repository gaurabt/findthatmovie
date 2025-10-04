import Image from 'next/image';

interface MovieCardProps {
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
}

export default function MovieCard({
  title,
  overview,
  posterPath,
  releaseDate,
  voteAverage,
}: MovieCardProps) {
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : '/no-poster.png';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-[400px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">
          Released: {new Date(releaseDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Rating: {voteAverage.toFixed(1)}/10
        </p>
        <p className="text-gray-700 line-clamp-3">{overview}</p>
      </div>
    </div>
  );
}