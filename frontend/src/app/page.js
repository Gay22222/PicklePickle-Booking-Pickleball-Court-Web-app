import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nội dung demo để dễ nhìn header */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold mb-4">
          PicklePickle Booking
        </h1>
        <p className="text-zinc-300 mb-8">
          Đây là trang chủ tạm thời để test layout & header.
          Bạn có thể chỉnh màu nền, spacing… cho khớp với design.
        </p>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
          <p className="text-sm text-zinc-400">
            Header đang nằm trong <code>src/app/layout.js</code>. 
            Chỉ cần sửa file <code>components/layout/Header.js</code> 
            là sẽ thấy thay đổi ở đây.
          </p>
        </div>
      </div>
    </main>
  );
}

