import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movieId: number) => void;
  onToggleBookmark?: (movieId: number) => void;
}

export default function MovieCard({ movie, onSelectMovie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <li className="movie-card">
      <div className="movie-card-poster">
        <button
          className="movie-card-open"
          type="button"
          aria-label={`${title} 상세 보기`}
          onClick={() => onSelectMovie(id)}
        >
          <img src={posterPath} alt="" />
        </button>
        {onToggleBookmark && (
          <button
            className={
              isBookmarked
                ? "movie-card-bookmark movie-card-bookmark--active"
                : "movie-card-bookmark"
            }
            type="button"
            aria-label={isBookmarked ? `${title} 북마크 해제` : `${title} 북마크`}
            aria-pressed={isBookmarked}
            onClick={() => onToggleBookmark(id)}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              width={24}
              height={24}
            />
          </button>
        )}
      </div>
      <h3 className="movie-card-title">
        <button type="button" onClick={() => onSelectMovie(id)}>
          {title}
        </button>
      </h3>
      <p className="movie-card-date">{releaseDate}</p>
    </li>
  );
}
