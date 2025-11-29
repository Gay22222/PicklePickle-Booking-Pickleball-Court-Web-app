import { Addon } from "../../models/addon.model.js";

export async function listAddonsService(filters = {}) {
  const { category } = filters;

  const query = { isActive: true };
  if (category) {
    query.category = category;
  }

  const addons = await Addon.find(query).sort({ category: 1, name: 1 }).lean();

  // Map về shape FE đang dùng: id, name, category, categoryLabel, price, image
  return addons.map((a) => ({
    id: a.code,
    name: a.name,
    category: a.category,
    categoryLabel: a.categoryLabel,
    price: a.price,
    image: a.imageUrl,
    description: a.description ?? "",
  }));
}

export async function getAddonByCodeService(code) {
  const addon = await Addon.findOne({
    code,
    isActive: true,
  }).lean();

  if (!addon) return null;

  return {
    id: addon.code,
    name: addon.name,
    category: addon.category,
    categoryLabel: addon.categoryLabel,
    price: addon.price,
    image: addon.imageUrl,
    description: addon.description ?? "",
  };
}
