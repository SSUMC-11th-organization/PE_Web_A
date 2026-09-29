import type { Movie } from "../types/movie";

interface BookmarkIconProps {
  isBookmarked: boolean;
}

function BookmarkIcon({ isBookmarked }: BookmarkIconProps) {
  return (
    <svg
      className="movie-card__bookmark-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={isBookmarked ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster-box">
        <img
          className="movie-card__poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          loading="lazy"
        />

        <button
          type="button"
          className={
            movie.isBookmarked
              ? "movie-card__bookmark movie-card__bookmark--active"
              : "movie-card__bookmark"
          }
          aria-label={
            movie.isBookmarked
              ? `${movie.title} 북마크 해제`
              : `${movie.title} 북마크 추가`
          }
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <BookmarkIcon isBookmarked={movie.isBookmarked} />
        </button>

        <div className="movie-card__overlay">
          <p className="movie-card__tagline">{movie.tagline}</p>
          <p className="movie-card__overview">{movie.overview}</p>
        </div>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__original-title">{movie.originalTitle}</p>
        <p className="movie-card__meta">
          {movie.releaseDate} · {movie.runtime}
        </p>
        <ul className="movie-card__genres">
          {movie.genres.map((genre) => (
            <li key={genre} className="movie-card__genre">
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
