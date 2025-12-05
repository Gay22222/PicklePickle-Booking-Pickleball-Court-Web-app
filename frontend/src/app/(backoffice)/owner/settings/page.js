import SidebarNav from "../../components/layout/SidebarNav";

export default function OwnerSettingsPage() {
  return (
    <div className="flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Cài đặt tài khoản chủ sân</h1>
        <div className="bg-white rounded shadow p-6">
          <p>Cấu hình thông tin tài khoản, payout, liên hệ.</p>
          <ul className="mt-4 list-disc ml-6 text-gray-700">
            <li>Tên chủ sân: Nguyễn Văn B</li>
            <li>Email: owner@example.com</li>
            <li>Ngân hàng: Vietcombank</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
