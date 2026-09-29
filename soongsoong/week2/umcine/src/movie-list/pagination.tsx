interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        className="pagination-arrow"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
      >
        <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={
            page === currentPage
              ? "pagination-page pagination-page--active"
              : "pagination-page"
          }
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-arrow"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
      >
        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
      </button>
    </nav>
  );
}
