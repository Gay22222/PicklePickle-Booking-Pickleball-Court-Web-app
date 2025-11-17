import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#f4f4f4]">
      {/* WRAPPER */}
      <div className="relative w-[1100px] h-[580px]">
        {/* ===== LAYER 1 (BACKGROUND) ===== */}
        <div className="absolute top-0 left-0 w-[560px] h-[580px] rounded-[40px] overflow-hidden z-0">
          <Image
            src="/auth/layer1.png"
            alt="Left Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ===== LAYER 2 (CARD FORM) ===== */}
        <div className="absolute top-0 left-[430px] w-[560px] h-[580px] z-10">
          {/* Ảnh khung card */}
          <div className="absolute inset-0 rounded-[40px] overflow-hidden">
            <Image
              src="/auth/layer2.png"
              alt="Card Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Nội dung form */}
          <div className="absolute inset-0 px-12 py-10 flex flex-col">
            <h1 className="text-[24px] font-semibold text-center mb-6 text-gray-900">
              Log in with your Account
            </h1>

            {/* SOCIAL BUTTONS */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button className="flex items-center gap-2 border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer transition">
                <Image src="/auth/googleIcon.svg" alt="" width={20} height={20} />
                <span>Log in Google</span>
              </button>

              <button className="flex items-center gap-2 border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer transition">
                <Image src="/auth/facebookIcon.svg" alt="" width={20} height={20} />
                <span>Log in Facebook</span>
              </button>
            </div>

            {/* DIVIDER (ngắn hơn) */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-24 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">OR</span>
              <span className="w-24 h-px bg-gray-300" />
            </div>

            {/* FORM INPUTS */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  className="w-full border border-gray-400 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-500 bg-white/90 outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="Email"
                  type="email"
                />
                <Image
                  src="/auth/emailIcon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60"
                />
              </div>

              <div className="relative">
                <input
                  className="w-full border border-gray-400 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-500 bg-white/90 outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="Username"
                  type="text"
                />
                <Image
                  src="/auth/userIcon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60"
                />
              </div>

              <div className="relative">
                <input
                  className="w-full border border-gray-400 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-500 bg-white/90 outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="Password"
                  type="password"
                />
                <Image
                  src="/auth/lockIcon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60"
                />
              </div>
            </div>

            {/* TEXT TRƯỚC, BUTTON SAU */}
            <p className="mt-4 text-xs text-gray-500 text-right">
              Don&apos;t You have account,{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">
                click here.
              </span>
            </p>

            <button
              className="mt-4 w-1/2 mx-auto py-3 rounded-full bg-black text-white text-sm hover:bg-black/80 hover:shadow-lg transition duration-150 active:translate-y-[1px]"
            >
              CONFIRM
            </button>
          </div>
        </div>

        {/* ===== ROCKET: PHÓNG TO, VẪN NẰM TRONG LAYER 1 ===== */}
        <div className="absolute left-[30px] top-[140px] w-[400px] h-[340px] z-20 pointer-events-none">
          <Image
            src="/auth/rocketlogin.png"
            alt="Rocket"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
