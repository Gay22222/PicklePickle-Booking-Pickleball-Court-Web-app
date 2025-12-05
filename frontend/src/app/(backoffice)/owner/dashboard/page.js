"use client";

import { useEffect, useState } from "react";

function formatVnd(v) {
    if (!v) return "0 VND";
    return v.toLocaleString("vi-VN") + " VND";
}

export default function OwnerDashboardPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            try {
                setLoading(true);
                const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

                const res = await fetch(`${API_BASE}/owner/dashboard/summary`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    console.error("Failed to load dashboard summary", res.status);
                    return;
                }

                const json = await res.json();
                setSummary(json.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-slate-800">
                Dashboard Chủ sân
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tổng doanh thu hôm nay */}
                <div className="bg-white rounded-xl shadow-sm border px-5 py-4">
                    <p className="text-xs uppercase text-slate-500 mb-2">Doanh thu hôm nay</p>
                    <p className="text-2xl font-semibold text-slate-900">
                        {loading || !summary ? "..." : formatVnd(summary.todayRevenue)}
                    </p>
                </div>

                {/* Lượt đặt sân hôm nay */}
                <div className="bg-white rounded-xl shadow-sm border px-5 py-4">
                    <p className="text-xs uppercase text-slate-500 mb-2">
                        Lượt đặt sân hôm nay
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                        {loading || !summary ? "..." : summary.todayBookings}
                    </p>
                </div>

                {/* Số sân đang hoạt động */}
                <div className="bg-white rounded-xl shadow-sm border px-5 py-4">
                    <p className="text-xs uppercase text-slate-500 mb-2">
                        Số sân đang hoạt động
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                        {loading || !summary ? "..." : summary.totalActiveCourts}
                    </p>
                </div>
            </div>

            {/* Sau này mình add thêm chart như mockup ở dưới */}
        </div>
    );
}
