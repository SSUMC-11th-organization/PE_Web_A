const NAV_ITEMS = ["홈", "영화", "TV 프로그램", "인기", "찜한 목록"];

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="/">
          UM<span className="header__logo-accent">Cine</span>
        </a>

        <nav className="header__nav" aria-label="주요 메뉴">
          <ul className="header__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  className={
                    item === "영화"
                      ? "header__nav-link header__nav-link--active"
                      : "header__nav-link"
                  }
                  href="/"
                >
                  {item}
                </a>
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
