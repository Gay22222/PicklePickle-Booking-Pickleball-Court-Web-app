// Dữ liệu mock cho UI, chưa cần backend
export const MOCK_BOOKINGS = [
  {
    id: "BK-202510-0001",
    courtName: "PickleLand Cầu Sài Gòn",
    courtCode: "TREASURE9",
    location: "Bình Thạnh, TP. HCM",
    imageUrl: "/history/mock1.png",
    date: "20/10/2025",
    startTime: "07:00 AM",
    endTime: "09:00 AM",
    status: "upcoming",
    statusLabel: "Sắp diễn ra",
    totalPrice: 586000,
    createdAt: "18/10/2025 21:30",
    reviews: 36,
    rating: 4.2,
  },
  // Thêm nhiều booking giống nhau để mock UI
  ...Array(6)
    .fill()
    .map((_, i) => ({
      id: `BK-202510-000${i + 2}`,
      courtName: "PickleLand Thảo Điền",
      courtCode: "TREASURE9",
      location: "Thảo Điền, TP. Thủ Đức",
      imageUrl: "/history/mock1.png",
      date: "20/10/2025",
      startTime: "07:00 AM",
      endTime: "09:00 AM",
      status: "upcoming",
      statusLabel: "Sắp diễn ra",
      totalPrice: 586000,
      createdAt: "18/10/2025 21:30",
      reviews: 36,
      rating: 4.2,
    })),
];
