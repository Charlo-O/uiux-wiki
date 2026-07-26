/**
 * Scoped UIUX theme registry.
 *
 * These tokens are intentionally owned by uiux.wiki. They echo the visual
 * direction of the local Astryx theme examples without importing Astryx
 * runtime packages or changing the rest of the application.
 */

export const UIUX_THEME_STORAGE_KEY = "uiux.wiki.theme";
export const UIUX_THEME_EVENT = "uiux:theme-change";

const baseTokens = {
  fontFamily:
    '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  radiusSm: "8px",
  radiusMd: "14px",
  radiusLg: "20px",
  shadowSm: "0 1px 2px rgba(16, 24, 40, 0.05)",
  shadowMd: "0 18px 42px rgba(16, 24, 40, 0.08)",
  previewGap: "16px",
};

export const UIUX_THEMES = Object.freeze([
  {
    id: "neutral",
    label: "Neutral",
    labelZh: "中性",
    description: "安静、清晰、适合默认文档与组件图鉴。",
    mood: "Calm and editorial",
    swatch: ["#f4f4f5", "#ffffff", "#18181b"],
    tokens: {
      ...baseTokens,
      background: "#f7f7f8",
      surface: "#ffffff",
      surfaceMuted: "#f1f2f4",
      text: "#171717",
      mutedText: "#64748b",
      border: "#dfe2e6",
      borderStrong: "#c6cbd2",
      accent: "#111111",
      accentContrast: "#ffffff",
      focus: "#1d9bf0",
      danger: "#d64545",
      radius: "14px",
    },
  },
  {
    id: "stone",
    label: "Stone",
    labelZh: "岩石",
    description: "温暖的石材中性色，适合稳重、产品化的案例。",
    mood: "Warm and grounded",
    swatch: ["#eeeae4", "#fbfaf8", "#4b4035"],
    tokens: {
      ...baseTokens,
      background: "#f1eee9",
      surface: "#fbfaf8",
      surfaceMuted: "#e8e3dc",
      text: "#302a24",
      mutedText: "#75695d",
      border: "#d8d0c7",
      borderStrong: "#b8aa9b",
      accent: "#4c4035",
      accentContrast: "#fffdf9",
      focus: "#927760",
      danger: "#b54a3f",
      radius: "14px",
    },
  },
  {
    id: "gothic",
    label: "Gothic",
    labelZh: "哥特",
    description: "深色高对比主题，突出内容与示例的戏剧性。",
    mood: "Dark and expressive",
    swatch: ["#131923", "#1d2734", "#f3f1ec"],
    tokens: {
      ...baseTokens,
      background: "#0f141c",
      surface: "#171e29",
      surfaceMuted: "#222c3a",
      text: "#f3f1ec",
      mutedText: "#aab3bf",
      border: "#344150",
      borderStrong: "#526171",
      accent: "#f3f1ec",
      accentContrast: "#10151d",
      focus: "#8fc9ff",
      danger: "#ff8b88",
      radius: "12px",
      shadowSm: "0 1px 2px rgba(0, 0, 0, 0.32)",
      shadowMd: "0 20px 54px rgba(0, 0, 0, 0.42)",
    },
  },
  {
    id: "matcha",
    label: "Matcha",
    labelZh: "抹茶",
    description: "柔和的绿色和奶油底色，适合轻盈、生活方式类案例。",
    mood: "Fresh and optimistic",
    swatch: ["#d9efe7", "#fbfff9", "#205b45"],
    tokens: {
      ...baseTokens,
      background: "#e8f4ee",
      surface: "#fbfff9",
      surfaceMuted: "#d9eee5",
      text: "#18382d",
      mutedText: "#5d7d70",
      border: "#c1ded1",
      borderStrong: "#91bda9",
      accent: "#205b45",
      accentContrast: "#f7fff9",
      focus: "#50a77e",
      danger: "#c35d4a",
      radius: "18px",
    },
  },
  {
    id: "y2k",
    label: "Y2K",
    labelZh: "千禧",
    description: "高饱和蓝紫与圆角界面，适合实验性和互动式案例。",
    mood: "Playful and electric",
    swatch: ["#c8c9ff", "#f3f2ff", "#292a93"],
    tokens: {
      ...baseTokens,
      background: "#d9dcff",
      surface: "#f7f7ff",
      surfaceMuted: "#c6c9ff",
      text: "#1e206e",
      mutedText: "#5e61a0",
      border: "#aeb2f4",
      borderStrong: "#7d83e1",
      accent: "#292a93",
      accentContrast: "#ffffff",
      focus: "#6157e8",
      danger: "#ba3c78",
      radius: "22px",
      shadowSm: "0 2px 0 rgba(41, 42, 147, 0.12)",
      shadowMd: "0 20px 48px rgba(68, 60, 180, 0.16)",
    },
  },
  {
    id: "butter",
    label: "Butter",
    labelZh: "黄油",
    description: "明亮的黄蓝对比，适合活泼而友好的组件示例。",
    mood: "Sunny and tactile",
    swatch: ["#f8dc69", "#fff9dc", "#164ac3"],
    tokens: {
      ...baseTokens,
      background: "#fff3b8",
      surface: "#fffdf0",
      surfaceMuted: "#f6df76",
      text: "#2b2a1c",
      mutedText: "#706b47",
      border: "#e7cb54",
      borderStrong: "#c7a72d",
      accent: "#164ac3",
      accentContrast: "#ffffff",
      focus: "#2c72ef",
      danger: "#c13d3d",
      radius: "16px",
      shadowMd: "0 18px 42px rgba(108, 83, 0, 0.14)",
    },
  },
]);

export const THEMES = UIUX_THEMES;

export function getThemeById(themeId) {
  const normalized = String(themeId || "").trim().toLowerCase();
  return UIUX_THEMES.find((theme) => theme.id === normalized) || UIUX_THEMES[0];
}

export function isThemeId(themeId) {
  const normalized = String(themeId || "").trim().toLowerCase();
  return UIUX_THEMES.some((theme) => theme.id === normalized);
}

export function themeToCssVars(themeOrId) {
  const theme = typeof themeOrId === "string" ? getThemeById(themeOrId) : themeOrId;
  const tokens = theme?.tokens || UIUX_THEMES[0].tokens;
  return {
    "--uiux-theme-bg": tokens.background,
    "--uiux-theme-surface": tokens.surface,
    "--uiux-theme-surface-muted": tokens.surfaceMuted,
    "--uiux-theme-text": tokens.text,
    "--uiux-theme-muted-text": tokens.mutedText,
    "--uiux-theme-border": tokens.border,
    "--uiux-theme-border-strong": tokens.borderStrong,
    "--uiux-theme-accent": tokens.accent,
    "--uiux-theme-accent-contrast": tokens.accentContrast,
    "--uiux-theme-focus": tokens.focus,
    "--uiux-theme-danger": tokens.danger,
    "--uiux-theme-font": tokens.fontFamily,
    "--uiux-theme-radius-sm": tokens.radiusSm,
    "--uiux-theme-radius-md": tokens.radiusMd,
    "--uiux-theme-radius-lg": tokens.radiusLg,
    "--uiux-theme-radius": tokens.radius,
    "--uiux-theme-shadow-sm": tokens.shadowSm,
    "--uiux-theme-shadow-md": tokens.shadowMd,
    "--uiux-theme-preview-gap": tokens.previewGap,
  };
}

function resolveThemeScope(scope) {
  if (scope && scope.nodeType === 1) return scope;
  if (typeof scope === "string" && typeof document !== "undefined") {
    return document.querySelector(scope);
  }
  if (scope?.documentElement) return scope.documentElement;
  if (typeof document !== "undefined") return document.documentElement;
  return null;
}

export function applyTheme(scope, themeOrId, options = {}) {
  const element = resolveThemeScope(scope);
  const theme = typeof themeOrId === "string" ? getThemeById(themeOrId) : themeOrId || UIUX_THEMES[0];
  if (!element) return theme;

  Object.entries(themeToCssVars(theme)).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });
  element.setAttribute("data-uiux-theme", theme.id);

  if (options.persist !== false && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(UIUX_THEME_STORAGE_KEY, theme.id);
    } catch {
      // Storage restrictions should not break an in-memory preview.
    }
  }

  if (typeof element.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
    element.dispatchEvent(
      new CustomEvent(UIUX_THEME_EVENT, {
        bubbles: true,
        detail: { themeId: theme.id, theme },
      }),
    );
  }
  return theme;
}

export function clearTheme(scope) {
  const element = resolveThemeScope(scope);
  if (!element) return;
  Object.keys(themeToCssVars(UIUX_THEMES[0])).forEach((name) => element.style.removeProperty(name));
  element.removeAttribute("data-uiux-theme");
}

export function readStoredTheme(fallback = UIUX_THEMES[0].id) {
  if (typeof localStorage === "undefined") return getThemeById(fallback);
  try {
    return getThemeById(localStorage.getItem(UIUX_THEME_STORAGE_KEY) || fallback);
  } catch {
    return getThemeById(fallback);
  }
}
