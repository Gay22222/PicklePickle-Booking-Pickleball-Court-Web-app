// src/app/components/layout/Header.js
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const isLoggedIn = true;
  const userName = "Mr Pickle";

  return (
    <header className="pp-header">
      <nav className="pp-header__inner">
        {/* Logo + brand */}
        <Link href="/" className="pp-header__brand">
          <Image
            src="/Logo.svg"
            alt="PicklePickle logo"
            width={80}
            height={80}
            priority
            className="pp-header__logo"
          />
          <span className="pp-header__brand-text">PicklePickle</span>
        </Link>

        {/* Right side */}
        <div className="pp-header__right">
          {isLoggedIn ? (
            <>
              {/* Thông báo */}
              <button className="pp-header__icon-btn" type="button">
                <Image
                  src="/notificationIcon.svg"
                  alt="Thông báo"
                  width={20}
                  height={20}
                  className="pp-header__icon"
                />
                <span>Thông báo</span>
              </button>

              {/* Lịch sử */}
              <button className="pp-header__icon-btn" type="button">
                <Image
                  src="/historyIcon.svg"
                  alt="Lịch sử"
                  width={20}
                  height={20}
                  className="pp-header__icon"
                />
                <span>Lịch sử</span>
              </button>

              {/* User */}
              <div className="pp-header__user">
                <div className="pp-header__avatar">
                  <Image
                    src="/Logo.svg"
                    alt={userName}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="pp-header__user-text">
                  Chào,&nbsp;
                  <span className="pp-header__user-name">{userName}</span>
                </span>
              </div>
            </>
          ) : (
            <>
              <button className="pp-header__link pp-header__dropdown" type="button">
                <span>Tin tức</span>
                <span className="pp-header__caret">▾</span>
              </button>

              <Link href="/login" className="pp-header__link">
                Đăng nhập
              </Link>

              <span className="pp-header__divider" />

              <Link href="/register" className="pp-header__link pp-header__link--strong">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
