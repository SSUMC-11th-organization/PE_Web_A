import type { Movie } from "../types/movie";

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
          <span className="movie-card__bookmark-icon" aria-hidden="true" />
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
