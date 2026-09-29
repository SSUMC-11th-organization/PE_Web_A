import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onSelectMovie: (movieId: number) => void;
  // 넘기지 않으면 카드에 북마크 버튼을 보여주지 않아요.
  onToggleBookmark?: (movieId: number) => void;
}

export default function MovieGrid({ movies, onSelectMovie, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onSelectMovie={onSelectMovie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </ul>
  );
}
