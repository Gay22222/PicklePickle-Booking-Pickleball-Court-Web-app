"use client";

import { useState } from "react";
import BookingHistoryList from "../components/bookings/history/BookingHistoryList";
import Pagination from "../components/layout/Pagination";
import BookingHistoryFilter from "../components/bookings/history/BookingHistoryFilter";

// Mock data giữ nguyên...
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
  },
];

const ITEMS_PER_PAGE = 7;

export default function BookingHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("oldest"); // hoặc "" nếu muốn

  const totalPages = Math.ceil(MOCK_BOOKINGS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = MOCK_BOOKINGS.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen w-full bg-[#f4f4f4]">
      <section className="max-w-[1120px] mx-auto pt-8 pb-16">
        {/* Sort bar dùng component mới */}
        <BookingHistoryFilter sort={sort} onChangeSort={setSort} />

        {/* List card */}
        <BookingHistoryList bookings={pageData} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
