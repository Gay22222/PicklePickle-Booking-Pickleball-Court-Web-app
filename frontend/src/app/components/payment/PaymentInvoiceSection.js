"use client";

import { useState, useMemo } from "react";

export default function PaymentInvoiceSection({ items }) {
    const [couponCode, setCouponCode] = useState("");

    // MOCK: tạm tính = tổng các dòng; giảm giá = 0
    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.amount, 0),
        [items]
    );
    const discount = 0; // sau này backend sẽ trả

    const handleApply = () => {
        // hiện tại chỉ mock, chưa làm gì
        console.log("Apply coupon (mock):", couponCode);
    };

    return (
        <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-black">Hóa đơn</h2>

            {/* Các dòng tiền: Tiền sân, Thuê vợt, ... */}
            <div className="space-y-1 text-sm">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between text-black"
                    >
                        <span>{item.label}</span>
                        <span>{item.amount.toLocaleString("vi-VN")} VND</span>
                    </div>
                ))}
            </div>

            {/* Mã giảm giá */}
            <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Mã giảm giá"
                        className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                    />
                    <button
                        type="button"
                        onClick={handleApply}
                        className="rounded-md bg-black px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-zinc-800"
                    >
                        ÁP DỤNG
                    </button>
                </div>

                {/* 👇 2 dòng bạn đang thiếu – Giảm giá + Tạm tính */}
                <div className="flex items-center justify-between text-sm text-black">
                    <span>Giảm giá:</span>
                    <span>{discount.toLocaleString("vi-VN")} VND</span>
                </div>

                <div className="flex items-center justify-between text-sm font-semibold text-black">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString("vi-VN")} VND</span>
                </div>

            </div>

            {/* Nút Thanh toán */}
            <div className="pt-2">
                <button
                    type="button"
                    className="mt-2 w-full rounded-md bg-[#4b4b4b] px-4 py-3 text-sm md:text-base font-semibold text-white hover:bg-black"
                >
                    Thanh toán
                </button>
            </div>
        </section>
    );
}
