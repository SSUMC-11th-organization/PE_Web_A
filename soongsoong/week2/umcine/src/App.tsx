import { useState } from "react";
import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";
import type { Page, User } from "./types/app";
import Header from "./movie-list/header";
import MovieGrid from "./movie-list/movie-grid";
import Pagination from "./movie-list/pagination";
import MovieDetailPage from "./movie-detail/movie-detail-page";
import SearchPage from "./search/search-page";
import LoginPage from "./auth/login-page";
import SignupPage from "./auth/signup-page";
import MyPage from "./my-page/my-page";
import "./movie-list/movie-list.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState<Page>({ name: "movie-list" });
  const [user, setUser] = useState<User | null>(null);

  function handleNavigate(nextPage: Page) {
    setPage(nextPage);
    window.scrollTo(0, 0);
  }

  function handleSelectMovie(movieId: number) {
    handleNavigate({ name: "movie-detail", movieId });
  }

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  function handleLogin(nextUser: User) {
    setUser(nextUser);
    handleNavigate({ name: "my-page" });
  }

  function handleLogout() {
    setUser(null);
    handleNavigate({ name: "movie-list" });
  }

  function renderPage() {
    switch (page.name) {
      case "movie-list":
        return (
          <main className="movie-list">
            <h1 className="movie-list-title">영화 목록</h1>
            <MovieGrid
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onToggleBookmark={handleToggleBookmark}
            />
            <Pagination currentPage={1} totalPages={1} />
          </main>
        );
      case "movie-detail": {
        const movie = movies.find((item) => item.id === page.movieId);
        if (!movie) {
          return null;
        }
        return (
          <MovieDetailPage
            key={movie.id}
            movie={movie}
            onNavigate={handleNavigate}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      }
      case "search":
        return (
          <SearchPage
            movies={movies}
            onSelectMovie={handleSelectMovie}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case "login":
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case "signup":
        return <SignupPage onNavigate={handleNavigate} />;
      case "my-page":
        if (!user) {
          return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
        }
        return (
          <MyPage
            user={user}
            bookmarkedMovies={movies.filter((movie) => movie.isBookmarked)}
            onSelectMovie={handleSelectMovie}
            onSaveUser={setUser}
            onWithdraw={handleLogout}
          />
        );
    }
  }

  const hasFooter =
    page.name === "movie-list" || page.name === "movie-detail" || page.name === "my-page";

  return (
    <div className="page">
      <Header
        currentPage={page}
        isLoggedIn={user !== null}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      {renderPage()}
      {hasFooter && (
        <footer className="footer">
          <div className="footer-inner">
            <img src="/images/logos/tmdb-logo.svg" alt="TMDB" height={10} />
            <p>
              This product uses the TMDB API but is not endorsed or certified by{" "}
              <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
                TMDB
              </a>
              .
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
