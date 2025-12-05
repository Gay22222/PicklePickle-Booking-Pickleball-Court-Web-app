import SidebarNav from "../../components/layout/SidebarNav";

export default function OwnerAddonsPage() {
  return (
    <div className="flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Quản lý phụ kiện</h1>
        <div className="bg-white rounded shadow p-6">
          <p>Quản lý các phụ kiện, dịch vụ đi kèm cho sân.</p>
          <ul className="mt-4 list-disc ml-6 text-gray-700">
            <li>Khăn lau</li>
            <li>Nước uống</li>
            <li>Thuê vợt</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
