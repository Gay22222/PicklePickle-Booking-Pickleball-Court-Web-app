import { Addon } from "../models/addon.model.js";

export async function ensureAddons() {
  const existing = await Addon.countDocuments();
  if (existing > 0) {
    console.log(`Addons already exist (${existing}), skip seeding.`);
    return;
  }

  console.log(" Seeding default addons...");

  const now = new Date();

  const addons = [
    {
      code: "balls",
      name: "Bóng Pickleball (3 quả)",
      category: "equipment",
      categoryLabel: "Dụng cụ",
      price: 280000,
      imageUrl: "/booking/pickleballIcon.svg",
      description: "Combo 3 quả bóng Pickleball chuẩn thi đấu.",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      code: "racket-rent",
      name: "Thuê vợt Pickleball",
      category: "equipment",
      categoryLabel: "Dụng cụ",
      price: 50000,
      imageUrl: "/booking/racketIcon.svg",
      description: "Thuê vợt Pickleball cho mỗi buổi chơi.",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      code: "water",
      name: "Nước suối",
      category: "drink",
      categoryLabel: "Đồ uống",
      price: 10000,
      imageUrl: "/booking/water.svg",
      description: "Chai nước suối 500ml.",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      code: "revive",
      name: "Nước khoáng",
      category: "drink",
      categoryLabel: "Đồ uống",
      price: 20000,
      imageUrl: "/booking/revive.svg",
      description: "Nước khoáng bù khoáng sau khi vận động.",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      code: "wet-tissue",
      name: "Khăn ướt",
      category: "support",
      categoryLabel: "Phụ trợ",
      price: 5000,
      imageUrl: "/booking/khanuotIcon.svg",
      description: "Gói khăn ướt tiện dụng.",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      code: "wristband",
      name: "Băng cổ tay",
      category: "support",
      categoryLabel: "Phụ trợ",
      price: 35000,
      imageUrl: "/booking/bangcotayIcon.svg",
      description: "Băng cổ tay thấm mồ hôi hỗ trợ chơi thể thao.",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await Addon.insertMany(addons);

  console.log(" Seeded addons successfully.");
}
