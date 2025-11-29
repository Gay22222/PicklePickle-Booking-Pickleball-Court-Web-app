import {
  listAddonsHandler,
  getAddonByCodeHandler,
} from "./addon.controller.js";

export default async function addonRoutes(app, opts) {
  // Public: list all addons (optionally filter by ?category=equipment|drink|support)
  app.get(
    "/addons",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["equipment", "drink", "support"],
            },
          },
        },
      },
    },
    listAddonsHandler
  );

  // Public: get single addon by code
  app.get(
    "/addons/:code",
    {
      schema: {
        params: {
          type: "object",
          required: ["code"],
          properties: {
            code: { type: "string" },
          },
        },
      },
    },
    getAddonByCodeHandler
  );
}
