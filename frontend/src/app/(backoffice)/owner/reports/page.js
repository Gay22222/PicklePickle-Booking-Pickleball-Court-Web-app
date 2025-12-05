import SidebarNav from "../../components/layout/SidebarNav";

export default function OwnerReportsPage() {
  return (
    <div className="flex">

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Báo cáo & Phân tích</h1>
        <div className="bg-white rounded shadow p-6">
          <p>Thống kê doanh thu, tỉ lệ huỷ sân theo thời gian.</p>
          <ul className="mt-4 list-disc ml-6 text-gray-700">
            <li>Doanh thu tháng 10/2025: 12.000.000đ</li>
            <li>Tỉ lệ huỷ: 5%</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
