"use client";

import BookingHistoryList from "../components/bookings/history/BookingHistoryList";
import BookingHistoryFilter from "../components/bookings/history/BookingHistoryFilter";
import { MOCK_BOOKINGS } from "./mockBookings";
import { useState } from "react";

export default function BookingHistoryPage() {
  // Vì đây là server component, tạm thời viết dạng client sau khi có design:
  // Có thể đổi sang "use client" nếu cần interactive filter
  const bookings = MOCK_BOOKINGS;

  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1120px] mx-auto pt-8 pb-16">
        <header className="mb-6">
          <h1 className="text-xl font-semibold">Lịch sử đặt sân</h1>
          <p>Xem lại tất cả các lần bạn đã đặt sân trên PicklePickle.</p>
        </header>

        {/* Filter */}
        <BookingHistoryFilter
          activeStatus="all"
          onChangeStatus={() => {}}
        />

        {/* List */}
        <BookingHistoryList bookings={bookings} />
      </section>
    </main>
  );
}
