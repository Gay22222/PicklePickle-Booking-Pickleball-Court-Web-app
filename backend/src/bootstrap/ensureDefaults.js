// src/bootstrap/ensureDefaults.js
import { Role } from "../models/role.model.js";
import { BookingStatus } from "../models/bookingStatus.model.js";
import { PaymentStatus } from "../models/paymentStatus.model.js";
import { ensureVenuesAndCourts } from "./seedVenuesAndCourts.js";
import { ensureAddons } from "./seedAddons.js";

// ==== ROLES ==================================================
async function ensureRoles() {
    const roles = [
        { code: "CUSTOMER", name: "Khách đặt sân" },
        { code: "OWNER", name: "Chủ sân" },
        { code: "ADMIN", name: "Quản trị hệ thống" },
    ];

    for (const r of roles) {
        await Role.updateOne({ code: r.code }, r, { upsert: true });
    }
    console.log(" Default roles ensured");
}

// ==== BOOKING STATUSES =======================================
async function ensureBookingStatuses() {
    const statuses = [
        {
            code: "PENDING",
            label: "Chờ thanh toán",
            description: "Booking đã tạo, đang chờ thanh toán hoặc xác nhận.",
            isFinal: false,
            isCancel: false,
        },
        {
            code: "CONFIRMED",
            label: "Đã xác nhận",
            description: "Thanh toán thành công hoặc chủ sân đã xác nhận.",
            isFinal: false,
            isCancel: false,
        },
        {
            code: "COMPLETED",
            label: "Hoàn tất",
            description: "Khách đã chơi xong.",
            isFinal: true,
            isCancel: false,
        },
        {
            code: "CANCELLED",
            label: "Đã hủy",
            description: "Booking đã bị hủy.",
            isFinal: true,
            isCancel: true,
        },
        {
            code: "NO_SHOW",
            label: "Không đến",
            description: "Khách không đến sân.",
            isFinal: true,
            isCancel: true,
        },
    ];

    for (const s of statuses) {
        await BookingStatus.updateOne({ code: s.code }, s, { upsert: true });
    }
    console.log(" Default booking statuses ensured");
}

// ==== PAYMENT STATUSES =======================================
async function ensurePaymentStatuses() {
    const statuses = [
        {
            code: "PENDING",
            label: "Đang thanh toán",
            description: "Đã tạo yêu cầu thanh toán, chưa có kết quả cuối.",
            isSuccess: false,
            isFinal: false,
        },
        {
            code: "SUCCEEDED",
            label: "Thanh toán thành công",
            description: "Thanh toán thành công từ cổng (VNPay/MoMo...).",
            isSuccess: true,
            isFinal: true,
        },
        {
            code: "FAILED",
            label: "Thanh toán thất bại",
            description: "Thanh toán thất bại hoặc lỗi kỹ thuật.",
            isSuccess: false,
            isFinal: true,
        },
        {
            code: "CANCELLED",
            label: "Hủy thanh toán",
            description: "Khách hoặc hệ thống hủy giao dịch.",
            isSuccess: false,
            isFinal: true,
        },
    ];

    for (const s of statuses) {
        await PaymentStatus.updateOne({ code: s.code }, s, { upsert: true });
    }
    console.log(" Default payment statuses ensured");
}

// ==== ENTRY POINT: được gọi trong server.js ==================
export async function ensureDefaults() {
    await ensureRoles();
    await ensureBookingStatuses();
    await ensurePaymentStatuses();
    await ensureVenuesAndCourts(); // seed venue + court + pricing + giờ mở cửa
    await ensureAddons(); // seed addons
}
