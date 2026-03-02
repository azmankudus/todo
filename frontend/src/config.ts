export const CONFIG = {
  theme: "ocean", // one of: ocean, sunset, forest, lavender, rose, midnight, mint, amber, crimson, berry
  background: "wavy", // one of: wavy, blobs, mesh, grid, dots, aurora, topography, waves, geometric, minimal
  storagePrefix: "vibe_todo_",
  securityEnabled: false,
};

export const getStorageKey = (key: string) => `${CONFIG.storagePrefix}${key}`;

export const AUTH_KEYS = {
  accessToken: getStorageKey("accessToken"),
  refreshToken: getStorageKey("refreshToken"),
  user: getStorageKey("user"),
};
