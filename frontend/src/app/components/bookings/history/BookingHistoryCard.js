"use client";


import Image from "next/image";
import BookingStatusBadge from "./BookingStatusBadge";

export default function BookingHistoryCard({ booking }) {
  const {
    courtName,
    courtCode,
    location,
    imageUrl,
    date,
    startTime,
    endTime,
    status,
    statusLabel,
    totalPrice,
    id,
  } = booking;

  return (
    <div className="w-full">
      {/* Ảnh sân */}
      <div>
        <Image
          src={imageUrl}
          alt={courtName}
          width={240}
          height={160}
          className="object-cover"
        />
      </div>

      {/* Thông tin chi tiết */}
      <div>
        <div>
          <h3>{courtName}</h3>
          <p>Code: {courtCode}</p>
        </div>

        <p>{location}</p>

        <p>
          Ngày chơi: {date} • {startTime} - {endTime}
        </p>

        <p>Mã đặt sân: {id}</p>

        <p>Tổng tiền: {totalPrice.toLocaleString("vi-VN")} đ</p>

        <BookingStatusBadge status={status} label={statusLabel} />

        {/* Sau này có thể thêm nút: Xem chi tiết, Đặt lại, Hủy, v.v. */}
      </div>
    </div>
  );
}
