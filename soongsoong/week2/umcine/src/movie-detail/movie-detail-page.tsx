import { useState, type FormEvent } from "react";
import type { Movie } from "../types/movie";
import type { Page } from "../types/app";
import "./movie-detail.css";

interface MovieDetailPageProps {
  movie: Movie;
  onNavigate: (page: Page) => void;
  onToggleBookmark: (movieId: number) => void;
}

const MAX_RATING = 5;

// App에서 key={movie.id}로 렌더링해서, 영화가 바뀌면 입력하던 평점이 초기화돼요.
export default function MovieDetailPage({
  movie,
  onNavigate,
  onToggleBookmark,
}: MovieDetailPageProps) {
  const {
    id,
    title,
    originalTitle,
    releaseDate,
    genres,
    runtime,
    posterPath,
    backdropPath,
    tagline,
    overview,
    isBookmarked,
  } = movie;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  function handleSelectRating(nextRating: number) {
    setRating(nextRating);
    setIsSaved(false);
  }

  function handleSubmitRating(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: 백엔드 API가 준비되면 rating, review를 서버에 저장해요.
    setIsSaved(true);
  }

  return (
    <main className="movie-detail">
      <section
        className="movie-detail-hero"
        style={{ backgroundImage: `url(${backdropPath})` }}
      >
        <div className="movie-detail-hero-inner">
          <button
            className="movie-detail-back"
            type="button"
            onClick={() => onNavigate({ name: "movie-list" })}
          >
            <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
            영화 목록
          </button>

          <div className="movie-detail-heading">
            <h1 className="movie-detail-title">{title}</h1>
            <p className="movie-detail-original-title">{originalTitle}</p>
            <p className="movie-detail-meta">
              <span>{releaseDate}</span>
              <span>{genres.join(" · ")}</span>
              <span>{runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="movie-detail-body">
        <img className="movie-detail-poster" src={posterPath} alt={`${title} 포스터`} />

        <section className="movie-detail-info">
          <h2 className="movie-detail-tagline">{tagline}</h2>
          <p className="movie-detail-overview">{overview}</p>
          <button
            className="movie-detail-bookmark"
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => onToggleBookmark(id)}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              width={24}
              height={24}
            />
            즐겨찾기
          </button>
        </section>

        <aside className="rating">
          <h2 className="rating-title">내 평점</h2>
          <p className="rating-hint">별점은 필수, 후기는 선택이에요.</p>

          <form onSubmit={handleSubmitRating}>
            <div className="rating-stars" role="radiogroup" aria-label="별점">
              {Array.from({ length: MAX_RATING }, (_, index) => {
                const star = index + 1;
                const isFilled = star <= rating;

                return (
                  <button
                    key={star}
                    className={isFilled ? "rating-star rating-star--filled" : "rating-star"}
                    type="button"
                    role="radio"
                    aria-checked={star === rating}
                    aria-label={`${star}점`}
                    onClick={() => handleSelectRating(star)}
                  >
                    <span className="rating-star-icon" />
                  </button>
                );
              })}
            </div>

            <textarea
              className="rating-review"
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              value={review}
              onChange={(event) => {
                setReview(event.target.value);
                setIsSaved(false);
              }}
            />

            <button className="rating-submit" type="submit" disabled={rating === 0}>
              평점 저장
            </button>
            {isSaved && <p className="rating-message">평점을 저장했어요.</p>}
          </form>
        </aside>
      </div>
    </main>
  );
}
