"use client";

import CourtCard from "../courts/CourtCard";
import Pagination from "../layout/Pagination";

export default function SearchResultsGrid({
  venues,
  currentPage,
  totalPages,
  onPageChange,
  loading,
}) {
  // Map venue -> court object cho CourtCard
  const mappedCourts = (venues ?? []).map((v) => {
    const primaryImage =
      (v.images || []).find((img) => img.isPrimary) ||
      (v.images || [])[0];

    return {
      id: v._id,
      name: v.name,
      rating: v.rating ?? 4.5,
      reviews: v.reviewCount ?? 0,
      phone: v.phone ?? "",
      address: v.address,
      timeRange: "06:00–23:00", // sau này lấy từ open-hours
      price: v.basePricePerHour
        ? `${v.basePricePerHour.toLocaleString("vi-VN")}đ/giờ`
        : "",
      image: primaryImage?.url || "/courts/sample1.png",
    };
  });


  const mid = Math.ceil(mappedCourts.length / 2);
  const leftColumn = mappedCourts.slice(0, mid);
  const rightColumn = mappedCourts.slice(mid);

  return (
    <div>
      {loading && (
        <p className="mb-2 text-sm text-zinc-500">Đang tải danh sách sân...</p>
      )}

      {/* GRID 2 CỘT */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-dashed border-purple-200 p-3">
          <div className="space-y-3">
            {leftColumn.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
            {!loading && leftColumn.length === 0 && rightColumn.length === 0 && (
              <p className="text-xs text-zinc-500">
                Không tìm thấy sân phù hợp.
              </p>
            )}
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
        onPageChange={onPageChange}
      />
    </div>
  );
}
