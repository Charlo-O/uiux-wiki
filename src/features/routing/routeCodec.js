/**
 * Small history API route codec used by the SPA before a router is introduced.
 *
 * Supported canonical views:
 *   /?view=all
 *   /?view=uiux&category=components&item=button
 *   /?view=themes&theme=neutral
 *   /?view=templates&preview=button-group
 *
 * The codec is deliberately dependency free and can be called from App.jsx,
 * tests, or a future router adapter.
 */

const VIEW_ALIASES = {
  home: "all",
  all: "all",
  uiux: "uiux",
  themes: "themes",
  theme: "themes",
  templates: "templates",
  template: "templates",
  effects: "effects",
  effect: "effects",
};

export const DEFAULT_ROUTE = Object.freeze({ view: "all" });

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readSearchParams(locationLike) {
  if (typeof locationLike === "string") {
    const url = new URL(locationLike, "http://uiux.local");
    return url.searchParams;
  }
  if (locationLike?.searchParams instanceof URLSearchParams) return locationLike.searchParams;
  return new URLSearchParams(locationLike?.search || "");
}

export function normalizeView(view) {
  const normalized = String(view || "").trim().toLowerCase();
  return VIEW_ALIASES[normalized] || DEFAULT_ROUTE.view;
}

export function readAppRoute(locationLike = typeof window !== "undefined" ? window.location : "") {
  const params = readSearchParams(locationLike);
  const route = { view: normalizeView(params.get("view")) };

  const category = params.get("category");
  const item = params.get("item");
  const theme = params.get("theme");
  const template = params.get("template");
  const preview = params.get("preview");

  if (category) route.category = safeDecode(category);
  if (item) route.itemId = safeDecode(item);
  if (theme) route.themeId = safeDecode(theme).toLowerCase();
  if (template) route.templateId = safeDecode(template);
  if (preview) route.previewId = safeDecode(preview);
  if (params.get("mode")) route.mode = params.get("mode") === "dark" ? "dark" : "light";

  // Astryx-style `/templates/<slug>` links are accepted as a compatibility
  // convenience while all generated links remain query based.
  const pathname = locationLike?.pathname || (typeof locationLike === "string" ? new URL(locationLike, "http://uiux.local").pathname : "");
  const templateMatch = pathname.match(/^\/templates\/([^/]+)/);
  if (templateMatch && !route.templateId && !route.previewId) {
    route.view = "templates";
    route.templateId = safeDecode(templateMatch[1]);
    route.previewId = route.templateId;
  }

  return route;
}

export function buildAppSearch(route = DEFAULT_ROUTE) {
  const normalized = { ...route, view: normalizeView(route.view) };
  const params = new URLSearchParams();
  params.set("view", normalized.view);

  if (normalized.category) params.set("category", normalized.category);
  if (normalized.itemId) params.set("item", normalized.itemId);
  if (normalized.view === "themes" && normalized.themeId) params.set("theme", normalized.themeId);
  if (normalized.templateId) params.set("template", normalized.templateId);
  if (normalized.previewId) params.set("preview", normalized.previewId);
  if (normalized.mode) params.set("mode", normalized.mode === "dark" ? "dark" : "light");

  return `?${params.toString()}`;
}

export function buildAppUrl(route = DEFAULT_ROUTE, { origin, pathname = "/" } = {}) {
  const search = buildAppSearch(route);
  if (!origin) return `${pathname}${search}`;
  return `${origin.replace(/\/$/, "")}${pathname}${search}`;
}

export function createRoute(route = DEFAULT_ROUTE, options) {
  return buildAppUrl(route, options);
}

export function toUiuxRoute({ category, itemId, ...rest } = {}) {
  return buildAppUrl({ ...rest, view: "uiux", category, itemId });
}

export function toThemeRoute(themeId, rest = {}) {
  return buildAppUrl({ ...rest, view: "themes", themeId });
}

export function toTemplateRoute(templateId, rest = {}) {
  return buildAppUrl({ ...rest, view: "templates", templateId, previewId: templateId });
}

export function writeAppRoute(route, { replace = false, target = typeof window !== "undefined" ? window : null } = {}) {
  const url = buildAppUrl(route);
  if (!target?.history) return url;
  const method = replace ? "replaceState" : "pushState";
  target.history[method]({ ...route }, "", url);
  target.dispatchEvent?.(new PopStateEvent("popstate", { state: { ...route } }));
  return url;
}

export function subscribeToRoute(listener, target = typeof window !== "undefined" ? window : null) {
  if (!target?.addEventListener || typeof listener !== "function") return () => {};
  const handleChange = (event) => listener(readAppRoute(target.location), event);
  target.addEventListener("popstate", handleChange);
  target.addEventListener("hashchange", handleChange);
  return () => {
    target.removeEventListener("popstate", handleChange);
    target.removeEventListener("hashchange", handleChange);
  };
}
