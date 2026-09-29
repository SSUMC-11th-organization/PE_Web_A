import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import "../../App.css";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main className="main">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main className="detail">
      <div className="detail__backdrop">
        <img
          className="detail__backdrop-image"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="detail__body">
        <Link className="detail__back" to="/">
          영화 목록
        </Link>

        <div className="detail__content">
          <img
            className="detail__poster"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="detail__info">
            <h1 className="detail__title">{movie.title}</h1>
            <p className="detail__original-title">{movie.originalTitle}</p>
            <p className="detail__meta">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
            <h2 className="detail__tagline">{movie.tagline}</h2>
            <p className="detail__overview">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
