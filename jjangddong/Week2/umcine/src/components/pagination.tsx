interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지 목록">
      <button
        type="button"
        className="pagination__arrow"
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onChangePage(currentPage - 1)}
      >
        <span className="pagination__arrow-icon pagination__arrow-icon--prev" />
      </button>

      <ul className="pagination__list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={
                page === currentPage
                  ? "pagination__page pagination__page--active"
                  : "pagination__page"
              }
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onChangePage(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination__arrow"
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        onClick={() => onChangePage(currentPage + 1)}
      >
        <span className="pagination__arrow-icon pagination__arrow-icon--next" />
      </button>
    </nav>
  );
}
