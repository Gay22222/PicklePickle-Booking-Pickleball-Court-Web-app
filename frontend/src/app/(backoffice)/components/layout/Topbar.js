"use client";

export default function Topbar() {
  return (
    <header className="w-full h-16 bg-white border-b flex items-center px-6 justify-between">
      <div className="font-bold text-lg text-gray-700">PicklePickle Backoffice</div>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">Xin chào, Chủ sân!</span>
        <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">Đăng xuất</button>
      </div>
    </header>
  );
}
