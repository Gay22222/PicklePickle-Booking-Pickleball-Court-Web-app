"use client";

import { useState, useEffect } from "react";
import BookingHistoryList from "../components/bookings/history/BookingHistoryList";
import Pagination from "../components/layout/Pagination";
import BookingHistoryFilter from "../components/bookings/history/BookingHistoryFilter";

const ITEMS_PER_PAGE = 7;
const API_HISTORY_LIMIT = 100;

// Mock data fallback
const MOCK_BOOKINGS = [
  {
    id: "BK-0001",
    courtName: "PickleLand Thảo Điền",
    courtCode: "TREASURE9",
    date: "20/10/2025",
    startTime: "7:00 AM",
    endTime: "9:00 AM",
    statusLabel: "Sắp diễn ra",
    rating: 4.2,
    reviews: 36,
    imageUrl: "/history/mock1.png",
    isFavorite: false,
    _dateValue: new Date("2025-10-20").getTime(),
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// map 1 booking từ API -> card
function mapApiBookingToCard(b) {
  let startTime = "";
  let endTime = "";

  if (b.timeLabel && typeof b.timeLabel === "string") {
    const parts = b.timeLabel.split("-");
    if (parts.length === 2) {
      startTime = parts[0].trim();
      endTime = parts[1].trim();
    }
  }

  const dateObj = b.date
    ? new Date(b.date)
    : b.createdAt
    ? new Date(b.createdAt)
    : null;

  return {
    id: b.id || b.code,
    courtName: b.courtName || b.venueName || "Sân chưa rõ",
    courtCode: b.code || "",
    date: b.dateLabel || "",
    startTime,
    endTime,
    statusLabel: b.bookingStatusLabel || b.paymentStatusLabel || "",
    rating: 4.5,
    reviews: 50,
    imageUrl: "/history/mock1.png",
    isFavorite: false,
    _dateValue: dateObj ? dateObj.getTime() : 0,
  };
}

export default function BookingHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("oldest");
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!API_BASE) {
      console.error("NEXT_PUBLIC_API_BASE is not set");
      return;
    }

    let cancelled = false;

    async function fetchHistory() {
      try {
        setLoading(true);
        setAuthError("");

        // 🔑 LẤY TOKEN GIỐNG TRANG BOOKING
        // ưu tiên pptoken (như bạn nói), fallback sang pp_token
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("pptoken") ||
              localStorage.getItem("pp_token")
            : null;

        console.log("[History] token =", token);

        if (!token) {
          console.log("[History] No token -> dùng MOCK_BOOKINGS");
          return;
        }

        const url = `${API_BASE}/bookings/history?page=1&limit=${API_HISTORY_LIMIT}`;
        console.log("[History] calling:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json().catch(() => null);
        if (cancelled) return;

        if (!res.ok) {
          const msg = json?.message || `Error ${res.status}`;
          console.warn("[History] Error:", res.status, msg);

          if (res.status === 401) {
            setAuthError(
              (json && json.message) ||
                "Phiên đăng nhập đã hết hạn hoặc không hợp lệ."
            );
          }
          // Giữ mock
          return;
        }

        const wrapped = json?.data || json || {};
        const items = wrapped.items || wrapped.bookings || [];

        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map(mapApiBookingToCard);
          setBookings(mapped);
        } else {
          console.log("[History] API không trả booking nào, giữ mock");
        }
      } catch (err) {
        console.error("[History] Lỗi gọi /bookings/history:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  // sort theo lựa chọn
  const sortedBookings = [...bookings].sort((a, b) => {
    const av = a._dateValue || 0;
    const bv = b._dateValue || 0;
    if (sort === "newest") return bv - av;
    return av - bv;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedBookings.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = sortedBookings.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen w-full bg-[#f4f4f4]">
      <section className="max-w-[1120px] mx-auto pt-8 pb-16">
        <BookingHistoryFilter sort={sort} onChangeSort={setSort} />

        {authError && (
          <p className="mt-4 text-sm text-red-500">
            {authError} (đang hiển thị dữ liệu demo).
          </p>
        )}

        {loading ? (
          <div className="mt-8 text-sm text-[#666]">Đang tải lịch sử...</div>
        ) : (
          <BookingHistoryList bookings={pageData} />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
