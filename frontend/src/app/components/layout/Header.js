"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const syncFromStorage = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("pp_token");
    const rawUser = localStorage.getItem("pp_user");

    if (token && rawUser) {
      try {
        const user = JSON.parse(rawUser);
        setIsLoggedIn(true);
        setUserName(user.fullName || user.email || "User");
      } catch {
        setIsLoggedIn(false);
        setUserName("");
      }
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  useEffect(() => {
    syncFromStorage();
    if (typeof window === "undefined") return;
    const handler = () => syncFromStorage();
    window.addEventListener("pp-auth-changed", handler);
    return () => window.removeEventListener("pp-auth-changed", handler);
  }, []);

  const handleLogout = (e) => {
    // tránh click logout cũng trigger vào avatar
    e.stopPropagation();
    if (typeof window !== "undefined") {
      localStorage.removeItem("pp_token");
      localStorage.removeItem("pp_user");
      window.dispatchEvent(new Event("pp-auth-changed"));
    }
    router.push("/login");
  };

  return (
    <header className="pp-header">
      <nav className="pp-header__inner">
        <Link href="/" className="pp-header__brand">
          <Image
            src="/Logo.svg"
            alt="PicklePickle logo"
            width={100}
            height={100}
            priority
            className="pp-header__logo"
          />
          <span className="pp-header__brand-text">PicklePickle</span>
        </Link>

        <div className="pp-header__right">
          {isLoggedIn ? (
            <>
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

              <button
                className="pp-header__icon-btn"
                type="button"
                onClick={() => router.push("/history")}
              >
                <Image
                  src="/historyIcon.svg"
                  alt="Lịch sử"
                  width={20}
                  height={20}
                  className="pp-header__icon"
                />
                <span>Lịch sử</span>
              </button>

              {/* CLICK AVATAR → PROFILE */}
              <div
                className="pp-header__user cursor-pointer"
                onClick={() => router.push("/account/profile")}
              >
                <div className="pp-header__avatar">
                  <Image
                    src="/Logo.svg"
                    alt={userName || "User"}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="pp-header__user-text">
                  Chào,&nbsp;
                  <span className="pp-header__user-name">
                    {userName || "User"}
                  </span>
                </span>

                <button
                  type="button"
                  className="pp-header__link pp-header__link--strong ml-3"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="pp-header__link pp-header__dropdown"
                type="button"
              >
                <span>Tin tức</span>
                <span className="pp-header__caret">▾</span>
              </button>

              <Link href="/login" className="pp-header__link">
                Đăng nhập
              </Link>

              <span className="pp-header__divider" />

              <Link
                href="/register"
                className="pp-header__link pp-header__link--strong"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
