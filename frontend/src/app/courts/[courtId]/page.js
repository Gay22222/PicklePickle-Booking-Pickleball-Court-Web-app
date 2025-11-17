import CourtHeroSection from "@/app/components/courts/detail/CourtHeroSection";
import CourtOverviewSection from "@/app/components/courts/detail/CourtOverviewSection";
import CourtPricingSection from "@/app/components/courts/detail/CourtPricingSection";

// 🎯 Mock data theo courtId
const mockCourts = {
  "pickoland-thao-dien": {
    id: "pickoland-thao-dien",
    name: "PickoLand Thảo Điền Pickleball Club",
    shortName: "PickoLand",
    address:
      "188 A6 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, Hồ Chí Minh, Vietnam",
    phone: "0903 396 059",
    description:
      "Câu lạc bộ PickoLand Thảo Điền Pickleball là một trong những địa điểm chơi pickleball phổ biến nhất tại TP. Hồ Chí Minh, Việt Nam. Ở đây có 5 sân ngoài trời mặt cứng. Tất cả đều là sân chuyên dụng với vạch kẻ và lưới cố định. Để chơi, bạn cần có hội viên. Có thể đặt sân trước. Cơ sở vật chất bao gồm nhà vệ sinh, hệ thống đèn chiếu sáng và cửa hàng pro shop/thiết bị.",
    heroImages: [
      "/courts/sample1.png",
      "/courts/sample2.png",
      "/courts/sample3.png",
    ],
    overview: {
      featureLeft: [
        "Mặt sân cứng, độ nảy chuẩn thi đấu",
        "5 sân ngoài trời, mái che một phần",
        "Hệ thống chiếu sáng thi đấu ban đêm",
      ],
      featureRight: [
        "Vạch kẻ cố định theo chuẩn Pickleball",
        "Lưới căng cố định, chiều cao tiêu chuẩn",
        "Khu vực non-volley zone (kitchen) rõ ràng",
      ],
      amenitiesLeft: [
        "Đồ ăn & nước uống ngay trong khu compound",
        "Phòng vệ sinh & phòng thay đồ sạch sẽ",
        "Cửa hàng dụng cụ & phụ kiện Pickleball",
        "Khu vực nghỉ ngơi, ghế ngồi cho khán giả",
      ],
      amenitiesRight: [
        "Hệ thống đèn thi đấu ban đêm",
        "Không gian phù hợp tổ chức giải, sự kiện",
        "Bãi gửi xe xung quanh khu vực sân",
      ],
      featureImages: Array(5).fill("/courts/mockupduplicate.png"),
      amenityImages: Array(5).fill("/courts/mockupduplicate.png"),
      logoSrc: "/courts/Logo.svg",
    },
    pricing: {
      title: "Bảng giá sân PickoLand",
      rows: [
        {
          day: "T2 - T6",
          slots: [
            { time: "9h - 16h", fixed: "80.000đ/h", walkin: "90.000đ/h" },
          ],
        },
        {
          day: "T2 - CN",
          slots: [
            { time: "5h - 9h", fixed: "100.000đ/h", walkin: "110.000đ/h" },
            { time: "16h - 23h", fixed: "100.000đ/h", walkin: "110.000đ/h" },
          ],
        },
        {
          day: "T7 - CN",
          slots: [
            { time: "9h - 16h", fixed: "100.000đ/h", walkin: "110.000đ/h" },
          ],
        },
      ],
    },
  },

  // sau này bạn chỉ cần thêm sân mới ở đây
  // "another-court-id": { ... }
};

const defaultCourt = mockCourts["pickoland-thao-dien"];

export default function CourtDetailPage({ params }) {
  const { courtId } = params;
  const court = mockCourts[courtId] ?? defaultCourt;

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        <CourtHeroSection court={court} />
        <CourtOverviewSection overview={court.overview} />
        <CourtPricingSection pricing={court.pricing} />
      </section>
    </main>
  );
}
