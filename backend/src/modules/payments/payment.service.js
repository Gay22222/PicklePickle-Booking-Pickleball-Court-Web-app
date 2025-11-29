export async function createCheckout({ paymentMethod, bookingDraft }) {
  // Tạm thời chỉ mock tính tiền & trả về object,
  // sau này bạn có thể:
  // - Tạo document Payment trong Mongo
  // - Gọi API Momo / VNPay để lấy redirectUrl

  const courtTotal = bookingDraft?.courtTotal || 0;
  const addonsTotal = bookingDraft?.addons?.addonsTotal || 0;
  const totalAmount = courtTotal + addonsTotal;

  return {
    paymentId: "mock-" + Date.now(),
    paymentMethod,
    totalAmount,
    bookingDraft,
    redirectUrl: null, // sau này gắn URL thanh toán thật
    status: "PENDING",
  };
}
