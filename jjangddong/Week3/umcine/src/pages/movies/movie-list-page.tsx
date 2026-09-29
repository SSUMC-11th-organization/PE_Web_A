import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [movieList, setMovieList] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  function handleChangePage(page: number) {
    setCurrentPage(page);
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-8 pt-12 pb-20 max-lg:px-5 max-sm:pt-8">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.8px] max-sm:text-[26px]">
          영화 목록
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          지금 가장 주목받는 영화 {movieList.length}편을 만나 보세요.
        </p>
      </div>

      <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onChangePage={handleChangePage}
      />
    </main>
  );
}
