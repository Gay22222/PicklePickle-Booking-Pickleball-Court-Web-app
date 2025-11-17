"use client";

import { useState } from "react";
import CourtCard from "../courts/CourtCard";
import Pagination from "./Pagination";

const mockCourts = Array.from({ length: 21 }).map((_, index) => ({
  id: index + 1,
  name: "PickleLand",
  rating: 4.2,
  reviews: 36,
  phone: "0943345543",
  address: "188 Ađ Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, HCM",
  timeRange: "6:00–22:00",
  price: "120.000đ/giờ",
  image: "/search/sample1.png",
}));

const PER_PAGE = 8; // mỗi trang 8 sân

export default function SearchResultsGrid() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockCourts.length / PER_PAGE);
  const startIndex = (currentPage - 1) * PER_PAGE;
  const currentCourts = mockCourts.slice(startIndex, startIndex + PER_PAGE);

  // chia 2 cột
  const mid = Math.ceil(currentCourts.length / 2);
  const leftColumn = currentCourts.slice(0, mid);
  const rightColumn = currentCourts.slice(mid);

  return (
    <div>
      {/* GRID 2 CỘT */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-dashed border-purple-200 p-3">
          <div className="space-y-3">
            {leftColumn.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-purple-200 p-3">
          <div className="space-y-3">
            {rightColumn.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
