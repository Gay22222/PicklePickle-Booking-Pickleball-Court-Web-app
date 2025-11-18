"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CourtHeroSection({ court }) {
  const router = useRouter();

  const {
    name,
    address,
    phone,
    description,
    heroImages: heroImagesProp,
  } = court || {};

  // fallback nếu thiếu ảnh / mô tả
  const heroImages =
    heroImagesProp && heroImagesProp.length > 0
      ? heroImagesProp
      : ["/courts/sample1.png", "/courts/sample2.png", "/courts/sample3.png"];

  const defaultDescription =
    "Câu lạc bộ PickoLand Thảo Điền Pickleball là một trong những địa điểm chơi pickleball phổ biến nhất tại TP. Hồ Chí Minh, Việt Nam. Ở đây có 5 sân ngoài trời mặt cứng. Tất cả đều là sân chuyên dụng với vạch kẻ và lưới cố định. Để chơi, bạn cần có hội viên. Có thể đặt sân trước. Cơ sở vật chất bao gồm nhà vệ sinh, hệ thống đèn chiếu sáng và cửa hàng pro shop/thiết bị.";

  const fullDescription =
    description && description.trim().length > 0
      ? description
      : defaultDescription;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const sentences = fullDescription.split(". ");
  const shortDescription =
    sentences.length > 2
      ? sentences.slice(0, 2).join(". ") + "..."
      : fullDescription;

  // auto slide 5s
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [heroImages.length]);

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === heroImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="grid items-start gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {/* LEFT */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-zinc-900">
          {name}
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
           <button
            type="button"
            onClick={() => {
              // dùng court.id nếu có, fallback courtId mock
              const targetId = court?.id || "pickoland-thao-dien";
              router.push(`/courts/${targetId}/booking`);
            }}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
          >
            <span>Đặt sân</span>
            <Image
              src="/courts/bookingIcon.svg"
              alt="Đặt sân"
              width={16}
              height={16}
            />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
          >
            <span>Tư vấn</span>
            <Image
              src="/courts/phoneIcon.svg"
              alt="Tư vấn"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* Community card */}
        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <Image
              src="/courts/followIcon.svg"
              alt="Cộng đồng"
              width={24}
              height={24}
              className="mt-[2px]"
            />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-800">
                Tham gia cộng đồng PickoLand
              </p>
              <p className="text-[11px] text-zinc-500">
                Follow để tham gia chat và kết nối với người chơi nhé!
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md hover:scale-[1.03] active:scale-[0.97]"
          >
            Follow
          </button>
        </div>

        {/* Address & phone */}
        <div className="space-y-1.5 pt-1 text-sm text-zinc-800">
          <div className="flex items-start gap-2">
            <Image
              src="/courts/locationIcon.svg"
              alt="Địa chỉ"
              width={16}
              height={16}
              className="mt-[2px]"
            />
            <span>{address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/courts/phoneIcon.svg"
              alt="Điện thoại"
              width={16}
              height={16}
            />
            <span>{phone}</span>
          </div>
        </div>

        {/* Description */}
        <div className="pt-2 text-sm leading-relaxed text-zinc-700">
          <p>{expanded ? fullDescription : shortDescription}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-zinc-800 hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
            <span className="text-[10px]">
              {expanded ? "↑" : "↓"}
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT – slider */}
      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl md:h-[320px]">
        {heroImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Ảnh sân ${index + 1}`}
            fill
            className={`absolute inset-0 object-cover transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            sizes="(min-width: 768px) 400px, 100vw"
          />
        ))}

        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur transition hover:bg-white"
        >
          <Image
            src="/courts/prevIcon.svg"
            alt="Previous"
            width={16}
            height={16}
          />
        </button>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur transition hover:bg-white"
        >
          <Image
            src="/courts/nextIcon.svg"
            alt="Next"
            width={16}
            height={16}
          />
        </button>
      </div>
    </section>
  );
}
