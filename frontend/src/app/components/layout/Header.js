"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Xác định có phải route backoffice không
  const isBackoffice =
    pathname.startsWith("/owner") || pathname.startsWith("/admin");

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
    e.stopPropagation();
    if (typeof window !== "undefined") {
      localStorage.removeItem("pp_token");
      localStorage.removeItem("pp_user");
      window.dispatchEvent(new Event("pp-auth-changed"));
    }
    router.push("/login");
  };

  // =========================
  //  HEADER BACKOFFICE
  // =========================
  if (isBackoffice) {
    // Label hiển thị bên phải: ADMIN hay CHỦ SÂN
    const roleLabel = pathname.startsWith("/admin") ? "ADMIN" : "CHỦ SÂN";
    const displayInitial =
      (userName && userName[0]?.toUpperCase()) || roleLabel[0];

    return (
      <header className="bg-[#032341] text-white h-12 flex items-center shadow-sm">
        <nav className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo + brand */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Image
              src="/Logo.svg"
              alt="PicklePickle logo"
              width={24}
              height={24}
              priority
            />
            <span className="text-sm font-semibold tracking-wide">
              PicklePickle
            </span>
          </button>

          {/* Icons + role */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-[#04152c] transition-colors"
            >
              <Image
                src="/Search.svg"
                alt="Tìm kiếm"
                width={18}
                height={18}
              />
            </button>

            {/* Help */}
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-[#04152c] transition-colors"
            >
              <Image
                src="/QuestionCircle.svg"
                alt="Trợ giúp"
                width={18}
                height={18}
              />
            </button>

            {/* Bell + badge */}
            {/* Bell + badge */}
            <button
              type="button"
              className="relative p-1.5 rounded-full hover:bg-[#04152c] transition-colors"
            >
              <Image
                src="/Bell.svg"
                alt="Thông báo"
                width={18}
                height={18}
              />

              

            </button>




            {/* Avatar + role label (ADMIN / CHỦ SÂN) */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-xs font-semibold">
                {displayInitial}
              </div>
              <span className="text-xs font-semibold uppercase">
                {roleLabel}
              </span>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // =========================
  //  HEADER USER (PUBLIC) – GIỮ NGUYÊN
  // ========================= :contentReference[oaicite:0]{index=0}
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
