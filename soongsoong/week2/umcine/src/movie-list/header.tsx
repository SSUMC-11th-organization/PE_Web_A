import type { Page } from "../types/app";

interface HeaderProps {
  currentPage: Page;
  isLoggedIn: boolean;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export default function Header({ currentPage, isLoggedIn, onNavigate, onLogout }: HeaderProps) {
  const navItems: { label: string; page: Page; activePages: Page["name"][] }[] = [
    { label: "영화", page: { name: "movie-list" }, activePages: ["movie-list", "movie-detail"] },
    { label: "검색", page: { name: "search" }, activePages: ["search"] },
    {
      label: "내 정보",
      // 로그인하지 않았으면 내 정보 대신 로그인 화면으로 보내요.
      page: isLoggedIn ? { name: "my-page" } : { name: "login" },
      activePages: ["my-page"],
    },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <button
          className="header-logo"
          type="button"
          onClick={() => onNavigate({ name: "movie-list" })}
        >
          <span className="header-logo-icon">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          UMCine
        </button>

        <nav>
          <ul className="header-nav">
            {navItems.map((item) => {
              const isActive = item.activePages.includes(currentPage.name);

              return (
                <li key={item.label}>
                  <button
                    className={
                      isActive ? "header-nav-link header-nav-link--active" : "header-nav-link"
                    }
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onNavigate(item.page)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            className="header-search-button"
            type="button"
            aria-label="검색"
            onClick={() => onNavigate({ name: "search" })}
          >
            <img src="/icons/search.svg" alt="" width={24} height={24} />
          </button>
          {isLoggedIn ? (
            <button className="header-login-button" type="button" onClick={onLogout}>
              로그아웃
            </button>
          ) : (
            <button
              className="header-login-button"
              type="button"
              onClick={() => onNavigate({ name: "login" })}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
