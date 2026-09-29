import { useState, type FormEvent } from "react";
import type { Movie } from "../types/movie";
import MovieGrid from "../movie-list/movie-grid";
import "../movie-list/movie-list.css";

interface SearchPageProps {
  movies: Movie[];
  onSelectMovie: (movieId: number) => void;
  onToggleBookmark: (movieId: number) => void;
}

export default function SearchPage({ movies, onSelectMovie, onToggleBookmark }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  // TODO: 검색 API가 준비되면 더미 데이터 필터링을 API 요청으로 바꿔요.
  const keyword = submittedQuery.toLowerCase();
  const results = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(keyword) ||
      movie.originalTitle.toLowerCase().includes(keyword),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  return (
    <main className="search">
      <h1 className="search-title">어떤 영화를 찾고 있나요?</h1>

      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <img className="search-form-icon" src="/icons/search.svg" alt="" width={24} height={24} />
        <input
          className="search-form-input"
          type="search"
          placeholder="예: 스파이더맨"
          aria-label="영화 제목"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="search-form-button" type="submit">
          검색
        </button>
      </form>

      {submittedQuery && (
        <section className="search-results">
          <h2 className="search-results-title">
            ‘{submittedQuery}’ 검색 결과 {results.length}편
          </h2>
          {results.length > 0 ? (
            <MovieGrid
              movies={results}
              onSelectMovie={onSelectMovie}
              onToggleBookmark={onToggleBookmark}
            />
          ) : (
            <p className="search-results-empty">검색 결과가 없어요.</p>
          )}
        </section>
      )}
    </main>
  );
}
