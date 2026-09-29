import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import "../../App.css";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="main">
      <div className="main__head">
        <h1 className="main__title">영화 검색</h1>
        <p className="main__subtitle">보고 싶은 영화의 제목을 검색해 보세요.</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-form__input"
          aria-label="검색어"
          placeholder="영화 제목 또는 원제를 입력하세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button className="search-form__button" type="submit">
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="search-empty">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="search-summary">
            <h2 className="search-summary__title">‘{query}’ 검색 결과</h2>
            <p className="search-summary__count">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <p className="search-empty">검색 결과가 없어요.</p>
          ) : (
            <ul className="search-results">
              {searchResults.map((movie) => (
                <li key={movie.id} className="search-result">
                  <img
                    className="search-result__poster"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    loading="lazy"
                  />
                  <div className="search-result__info">
                    <h3 className="search-result__title">{movie.title}</h3>
                    <p className="search-result__original-title">
                      {movie.originalTitle}
                    </p>
                    <p className="search-result__meta">{movie.releaseDate}</p>
                    <p className="search-result__overview">{movie.overview}</p>
                    <Link
                      className="search-result__link"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
