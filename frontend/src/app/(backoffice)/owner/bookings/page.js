import SidebarNav from "../../components/layout/SidebarNav";

export default function OwnerBookingsPage() {
  return (
    <div className="flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Quản lý đặt sân</h1>
        <div className="bg-white rounded shadow p-6">
          <p>Hiển thị danh sách các lượt đặt sân của các khách hàng cho sân của bạn.</p>
          <ul className="mt-4 list-disc ml-6 text-gray-700">
            <li>Khách: Nguyễn Văn A</li>
            <li>Thời gian: 20/10/2025, 7:00 - 9:00</li>
            <li>Trạng thái: Đã xác nhận</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
