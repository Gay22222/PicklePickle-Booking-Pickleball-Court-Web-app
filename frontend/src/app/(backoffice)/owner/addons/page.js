"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { apiFetch } from "../../../../lib/apiClient";

// Mock fallback nếu API lỗi / chưa có data
const FALLBACK_ADDONS = [
  { id: "water", name: "Nước suối", price: 10000, quantity: 100 },
  { id: "mineral", name: "Nước khoáng", price: 20000, quantity: 100 },
  { id: "balls", name: "Bóng Pickleball (3 quả)", price: 280000, quantity: 100 },
  { id: "racket-rent", name: "Thuê vợt Pickleball", price: 50000, quantity: 100 },
  { id: "wristband", name: "Băng cổ tay", price: 35000, quantity: 100 },
  { id: "wet-tissue", name: "Khăn ướt", price: 5000, quantity: 100 },
];

export default function OwnerAddonsPage() {
  const [addons, setAddons] = useState(FALLBACK_ADDONS);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  // ===== VENUES của owner =====
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");

  // ===== STATE cho popup form (Thêm / Sửa) =====
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [editingAddon, setEditingAddon] = useState(null);

  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    quantity: "",
    imageFile: null,
    imageName: "",
  });
  const [formError, setFormError] = useState("");

  // ===== STATE cho popup xác nhận xoá =====
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingAddon, setDeletingAddon] = useState(null);

  // ====== Load danh sách VENUE của owner (pattern từ bookings) ======
  useEffect(() => {
    let ignore = false;

    async function loadVenues() {
      try {
        const res = await apiFetch("/owner/venues");

        // apiFetch có thể trả: array hoặc { data: [...] } hoặc { data: { data: [...] } }
        let venuesData = [];
        if (Array.isArray(res)) {
          venuesData = res;
        } else if (Array.isArray(res?.data)) {
          venuesData = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          venuesData = res.data.data;
        }

        if (!ignore) {
          setVenues(venuesData);
          if (venuesData.length) {
            setSelectedVenueId((prev) => prev || venuesData[0].id);
          }
        }

        console.log("owner venues res =", res);
        console.log("venuesData =", venuesData);
      } catch (err) {
        console.error("Load owner venues error:", err);
      }
    }

    loadVenues();

    return () => {
      ignore = true;
    };
  }, []);

  // ====== Load addons theo venue đã chọn ======
  useEffect(() => {
    if (!selectedVenueId) return;

    let cancelled = false;

    async function fetchAddons() {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await apiFetch(`/addons?venueId=${selectedVenueId}`);
        const json = res || {};
        const data = json.data || json; // phòng trường hợp apiFetch trả thẳng array

        if (!cancelled) {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((a) => ({
              id: a.id ?? a.code ?? a._id ?? a.mongoId,
              mongoId: a.mongoId ?? a._id,
              name: a.name,
              price: a.price,
              quantity: a.defaultQuantity ?? a.quantity ?? 100,
            }));
            setAddons(mapped);
          } else {
            setAddons([]);
          }
        }
      } catch (err) {
        console.error("Cannot load owner addons", err);
        if (!cancelled) {
          setErrorMsg(
            "Không tải được danh sách phụ kiện từ server. Đang dùng dữ liệu mẫu."
          );
          setAddons(FALLBACK_ADDONS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAddons();

    return () => {
      cancelled = true;
    };
  }, [selectedVenueId]);

  // ====== Filter search ======
  const filteredAddons = useMemo(() => {
    if (!search.trim()) return addons;
    const keyword = search.toLowerCase();
    return addons.filter((a) => a.name.toLowerCase().includes(keyword));
  }, [addons, search]);

  // ====== HANDLERS: mở popup Thêm / Sửa ======
  const openCreateModal = () => {
    setFormMode("create");
    setEditingAddon(null);
    setFormValues({
      name: "",
      price: "",
      quantity: "",
      imageFile: null,
      imageName: "",
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditModal = (addon) => {
    setFormMode("edit");
    setEditingAddon(addon);
    setFormValues({
      name: addon.name || "",
      price: addon.price?.toString() || "",
      quantity: addon.quantity?.toString() || "",
      imageFile: null,
      imageName: "",
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormValues((prev) => ({
      ...prev,
      imageFile: file,
      imageName: file.name,
    }));
  };

  const validateForm = () => {
    if (!formValues.name.trim()) {
      return "Tên sản phẩm không được để trống.";
    }
    const priceNumber = Number(formValues.price.toString().replace(/,/g, ""));
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      return "Đơn giá không hợp lệ.";
    }
    const quantityNumber = Number(formValues.quantity);
    if (!Number.isFinite(quantityNumber) || quantityNumber < 0) {
      return "Số lượng không hợp lệ.";
    }
    return "";
  };

  const handleSubmitForm = async () => {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    // Chuyển đổi sang number chuẩn
    const priceNumber = Number(formValues.price.toString().replace(/,/g, ""));
    const quantityNumber = Number(formValues.quantity);

    if (formMode === "create") {
      // TODO: Gọi API tạo addon mới
      // ví dụ: await apiFetch(`/owner/addons`, { method: "POST", body: JSON.stringify({...}) })

      // Tạm thời: update local state cho đẹp UI
      const newAddon = {
        id: `temp-${Date.now()}`,
        name: formValues.name.trim(),
        price: priceNumber,
        quantity: quantityNumber,
      };
      setAddons((prev) => [...prev, newAddon]);
    } else if (formMode === "edit" && editingAddon) {
      // TODO: Gọi API update addon
      // ví dụ: await apiFetch(`/owner/addons/${editingAddon.mongoId}`, { method: "PUT", body: JSON.stringify({...}) })

      // Tạm thời: update local state
      setAddons((prev) =>
        prev.map((item) =>
          (item.id === editingAddon.id || item.mongoId === editingAddon.mongoId)
            ? {
                ...item,
                name: formValues.name.trim(),
                price: priceNumber,
                quantity: quantityNumber,
              }
            : item
        )
      );
    }

    setIsFormOpen(false);
  };

  // ====== HANDLERS: popup xác nhận xoá ======
  const openDeleteModal = (addon) => {
    setDeletingAddon(addon);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddon) return;

    // TODO: Gọi API xoá addon thực tế
    // ví dụ: await apiFetch(`/owner/addons/${deletingAddon.mongoId}`, { method: "DELETE" })

    // Tạm thời: xoá trên local state
    setAddons((prev) =>
      prev.filter(
        (item) =>
          item.id !== deletingAddon.id &&
          item.mongoId !== deletingAddon.mongoId
      )
    );

    setIsDeleteOpen(false);
    setDeletingAddon(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteOpen(false);
    setDeletingAddon(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + title */}
      <div>
        <div className="text-xs text-gray-500 mb-1">
          Trang chủ / <span className="text-gray-700">Quản lý phụ kiện</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Chi tiết phụ kiện
        </h1>
        {errorMsg && (
          <p className="mt-1 text-xs text-red-500">{errorMsg}</p>
        )}
      </div>

      {/* Card chính */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header card: title + venue + search + button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Bảng quản lý sản phẩm bán lẻ
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Dropdown chọn venue */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black">Sân</span>
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-xs md:text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {venues.length === 0 && (
                  <option value="">Không có sân</option>
                )}
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Image
                  src="/Search.svg"
                  alt="Tìm kiếm"
                  width={16}
                  height={16}
                />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-56 rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Nút thêm sản phẩm */}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center rounded-md bg-[#1890ff] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1677d4] focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              + Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 pb-4 overflow-x-auto">
          {loading && (
            <p className="mt-3 mb-1 text-xs text-gray-500">
              Đang tải danh sách phụ kiện...
            </p>
          )}

          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#fafafa] text-gray-700 border-b border-gray-200">
                <th className="py-2.5 pl-4 pr-2 text-left w-20 font-medium">
                  STT
                </th>
                <th className="py-2.5 px-2 text-left font-medium">Sản phẩm</th>
                <th className="py-2.5 px-2 text-left w-40 font-medium">
                  Đơn giá
                </th>
                <th className="py-2.5 px-2 text-left w-32 font-medium">
                  Số lượng
                </th>
                <th className="py-2.5 px-2 text-left w-32 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAddons.map((addon, index) => (
                <tr
                  key={addon.mongoId || addon.id || index}
                  className="border-b border-gray-100 hover:bg-[#fafafa]"
                >
                  {/* STT với vòng tròn đỏ */}
                  <td className="py-2.5 pl-4 pr-2">
                    <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4d4f] text-[11px] font-semibold text-white">
                      {index + 1}
                    </div>
                  </td>

                  <td className="py-2.5 px-2 text-sm text-gray-900">
                    {addon.name}
                  </td>

                  <td className="py-2.5 px-2 text-sm text-gray-900">
                    {addon.price.toLocaleString("vi-VN")}
                  </td>

                  <td className="py-2.5 px-2 text-sm text-gray-900">
                    {addon.quantity}
                  </td>

                  <td className="py-2.5 px-2 text-sm">
                    <button
                      type="button"
                      onClick={() => openEditModal(addon)}
                      className="mr-3 text-sky-600 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(addon)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAddons.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    Không có sản phẩm nào cho sân này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div className="flex justify-end items-center gap-2 px-6 pb-5">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-xs text-gray-600 hover:bg-gray-50"
          >
            {"<"}
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded border border-[#1890ff] bg-white text-xs font-medium text-[#1890ff]"
          >
            1
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-xs text-gray-600 hover:bg-gray-50"
          >
            {">"}
          </button>
        </div>
      </section>

      {/* ===== POPUP FORM: Thêm / Sửa sản phẩm ===== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-lg border border-gray-200">
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
              {formMode === "create" ? "Thêm Sản Phẩm" : "Chỉnh Sửa Sản Phẩm"}
            </h2>

            <div className="space-y-4">
              {/* Tên sản phẩm */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) =>
                    handleFormChange("name", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Đơn giá */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Đơn giá
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.price}
                  onChange={(e) =>
                    handleFormChange("price", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Số lượng */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Số lượng
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.quantity}
                  onChange={(e) =>
                    handleFormChange("quantity", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Upload image (mock) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Hình ảnh
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span>⬆ Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {formValues.imageName && (
                    <span className="text-xs text-gray-500 truncate max-w-[160px]">
                      {formValues.imageName}
                    </span>
                  )}
                </div>
              </div>

              {formError && (
                <p className="text-xs text-red-500">{formError}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitForm}
                className="rounded-md bg-[#1890ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#1677d4]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== POPUP XÁC NHẬN XOÁ ===== */}
      {isDeleteOpen && deletingAddon && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-2xl bg-white px-6 py-6 shadow-lg border border-gray-200">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Xác nhận xoá
            </h3>
            <p className="mb-6 text-sm text-gray-700">
              Bạn có chắc chắn muốn xoá{" "}
              <span className="font-semibold">
                {deletingAddon.name}
              </span>{" "}
              khỏi danh sách sản phẩm?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-md bg-red-500 px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
