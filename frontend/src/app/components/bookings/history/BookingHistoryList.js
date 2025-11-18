import Image from "next/image";

export default function BookingHistoryList({ bookings }) {
  return (
    <div className="flex flex-col gap-6">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="w-[220px] h-[140px] relative shrink-0">
            <Image
              src={booking.imageUrl}
              alt={booking.courtName}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex-1 px-6 py-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{booking.courtName}</span>
                <span className="text-xs text-gray-500">Code: {booking.courtCode}</span>
                <Image
                  src="/history/heart.svg"
                  alt="Heart"
                  width={18}
                  height={18}
                  className="ml-2 inline-block"
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src="/history/star.svg"
                  alt="Star"
                  width={16}
                  height={16}
                  className="inline-block"
                />
                <span className="text-sm">{booking.rating}</span>
                <span className="text-xs text-gray-500">{booking.reviews} reviews</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                <Image
                  src="/history/calendar.svg"
                  alt="Calendar"
                  width={16}
                  height={16}
                  className="inline-block"
                />
                <span>{booking.date}</span>
                <span>Trạng thái: {booking.statusLabel}</span>
              </div>
              <div className="flex gap-4 mt-1 text-sm text-gray-700">
                <span>Bắt đầu: {booking.startTime}</span>
                <span>Kết thúc: {booking.endTime}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">Chi tiết</button>
              <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">Huỷ sân</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}