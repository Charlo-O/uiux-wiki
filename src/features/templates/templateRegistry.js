/**
 * UIUX local template registry.
 *
 * The registry mirrors the interaction contract of Astryx's template gallery
 * (category groups, stable ordering, ready/hidden flags and a preview slug)
 * without importing the Astryx runtime or CLI. Each entry points at a local
 * React renderer in `templateComponents.jsx`.
 */

export const TEMPLATE_GROUP_ORDER = [
  "Dashboard",
  "Table",
  "Form",
  "Settings",
  "Login",
  "Tools",
  "Content",
  "AI Chat",
  "Gallery",
  "Shell",
];

export const OTHER_TEMPLATE_GROUP = "Other";

/**
 * Metadata intentionally stays separate from renderers. This lets the
 * gallery lazy-mount real components and lets a future generator replace a
 * renderer without changing route/query contracts.
 */
export const templateRegistry = [
  {
    slug: "dashboard",
    name: "数据仪表盘",
    nameEn: "Dashboard",
    description: "把核心指标、趋势和待办事项放在同一工作台中。",
    category: "Dashboard - Analytics",
    source: "dashboard",
    renderer: "dashboard",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "table",
    name: "数据表格",
    nameEn: "Data Table",
    description: "可搜索、筛选、排序和批量处理的数据表格页面。",
    category: "Table - Operations",
    source: "table",
    renderer: "table",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "form-two-column",
    name: "双栏表单",
    nameEn: "Two-column Form",
    description: "适合设置、创建和结账流程的双栏表单布局。",
    category: "Form - Input",
    source: "form-two-column",
    renderer: "form-two-column",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "login-split",
    name: "分栏登录",
    nameEn: "Split Login",
    description: "品牌内容与登录表单并置的认证入口。",
    category: "Login",
    source: "login-split",
    renderer: "login-split",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "settings-sidebar",
    name: "设置侧栏",
    nameEn: "Settings Sidebar",
    description: "以二级导航组织个人、通知和安全设置。",
    category: "Settings",
    source: "settings-sidebar",
    renderer: "settings-sidebar",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "ai-chat",
    name: "AI 对话",
    nameEn: "AI Chat",
    description: "带上下文、消息状态和快捷提示的 AI 工作区。",
    category: "AI Chat",
    source: "ai-chat",
    renderer: "ai-chat",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "classic-gallery",
    name: "经典画廊",
    nameEn: "Classic Gallery",
    description: "用卡片网格展示内容、分类和收藏状态。",
    category: "Gallery - Content",
    source: "classic-gallery",
    renderer: "classic-gallery",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "documentation",
    name: "文档工作区",
    nameEn: "Documentation",
    description: "左侧目录、正文阅读和右侧页内导航的文档布局。",
    category: "Content - Docs",
    source: "documentation",
    renderer: "documentation",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "kanban-board",
    name: "看板",
    nameEn: "Kanban Board",
    description: "按流程列组织任务，并支持添加和移动任务。",
    category: "Tools - Planning",
    source: "kanban-board",
    renderer: "kanban-board",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "shell-top-nav",
    name: "顶部导航壳",
    nameEn: "Top Navigation Shell",
    description: "轻量的顶部导航、欢迎区和内容卡片起始页。",
    category: "Shell",
    source: "shell-top-nav",
    renderer: "shell-top-nav",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "product-detail",
    name: "商品详情",
    nameEn: "Product Detail",
    description: "图片、规格、价格和购买操作组成的详情页。",
    category: "Content - Commerce",
    source: "product-detail",
    renderer: "product-detail",
    isReady: true,
    isHiddenFromOverview: false,
  },
  {
    slug: "editor",
    name: "编辑器",
    nameEn: "Editor",
    description: "带工具栏、画布和属性面板的创作界面。",
    category: "Tools - Creation",
    source: "editor",
    renderer: "editor",
    isReady: true,
    isHiddenFromOverview: false,
  },
];

export function groupOf(category) {
  if (!category) {
    return OTHER_TEMPLATE_GROUP;
  }
  const separator = category.indexOf(" - ");
  return separator === -1 ? category : category.slice(0, separator);
}

export function groupRank(group) {
  const index = TEMPLATE_GROUP_ORDER.indexOf(group);
  if (index !== -1) {
    return index;
  }
  return group === OTHER_TEMPLATE_GROUP
    ? Number.MAX_SAFE_INTEGER
    : TEMPLATE_GROUP_ORDER.length;
}

export function compareTemplates(a, b) {
  const groupA = groupOf(a.category);
  const groupB = groupOf(b.category);
  return (
    groupRank(groupA) - groupRank(groupB) ||
    groupA.localeCompare(groupB, "zh-Hans") ||
    String(a.name).localeCompare(String(b.name), "zh-Hans") ||
    String(a.slug).localeCompare(String(b.slug))
  );
}

export function sortTemplates(items = templateRegistry) {
  return [...items].sort(compareTemplates);
}

export function getVisibleTemplates(items = templateRegistry) {
  return sortTemplates(
    items.filter((template) => template.isReady && !template.isHiddenFromOverview),
  );
}

export function getTemplateBySlug(slug, items = templateRegistry) {
  return items.find((template) => template.slug === slug) ?? null;
}

export function getTemplateCategories(items = getVisibleTemplates()) {
  const groups = [...new Set(items.map((template) => groupOf(template.category)))].sort(
    (a, b) => groupRank(a) - groupRank(b) || a.localeCompare(b, "zh-Hans"),
  );
  return ["All", ...groups];
}

export function filterTemplates(items, category = "All") {
  if (!category || category === "All") {
    return sortTemplates(items);
  }
  return sortTemplates(items).filter(
    (template) => groupOf(template.category) === category,
  );
}

export function getTemplatePreviewItems(items = getVisibleTemplates()) {
  return items.map((template) => ({
    slug: template.slug,
    name: template.name,
    nameEn: template.nameEn,
    description: template.description,
    source: template.source,
    category: groupOf(template.category),
  }));
}

export function buildTemplatePreviewHref(slug, {
  pathname = typeof window !== "undefined" ? window.location.pathname : "/",
  category,
} = {}) {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  params.set("view", "templates");
  params.set("preview", slug);
  if (category && category !== "All") {
    params.set("category", category);
  } else {
    params.delete("category");
  }
  return `${pathname}?${params.toString()}`;
}

export function buildTemplateRoute(slug, {
  pathname = typeof window !== "undefined" ? window.location.pathname : "/",
} = {}) {
  const params = new URLSearchParams();
  params.set("view", "templates");
  params.set("template", slug);
  return `${pathname}?${params.toString()}`;
}

/** Legacy path-style deep link, kept for parity with Astryx's `/templates/:slug`. */
export function buildTemplatePathHref(slug, { basePath = "/templates" } = {}) {
  return `${basePath.replace(/\/$/, "")}/${encodeURIComponent(slug)}`;
}

export function parseTemplatePath(pathname = "") {
  const match = pathname.match(/\/templates\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function parseTemplateQuery(search = typeof window !== "undefined" ? window.location.search : "") {
  const params = new URLSearchParams(search);
  return {
    view: params.get("view") ?? null,
    category: params.get("category") ?? "All",
    preview: params.get("preview") ?? null,
    template: params.get("template") ?? null,
  };
}
