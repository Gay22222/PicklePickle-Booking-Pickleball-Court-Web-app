"use client";

import { useState, useEffect } from "react";
import StatCard from "../../components/widgets/StatCard";
import BarChartWidget from "../../components/widgets/BarChart";
import DonutChartWidget from "../../components/widgets/DonutChart";
import LineChartWidget from "../../components/widgets/LineChart";
import { apiFetch } from "../../../../lib/apiClient";

// ---------- Mock data ----------

const MOCK_BOOKING_BY_TIME_SLOT = [
    { label: "5-7", value: 20 },
    { label: "7-9", value: 28 },
    { label: "9-11", value: 25 },
    { label: "11-13", value: 10 },
    { label: "13-15", value: 6 },
    { label: "15-17", value: 12 },
    { label: "17-19", value: 45 },
    { label: "19-21", value: 35 },
    { label: "21-23", value: 20 },
];

const MOCK_REVENUE_BY_MONTH = [
    { label: "T1", user: 30, revenue: 25 },
    { label: "T2", user: 45, revenue: 35 },
    { label: "T3", user: 48, revenue: 40 },
    { label: "T4", user: 32, revenue: 28 },
    { label: "T5", user: 24, revenue: 30 },
    { label: "T6", user: 55, revenue: 50 },
    { label: "T7", user: 70, revenue: 68 },
    { label: "T8", user: 82, revenue: 80 },
    { label: "T9", user: 95, revenue: 92 },
    { label: "T10", user: 88, revenue: 86 },
    { label: "T11", user: 75, revenue: 73 },
    { label: "T12", user: 68, revenue: 66 },
];

const MOCK_BOOKING_STATUS = [
    { name: "Hoàn thành", value: 150 },
    { name: "Đã huỷ", value: 20 },
];

const MOCK_SUMMARY = {
    totalRevenueThisMonth: 80000000,
    growthPercent: 12,
    totalBookingsThisMonth: 6560,
    activeCourtsPercent: 78,
};

// ---------- Small components ----------
function TabButton({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1 text-sm border-b-2 transition-colors ${active
                ? "border-sky-500 text-sky-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
        >
            {children}
        </button>
    );
}

function FilterChip({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${active
                ? "bg-sky-50 text-sky-600 border-sky-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
        >
            {children}
        </button>
    );
}

// ---------- Main Page ----------
export default function OwnerDashboardPage() {
    const [activeTab, setActiveTab] = useState("revenue");
    const [range, setRange] = useState("year");

    // state có mock fallback
    const [summary, setSummary] = useState(MOCK_SUMMARY);
    const [revenueByMonth, setRevenueByMonth] =
        useState(MOCK_REVENUE_BY_MONTH);
    const [bookingByTimeSlot, setBookingByTimeSlot] = useState(
        MOCK_BOOKING_BY_TIME_SLOT
    );
    const [bookingStatusData, setBookingStatusData] =
        useState(MOCK_BOOKING_STATUS);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [summaryRes, revenueRes, slotsRes, statusRes] =
                    await Promise.all([
                        apiFetch("/owner/dashboard/summary").catch(() => null),
                        apiFetch("/owner/dashboard/revenue?range=year").catch(
                            () => null
                        ),
                        apiFetch("/owner/dashboard/bookings?range=month").catch(
                            () => null
                        ),
                        apiFetch(
                            "/owner/dashboard/booking-status?range=month"
                        ).catch(() => null),
                    ]);

                // SUMMARY
                const summaryData =
                    summaryRes?.data && typeof summaryRes.data === "object"
                        ? summaryRes.data
                        : typeof summaryRes === "object"
                            ? summaryRes
                            : null;

                if (summaryData) {
                    setSummary((prev) => ({
                        ...prev,
                        ...summaryData,
                    }));
                }

                // REVENUE LINE CHART
                const revPayload =
                    revenueRes?.data && typeof revenueRes.data === "object"
                        ? revenueRes.data
                        : revenueRes;

                if (revPayload?.months && Array.isArray(revPayload.months)) {
                    const merged = revPayload.months.map((label, i) => ({
                        label,
                        user: revPayload.activeUsers?.[i] ?? 0,
                        revenue: revPayload.revenue?.[i] ?? 0,
                    }));
                    setRevenueByMonth(merged);
                }

                // BOOKINGS BY TIME SLOT (BAR) – luôn override nếu API trả mảng,
                // kể cả [] để không giữ mock khi không có data
                const slotsPayload =
                    Array.isArray(slotsRes?.data) || Array.isArray(slotsRes)
                        ? slotsRes.data || slotsRes
                        : null;

                if (Array.isArray(slotsPayload)) {
                    setBookingByTimeSlot(slotsPayload);
                }

                // BOOKING STATUS (DONUT)
                const statusPayload =
                    Array.isArray(statusRes?.data) || Array.isArray(statusRes)
                        ? statusRes.data || statusRes
                        : null;

                if (Array.isArray(statusPayload)) {
                    setBookingStatusData(statusPayload);
                }
            } catch (err) {
                console.error("Owner dashboard load error:", err);
                // nếu lỗi toàn bộ thì giữ nguyên mock
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const totalBookings = bookingStatusData.reduce(
        (sum, item) => sum + item.value,
        0
    );

    // Tính toán hiển thị từ summary
    const revenueNumber =
        summary.totalRevenueThisMonth ??
        summary.todayRevenue ??
        MOCK_SUMMARY.totalRevenueThisMonth;

    const growthPercent =
        typeof summary.growthPercent === "number"
            ? summary.growthPercent
            : MOCK_SUMMARY.growthPercent;

    const totalBookingsSummary =
        summary.totalBookingsThisMonth ??
        summary.todayBookings ??
        MOCK_SUMMARY.totalBookingsThisMonth;

    const activePercent = summary
        ? Math.round(summary.activeVenuePercent  || 0)
        : 0;

    if (loading) {
        return (
            <div className="p-6 text-gray-500 text-sm">
                Đang tải dữ liệu dashboard...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Hàng stat trên cùng */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Tổng doanh thu"
                    value={`${revenueNumber.toLocaleString("vi-VN")} VND`}
                    subtitle={
                        <>
                            Tăng so với tháng trước{" "}
                            <span
                                className={`font-semibold ${growthPercent >= 0
                                    ? "text-emerald-500"
                                    : "text-red-500"
                                    }`}
                            >
                                {growthPercent.toFixed(2)}%
                            </span>
                            <span
                                className={`ml-1 ${growthPercent >= 0
                                    ? "text-emerald-500"
                                    : "text-red-500"
                                    }`}
                            >
                                {growthPercent >= 0 ? "▲" : "▼"}
                            </span>
                        </>
                    }
                    extra={`Doanh thu ngày ${summary.todayRevenue
                        ? ` ${summary.todayRevenue.toLocaleString("vi-VN")} VND`
                        : " đang cập nhật"
                        }`}
                />

                <StatCard
                    title="Tổng lượt đặt sân"
                    value={totalBookingsSummary.toLocaleString("vi-VN")}
                    subtitle={
                        <span className="text-gray-500 text-xs">
                            Tổng lượt đặt sân trong tháng hiện tại
                        </span>
                    }
                />

                <StatCard
                    title="Số sân còn đang hoạt động"
                    value={`${activePercent}%`}
                    extra={
                        <div className="mt-2">
                            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${activePercent}%`,
                                        background:
                                            "linear-gradient(90deg, #00C9A7 0%, #4ADE80 100%)",
                                    }}
                                />
                            </div>
                        </div>
                    }
                />
            </section>

            {/* Khối chart dưới */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Tabs + Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 pt-4">
                    <div className="flex items-center gap-4">
                        <TabButton
                            active={activeTab === "revenue"}
                            onClick={() => setActiveTab("revenue")}
                        >
                            Doanh thu
                        </TabButton>
                        <TabButton
                            active={activeTab === "bookings"}
                            onClick={() => setActiveTab("bookings")}
                        >
                            Lượt đặt sân
                        </TabButton>
                    </div>

                    <div className="mt-3 md:mt-0 flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-2">
                            <FilterChip
                                active={range === "week"}
                                onClick={() => setRange("week")}
                            >
                                Tuần
                            </FilterChip>
                            <FilterChip
                                active={range === "month"}
                                onClick={() => setRange("month")}
                            >
                                Tháng
                            </FilterChip>
                            <FilterChip
                                active={range === "year"}
                                onClick={() => setRange("year")}
                            >
                                Năm
                            </FilterChip>
                        </div>

                        <div className="h-4 w-px bg-gray-200" />

                        {/* Date range mock (chưa nối API) */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded border border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                            >
                                Start date
                            </button>
                            <span className="text-gray-400">–</span>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded border border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                            >
                                End date
                            </button>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
                    <div className="xl:col-span-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            {activeTab === "bookings"
                                ? "Lượt đặt sân theo khung giờ"
                                : "Doanh thu theo tháng"}
                        </h3>

                        {activeTab === "bookings" ? (
                            <BarChartWidget data={bookingByTimeSlot} />
                        ) : (
                            <LineChartWidget data={revenueByMonth} />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Tình trạng đặt sân
                        </h3>

                        <div className="flex-1 flex items-center justify-center">
                            <DonutChartWidget data={bookingStatusData} />
                        </div>

                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                            {bookingStatusData.map((item, index) => {
                                const colors = ["#7C5CFC", "#FF9BB2"];
                                const total = totalBookings || 1;
                                return (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <span
                                            className="inline-block w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    colors[index % colors.length],
                                            }}
                                        />
                                        <span className="flex-1">{item.name}</span>
                                        <span className="text-gray-500">
                                            {item.value} (
                                            {((item.value / total) * 100).toFixed(2)}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
