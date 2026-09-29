import { Link } from "@tanstack/react-router";

const NAV_ITEMS = [
  { label: "영화", to: "/" },
  { label: "검색", to: "/search" },
] as const;

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link className="header__logo" to="/">
          UM<span className="header__logo-accent">Cine</span>
        </Link>

        <nav className="header__nav" aria-label="주요 메뉴">
          <ul className="header__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  className="header__nav-link"
                  activeProps={{ className: "header__nav-link--active" }}
                  activeOptions={{ exact: item.to === "/" }}
                  to={item.to}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button type="button" className="header__button">
            로그인
          </button>
          <button
            type="button"
            className="header__button header__button--primary"
          >
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
}
