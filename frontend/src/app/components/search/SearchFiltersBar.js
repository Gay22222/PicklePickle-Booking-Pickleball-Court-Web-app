"use client";

import Image from "next/image";
import { useState } from "react";

export default function SearchFiltersBar() {
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [area, setArea] = useState("");

  const totalCourts = 10;
  const totalAreas = 50;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ keyword, date, startTime, endTime, area });
  };

  return (
    <div>
      {/* SEARCH BAR CONTAINER */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 md:flex-row md:items-center">
          {/* Tên sân */}
          <div className="flex flex-1 items-center gap-2 border-b border-zinc-200 pb-2 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <Image
              src="/search/searchIcon.svg"
              alt="Search"
              width={18}
              height={18}
            />
            <div className="flex-1">
              <p className="text-[11px] text-zinc-400">Tên sân</p>
              <input
                type="text"
                placeholder="PicklePickle"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full border-0 bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
              />
            </div>
            <button
              type="button"
              className="text-xs text-zinc-500 hover:text-zinc-700"
              onClick={() => setKeyword("")}
            >
              ×
            </button>
          </div>

          {/* Ngày */}
          <div className="flex flex-1 items-center gap-2 border-b border-zinc-200 pb-2 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <Image
              src="/search/calendarIcon.svg"
              alt="Calendar"
              width={18}
              height={18}
            />
            <div className="flex-1">
              <p className="text-[11px] text-zinc-400">Ngày</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-0 bg-transparent text-sm font-medium text-zinc-900 outline-none"
              />
            </div>
          </div>

          {/* Bắt đầu */}
          <div className="flex flex-1 items-center gap-2 border-b border-zinc-200 pb-2 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <Image
              src="/search/clockstartIcon.svg"
              alt="Start time"
              width={18}
              height={18}
            />
            <div className="flex-1">
              <p className="text-[11px] text-zinc-400">Bắt đầu</p>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border-0 bg-transparent text-sm font-medium text-zinc-900 outline-none"
              />
            </div>
          </div>

          {/* Kết thúc */}
          <div className="flex flex-1 items-center gap-2 md:pr-4">
            <Image
              src="/search/clockendIcon.svg"
              alt="End time"
              width={18}
              height={18}
            />
            <div className="flex-1">
              <p className="text-[11px] text-zinc-400">Kết thúc</p>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border-0 bg-transparent text-sm font-medium text-zinc-900 outline-none"
              />
            </div>
          </div>

          {/* Nút Search */}
          <div className="flex justify-end md:pl-2">
            <button
              type="submit"
              className="
                h-[44px] min-w-[120px] rounded-xl bg-zinc-800
                px-6 text-sm font-semibold text-white shadow-md
                transition-all duration-150
                hover:bg-zinc-900 hover:shadow-lg hover:scale-[1.02]
              "
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* HÀNG DƯỚI: Khu vực + summary */}
      <div className="mt-3 flex flex-col gap-2 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="
            w-full md:w-[15%]
            rounded-lg border border-zinc-200 bg-white
            px-3 py-2 text-xs text-zinc-800 shadow-sm
            outline-none hover:border-zinc-300
          "
        >
          <option value="">Khu vực</option>
          <option value="quan2">Quận 2</option>
          <option value="thuduc">Thủ Đức</option>
          <option value="quan7">Quận 7</option>
        </select>

        <p className="text-[11px] md:text-xs">
          {totalCourts} sân từ {totalAreas} khu vực
        </p>
      </div>
    </div>
  );
}
