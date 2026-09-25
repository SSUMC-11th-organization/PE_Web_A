import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

const MOVIES_PER_PAGE = 10;

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));

  function handleToggleBookmark(id: number) {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  }

  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const pageMovies = movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  return (
    <>
      <Header />

      <main className="main">
        <section className="movie-section">
          <h2 className="movie-section__title">영화 목록</h2>

          <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
    </>
  );
}
