// frontend/src/app/(backoffice)/components/layout/SidebarNav.js
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";

// Menu cho chủ sân
const ownerMenuItems = [
    {
        label: "Trang chủ",
        href: "/owner/dashboard",
        icon: "/backoffice/dashboardIcon.svg",
    },
    {
        label: "Quản lý đặt sân",
        href: "/owner/bookings",
        icon: "/backoffice/managecourtIcon.svg",
    },
    {
        label: "Quản lý phụ kiện",
        href: "/owner/addons",
        icon: "/backoffice/manageaddonsIcon.svg",
    },
    {
        label: "Quản lý content",
        href: "/owner/content",
        icon: "/backoffice/managecontentIcon.svg",
    },
    {
        label: "Báo cáo và phân tích",
        icon: "/backoffice/reportIcon.svg",
        type: "group",
        children: [
            { label: "Doanh thu", href: "/owner/reports/revenue" },
            { label: "Đặt sân", href: "/owner/reports/bookings" },
        ],
    },
];

// Menu cho admin
const adminMenuItems = [
    {
        label: "Trang chủ",
        href: "/admin/dashboard",
        icon: "/backoffice/dashboardIcon.svg",
    },
    {
        label: "Quản lý sân & nhà cung cấp",
        href: "/admin/venues",
        icon: "/backoffice/managecourtIcon.svg",
    },
    {
        label: "Quản lý đặt sân",
        href: "/admin/bookings",
        icon: "/backoffice/manageaddonsIcon.svg",
    },
    {
        label: "Quản lý người dùng",
        href: "/admin/users",
        icon: "/backoffice/managecontentIcon.svg",
    },
    {
        label: "Báo cáo và phân tích",
        icon: "/backoffice/reportIcon.svg",
        type: "group",
        children: [
            { label: "Tổng quan", href: "/admin/reports" },
            { label: "Doanh thu", href: "/admin/reports/revenue" },
        ],
    },
];

export default function SidebarNav() {
    const pathname = usePathname();

    // xác định đang ở role nào
    const isAdmin = pathname.startsWith("/admin");
    const menuItems = useMemo(
        () => (isAdmin ? adminMenuItems : ownerMenuItems),
        [isAdmin]
    );

    const [collapsed, setCollapsed] = useState(false);
    const [reportOpen, setReportOpen] = useState(true);

    return (
        <aside
            className={`relative bg-white border-r shadow-sm flex flex-col transition-all duration-200
      ${collapsed ? "w-16" : "w-64"} h-screen`}
        >
            {/* MENU */}
            <nav className="flex-1 overflow-y-auto pt-4 pb-6">
                {menuItems.map((item) => {
                    // --- Group: Báo cáo & phân tích ---
                    if (item.type === "group") {
                        const isAnyChildActive =
                            item.children?.some((child) => pathname.startsWith(child.href)) ??
                            false;

                        return (
                            <div key={item.label}>
                                <button
                                    type="button"
                                    onClick={() => setReportOpen((v) => !v)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${isAnyChildActive
                                        ? "bg-sky-50 text-gray-900 font-medium"
                                        : "text-gray-800 hover:bg-sky-50"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            width={18}
                                            height={18}
                                        />
                                        {!collapsed && <span>{item.label}</span>}
                                    </span>

                                    {!collapsed && (
                                        <span className="text-xs text-gray-500">
                                            {reportOpen ? "▴" : "▾"}
                                        </span>
                                    )}
                                </button>

                                {!collapsed && reportOpen && (
                                    <div className="mt-1 mb-1">
                                        {item.children.map((child) => {
                                            const active = pathname.startsWith(child.href);
                                            return (
                                                <div
                                                    key={child.href}
                                                    className="mb-1"
                                                    style={{ marginLeft: "64px" }}   // 👈 thụt vào ~ 1 tab
                                                >
                                                    <Link
                                                        href={child.href}
                                                        className={`text-sm leading-6 cursor-pointer ${active
                                                                ? "text-sky-600 font-medium"
                                                                : "text-gray-700 hover:text-sky-600"
                                                            }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}



                            </div>
                        );
                    }

                    // --- Item thường ---
                    const active = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition-colors
                ${active
                                    ? "bg-sky-50 text-gray-900 font-medium"
                                    : "text-gray-800 hover:bg-sky-50"
                                }`}
                        >
                            <Image
                                src={item.icon}
                                alt={item.label}
                                width={18}
                                height={18}
                            />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* NÚT THU GỌN Ở MÉP PHẢI, GIỮA CHIỀU CAO SIDEBAR */}
            <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                className="absolute w-4 h-10 rounded-full shadow bg-black border flex items-center justify-center text-xs text-white"
                style={{
                    top: "50%",             // giữa chiều cao
                    transform: "translateY(-50%)",
                    right: "-12px",         // nhô ra ngoài 1 chút (~ 0.75rem)
                    left: "auto",           // ép bỏ mọi rule CSS cũ set left: 0
                }}
            >
                {collapsed ? "›" : "‹"}
            </button>




        </aside>
    );
}
