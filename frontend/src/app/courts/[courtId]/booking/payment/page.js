"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PaymentMethodsSection from "@/app/components/payment/PaymentMethodsSection";
import PaymentInvoiceSection from "@/app/components/payment/PaymentInvoiceSection";

export default function CourtPaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const courtId = params?.courtId;

  // MOCK invoice
  const invoiceItems = useMemo(
    () => [
      { id: "court", label: "Tiền sân:", amount: 200000 },
      { id: "addon-racket", label: "Thuê vợt (x2):", amount: 100000 },
      { id: "addon-tissue", label: "Khăn lạnh (x2):", amount: 6000 },
      { id: "addon-balls", label: "Bóng Pickleball:", amount: 280000 },
    ],
    []
  );

  const [selectedMethod, setSelectedMethod] = useState("momo");

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
          <PaymentInvoiceSection items={invoiceItems} />
        </div>
      </section>
    </main>
  );
}
