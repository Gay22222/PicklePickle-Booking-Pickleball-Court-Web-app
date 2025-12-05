"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  // Các route backoffice: không dùng header public
  const isBackoffice =
    pathname.startsWith("/owner") || pathname.startsWith("/admin");

  if (isBackoffice) {
    // (backoffice)/layout.js sẽ lo Topbar + Sidebar
    return (
        <>
        <Header />
    {children}</>);
  }

  // Layout phía user: Header + main
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
