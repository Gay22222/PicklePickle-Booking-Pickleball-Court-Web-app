"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const CODE_LENGTH = 5;

export default function VerifyPage() {
  const [codes, setCodes] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (index) => (e) => {
    let value = e.target.value.replace(/\D/g, ""); // chỉ cho số
    if (!value) {
      // xóa
      setCodes((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    value = value[value.length - 1];

    setCodes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    setError("");

    // focus ô tiếp theo
    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (codes.some((c) => c === "")) {
      setError("Please enter the full verification code");
      return;
    }

    const code = codes.join("");
    console.log("Verify code:", code);
    // TODO: call API verify sau này
  };

  const hasError = !!error;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#f4f4f4]">
      <div className="relative w-[1100px] h-[580px]">
        {/* ===== LAYER 1 (giống register) ===== */}
        <div className="absolute top-0 left-0 w-[560px] h-[580px] rounded-[40px] overflow-hidden z-0">
          <Image
            src="/auth/layer1.png"
            alt="Left Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ===== LAYER 2 (card trắng) ===== */}
        <div className="absolute top-0 left-[430px] w-[560px] h-[580px] z-10">
          <div className="absolute inset-0 rounded-[40px] overflow-hidden">
            <Image
              src="/auth/layer2.png"
              alt="Card Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute inset-0 px-12 py-10 flex flex-col">
            <h1 className="text-[24px] font-semibold text-center mb-6 text-gray-900 tracking-wide">
              Create Account
            </h1>

            {/* Social buttons giống register */}
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

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-28 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">OR</span>
              <span className="w-28 h-px bg-gray-300" />
            </div>

            {/* ===== OTP FORM (CHECK YOUR MESSAGES) ===== */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center mt-2"
            >
              <div className="text-[18px] tracking-[0.15em] text-gray-400">
                CHECK YOUR <span className="text-gray-800">MESSAGES</span>
              </div>

              <p className="mt-2 text-[12px] text-gray-500 text-center">
                We&apos;ve sent you a code. Please check your messages.
              </p>

              <div className="mt-4 flex gap-3">
                {codes.map((value, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    value={value}
                    onChange={handleChange(idx)}
                    onKeyDown={handleKeyDown(idx)}
                    maxLength={1}
                    inputMode="numeric"
                    className={`w-11 h-11 text-center text-lg rounded-md bg-white outline-none transition-colors ${
                      hasError
                        ? "border border-red-500 text-red-600"
                        : "border border-gray-400 text-gray-800 focus:border-black focus:ring-2 focus:ring-black"
                    }`}
                  />
                ))}
              </div>

              {hasError && (
                <p className="mt-2 text-[11px] text-red-500">
                  {error}
                </p>
              )}

              <p className="mt-2 text-[11px] text-gray-500">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={() => console.log("Resend code")}
                  className="text-gray-800 underline-offset-2 hover:underline"
                >
                  Resend
                </button>
              </p>

              <button
                type="submit"
                className="mt-5 w-[230px] py-3 rounded-full bg-black text-white text-sm hover:bg-black/80 hover:shadow-lg transition duration-150 active:translate-y-[1px]"
              >
                CONFIRM
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="italic text-gray-800 hover:underline"
                >
                  Login.
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* ===== ROCKET (y chang login/register) ===== */}
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
