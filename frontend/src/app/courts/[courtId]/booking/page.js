"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

// Tạo list giờ 05:00 -> 22:00
const HOURS = Array.from({ length: 18 }, (_, idx) => {
    const hour = 5 + idx;
    return `${hour.toString().padStart(2, "0")}:00`;
});

// ❗Sau này bạn thay MOCK_COURTS bằng list sân lấy từ DB
const MOCK_COURTS = ["Sân 1", "Sân 2", "Sân 3", "Sân 4", "Sân 5", "Sân 6"];

// mock các slot đã được đặt sẵn (màu vàng)
const MOCK_BOOKED = new Set([
    "Sân 3-08:00",
    "Sân 3-09:00",
    "Sân 2-14:00",
    "Sân 2-15:00",
    "Sân 2-16:00",
    "Sân 3-17:00",
    "Sân 3-18:00",
    "Sân 4-15:00",
    "Sân 4-16:00",
    "Sân 5-06:00",
    "Sân 5-07:00",
    "Sân 5-18:00",
    "Sân 5-19:00",
]);

const COURT_NAME_BY_ID = {
    "pickoland-thao-dien": "PickoLand Thảo Điền",
};

export default function CourtBookingTimePage() {
    const params = useParams(); // ✅ lấy params trên client
    const courtId = params?.courtId;
    const router = useRouter();

    const courtName = COURT_NAME_BY_ID[courtId] ?? "PickoLand Thảo Điền";

    // ✅ Lưu Date thực, không phải string
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [selectedSlots, setSelectedSlots] = useState([]); // ["Sân 1-05:00", ...]
    const courts = MOCK_COURTS; // sau này: const courts = dataFromDB.courts;

    const formattedDate = currentDate.toLocaleDateString("vi-VN");

    const handlePrevDate = () => {
        setCurrentDate((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() - 1);
            return next;
        });
    };

    const handleNextDate = () => {
        setCurrentDate((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + 1);
            return next;
        });
    };

    const toggleSlot = (courtLabel, hour) => {
        const key = `${courtLabel}-${hour}`;
        if (MOCK_BOOKED.has(key)) return; // không cho chọn slot đã đặt

        setSelectedSlots((prev) => {
            const set = new Set(prev);
            if (set.has(key)) set.delete(key);
            else set.add(key);
            return Array.from(set);
        });
    };

    const handleSubmit = () => {
        const slotsParam = selectedSlots.join(",");
        router.push(
            `/courts/${courtId}/booking/addons?date=${encodeURIComponent(
                formattedDate
            )}&slots=${encodeURIComponent(slotsParam)}`
        );
    };

    const totalPrice = selectedSlots.length * 100000; // mock 100k/slot

    return (
        <main className="min-h-screen bg-[#f5f7fb]">
            <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
                {/* TITLE */}
                <h1 className="text-center text-2xl md:text-3xl font-semibold text-black">
                    Tình trạng đặt sân {courtName}
                </h1>

                {/* CARD */}
                <div className="rounded-3xl bg-[#f7f7f7] border border-[#e5e5e5] px-6 py-7 md:px-10 md:py-8 space-y-6">
                    {/* DATE + ARROWS */}
                    {/* DATE + ARROWS */}
                    <div className="flex items-center justify-center gap-6 text-sm font-medium text-black">
                        <button
                            type="button"
                            onClick={handlePrevDate}
                            className="flex items-center justify-center cursor-pointer transition hover:opacity-80 hover:scale-110"
                        >
                            <Image
                                src="/courts/prevIcon1.svg"
                                alt="Ngày trước"
                                width={20}
                                height={20}
                            />
                        </button>

                        <span>{formattedDate}</span>

                        <button
                            type="button"
                            onClick={handleNextDate}
                            className="flex items-center justify-center cursor-pointer transition hover:opacity-80 hover:scale-110"
                        >
                            <Image
                                src="/courts/nextIcon1.svg"
                                alt="Ngày sau"
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>


                    {/* LEGEND */}
                    <div className="flex items-center justify-center gap-6 text-sm text-black">
                        <LegendItem
                            colorClass="bg-white border border-[#dcdcdc]"
                            label="Trống"
                        />
                        <LegendItem colorClass="bg-[#ffe94d]" label="Đã đặt" />
                        <LegendItem colorClass="bg-[#7fd321]" label="Đang chọn" />
                    </div>

                    {/* TIME GRID */}
                    <div className="rounded-3xl bg-white border border-[#e5e5e5] px-4 py-5">
                        <div className="overflow-x-auto">
                            <div className="min-w-[900px]">
                                {/* header row */}
                                <div className="grid grid-cols-[90px_repeat(18,minmax(0,1fr))] gap-1 text-[11px] text-center text-black mb-2">
                                    <div />
                                    {HOURS.map((h) => (
                                        <div key={h}>{h}</div>
                                    ))}
                                </div>

                                {/* court rows – dynamic theo số sân */}
                                <div className="space-y-1">
                                    {courts.map((courtLabel) => (
                                        <div
                                            key={courtLabel}
                                            className="grid grid-cols-[90px_repeat(18,minmax(0,1fr))] gap-1 items-center"
                                        >
                                            <div className="text-[13px] font-medium text-left text-black">
                                                {courtLabel}
                                            </div>

                                            {HOURS.map((hour) => {
                                                const key = `${courtLabel}-${hour}`;
                                                const isBooked = MOCK_BOOKED.has(key);
                                                const isSelected = selectedSlots.includes(key);

                                                let bg = "bg-white";
                                                if (isBooked) bg = "bg-[#ffe94d]";
                                                if (isSelected) bg = "bg-[#7fd321]";

                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        disabled={isBooked}
                                                        onClick={() => toggleSlot(courtLabel, hour)}
                                                        className={`h-7 rounded-[6px] border border-[#dcdcdc] ${bg} transition hover:border-[#b3b3b3] disabled:cursor-not-allowed`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* TOTAL PRICE */}
                        <div className="mt-4 flex justify-end text-sm md:text-base font-semibold text-black">
                            Tổng tiền:&nbsp;
                            <span>
                                {totalPrice.toLocaleString("vi-VN")} đ
                            </span>
                        </div>
                    </div>

                    {/* CTA BUTTON */}
                    <div className="flex justify-center pt-2">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={selectedSlots.length === 0}
                            className="w-full max-w-xs rounded-full bg-[#2ecc3b] px-10 py-3 text-sm md:text-base font-semibold text-white shadow-md transition hover:bg-[#27b834] disabled:bg-[#c4c4c4] disabled:cursor-not-allowed"
                        >
                            ĐẶT SÂN NGAY
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

/* ---------- Sub component ---------- */

function LegendItem({ colorClass, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`h-4 w-7 rounded-[8px] ${colorClass}`} />
            <span className="text-[13px] text-black">{label}</span>
        </div>
    );
}
