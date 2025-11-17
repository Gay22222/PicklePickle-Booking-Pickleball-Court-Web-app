"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear lỗi field đó
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (!form.username.trim()) {
      newErrors.username = "Please enter your username";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    }
    if (!form.password.trim()) {
      newErrors.password = "Please enter your password";
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please re-enter your password";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Password confirmation does not match";
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (!hasError) {
      console.log("Submit register form", form);
      // TODO: call API sau này
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#f4f4f4]">
      <div className="relative w-[1100px] h-[580px]">
        {/* LAYER 1 */}
        <div className="absolute top-0 left-0 w-[560px] h-[580px] rounded-[40px] overflow-hidden z-0">
          <Image
            src="/auth/layer1.png"
            alt="Left Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* LAYER 2 */}
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

            {/* Social */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button className="flex items-center gap-2 border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer transition">
                <Image src="/auth/googleIcon.svg" alt="" width={20} height={20} />
                <span>Sign in Google</span>
              </button>

              <button className="flex items-center gap-2 border border-gray-400 rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer transition">
                <Image src="/auth/facebookIcon.svg" alt="" width={20} height={20} />
                <span>Sign in Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-28 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">OR</span>
              <span className="w-28 h-px bg-gray-300" />
            </div>

            {/* FORM */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-800">
                  UserName
                </label>
                <input
                  value={form.username}
                  onChange={handleChange("username")}
                  className={`w-full rounded-lg px-4 pt-4 pb-2 text-sm bg-white outline-none transition-colors ${
                    errors.username
                      ? "border-2 border-red-500 text-red-600 placeholder-red-400"
                      : "border-2 border-black text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black"
                  }`}
                  placeholder={
                    errors.username || "Please enter your username"
                  }
                  type="text"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-800">
                  Phone number
                </label>
                <div
                  className={`flex items-center rounded-lg bg-white overflow-hidden transition-colors ${
                    errors.phone
                      ? "border-2 border-red-500"
                      : "border-2 border-black focus-within:ring-2 focus-within:ring-black focus-within:border-black"
                  }`}
                >
                  <span
                    className={`pl-4 pr-2 text-sm ${
                      errors.phone ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    +84
                  </span>
                  <input
                    value={form.phone}
                    onChange={handleChange("phone")}
                    className={`flex-1 py-3 pr-4 text-sm outline-none ${
                      errors.phone
                        ? "text-red-600 placeholder-red-400"
                        : "text-gray-800 placeholder-gray-400"
                    }`}
                    placeholder={
                      errors.phone || "Please enter your phone number"
                    }
                    type="tel"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-800">
                  Password
                </label>
                <input
                  value={form.password}
                  onChange={handleChange("password")}
                  className={`w-full rounded-lg px-4 pt-4 pb-2 text-sm bg-white outline-none transition-colors ${
                    errors.password
                      ? "border-2 border-red-500 text-red-600 placeholder-red-400"
                      : "border-2 border-black text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black"
                  }`}
                  placeholder={
                    errors.password || "Please enter your password"
                  }
                  type="password"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-800">
                  Confirm Password
                </label>
                <input
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className={`w-full rounded-lg px-4 pt-4 pb-2 text-sm bg-white outline-none transition-colors ${
                    errors.confirmPassword
                      ? "border-2 border-red-500 text-red-600 placeholder-red-400"
                      : "border-2 border-black text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black"
                  }`}
                  placeholder={
                    errors.confirmPassword || "Please re-enter your password"
                  }
                  type="password"
                />
              </div>

              {/* Text + Button */}
              <p className="mt-2 text-xs text-gray-500 text-right">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="italic text-gray-800 hover:underline"
                >
                  Login.
                </Link>
              </p>

              <button
                type="submit"
                className="mt-3 w-[220px] mx-auto py-3 rounded-full bg-black text-white text-sm hover:bg-black/80 hover:shadow-lg transition duration-150 active:translate-y-[1px]"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* ROCKET */}
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
