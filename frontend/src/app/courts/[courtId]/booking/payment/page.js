"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import PaymentMethodsSection from "@/app/components/payment/PaymentMethodsSection";
import PaymentInvoiceSection from "@/app/components/payment/PaymentInvoiceSection";

const PAYMENT_DRAFT_KEY = "pp_booking_payment_draft";

export default function CourtPaymentPage() {
  const params = useParams();
  const courtId = params?.courtId;

  const [selectedMethod, setSelectedMethod] = useState("momo");

  // dữ liệu invoice thực tế
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [paymentDraft, setPaymentDraft] = useState(null);

  // đọc draft từ localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(PAYMENT_DRAFT_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw);
      setPaymentDraft(draft);

      const items = [];

      // 1. Tiền sân (tổng)
      if (draft.courtTotal && draft.courtTotal > 0) {
        items.push({
          id: "court",
          label: "Tiền sân",
          amount: draft.courtTotal,
        });
      }

      // 2. Dịch vụ thêm
      if (draft.addons?.items?.length) {
        draft.addons.items.forEach((addon) => {
          items.push({
            id: `addon-${addon.id}`,
            label: `${addon.name} (x${addon.quantity})`,
            amount: addon.totalPrice,
          });
        });
      }

      setInvoiceItems(items);
    } catch (err) {
      console.error("Cannot parse payment draft", err);
    }
  }, []);

  // mock xử lý thanh toán (sau này gọi API thật)
  const handlePay = async () => {
    if (!paymentDraft) {
      alert("Không tìm thấy thông tin đặt sân. Vui lòng quay lại bước trước.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/payments/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: selectedMethod,
            bookingDraft: paymentDraft,
          }),
        }
      );

      if (!res.ok) {
        console.error("Payment error", await res.text());
        alert("Thanh toán thất bại (mock).");
        return;
      }

      const json = await res.json();
      console.log("Payment result:", json);

      // mock: chỉ alert, sau này redirect sang Momo/VNPay
      alert("Thanh toán (mock) thành công!");
    } catch (err) {
      console.error("Payment request error", err);
      alert("Có lỗi trong quá trình thanh toán (mock).");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-4">
          Phương thức thanh toán
        </h1>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          {/* LEFT: payment methods */}
          <PaymentMethodsSection
            selectedId={selectedMethod}
            onChange={setSelectedMethod}
          />

          {/* RIGHT: invoice */}
          <PaymentInvoiceSection items={invoiceItems} onPay={handlePay} />
        </div>
      </section>
    </main>
  );
}
