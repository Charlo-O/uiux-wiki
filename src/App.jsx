import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Box,
  CalendarClock,
  ChartPie,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  CornerDownRight,
  Copy,
  Download,
  FunnelX,
  Grid2X2,
  Heart,
  Info,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  LogIn,
  MessageCircle,
  Mic,
  MousePointer2,
  PanelLeft,
  Pause,
  PenTool,
  Play,
  Plus,
  RefreshCcw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SquareCheck,
  ShoppingCart,
  Square,
  ThumbsDown,
  ThumbsUp,
  Type,
  UserMinus,
  UserPlus,
  UserRound,
  VolumeX,
  X,
} from "lucide-react";
import {
  BookOpen as ParkBookOpen,
  Click as ParkClick,
  Components as ParkComponents,
  GraphicDesign as ParkGraphicDesign,
  LayoutFour as ParkLayoutFour,
  PlayTwo as ParkPlayTwo,
} from "@icon-park/react";
import {
  categoryDescriptions,
  findItem,
  quickQuestions,
  sections,
  uiDocumentSections,
  uiDocumentTabs,
  uiItems,
} from "./data.js";

const initialPlayground = {
  style: "solid",
  state: "default",
  radius: "small",
};

const styleLabels = {
  solid: "实心",
  outline: "描边",
  text: "文字",
};

const stateLabels = {
  default: "默认",
  disabled: "禁用",
  loading: "加载",
};

const radiusLabels = {
  small: "小",
  pill: "胶囊",
};

const headerSections = [
  { id: "all", label: "全部" },
  { id: "components", label: "组件" },
  { id: "comparisons", label: "常见对比" },
  { id: "patterns", label: "交互" },
  { id: "states", label: "状态" },
  { id: "dictionary", label: "词典" },
  { id: "layouts", label: "布局" },
  { id: "styles", label: "样式" },
  { id: "motion", label: "动效" },
];
const sectionLabelById = new Map(sections.map((section) => [section.id, section.label]));

const homeEntryCards = [
  {
    sectionId: "components",
    title: "看组件",
    description: "按钮、输入框、弹窗、表格...",
    Icon: ParkComponents,
    iconVariant: "components",
    iconFill: ["#172554", "#dbeafe", "#ffffff", "#60a5fa"],
  },
  {
    sectionId: "patterns",
    title: "看交互",
    description: "点击、悬停、拖拽、展开...",
    Icon: ParkClick,
    iconVariant: "patterns",
    iconFill: ["#134e4a", "#ccfbf1", "#ffffff", "#2dd4bf"],
  },
  {
    sectionId: "dictionary",
    title: "看状态",
    description: "默认、加载、成功、错误...",
    Icon: ParkBookOpen,
    iconVariant: "dictionary",
    iconFill: ["#4c1d95", "#ede9fe", "#ffffff", "#a78bfa"],
  },
  {
    sectionId: "layouts",
    title: "看布局",
    description: "栅格、容器、间距、对齐...",
    Icon: ParkLayoutFour,
    iconVariant: "layouts",
    iconFill: ["#92400e", "#fef3c7", "#ffffff", "#fbbf24"],
  },
  {
    sectionId: "styles",
    title: "看样式",
    description: "颜色、字体、圆角、阴影...",
    Icon: ParkGraphicDesign,
    iconVariant: "styles",
    iconFill: ["#9f1239", "#ffe4e6", "#ffffff", "#fb7185"],
  },
  {
    sectionId: "motion",
    title: "看动效",
    description: "过渡、微动效、页面动效...",
    Icon: ParkPlayTwo,
    iconVariant: "motion",
    iconFill: ["#075985", "#e0f2fe", "#ffffff", "#38bdf8"],
  },
];

const homePriorityIds = [
  "button",
  "text-field",
  "search",
  "checkbox",
  "switch",
  "select",
  "modal",
  "toast",
  "alert",
  "skeleton",
  "tabs",
  "sidebar",
];

const homeQuickTags = ["按钮", "输入框", "Toast", "Modal", "Skeleton", "Tabs"];

const learnerPaths = [
  {
    title: "产品新人",
    Icon: UserRound,
    points: ["了解常见组件及用途", "掌握交互与状态差异", "快速提升产品表达力"],
  },
  {
    title: "设计新人",
    Icon: PenTool,
    points: ["学习组件样式与规范", "掌握布局与视觉层级", "参考动效提升体验"],
  },
  {
    title: "开发新人",
    Icon: Code2,
    points: ["理解组件结构与状态", "获取实现思路与示例", "减少沟通与实现成本"],
  },
  {
    title: "我只想知道这个 UI 叫什么",
    Icon: CircleHelp,
    points: ["输入或描述 UI 特征", "快速找到名称与解释", "顺便学点相关知识"],
  },
];

const comparisonLinks = [
  { label: "Toast vs Alert vs Modal", icon: MessageCircle, target: "toast" },
  { label: "Button vs Link", icon: Link2, target: "button" },
  { label: "Checkbox vs Switch", icon: SquareCheck, target: "checkbox" },
  { label: "Tabs vs Segmented Control", icon: PanelLeft, target: "tabs" },
];

const deviceModes = [
  { id: "desktop", label: "桌面端" },
  { id: "mobile", label: "移动端" },
];

const comparisonPairs = [
  { leftId: "button", rightId: "link", title: "按钮 vs 链接", note: "按钮执行当前页面动作，链接跳转到页面、位置或资源。" },
  { leftId: "modal", rightId: "drawer", title: "Modal vs Drawer", note: "Modal 阻断任务，Drawer 保留页面上下文，适合详情和编辑。" },
  { leftId: "toast", rightId: "alert", title: "Toast vs Alert", note: "Toast 短暂反馈，Alert 更醒目且更适合持续风险提示。" },
  { leftId: "tooltip", rightId: "popover", title: "Tooltip vs Popover", note: "Tooltip 只解释信息，Popover 可以承载轻量交互内容。" },
  { leftId: "select", rightId: "autocomplete", title: "Select vs Combobox", note: "Select 适合少量固定选项，Combobox 适合搜索和筛选大量选项。" },
  { leftId: "checkbox", rightId: "switch", title: "Checkbox vs Switch", note: "Checkbox 表示选择项，Switch 表示立即生效的开关状态。" },
  { leftId: "tabs", rightId: "bottom-navigation", title: "Tabs vs 底部导航", note: "Tabs 切换同层内容，底部导航承载移动端全局入口。" },
  { leftId: "menu", rightId: "dropdown", title: "Menu vs Dropdown", note: "Menu 是动作集合，Dropdown 多用于选择值或打开列表。" },
  { leftId: "skeleton", rightId: "spinner", title: "Skeleton vs Spinner", note: "Skeleton 保持布局稳定，Spinner 只说明等待。" },
  { leftId: "table", rightId: "list", title: "Table vs List", note: "Table 适合比较字段，List 更适合移动端连续浏览。" },
  { leftId: "pagination", rightId: "carousel", title: "Pagination vs Carousel", note: "Pagination 用于数据分页，Carousel 用于横向浏览少量内容。" },
  { leftId: "sidebar", rightId: "bottom-navigation", title: "Sidebar vs Bottom Nav", note: "Sidebar 适合桌面复杂导航，Bottom Nav 适合移动端高频入口。" },
];

const homeFooterLinks = [
  { label: "组件库", Icon: Box, sectionId: "all" },
  { label: "术语表", Icon: BookOpen, sectionId: "dictionary" },
  { label: "学习路径", Icon: UserRound, sectionId: "patterns" },
  { label: "版本计划", Icon: CalendarClock, sectionId: "motion" },
];

const aiConfigDefaults = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  apiKey: "",
  model: "gpt-4.1-mini",
  techStack: "React + Vite + CSS + lucide-react",
  temperature: 0.25,
};

const aiModes = {
  translate: "交互翻译",
  choose_component: "组件选择",
  generate_spec: "生成规范",
  review: "交互审查",
  coding_prompt: "Prompt 优化",
};

const aiDetailLevels = {
  brief: "简洁",
  standard: "标准",
  detailed: "详细",
};

const aiExamples = [
  "我想让按钮点一下弹出一个可以选东西的小框",
  "卡片 hover 显示详情，点击可以跳转",
  "用户列表里点一行打开右侧详情，删除前要确认",
  "下拉框可以输入搜索并选择用户",
  "左侧面板可以左右拖动调整宽度",
];

const aiSpecLabels = [
  ["trigger", "Trigger"],
  ["pattern", "Pattern"],
  ["states", "States"],
  ["visualFeedback", "Visual feedback"],
  ["keyboard", "Keyboard"],
  ["focus", "Focus"],
  ["mobile", "Mobile"],
  ["animation", "Animation"],
  ["accessibility", "Accessibility"],
  ["edgeCases", "Edge cases"],
];

const workspaceProjectDefaults = {
  id: "default",
  projectName: "Web App",
  framework: "React",
  componentLibrary: "shadcn/ui",
  styling: "CSS",
  platform: "桌面 Web",
  accessibilityLevel: "WCAG-oriented",
  componentMapping: "",
  teamTerms: "",
};

const workspaceExamples = [
  "表格行点击打开详情，右侧有更多操作，删除前需要确认",
  "点按钮弹出可以搜索并选择成员的小面板",
  "卡片 hover 显示操作，点击卡片跳转详情页",
  "移动端底部弹出筛选面板，提交后显示结果数量",
];

const workspaceStructuredFields = [
  ["trigger", "用户触发什么？", "点击表格行 / hover 卡片 / 拖拽分隔条"],
  ["change", "出现什么变化？", "右侧打开详情面板 / 底部弹出筛选面板"],
  ["nextStep", "用户下一步要做什么？", "查看详情 / 选择成员 / 确认删除"],
  ["navigation", "是否会跳转？", "不跳转，保留当前列表上下文"],
  ["form", "是否包含表单？", "包含搜索和多选 / 不包含表单"],
  ["blocking", "是否必须完成？", "不必须完成，可关闭返回"],
  ["mobile", "是否支持移动端？", "小屏使用 Bottom Sheet"],
  ["componentLibrary", "目标组件库是什么？", "shadcn/ui + Radix primitives"],
];

const structuredInputDefaults = Object.fromEntries(workspaceStructuredFields.map(([key]) => [key, ""]));

const patternComparisonNotes = {
  "Popover": "贴近触发器，适合轻量可交互内容。",
  "Modal": "强阻塞，适合必须完成或确认的关键任务。",
  "Dialog": "适合短流程确认，不适合承载大量内容。",
  "Drawer": "适合保留页面上下文的详情、筛选和编辑。",
  "Toast": "适合非阻塞反馈，不适合承载决策。",
  "Tooltip": "只适合解释说明，不承载按钮或表单。",
  "Bottom Sheet": "移动端更自然，适合筛选、分享和选择。",
};

const mobileComponentGroups = [
  { id: "navigation", label: "导航" },
  { id: "input", label: "输入" },
  { id: "feedback", label: "反馈" },
  { id: "gesture", label: "手势" },
  { id: "commerce", label: "业务" },
];

const mobileComponents = [
  {
    id: "mobile-tab-bar",
    title: "底部标签栏",
    english: "Tab Bar",
    group: "navigation",
    summary: "移动端主导航，承载 3-5 个高频入口。",
    usage: "适合首页、分类、消息、我的这类全局入口。",
    preview: "tabbar",
  },
  {
    id: "mobile-nav-bar",
    title: "顶部导航栏",
    english: "Navigation Bar",
    group: "navigation",
    summary: "展示页面标题、返回、搜索和更多操作。",
    usage: "适合详情页、二级页面和任务流程页。",
    preview: "navbar",
  },
  {
    id: "mobile-bottom-sheet",
    title: "底部面板",
    english: "Bottom Sheet",
    group: "feedback",
    summary: "从屏幕底部滑出的承载区。",
    usage: "适合筛选、分享、选择、轻量表单。",
    preview: "sheet",
  },
  {
    id: "mobile-action-sheet",
    title: "操作面板",
    english: "Action Sheet",
    group: "feedback",
    summary: "展示一组与当前对象相关的操作。",
    usage: "适合更多操作、分享、删除前选择。",
    preview: "actions",
  },
  {
    id: "mobile-search-bar",
    title: "搜索栏",
    english: "Search Bar",
    group: "input",
    summary: "移动端关键词输入和快速清除。",
    usage: "适合列表、商品、联系人和命令搜索。",
    preview: "search",
  },
  {
    id: "mobile-otp",
    title: "验证码输入",
    english: "OTP Input",
    group: "input",
    summary: "分格输入短信或邮箱验证码。",
    usage: "适合登录、支付确认、身份校验。",
    preview: "otp",
  },
  {
    id: "mobile-pull-refresh",
    title: "下拉刷新",
    english: "Pull to Refresh",
    group: "gesture",
    summary: "列表顶部下拉触发刷新。",
    usage: "适合动态列表、消息、订单、feed。",
    preview: "refresh",
  },
  {
    id: "mobile-swipe-action",
    title: "滑动操作",
    english: "Swipe Action",
    group: "gesture",
    summary: "横向滑动露出快捷操作。",
    usage: "适合消息删除、收藏、置顶、已读。",
    preview: "swipe",
  },
  {
    id: "mobile-toast",
    title: "移动轻提示",
    english: "Mobile Toast",
    group: "feedback",
    summary: "居中或底部短暂反馈。",
    usage: "适合保存成功、复制成功、网络错误。",
    preview: "toast",
  },
  {
    id: "mobile-product-card",
    title: "商品卡片",
    english: "Product Card",
    group: "commerce",
    summary: "移动端商品信息和购买入口。",
    usage: "适合商城、课程、模板和服务列表。",
    preview: "product",
  },
  {
    id: "mobile-segmented",
    title: "分段控制",
    english: "Segmented Control",
    group: "navigation",
    summary: "在同一页面切换视图或范围。",
    usage: "适合订单状态、榜单周期、内容类型切换。",
    preview: "navbar",
  },
  {
    id: "mobile-floating-action",
    title: "悬浮操作按钮",
    english: "Floating Action Button",
    group: "navigation",
    summary: "浮在内容上方的高频主操作。",
    usage: "适合发布、创建、扫码、快速编辑。",
    preview: "actions",
  },
  {
    id: "mobile-date-picker",
    title: "日期选择器",
    english: "Date Picker",
    group: "input",
    summary: "移动端日期、时间或范围选择。",
    usage: "适合预约、出行、订单筛选和报表范围。",
    preview: "picker",
  },
  {
    id: "mobile-stepper",
    title: "步进器",
    english: "Stepper",
    group: "input",
    summary: "用加减按钮调整数字。",
    usage: "适合数量、人数、库存和评分项。",
    preview: "stepper",
  },
  {
    id: "mobile-form-row",
    title: "表单行",
    english: "Form Row",
    group: "input",
    summary: "移动端设置项、资料项和输入项。",
    usage: "适合个人资料、地址、设置和偏好。",
    preview: "input",
  },
  {
    id: "mobile-empty-state",
    title: "空状态",
    english: "Empty State",
    group: "feedback",
    summary: "解释当前没有内容并引导下一步。",
    usage: "适合搜索无结果、列表为空、首次使用。",
    preview: "empty",
  },
  {
    id: "mobile-skeleton",
    title: "骨架屏",
    english: "Skeleton",
    group: "feedback",
    summary: "数据加载时保持布局稳定。",
    usage: "适合列表、卡片、详情页和 feed 加载。",
    preview: "loading",
  },
  {
    id: "mobile-carousel",
    title: "轮播",
    english: "Carousel",
    group: "gesture",
    summary: "横向滑动浏览图片或卡片。",
    usage: "适合 banner、商品图、教程页和作品集。",
    preview: "swipe",
  },
  {
    id: "mobile-image-viewer",
    title: "图片预览",
    english: "Image Viewer",
    group: "gesture",
    summary: "支持缩放、滑动和关闭的媒体查看。",
    usage: "适合相册、商品详情、聊天图片。",
    preview: "media",
  },
  {
    id: "mobile-checkout-bar",
    title: "结算栏",
    english: "Checkout Bar",
    group: "commerce",
    summary: "固定底部展示金额和主操作。",
    usage: "适合购物车、订单确认、课程购买。",
    preview: "product",
  },
  {
    id: "mobile-coupon",
    title: "优惠券",
    english: "Coupon",
    group: "commerce",
    summary: "展示优惠信息、领取状态和使用条件。",
    usage: "适合营销活动、会员权益、结算页。",
    preview: "product",
  },
  {
    id: "mobile-order-card",
    title: "订单卡片",
    english: "Order Card",
    group: "commerce",
    summary: "聚合订单状态、商品和操作按钮。",
    usage: "适合订单列表、售后、物流状态。",
    preview: "product",
  },
];

function normalize(value) {
  return value.toLowerCase().trim();
}

function itemMatchesQuery(entry, query) {
  const needle = normalize(query);
  if (!needle) return true;
  return [
    entry.id,
    entry.title,
    entry.english,
    entry.summary,
    entry.plain,
    entry.group,
    ...entry.aliases,
    ...entry.tags,
    ...entry.useCases,
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

function normalizeAiEndpoint(endpoint) {
  const value = endpoint.trim().replace(/\/+$/, "");
  if (!value) return "";
  if (value.endsWith("/chat/completions")) return value;
  if (value.endsWith("/v1")) return `${value}/chat/completions`;
  return `${value}/v1/chat/completions`;
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value == null || value === "") return [];
  return [value];
}

function cleanJsonText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return "";
  const withoutFence = trimmed
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  if (withoutFence.startsWith("{")) return withoutFence;
  const match = withoutFence.match(/\{[\s\S]*\}/);
  return match ? match[0] : withoutFence;
}

function normalizePattern(value, fallbackName = "待确认") {
  if (typeof value === "string") {
    return { name: value, summary: "", reason: "" };
  }

  const source = value && typeof value === "object" ? value : {};
  return {
    name: source.name || source.pattern || source.title || fallbackName,
    summary: source.summary || source.description || source.whenToUse || "",
    reason: source.reason || source.rationale || source.risk || source.note || "",
    score: source.score || source.confidence || "",
  };
}

function normalizeQuestion(value, index) {
  if (typeof value === "string") {
    return { question: value, options: [] };
  }

  const source = value && typeof value === "object" ? value : {};
  return {
    question: source.question || `需要确认的问题 ${index + 1}`,
    options: asArray(source.options).map((option) =>
      typeof option === "string"
        ? { label: option, result: "" }
        : { label: option.label || option.text || "选项", result: option.result || option.value || "" },
    ),
  };
}

function normalizeSpec(spec = {}) {
  const source = spec && typeof spec === "object" ? spec : {};
  return {
    trigger: source.trigger || "",
    pattern: source.pattern || source.component || "",
    states: asArray(source.states),
    visualFeedback: source.visualFeedback || source.feedback || "",
    keyboard: source.keyboard || source.keyboardBehavior || "",
    focus: source.focus || source.focusBehavior || "",
    mobile: source.mobile || source.mobileBehavior || source.mobileStrategy || "",
    animation: source.animation || "",
    accessibility: asArray(source.accessibility),
    edgeCases: asArray(source.edgeCases || source.edge_cases),
  };
}

function normalizeAiResult(value, userText) {
  const source = value && typeof value === "object" ? value : {};
  const recommended = normalizePattern(source.recommendedPattern || source.recommendation || source.pattern, "推荐模式");
  const spec = normalizeSpec(source.interactionSpec || source.spec || {});
  const fallbackPrompt = [
    `请根据以下交互需求实现功能：${userText}`,
    "",
    `推荐模式：${recommended.name}`,
    recommended.reason ? `推荐原因：${recommended.reason}` : "",
    spec.trigger ? `Trigger：${spec.trigger}` : "",
    spec.keyboard ? `Keyboard：${spec.keyboard}` : "",
    spec.focus ? `Focus：${spec.focus}` : "",
    spec.mobile ? `Mobile：${spec.mobile}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    understanding: source.understanding || source.summary || `我理解你想处理的是：${userText}`,
    confidence: source.confidence || source.overallConfidence || source.score || "",
    detectedIntents: asArray(source.detectedIntents || source.intents).map((intent) =>
      typeof intent === "string"
        ? { label: intent, value: "" }
        : {
            label: intent.label || intent.name || intent.id || "意图",
            value: intent.value || intent.result || intent.description || "",
            confidence: intent.confidence || "",
          },
    ),
    recommendedPattern: recommended,
    alternatives: asArray(source.alternatives || source.alternativePatterns).map((item) => normalizePattern(item, "备选模式")),
    notRecommended: asArray(source.notRecommended || source.rejectedPatterns || source.antiRecommended).map((item) =>
      normalizePattern(item, "不推荐模式"),
    ),
    clarificationQuestions: asArray(source.clarificationQuestions || source.questions).map(normalizeQuestion),
    interactionSpec: spec,
    componentSuggestions: asArray(source.componentSuggestions || source.components).map((item) =>
      typeof item === "string"
        ? { library: "", components: [item], note: "" }
        : {
            library: item.library || item.source || "",
            components: asArray(item.components || item.component || item.name),
            note: item.note || item.reason || "",
          },
    ),
    antiPatterns: asArray(source.antiPatterns || source.risks || source.commonMistakes).map((item) =>
      typeof item === "string"
        ? { issue: item, recommendation: "" }
        : { issue: item.issue || item.risk || item.name || "风险", recommendation: item.recommendation || item.fix || item.note || "" },
    ),
    codingPrompt: source.codingPrompt || source.prompt || fallbackPrompt,
  };
}

function parseAiResult(content, userText) {
  const jsonText = cleanJsonText(content);
  try {
    return normalizeAiResult(JSON.parse(jsonText), userText);
  } catch {
    return normalizeAiResult(
      {
        understanding: content,
        recommendedPattern: { name: "AI 返回了非 JSON 内容", reason: "可以调整模型或提示词后重试。" },
        codingPrompt: content,
      },
      userText,
    );
  }
}

function findRelatedItemsForAi(input) {
  const text = normalize(input);
  if (!text) return homePriorityIds.map((id) => findItem(id)).filter(Boolean).slice(0, 6);

  const boostedIds = new Set();
  [
    [["弹", "浮层", "小框"], ["popover", "modal", "drawer", "tooltip"]],
    [["下拉", "选择"], ["select", "dropdown", "autocomplete"]],
    [["hover", "悬停"], ["tooltip", "popover", "card"]],
    [["删除", "确认"], ["delete-confirmation", "modal", "toast"]],
    [["拖动", "拉伸", "调整宽度"], ["resizable-panel", "sidebar", "drawer"]],
    [["上传", "拖拽"], ["file-upload", "upload-pattern"]],
    [["搜索", "命令"], ["search", "command-palette"]],
    [["表格", "行"], ["table", "drawer", "filter-panel"]],
  ].forEach(([keywords, ids]) => {
    if (keywords.some((keyword) => text.includes(keyword))) ids.forEach((id) => boostedIds.add(id));
  });

  const scored = uiItems
    .map((entry) => {
      const fields = [entry.title, entry.english, entry.summary, entry.plain, entry.group, ...entry.aliases, ...entry.tags, ...entry.useCases];
      const score =
        (boostedIds.has(entry.id) ? 8 : 0) +
        fields.reduce((sum, field) => {
          const token = normalize(String(field || ""));
          if (!token) return sum;
          if (text.includes(token)) return sum + 4;
          if (token.length >= 2 && text.includes(token.slice(0, 2))) return sum + 1;
          return sum;
        }, 0);
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entry);

  return scored.length > 0 ? scored.slice(0, 8) : homePriorityIds.map((id) => findItem(id)).filter(Boolean).slice(0, 6);
}

function buildAiSystemPrompt() {
  return `你是 uiux.wiki 的 Web Interaction Design Assistant。你的任务是把用户的模糊 Web UI 交互描述转换成专业交互模式、组件建议、可访问性要求和前端实现说明。

只输出 JSON，不要输出 Markdown 围栏。JSON 字段必须尽量包含：
{
  "understanding": "一句话理解用户需求",
  "confidence": "0-100",
  "detectedIntents": [{"label":"Trigger","value":"click"}],
  "recommendedPattern": {"name":"Popover + Select","summary":"一句话说明","reason":"推荐原因"},
  "alternatives": [{"name":"Dialog","whenToUse":"适用条件","reason":"风险或说明"}],
  "notRecommended": [{"name":"Tooltip","reason":"为什么不推荐"}],
  "clarificationQuestions": [{"question":"需要确认什么","options":[{"label":"A","result":"对应结果"}]}],
  "interactionSpec": {
    "trigger": "",
    "pattern": "",
    "states": [],
    "visualFeedback": "",
    "keyboard": "",
    "focus": "",
    "mobile": "",
    "animation": "",
    "accessibility": [],
    "edgeCases": []
  },
  "componentSuggestions": [{"library":"shadcn/ui","components":["Popover","Select"],"note":""}],
  "antiPatterns": [{"issue":"hover-only critical content","recommendation":"替代方案"}],
  "codingPrompt": "可直接复制给 Codex/Cursor/前端的实现 prompt"
}

重点区分：Button vs Link、Tooltip vs Popover、Dialog vs Drawer vs Toast、Select vs Menu vs Combobox、Stretch vs Resize vs Expand。必须给出不推荐模式、键盘行为、焦点返回、移动端策略和常见错误提醒。`;
}

function buildAiUserPrompt({ input, mode, detailLevel, techStack, relatedItems }) {
  return JSON.stringify(
    {
      userText: input,
      mode,
      detailLevel,
      techStack,
      localUiKnowledge: relatedItems.map((entry) => ({
        title: entry.title,
        english: entry.english,
        summary: entry.summary,
        do: entry.do.slice(0, 3),
        dont: entry.dont.slice(0, 3),
        accessibility: entry.accessibility.slice(0, 3),
      })),
    },
    null,
    2,
  );
}

async function requestAiCompletion(config, body, includeResponseFormat = true) {
  const endpoint = normalizeAiEndpoint(config.endpoint);
  const payload = includeResponseFormat ? body : { ...body, response_format: undefined };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey.trim()}`,
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || text || `请求失败：HTTP ${response.status}`;
    const requestError = new Error(message);
    requestError.status = response.status;
    throw requestError;
  }

  return data;
}

async function generateAiAnalysis({ config, input, mode, detailLevel }) {
  if (!input.trim()) throw new Error("先输入一段交互需求。");
  if (!config.endpoint.trim() || !config.apiKey.trim() || !config.model.trim()) {
    throw new Error("请先填写 API 地址、API Key 和模型名称。");
  }

  const relatedItems = findRelatedItemsForAi(input);
  const body = {
    model: config.model.trim(),
    temperature: Number(config.temperature) || 0.25,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildAiSystemPrompt() },
      {
        role: "user",
        content: buildAiUserPrompt({
          input,
          mode,
          detailLevel,
          techStack: config.techStack,
          relatedItems,
        }),
      },
    ],
  };

  let data;
  try {
    data = await requestAiCompletion(config, body, true);
  } catch (requestError) {
    const canRetryWithoutJsonMode =
      requestError.status === 400 ||
      requestError.status === 422 ||
      /response_format|json/i.test(requestError.message || "");
    if (canRetryWithoutJsonMode) {
      data = await requestAiCompletion(config, body, false);
    } else {
      throw requestError;
    }
  }

  const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.output_text || data?.raw || "";
  if (!content) throw new Error("API 返回里没有找到模型输出内容。");

  return {
    result: parseAiResult(content, input),
    relatedItems,
  };
}

function formatMarkdownSpec(result) {
  if (!result) return "";
  const spec = result.interactionSpec || {};
  const lines = [
    `# ${result.recommendedPattern?.name || "交互规范"}`,
    "",
    "## 我理解你的需求",
    result.understanding,
    "",
    "## 推荐模式",
    `- ${result.recommendedPattern?.name || "待确认"}`,
    result.recommendedPattern?.reason ? `- 原因：${result.recommendedPattern.reason}` : "",
    "",
    "## 交互规范",
    ...aiSpecLabels
      .map(([key, label]) => {
        const value = spec[key];
        if (Array.isArray(value)) return value.length ? `- ${label}：${value.join("；")}` : "";
        return value ? `- ${label}：${value}` : "";
      })
      .filter(Boolean),
    "",
    "## 不推荐",
    ...result.notRecommended.map((item) => `- ${item.name}${item.reason ? `：${item.reason}` : ""}`),
    "",
    "## AI Coding Prompt",
    result.codingPrompt || "",
  ];
  return lines.filter((line) => line !== "").join("\n");
}

function formatTicketExport(result, spec = result?.interactionSpec || {}, inputText = "", projectConfig = {}) {
  if (!result) return "";
  const pattern = result.recommendedPattern?.name || spec.pattern || "interaction";
  const criteria = [
    spec.trigger ? `Trigger: ${spec.trigger}` : "",
    spec.pattern ? `Use pattern: ${spec.pattern}` : `Use pattern: ${pattern}`,
    spec.keyboard ? `Keyboard behavior: ${spec.keyboard}` : "",
    spec.focus ? `Focus behavior: ${spec.focus}` : "",
    spec.mobile ? `Mobile behavior: ${spec.mobile}` : "",
    spec.visualFeedback ? `Feedback: ${spec.visualFeedback}` : "",
    Array.isArray(spec.accessibility) && spec.accessibility.length > 0 ? `Accessibility: ${spec.accessibility.join("; ")}` : "",
    Array.isArray(spec.edgeCases) && spec.edgeCases.length > 0 ? `Edge cases: ${spec.edgeCases.join("; ")}` : "",
  ].filter(Boolean);
  const antiPatterns = result.antiPatterns
    .map((item) => `- Avoid ${item.issue}${item.recommendation ? `: ${item.recommendation}` : ""}`)
    .join("\n");

  return [
    `Title: Implement ${pattern} interaction`,
    "",
    "Description:",
    result.understanding || inputText || "Implement the interaction flow described in the spec.",
    "",
    "Project Context:",
    `- Project: ${projectConfig.projectName || "Web App"}`,
    `- Stack: ${buildProjectTechStack({ techStack: "" }, projectConfig) || "Not specified"}`,
    "",
    "Acceptance Criteria:",
    ...(criteria.length > 0 ? criteria.map((item) => `- ${item}`) : ["- Implement the interaction according to the exported spec."]),
    "",
    "Implementation Notes:",
    result.codingPrompt || "Follow the interaction spec and keep keyboard, focus, and mobile behavior complete.",
    antiPatterns ? "\nAnti-patterns:\n" + antiPatterns : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildRuleDebugData({ inputText, result, interactionPoints, patternComparisons, workspaceWarnings, qualityScore }) {
  const source = normalize(inputText || "");
  const termCandidates = [
    "点一下",
    "点击",
    "弹出",
    "弹窗",
    "小框",
    "下拉",
    "hover",
    "悬停",
    "拖拽",
    "拉伸",
    "跳转",
    "删除",
    "确认",
    "筛选",
    "移动端",
    "表单",
  ];
  const matchedTerms = termCandidates.filter((term) => source.includes(normalize(term)));
  const candidatePatterns = patternComparisons.length > 0
    ? patternComparisons.map((pattern) => `${pattern.name} (${pattern.score})`)
    : interactionPoints.map((point) => point.pattern);
  const rejectedPatterns = [
    ...(result?.notRecommended || []).map((item) => ({ name: item.name, reason: item.reason })),
    ...(result?.antiPatterns || []).map((item) => ({ name: item.issue, reason: item.recommendation })),
  ].filter((item) => item.name || item.reason);
  const spec = result?.interactionSpec || {};
  const accessibilityRisks = [
    !spec.keyboard ? "缺少键盘行为说明" : "",
    !spec.focus ? "缺少焦点管理说明" : "",
    !spec.mobile ? "缺少移动端策略" : "",
    ...workspaceWarnings,
  ].filter(Boolean);

  return {
    matchedTerms,
    candidatePatterns,
    rejectedPatterns,
    selectedPattern: result?.recommendedPattern?.name || "待生成",
    confidence: result?.confidence || "",
    qualityScore: result ? qualityScore : "",
    conflictRules: workspaceWarnings,
    accessibilityRisks,
    finalReason: result?.recommendedPattern?.reason || result?.recommendedPattern?.summary || "",
  };
}

function getVariantOptions(selected) {
  return selected.variants.length > 0 ? selected.variants : ["默认视图"];
}

function getActiveVariant(selected, activeVariantById) {
  const options = getVariantOptions(selected);
  const stored = activeVariantById[selected.id];
  return options.includes(stored) ? stored : options[0];
}

function getVariantIndex(selected, variant) {
  const index = getVariantOptions(selected).indexOf(variant);
  return index >= 0 ? index : 0;
}

function variantHas(variant = "", keywords) {
  return keywords.some((keyword) => variant.includes(keyword));
}

function getVariantPreviewClass(variant = "", index = 0) {
  const classes = [`variant-index-${index}`];

  if (variantHas(variant, ["描边", "边框", "线性", "虚线"])) classes.push("variant-outline");
  if (variantHas(variant, ["文字", "正文", "文本"])) classes.push("variant-textual");
  if (variantHas(variant, ["错误", "危险", "删除", "失败"])) classes.push("variant-danger");
  if (variantHas(variant, ["成功", "已选", "开启", "主", "高亮"])) classes.push("variant-success");
  if (variantHas(variant, ["警告", "提示", "通知", "半选"])) classes.push("variant-warning");
  if (variantHas(variant, ["紧凑", "小", "迷你"])) classes.push("variant-compact");
  if (variantHas(variant, ["宽松", "大", "舒展"])) classes.push("variant-spacious");
  if (variantHas(variant, ["深色", "暗色", "暗黑", "高对比"])) classes.push("variant-dark");
  if (variantHas(variant, ["图片", "头像", "图标", "音频", "视频", "媒体"])) classes.push("variant-media");
  if (variantHas(variant, ["底部", "抽屉"])) classes.push("variant-bottom");
  if (variantHas(variant, ["全屏", "页面"])) classes.push("variant-fullscreen");
  if (variantHas(variant, ["加载", "不确定"])) classes.push("variant-loading");
  if (variantHas(variant, ["多选", "分组", "分步", "范围"])) classes.push("variant-grouped");
  if (variantHas(variant, ["只读", "禁用", "关闭"])) classes.push("variant-muted");
  if (variantHas(variant, ["搜索", "建议", "命令"])) classes.push("variant-search");

  return classes.join(" ");
}

const taxonomyPreviewTypes = new Set([
  "text-content",
  "icon-system",
  "divider",
  "panel",
  "code-block",
  "keyboard-key",
  "status-indicator",
  "chart",
  "editor",
  "security",
  "map",
  "help",
  "a11y",
  "a11y-focus",
  "a11y-name",
  "a11y-structure",
  "a11y-announcement",
  "a11y-contrast",
  "a11y-motion",
  "a11y-target",
  "a11y-form",
  "a11y-alt-text",
  "a11y-testing",
  "i18n",
  "i18n-locale",
  "i18n-translation",
  "i18n-plural",
  "i18n-format",
  "i18n-direction",
  "i18n-text",
  "i18n-search",
  "i18n-compliance",
  "react-component",
  "react-preview",
  "mobile-preview",
  "term-card",
  "taxonomy",
]);

function useStoredList(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

async function hashCredential(email, password) {
  const source = `uiux.wiki:${normalize(email)}:${password}`;
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(source);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return window.btoa(unescape(encodeURIComponent(source)));
}

function buildProjectTechStack(aiConfig, projectConfig) {
  const baseStack = [
    aiConfig.techStack,
    projectConfig.framework,
    projectConfig.componentLibrary,
    projectConfig.styling,
    projectConfig.platform,
    projectConfig.accessibilityLevel,
  ]
    .filter(Boolean)
    .join(" + ");
  const componentMapping = String(projectConfig.componentMapping || "").trim();
  const teamTerms = String(projectConfig.teamTerms || "").trim();
  const projectKnowledge = [
    componentMapping ? `自定义组件映射：\n${componentMapping}` : "",
    teamTerms ? `团队术语偏好：\n${teamTerms}` : "",
  ].filter(Boolean);
  return projectKnowledge.length > 0 ? `${baseStack}\n\n项目知识：\n${projectKnowledge.join("\n\n")}` : baseStack;
}

function buildStructuredInputText(values = {}) {
  const lines = workspaceStructuredFields
    .map(([key, label]) => {
      const value = String(values[key] || "").trim();
      return value ? `${label} ${value}` : "";
    })
    .filter(Boolean);
  return lines.length > 0 ? `结构化输入：\n${lines.join("\n")}` : "";
}

function getProjectKnowledgeLines(value, limit = 4) {
  return String(value || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function getSpecCoverage(spec = {}) {
  return aiSpecLabels.filter(([key]) => {
    const value = spec[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length / aiSpecLabels.length;
}

function getQualityBreakdown(result, spec = result?.interactionSpec || {}) {
  if (!result) return 0;
  const numericConfidence = Number.parseInt(String(result.confidence || ""), 10);
  const confidence = Number.isFinite(numericConfidence) ? numericConfidence : 72;
  const coverage = Math.round(getSpecCoverage(spec) * 100);
  const accessibility = Math.min(
    100,
    44 +
      (Array.isArray(spec.accessibility) ? spec.accessibility.length : spec.accessibility ? 1 : 0) * 14 +
      (spec.keyboard ? 14 : 0) +
      (spec.focus ? 14 : 0),
  );
  const risk = result.antiPatterns.length > 0 || result.notRecommended.length > 0 ? 86 : 58;
  const promptReady = result.codingPrompt && result.codingPrompt.length > 80 ? 88 : 62;
  return [
    { key: "clarity", label: "意图清晰度", score: confidence },
    { key: "coverage", label: "Spec 完整度", score: coverage },
    { key: "accessibility", label: "可访问性覆盖", score: accessibility },
    { key: "risk", label: "风险识别", score: risk },
    { key: "prompt", label: "Prompt 可用度", score: promptReady },
  ];
}

function getQualityScore(result, spec = result?.interactionSpec || {}) {
  const breakdown = getQualityBreakdown(result, spec);
  if (!Array.isArray(breakdown)) return 0;
  return Math.round(breakdown.reduce((sum, item) => sum + item.score, 0) / breakdown.length);
}

function mergeResultSpec(result, spec) {
  if (!result) return null;
  return { ...result, interactionSpec: spec };
}

function inferPatternFromText(text) {
  const value = String(text || "");
  if (/删除|确认|危险|不可撤销/.test(value)) return "Dialog / Modal";
  if (/筛选|详情|右侧|侧边|抽屉/.test(value)) return "Drawer";
  if (/底部|移动端|手机/.test(value)) return "Bottom Sheet";
  if (/提示|成功|失败|保存|复制/.test(value)) return "Toast";
  if (/hover|悬停|说明/.test(value)) return "Popover / Tooltip";
  if (/下拉|选择|搜索/.test(value)) return "Combobox / Select";
  if (/拖|滑|刷新|手势/.test(value)) return "Gesture Pattern";
  return "Component Interaction";
}

function detectInteractionPoints(input, result) {
  const source = String(input || "").trim();
  const normalized = source
    .replace(/\r/g, "\n")
    .split(/\n+|[。；;]|(?:，|,)(?=(?:[^“”"]|“[^”]*”|"[^"]*")*$)/)
    .map((part) => part.replace(/^\s*(?:\d+\.|[-*、])\s*/, "").trim())
    .filter((part) => part.length >= 4);

  const parts = normalized.length > 1 ? normalized : source ? [source] : [];
  const uniqueParts = [...new Set(parts)].slice(0, 8);
  const fallbackPattern = result?.recommendedPattern?.name || "待判断";

  return uniqueParts.map((description, index) => ({
    id: `point-${index + 1}`,
    index: index + 1,
    title: description.length > 18 ? `${description.slice(0, 18)}...` : description,
    description,
    pattern: index === 0 && result ? fallbackPattern : inferPatternFromText(description),
    risk: /hover|悬停/.test(description)
      ? "注意不要让关键操作只依赖 hover"
      : /删除|危险/.test(description)
        ? "需要确认、撤销或明确后果"
        : /移动端|底部|手势/.test(description)
          ? "需要提供桌面与移动端差异策略"
          : "需要补齐状态与焦点规则",
  }));
}

function buildPatternComparisons(result) {
  if (!result) return [];
  const candidates = [
    { ...result.recommendedPattern, role: "推荐", tone: "recommended" },
    ...result.alternatives.slice(0, 3).map((item) => ({ ...item, role: "备选", tone: "alternative" })),
    ...result.notRecommended.slice(0, 2).map((item) => ({ ...item, role: "不推荐", tone: "rejected" })),
  ];

  return candidates
    .filter((item) => item?.name)
    .map((item, index) => {
      const noteKey = Object.keys(patternComparisonNotes).find((key) => item.name.includes(key));
      return {
        id: `${item.name}-${index}`,
        role: item.role,
        tone: item.tone,
        name: item.name,
        reason: item.reason || item.summary || patternComparisonNotes[noteKey] || "根据当前交互上下文判断。",
        score: item.tone === "recommended" ? 92 : item.tone === "alternative" ? 74 : 38,
      };
    });
}

function stringifySpecValue(value) {
  if (Array.isArray(value)) return value.join("；");
  return value || "";
}

function getSpecDiffRows(leftVersion, rightVersion) {
  if (!leftVersion || !rightVersion) return [];
  const leftSpec = leftVersion.spec || leftVersion.result?.interactionSpec || {};
  const rightSpec = rightVersion.spec || rightVersion.result?.interactionSpec || {};

  return aiSpecLabels.map(([key, label]) => {
    const left = stringifySpecValue(leftSpec[key]);
    const right = stringifySpecValue(rightSpec[key]);
    return {
      key,
      label,
      left,
      right,
      changed: left !== right,
    };
  });
}

function getVersionSummary(version) {
  return {
    title: version?.title || "交互规范",
    pattern: version?.result?.recommendedPattern?.name || "待判断",
    score: version?.qualityScore || getQualityScore(version?.result, version?.spec),
    point: version?.activePoint?.title || "整体分析",
  };
}

function getWorkspaceWarnings(points, analyses) {
  const text = points.map((point) => point.description).join(" ");
  const warnings = [];
  if (/hover|悬停/.test(text) && /移动端|手机|触控/.test(text)) {
    warnings.push("包含 hover 与移动端语境，需要提供触控替代交互。");
  }
  if (/删除|危险|不可撤销/.test(text) && !/确认|撤销|二次/.test(text)) {
    warnings.push("包含危险操作，但没有明确确认或撤销策略。");
  }
  const overlayCount = points.filter((point) => /弹|浮层|抽屉|底部|Drawer|Sheet|Modal|Popover/i.test(point.pattern)).length;
  if (overlayCount >= 3) {
    warnings.push("同一流程里浮层较多，建议检查遮挡、焦点和返回路径。");
  }
  const generatedCount = Object.keys(analyses).length;
  if (points.length > 1 && generatedCount > 0 && generatedCount < points.length) {
    warnings.push(`还有 ${points.length - generatedCount} 个交互点没有逐项生成。`);
  }
  return warnings;
}

export function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedId, setSelectedId] = useState("button");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useStoredList("uiux.wiki:favorites", []);
  const [reducedMotion, setReducedMotion] = useStoredList("uiux.wiki:reduced-motion", false);
  const [deviceMode, setDeviceMode] = useStoredList("uiux.wiki:device-mode", "desktop");
  const [aiConfig, setAiConfig] = useStoredList("uiux.wiki:ai-config", aiConfigDefaults);
  const [authUsers, setAuthUsers] = useStoredList("uiux.wiki:auth-users", []);
  const [sessionUserId, setSessionUserId] = useStoredList("uiux.wiki:session-user-id", "");
  const [playground, setPlayground] = useState(initialPlayground);
  const [previewModalId, setPreviewModalId] = useState("");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [authPanelOpen, setAuthPanelOpen] = useState(false);
  const [activeVariantById, setActiveVariantById] = useState({});
  const [notice, setNotice] = useState("");

  const selected = findItem(selectedId);
  const currentUser = authUsers.find((user) => user.id === sessionUserId) || null;
  const previewModalItem = previewModalId ? findItem(previewModalId) : null;
  const activeVariant = getActiveVariant(selected, activeVariantById);
  const previewModalVariant = previewModalItem ? getActiveVariant(previewModalItem, activeVariantById) : "";

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
  }, [reducedMotion]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const visibleItems = useMemo(() => {
    const base = query
      ? uiItems
      : activeSection === "home" || activeSection === "all" || activeSection === "workspace" || activeSection === "comparisons"
        ? uiItems
      : uiItems.filter((entry) => entry.category === activeSection);
    return base.filter((entry) => itemMatchesQuery(entry, query));
  }, [activeSection, query]);

  const listLabel = query
    ? `找到 ${visibleItems.length} 个相关 UI`
    : activeSection === "all"
      ? `全部 ${uiItems.length} 个 UI 条目都在这里。`
    : categoryDescriptions[activeSection] || "选择一个条目查看说明、预览和规范。";

  function chooseSection(sectionId) {
    setActiveSection(sectionId);
    setQuery("");
    setPreviewModalId("");
    if (sectionId === "workspace" || sectionId === "comparisons") return;
    const first =
      sectionId === "home" || sectionId === "all"
        ? uiItems[0]
        : uiItems.find((entry) => entry.category === sectionId);
    if (first) setSelectedId(first.id);
  }

  function chooseItem(entry) {
    setSelectedId(entry.id);
  }

  function openHomePreview(entry) {
    setSelectedId(entry.id);
    setPreviewModalId(entry.id);
  }

  function submitSearch(event) {
    event.preventDefault();
    const first = uiItems.find((entry) => itemMatchesQuery(entry, query));
    if (first) {
      chooseItem(first);
      if (activeSection === "home" || activeSection === "all") setPreviewModalId(first.id);
      setNotice(`已打开「${first.title}」`);
    } else if (query.trim()) {
      setNotice("没有找到完全匹配的条目");
    }
  }

  function clearDialog() {
    setQuery("");
    setActiveSection("home");
    setSelectedId("button");
    setPlayground(initialPlayground);
    setActiveVariantById({});
  }

  function toggleFavorite(id) {
    setFavorites((current) => {
      const exists = current.includes(id);
      setNotice(exists ? "已从收藏移除" : "已收藏");
      return exists ? current.filter((itemId) => itemId !== id) : [...current, id];
    });
  }

  function shareCurrent() {
    const url = `${window.location.origin}${window.location.pathname}#${selected.id}`;
    window.navigator?.clipboard?.writeText(url);
    setNotice("已复制当前条目链接");
  }

  function chooseVariant(entryId, variant) {
    setActiveVariantById((current) => ({
      ...current,
      [entryId]: variant,
    }));
  }

  useEffect(() => {
    function openHashItem() {
      const id = window.location.hash.replace("#", "");
      const entry = uiItems.find((item) => item.id === id);
      if (!entry) return;
      setSelectedId(entry.id);
      setActiveSection(entry.category);
      setPreviewModalId(entry.id);
    }

    openHashItem();
    window.addEventListener("hashchange", openHashItem);
    return () => window.removeEventListener("hashchange", openHashItem);
  }, []);

  const isHomePage = activeSection === "home";
  const isAllPage = activeSection === "all";
  const isWorkspacePage = activeSection === "workspace";
  const isComparisonsPage = activeSection === "comparisons";

  return (
    <main className={`app-shell device-mode-${deviceMode}`}>
      <Header
        activeSection={activeSection}
        onSection={chooseSection}
        deviceMode={deviceMode}
        onDeviceMode={(mode) => setDeviceMode(deviceModes.some((item) => item.id === mode) ? mode : "desktop")}
        onAiOpen={() => setAiPanelOpen(true)}
        currentUser={currentUser}
        onAuthOpen={() => setAuthPanelOpen(true)}
      />

      {isHomePage ? (
        <HomePage
          items={visibleItems}
          query={query}
          setQuery={setQuery}
          onSubmit={submitSearch}
          selectedId={selectedId}
          onChoose={openHomePreview}
          onSection={chooseSection}
          aiConfig={{ ...aiConfigDefaults, ...aiConfig }}
          onAiOpen={() => setAiPanelOpen(true)}
          onNotice={setNotice}
        />
      ) : isAllPage ? (
        <>
          <SearchComposer
            query={query}
            setQuery={setQuery}
            onSubmit={submitSearch}
            showQuickQuestions={false}
          />
          <AllComponentsPage
            items={visibleItems}
            query={query}
            selectedId={selectedId}
            onChoose={openHomePreview}
            deviceMode={deviceMode}
          />
        </>
      ) : isWorkspacePage ? (
        <AiWorkspacePage
          config={{ ...aiConfigDefaults, ...aiConfig }}
          currentUser={currentUser}
          onAiOpen={() => setAiPanelOpen(true)}
          onNotice={setNotice}
        />
      ) : isComparisonsPage ? (
        <CommonComparisonsPage deviceMode={deviceMode} onChoose={openHomePreview} />
      ) : (
        <>
          <SearchComposer query={query} setQuery={setQuery} onSubmit={submitSearch} />

          <section className="atlas-grid" aria-label="UI 图鉴">
            <AtlasListPanel
              activeSection={activeSection}
              listLabel={listLabel}
              items={visibleItems}
              selectedId={selectedId}
              onChoose={chooseItem}
              onClear={clearDialog}
              query={query}
              deviceMode={deviceMode}
            />
            <DetailPanel
              selected={selected}
              playground={playground}
              setPlayground={setPlayground}
              activeVariant={activeVariant}
              onVariantChange={(variant) => chooseVariant(selected.id, variant)}
              deviceMode={deviceMode}
              isFavorite={favorites.includes(selected.id)}
              onFavorite={() => toggleFavorite(selected.id)}
              onShare={shareCurrent}
              aiConfig={{ ...aiConfigDefaults, ...aiConfig }}
              onAiOpen={() => setAiPanelOpen(true)}
              onNotice={setNotice}
            />
          </section>
        </>
      )}

      {!isHomePage && (
        <footer className="site-footer">
          <span>内容由 uiux.wiki 整理，旨在帮助你快速理解界面语言。</span>
        </footer>
      )}

      {(isHomePage || isAllPage) && previewModalItem && (
        <PreviewModal
          selected={previewModalItem}
          playground={playground}
          setPlayground={setPlayground}
          activeVariant={previewModalVariant}
          onVariantChange={(variant) => chooseVariant(previewModalItem.id, variant)}
          deviceMode={deviceMode}
          onClose={() => setPreviewModalId("")}
        />
      )}

      {aiPanelOpen && (
        <AiSettingsPanel
          config={{ ...aiConfigDefaults, ...aiConfig }}
          setConfig={setAiConfig}
          onClose={() => setAiPanelOpen(false)}
          onNotice={setNotice}
        />
      )}

      {authPanelOpen && (
        <AuthPanel
          users={authUsers}
          setUsers={setAuthUsers}
          currentUser={currentUser}
          setSessionUserId={setSessionUserId}
          onClose={() => setAuthPanelOpen(false)}
          onNotice={setNotice}
        />
      )}

      <div className={`toast ${notice ? "show" : ""}`} role="status" aria-live="polite">
        {notice}
      </div>
    </main>
  );
}

function AiSettingsPanel({ config, setConfig, onClose, onNotice }) {
  const isReady = Boolean(config.endpoint?.trim() && config.apiKey?.trim() && config.model?.trim());
  const [testStatus, setTestStatus] = useState("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function updateConfig(key, value) {
    setConfig((current) => ({ ...aiConfigDefaults, ...current, [key]: value }));
  }

  function saveAndClose(event) {
    event.preventDefault();
    onNotice(isReady ? "AI API 已配置" : "AI API 配置已保存，仍缺少必要字段");
    onClose();
  }

  async function testConnection() {
    if (!isReady) {
      setTestStatus("error");
      setTestMessage("请先填写 API 地址、API Key 和模型名称。");
      onNotice("AI API 信息不完整");
      return;
    }

    const body = {
      model: config.model.trim(),
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "只输出 JSON。" },
        { role: "user", content: "{\"ping\":\"uiux.wiki\"}" },
      ],
    };

    setTestStatus("loading");
    setTestMessage("");
    try {
      let data;
      try {
        data = await requestAiCompletion(config, body, true);
      } catch (requestError) {
        const canRetryWithoutJsonMode =
          requestError.status === 400 ||
          requestError.status === 422 ||
          /response_format|json/i.test(requestError.message || "");
        if (!canRetryWithoutJsonMode) throw requestError;
        data = await requestAiCompletion(config, body, false);
      }
      const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.output_text || data?.raw || "";
      if (!content) throw new Error("API 可访问，但没有返回模型内容。");
      setTestStatus("success");
      setTestMessage("连接成功，可以在页面中使用 AI 功能。");
      onNotice("AI API 连接成功");
    } catch (requestError) {
      setTestStatus("error");
      setTestMessage(requestError.message || "连接失败，请检查 API 设置。");
      onNotice("AI API 连接失败");
    }
  }

  return (
    <div className="ai-panel-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="ai-panel ai-settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-panel-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ai-panel-heading">
          <span className="ai-orb" aria-hidden="true">
            <Sparkles size={22} strokeWidth={2} />
          </span>
          <div>
            <h2 id="ai-panel-title">AI API 设置</h2>
            <p>填写 OpenAI-compatible API。保存后，AI 翻译、规范生成、Prompt 导出会在页面对应位置启用。</p>
          </div>
          <button type="button" className="ai-close-button" aria-label="关闭 AI 设置" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form className="ai-settings-form" onSubmit={saveAndClose}>
          <section className="ai-card" aria-labelledby="ai-config-title">
            <div className="ai-section-title">
              <h3 id="ai-config-title">连接信息</h3>
              <span>{isReady ? "可用" : "未完整配置"}</span>
            </div>
            <div className="ai-config-grid">
              <label>
                API 地址
                <input
                  value={config.endpoint}
                  onChange={(event) => updateConfig("endpoint", event.target.value)}
                  placeholder="https://api.openai.com/v1/chat/completions"
                />
              </label>
              <label>
                API Key
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(event) => updateConfig("apiKey", event.target.value)}
                  placeholder="sk-..."
                  autoComplete="off"
                />
              </label>
              <label>
                模型
                <input value={config.model} onChange={(event) => updateConfig("model", event.target.value)} placeholder="gpt-4.1-mini" />
              </label>
              <label>
                默认技术栈
                <input
                  value={config.techStack}
                  onChange={(event) => updateConfig("techStack", event.target.value)}
                  placeholder="React + shadcn/ui"
                />
              </label>
            </div>
            <p className="ai-settings-note">
              这是前端直连模式，Key 会保存在你当前浏览器的 localStorage。公开部署时建议改成后端代理。
            </p>
            {testStatus !== "idle" && (
              <p className={`ai-settings-test ${testStatus}`}>
                {testStatus === "loading" ? "正在测试连接..." : testMessage}
              </p>
            )}
          </section>

          <div className="ai-settings-actions">
            <button type="button" onClick={testConnection} disabled={testStatus === "loading"}>
              {testStatus === "loading" ? "测试中..." : "测试连接"}
            </button>
            <button type="button" onClick={onClose}>
              取消
            </button>
            <button type="submit">保存设置</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function AuthPanel({ users, setUsers, currentUser, setSessionUserId, onClose, onNotice }) {
  const [mode, setMode] = useState(currentUser ? "account" : "login");
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [importText, setImportText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const cleanEmail = normalize(email);
    if (!cleanEmail || !password) {
      setError("请填写邮箱和密码。");
      return;
    }

    setBusy(true);
    try {
      const passwordHash = await hashCredential(cleanEmail, password);
      if (mode === "register") {
        if (!name.trim()) {
          setError("请填写昵称。");
          return;
        }
        if (users.some((user) => normalize(user.email) === cleanEmail)) {
          setError("这个邮箱已经注册。");
          return;
        }
        const user = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: cleanEmail,
          passwordHash,
          createdAt: new Date().toISOString(),
        };
        setUsers((current) => [user, ...current]);
        setSessionUserId(user.id);
        onNotice("注册成功，已登录");
        onClose();
        return;
      }

      const matched = users.find((user) => normalize(user.email) === cleanEmail && user.passwordHash === passwordHash);
      if (!matched) {
        setError("邮箱或密码不正确。");
        return;
      }
      setSessionUserId(matched.id);
      onNotice("登录成功");
      onClose();
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    setSessionUserId("");
    onNotice("已退出登录");
    onClose();
  }

  async function exportLocalData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      currentUserId: currentUser?.id || "",
      keys: [
        "uiux.wiki:auth-users",
        "uiux.wiki:session-user-id",
        "uiux.wiki:workspace-project-profiles",
        "uiux.wiki:workspace-active-project",
        "uiux.wiki:workspace-history",
        "uiux.wiki:workspace-versions",
        "uiux.wiki:workspace-projects",
        "uiux.wiki:ai-config",
        "uiux.wiki:favorites",
      ].reduce((store, key) => {
        store[key] = window.localStorage.getItem(key);
        return store;
      }, {}),
    };
    await copyTextToClipboard(JSON.stringify(payload, null, 2));
    onNotice("已复制本地数据备份");
  }

  function importLocalData() {
    try {
      const payload = JSON.parse(importText);
      if (!payload?.keys || typeof payload.keys !== "object") throw new Error("格式不正确");
      Object.entries(payload.keys).forEach(([key, value]) => {
        if (key.startsWith("uiux.wiki:") && typeof value === "string") {
          window.localStorage.setItem(key, value);
        }
      });
      onNotice("已导入本地数据，请刷新页面查看");
      onClose();
    } catch {
      setError("导入失败，请检查备份 JSON。");
    }
  }

  return (
    <div className="ai-panel-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="ai-panel auth-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-panel-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ai-panel-heading">
          <span className="ai-orb" aria-hidden="true">
            <UserRound size={22} strokeWidth={2} />
          </span>
          <div>
            <h2 id="auth-panel-title">{currentUser ? "账户" : mode === "login" ? "登录" : "注册"}</h2>
            <p>本地账户用于保存工作台历史与偏好；当前版本不依赖后端服务。</p>
          </div>
          <button type="button" className="ai-close-button" aria-label="关闭账户面板" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        {currentUser && mode === "account" ? (
          <div className="auth-account-card">
            <span>当前账户</span>
            <strong>{currentUser.name}</strong>
            <p>{currentUser.email}</p>
            <div className="auth-actions">
              <button type="button" onClick={() => setMode("login")}>
                切换账户
              </button>
              <button type="button" onClick={exportLocalData}>
                导出数据
              </button>
              <button type="button" className="danger" onClick={logout}>
                退出登录
              </button>
            </div>
            <label className="auth-import-box">
              导入备份
              <textarea
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
                placeholder="粘贴从“导出数据”得到的 JSON"
              />
            </label>
            <button type="button" className="ai-generate-button" onClick={importLocalData}>
              导入本地数据
            </button>
            {error && <p className="ai-error">{error}</p>}
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-tabs" role="tablist" aria-label="账户模式">
              <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                登录
              </button>
              <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
                注册
              </button>
            </div>

            {mode === "register" && (
              <label>
                昵称
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：UI 学习者" />
              </label>
            )}
            <label>
              邮箱
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </label>
            <label>
              密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="至少输入一个本地密码"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>
            {error && <p className="ai-error">{error}</p>}
            <button type="submit" className="ai-generate-button" disabled={busy}>
              {busy ? "处理中..." : mode === "login" ? "登录" : "创建账户"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function AiResultView({ status, error, result, relatedItems, onCopyPrompt, onCopyMarkdown }) {
  if (status === "idle" && !result) {
    return (
      <aside className="ai-result-panel empty">
        <Sparkles size={28} strokeWidth={1.8} />
        <strong>等待生成</strong>
        <p>AI 会把你的交互描述拆成推荐模式、反模式、可访问性检查和可复制 Prompt。</p>
      </aside>
    );
  }

  if (status === "loading") {
    return (
      <aside className="ai-result-panel loading">
        <span className="ai-loading-ring" />
        <strong>正在分析交互语义</strong>
        <p>会优先判断组件模式，再补充键盘、焦点、移动端和实现说明。</p>
      </aside>
    );
  }

  if (status === "error" && !result) {
    return (
      <aside className="ai-result-panel empty">
        <CircleHelp size={28} strokeWidth={1.8} />
        <strong>生成失败</strong>
        <p>{error || "请检查 API 设置后重试。"}</p>
      </aside>
    );
  }

  const spec = result.interactionSpec || {};

  return (
    <aside className="ai-result-panel">
      <div className="ai-result-summary">
        <span>推荐</span>
        <h3>{result.recommendedPattern.name}</h3>
        <p>{result.understanding}</p>
        {result.confidence && <b>置信度：{result.confidence}</b>}
      </div>

      <div className="ai-result-actions">
        <button type="button" onClick={onCopyPrompt}>
          <Copy size={17} />
          复制 Prompt
        </button>
        <button type="button" onClick={onCopyMarkdown}>
          <Copy size={17} />
          复制 Markdown
        </button>
      </div>

      {result.detectedIntents.length > 0 && (
        <section className="ai-result-block">
          <h4>意图拆解</h4>
          <div className="ai-intent-list">
            {result.detectedIntents.map((intent, index) => (
              <span key={`${intent.label}-${index}`}>
                <b>{intent.label}</b>
                {intent.value && <em>{intent.value}</em>}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="ai-result-block">
        <h4>模式判断</h4>
        <div className="ai-pattern-grid">
          <article className="recommended">
            <span>推荐</span>
            <strong>{result.recommendedPattern.name}</strong>
            <p>{result.recommendedPattern.reason || result.recommendedPattern.summary}</p>
          </article>
          {result.alternatives.slice(0, 2).map((pattern) => (
            <article key={pattern.name}>
              <span>备选</span>
              <strong>{pattern.name}</strong>
              <p>{pattern.reason || pattern.summary}</p>
            </article>
          ))}
          {result.notRecommended.slice(0, 2).map((pattern) => (
            <article key={pattern.name} className="rejected">
              <span>不推荐</span>
              <strong>{pattern.name}</strong>
              <p>{pattern.reason || pattern.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-result-block">
        <h4>交互规范</h4>
        <div className="ai-spec-grid">
          {aiSpecLabels.map(([key, label]) => {
            const value = spec[key];
            const text = Array.isArray(value) ? value.join("；") : value;
            if (!text) return null;
            return (
              <div key={key}>
                <span>{label}</span>
                <p>{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {(result.componentSuggestions.length > 0 || relatedItems.length > 0) && (
        <section className="ai-result-block">
          <h4>组件建议</h4>
          <div className="ai-component-list">
            {result.componentSuggestions.slice(0, 4).map((item, index) => (
              <span key={`${item.library}-${index}`}>
                <b>{item.library || "组件库"}</b>
                {item.components.join(" / ")}
              </span>
            ))}
            {relatedItems.slice(0, 4).map((entry) => (
              <span key={entry.id}>
                <b>图鉴</b>
                {entry.title} / {entry.english}
              </span>
            ))}
          </div>
        </section>
      )}

      {result.antiPatterns.length > 0 && (
        <section className="ai-result-block">
          <h4>风险提醒</h4>
          <ul className="ai-risk-list">
            {result.antiPatterns.slice(0, 5).map((item, index) => (
              <li key={`${item.issue}-${index}`}>
                <strong>{item.issue}</strong>
                {item.recommendation && <span>{item.recommendation}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.clarificationQuestions.length > 0 && (
        <section className="ai-result-block">
          <h4>需要确认</h4>
          <div className="ai-question-list">
            {result.clarificationQuestions.slice(0, 3).map((question, index) => (
              <article key={`${question.question}-${index}`}>
                <strong>{question.question}</strong>
                {question.options.length > 0 && <p>{question.options.map((option) => option.label).join(" / ")}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="ai-result-block">
        <h4>AI Coding Prompt</h4>
        <pre className="ai-prompt-box">{result.codingPrompt}</pre>
      </section>
    </aside>
  );
}

async function copyTextToClipboard(text) {
  if (!text) return false;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

function downloadTextFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function AiInlineTranslator({ config, onAiOpen, onNotice }) {
  const [input, setInput] = useState(aiExamples[0]);
  const [mode, setMode] = useState("translate");
  const [detailLevel, setDetailLevel] = useState("standard");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const isReady = Boolean(config.endpoint?.trim() && config.apiKey?.trim() && config.model?.trim());
  const relatedPreview = useMemo(() => findRelatedItemsForAi(input).slice(0, 4), [input]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isReady) {
      onNotice("请先通过右上角「AI 增强」配置 API");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const generated = await generateAiAnalysis({ config, input, mode, detailLevel });
      setResult(generated.result);
      setRelatedItems(generated.relatedItems);
      setStatus("success");
      onNotice("AI 增强结果已生成");
    } catch (requestError) {
      setError(requestError.message || "AI 生成失败");
      setStatus("error");
      onNotice("AI 生成失败，请检查 API 设置");
    }
  }

  async function copyPrompt() {
    if (!result) return;
    await copyTextToClipboard(result.codingPrompt);
    onNotice("已复制 AI Prompt");
  }

  async function copyMarkdown() {
    if (!result) return;
    await copyTextToClipboard(formatMarkdownSpec(result));
    onNotice("已复制 Markdown 规范");
  }

  return (
    <section className="home-ai-section" aria-labelledby="home-ai-title">
      <div className="home-ai-heading">
        <div>
          <span className="panel-kicker">AI 增强</span>
          <h2 id="home-ai-title">交互翻译与规范生成</h2>
        </div>
        <span className={`ai-status-pill ${isReady ? "ready" : ""}`}>{isReady ? "API 已配置" : "右上角 AI 增强配置"}</span>
      </div>

      <div className="ai-inline-workspace">
        <form className="ai-input-panel ai-inline-form" onSubmit={handleSubmit}>
          <section className="ai-card">
            <label className="ai-textarea-label" htmlFor="home-ai-input">
              需求描述
              <textarea
                id="home-ai-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="描述你想要的交互，比如：点按钮后出现一个可以选人的小面板"
              />
            </label>

            <div className="ai-example-chips" aria-label="示例需求">
              {aiExamples.map((example) => (
                <button key={example} type="button" onClick={() => setInput(example)}>
                  {example}
                </button>
              ))}
            </div>

            <div className="ai-config-grid ai-control-grid">
              <label>
                生成类型
                <select value={mode} onChange={(event) => setMode(event.target.value)}>
                  {Object.entries(aiModes).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                详细程度
                <select value={detailLevel} onChange={(event) => setDetailLevel(event.target.value)}>
                  {Object.entries(aiDetailLevels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="ai-related-row" aria-label="相关图鉴条目">
              <span>相关条目</span>
              {relatedPreview.map((entry) => (
                <i key={entry.id}>{entry.title}</i>
              ))}
            </div>

            {error && <p className="ai-error">{error}</p>}

            <button className="ai-generate-button" type="submit" disabled={status === "loading"}>
              <Sparkles size={18} strokeWidth={2} />
              {isReady ? "生成 AI 增强结果" : "等待 API 配置"}
            </button>
          </section>
        </form>

        <AiResultView
          status={status}
          error={error}
          result={result}
          relatedItems={relatedItems}
          onCopyPrompt={copyPrompt}
          onCopyMarkdown={copyMarkdown}
        />
      </div>
    </section>
  );
}

function AiDetailEnhancement({ selected, config, onAiOpen, onNotice }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const isReady = Boolean(config.endpoint?.trim() && config.apiKey?.trim() && config.model?.trim());

  const input = useMemo(() => {
    const variants = selected.variants.length > 0 ? `常见变体：${selected.variants.join("、")}` : "";
    const useCases = selected.useCases.length > 0 ? `常见用途：${selected.useCases.join("、")}` : "";
    return [
      `请基于 UI 条目「${selected.title} / ${selected.english}」生成前端交互规范。`,
      `简介：${selected.plain}`,
      useCases,
      variants,
      `需要输出触发方式、状态、键盘行为、焦点管理、可访问性、反模式和可复制 Coding Prompt。`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [selected]);

  useEffect(() => {
    setStatus("idle");
    setError("");
    setResult(null);
    setRelatedItems([]);
  }, [selected.id]);

  async function generateForCurrentItem() {
    if (!isReady) {
      onNotice("请先通过右上角「AI 增强」配置 API");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const generated = await generateAiAnalysis({
        config,
        input,
        mode: "generate_spec",
        detailLevel: "standard",
      });
      setResult(generated.result);
      setRelatedItems(generated.relatedItems);
      setStatus("success");
      onNotice("当前条目的 AI 规范已生成");
    } catch (requestError) {
      setError(requestError.message || "AI 生成失败");
      setStatus("error");
      onNotice("AI 生成失败，请检查 API 设置");
    }
  }

  async function copyPrompt() {
    if (!result) return;
    await copyTextToClipboard(result.codingPrompt);
    onNotice("已复制当前条目 Prompt");
  }

  async function copyMarkdown() {
    if (!result) return;
    await copyTextToClipboard(formatMarkdownSpec(result));
    onNotice("已复制当前条目 Markdown");
  }

  return (
    <div className="answer-section detail-ai-section">
      <div className="detail-ai-heading">
        <div>
          <h3>AI 生成规范</h3>
          <p>{selected.title} 的交互说明、实现 Prompt 和风险检查。</p>
        </div>
        <button
          type="button"
          className="ai-generate-button detail-ai-action"
          onClick={generateForCurrentItem}
          disabled={status === "loading"}
        >
          <Sparkles size={17} strokeWidth={2} />
          {isReady ? "生成" : "等待 API"}
        </button>
      </div>

      {status === "idle" && !result ? (
        <div className="detail-ai-preview">
          <span>{selected.english}</span>
          <strong>生成当前条目的前端交互规范</strong>
          <p>{selected.summary}</p>
        </div>
      ) : (
        <AiResultView
          status={status}
          error={error}
          result={result}
          relatedItems={relatedItems}
          onCopyPrompt={copyPrompt}
          onCopyMarkdown={copyMarkdown}
        />
      )}
    </div>
  );
}

function AiWorkspacePage({ config, currentUser, onAiOpen, onNotice }) {
  const [input, setInput] = useState(workspaceExamples[0]);
  const [mode, setMode] = useState("translate");
  const [detailLevel, setDetailLevel] = useState("standard");
  const [legacyProjectConfigs] = useStoredList("uiux.wiki:workspace-projects", {});
  const [projectProfiles, setProjectProfiles] = useStoredList("uiux.wiki:workspace-project-profiles", {});
  const [activeProjectByOwner, setActiveProjectByOwner] = useStoredList("uiux.wiki:workspace-active-project", {});
  const [allHistory, setAllHistory] = useStoredList("uiux.wiki:workspace-history", []);
  const [allVersions, setAllVersions] = useStoredList("uiux.wiki:workspace-versions", []);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [editedSpec, setEditedSpec] = useState({});
  const [relatedItems, setRelatedItems] = useState([]);
  const [clarificationAnswers, setClarificationAnswers] = useState({});
  const [activePointId, setActivePointId] = useState("all");
  const [compareVersionIds, setCompareVersionIds] = useState([]);
  const [pointAnalyses, setPointAnalyses] = useState({});
  const [pointStatuses, setPointStatuses] = useState({});
  const [structuredInput, setStructuredInput] = useState(structuredInputDefaults);
  const ownerId = currentUser?.id || "guest";
  const legacyProject = legacyProjectConfigs[ownerId] || {};
  const fallbackProject = { ...workspaceProjectDefaults, ...legacyProject, id: legacyProject.id || "default" };
  const ownerProjects = projectProfiles[ownerId]?.length ? projectProfiles[ownerId] : [fallbackProject];
  const activeProjectId = activeProjectByOwner[ownerId] || ownerProjects[0]?.id || "default";
  const projectConfig = {
    ...workspaceProjectDefaults,
    ...(ownerProjects.find((project) => project.id === activeProjectId) || ownerProjects[0] || fallbackProject),
  };
  const projectId = projectConfig.id || "default";
  const isReady = Boolean(config.endpoint?.trim() && config.apiKey?.trim() && config.model?.trim());
  const mergedResult = result ? mergeResultSpec(result, editedSpec) : null;
  const structuredInputText = buildStructuredInputText(structuredInput);
  const workspaceInputText = [input.trim(), structuredInputText].filter(Boolean).join("\n\n");
  const interactionPoints = useMemo(() => detectInteractionPoints(workspaceInputText, mergedResult), [workspaceInputText, mergedResult]);
  const activeInteractionPoint = interactionPoints.find((point) => point.id === activePointId) || null;
  const patternComparisons = buildPatternComparisons(mergedResult);
  const qualityBreakdown = getQualityBreakdown(mergedResult, editedSpec);
  const qualityScore = getQualityScore(mergedResult, editedSpec);
  const workspaceWarnings = getWorkspaceWarnings(interactionPoints, pointAnalyses);
  const ruleDebugData = buildRuleDebugData({
    inputText: workspaceInputText,
    result: mergedResult,
    interactionPoints,
    patternComparisons,
    workspaceWarnings,
    qualityScore,
  });
  const history = allHistory.filter(
    (item) =>
      (item.ownerId || "guest") === ownerId &&
      (item.projectId ? item.projectId === projectId : projectId === "default"),
  );
  const versions = allVersions.filter(
    (item) =>
      (item.ownerId || "guest") === ownerId &&
      (item.projectId ? item.projectId === projectId : projectId === "default"),
  );
  const compareVersions = compareVersionIds
    .map((id) => versions.find((version) => version.id === id))
    .filter(Boolean)
    .slice(0, 2);
  const versionDiffRows = compareVersions.length === 2 ? getSpecDiffRows(compareVersions[0], compareVersions[1]) : [];
  const projectKnowledgePreview = [
    ...getProjectKnowledgeLines(projectConfig.componentMapping),
    ...getProjectKnowledgeLines(projectConfig.teamTerms),
  ];

  useEffect(() => {
    setPointAnalyses({});
    setPointStatuses({});
    setActivePointId("all");
  }, [workspaceInputText]);

  function updateProjectConfig(key, value) {
    setProjectProfiles((current) => {
      const base = current[ownerId]?.length ? current[ownerId] : ownerProjects;
      return {
        ...current,
        [ownerId]: base.map((project) =>
          project.id === projectId ? { ...workspaceProjectDefaults, ...project, [key]: value } : project,
        ),
      };
    });
  }

  function createProjectProfile() {
    const nextProject = {
      ...workspaceProjectDefaults,
      id: `project-${Date.now()}`,
      projectName: `新项目 ${ownerProjects.length + 1}`,
    };
    setProjectProfiles((current) => ({
      ...current,
      [ownerId]: [...ownerProjects, nextProject],
    }));
    setActiveProjectByOwner((current) => ({ ...current, [ownerId]: nextProject.id }));
    onNotice("已创建新项目");
  }

  function duplicateProjectProfile() {
    const nextProject = {
      ...projectConfig,
      id: `project-${Date.now()}`,
      projectName: `${projectConfig.projectName} 副本`,
    };
    setProjectProfiles((current) => ({
      ...current,
      [ownerId]: [...ownerProjects, nextProject],
    }));
    setActiveProjectByOwner((current) => ({ ...current, [ownerId]: nextProject.id }));
    onNotice("已复制当前项目配置");
  }

  function deleteProjectProfile() {
    if (ownerProjects.length <= 1) {
      onNotice("至少保留一个项目");
      return;
    }
    const nextProjects = ownerProjects.filter((project) => project.id !== projectId);
    setProjectProfiles((current) => ({
      ...current,
      [ownerId]: nextProjects,
    }));
    setActiveProjectByOwner((current) => ({ ...current, [ownerId]: nextProjects[0]?.id || "default" }));
    onNotice("已删除当前项目");
  }

  function updateStructuredInput(key, value) {
    setStructuredInput((current) => ({ ...current, [key]: value }));
  }

  function applyStructuredInputToText() {
    if (!structuredInputText) {
      onNotice("先填写一个结构化输入项");
      return;
    }
    setInput((current) => {
      const base = current.trim();
      return base ? `${base}\n\n${structuredInputText}` : structuredInputText;
    });
    setStructuredInput({ ...structuredInputDefaults });
    onNotice("已同步到交互需求");
  }

  function clearStructuredInput() {
    setStructuredInput({ ...structuredInputDefaults });
    onNotice("已清空结构化输入");
  }

  async function generate(extraText = "") {
    if (!isReady) {
      onNotice("请先通过右上角「AI 增强」配置 API");
      return;
    }

    const focusText = activeInteractionPoint
      ? `当前聚焦交互点：${activeInteractionPoint.index}. ${activeInteractionPoint.description}\n请优先给这个交互点生成可执行规范，同时保留整体上下文。`
      : "";
    const userText = [workspaceInputText, focusText, extraText].filter(Boolean).join("\n\n");
    setStatus("loading");
    setError("");
    try {
      const generated = await generateAiAnalysis({
        config: {
          ...config,
          techStack: buildProjectTechStack(config, projectConfig),
        },
        input: userText,
        mode,
        detailLevel,
      });
      setResult(generated.result);
      setEditedSpec(generated.result.interactionSpec || {});
      setRelatedItems(generated.relatedItems);
      setClarificationAnswers({});
      setStatus("success");
      setAllHistory((current) => [
        {
          id: `analysis-${Date.now()}`,
          ownerId,
          projectId,
          projectName: projectConfig.projectName,
          title: generated.result.recommendedPattern?.name || "交互规范",
          input: workspaceInputText,
          baseInput: input,
          structuredInput,
          mode,
          detailLevel,
          result: generated.result,
          relatedItems: generated.relatedItems,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ].filter((item, index) => index < 40));
      const generatedSpec = generated.result.interactionSpec || {};
      const version = {
        id: `version-${Date.now()}`,
        ownerId,
        projectId,
        projectName: projectConfig.projectName,
        title: generated.result.recommendedPattern?.name || "交互规范",
        input: workspaceInputText,
        baseInput: input,
        structuredInput,
        mode,
        detailLevel,
        activePointId,
        activePoint: activeInteractionPoint,
        result: generated.result,
        spec: generatedSpec,
        qualityScore: getQualityScore(generated.result, generatedSpec),
        note: activeInteractionPoint ? `AI 生成：${activeInteractionPoint.title}` : "AI 生成：整体分析",
        createdAt: new Date().toISOString(),
      };
      setAllVersions((current) => [version, ...current].filter((item, index) => index < 80));
      onNotice("工作台结果已生成");
    } catch (requestError) {
      setError(requestError.message || "AI 生成失败");
      setStatus("error");
      onNotice("AI 生成失败，请检查 API 设置");
    }
  }

  async function generatePoint(point, { quiet = false } = {}) {
    if (!point) return;
    if (!isReady) {
      onNotice("请先通过右上角「AI 增强」配置 API");
      return;
    }

    setActivePointId(point.id);
    setPointStatuses((current) => ({ ...current, [point.id]: "loading" }));
    setStatus("loading");
    setError("");
    try {
      const pointText = [
        `整体需求：${workspaceInputText}`,
        `当前只分析第 ${point.index} 个交互点：${point.description}`,
        "请输出这个交互点的推荐模式、反模式、前端规范、移动端策略、可访问性要求和 AI Coding Prompt。",
      ].join("\n\n");
      const generated = await generateAiAnalysis({
        config: {
          ...config,
          techStack: buildProjectTechStack(config, projectConfig),
        },
        input: pointText,
        mode: "generate_spec",
        detailLevel,
      });
      const quality = getQualityScore(generated.result, generated.result.interactionSpec || {});
      const pointRecord = {
        point,
        result: generated.result,
        relatedItems: generated.relatedItems,
        qualityScore: quality,
        createdAt: new Date().toISOString(),
      };
      setPointAnalyses((current) => ({ ...current, [point.id]: pointRecord }));
      setPointStatuses((current) => ({ ...current, [point.id]: "success" }));
      setResult(generated.result);
      setEditedSpec(generated.result.interactionSpec || {});
      setRelatedItems(generated.relatedItems);
      setClarificationAnswers({});
      setStatus("success");
      setAllVersions((current) => [
        {
          id: `version-${Date.now()}-${point.id}`,
          ownerId,
          projectId,
          projectName: projectConfig.projectName,
          title: generated.result.recommendedPattern?.name || `${point.title} 规范`,
          input: workspaceInputText,
          baseInput: input,
          structuredInput,
          mode: "generate_spec",
          detailLevel,
          activePointId: point.id,
          activePoint: point,
          result: generated.result,
          spec: generated.result.interactionSpec || {},
          qualityScore: quality,
          note: `逐项生成：${point.title}`,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ].filter((item, index) => index < 80));
      if (!quiet) onNotice(`已生成「${point.title}」`);
    } catch (requestError) {
      setPointStatuses((current) => ({ ...current, [point.id]: "error" }));
      setError(requestError.message || "交互点生成失败");
      setStatus("error");
      if (!quiet) onNotice("交互点生成失败，请检查 API 设置");
    }
  }

  async function generateAllPoints() {
    if (interactionPoints.length === 0) {
      onNotice("先输入要分析的交互需求");
      return;
    }
    if (!isReady) {
      onNotice("请先通过右上角「AI 增强」配置 API");
      return;
    }

    for (const point of interactionPoints) {
      await generatePoint(point, { quiet: true });
    }
    onNotice("所有交互点已逐项生成");
  }

  function updateSpec(key, value) {
    setEditedSpec((current) => ({
      ...current,
      [key]: Array.isArray(current[key]) ? value.split(/\n|；|;/).map((item) => item.trim()).filter(Boolean) : value,
    }));
  }

  function answerClarification(question, option) {
    setClarificationAnswers((current) => ({
      ...current,
      [question.question]: option.label,
    }));
  }

  function regenerateWithAnswers() {
    const answers = Object.entries(clarificationAnswers)
      .map(([question, answer]) => `澄清问题：${question}\n用户选择：${answer}`)
      .join("\n\n");
    if (!answers) {
      onNotice("先选择一个澄清答案");
      return;
    }
    generate(answers);
  }

  function regenerateWithPattern(patternName) {
    if (!patternName) return;
    generate(`模式对比选择：${patternName}\n请固定推荐模式为「${patternName}」，重新生成完整 Spec，并说明为什么它适合当前需求。`);
  }

  async function copyPrompt() {
    if (!mergedResult) return;
    await copyTextToClipboard(mergedResult.codingPrompt);
    onNotice("已复制工作台 Prompt");
  }

  async function copyMarkdown() {
    if (!mergedResult) return;
    await copyTextToClipboard(formatMarkdownSpec(mergedResult));
    onNotice("已复制 Markdown Spec");
  }

  async function copyJson() {
    if (!mergedResult) return;
    await copyTextToClipboard(JSON.stringify(mergedResult, null, 2));
    onNotice("已复制 JSON");
  }

  function downloadMarkdown() {
    if (!mergedResult) return;
    downloadTextFile("interaction-spec.md", formatMarkdownSpec(mergedResult), "text/markdown;charset=utf-8");
    onNotice("已下载 Markdown Spec");
  }

  function downloadJson() {
    if (!mergedResult) return;
    const payload = {
      project: projectConfig,
      input: workspaceInputText,
      result: mergedResult,
      ruleDebug: ruleDebugData,
      exportedAt: new Date().toISOString(),
    };
    downloadTextFile("interaction-analysis.json", JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    onNotice("已下载 JSON");
  }

  async function copyTicket() {
    if (!mergedResult) return;
    await copyTextToClipboard(formatTicketExport(mergedResult, editedSpec, workspaceInputText, projectConfig));
    onNotice("已复制 Jira / Linear Ticket");
  }

  async function copyRuleDebug() {
    await copyTextToClipboard(JSON.stringify(ruleDebugData, null, 2));
    onNotice("已复制规则调试 JSON");
  }

  function restoreAiSpecSuggestion() {
    if (!result?.interactionSpec) return;
    setEditedSpec(result.interactionSpec);
    onNotice("已恢复 AI 建议 Spec");
  }

  function restoreHistory(item) {
    setInput(item.baseInput || item.input);
    setStructuredInput({ ...structuredInputDefaults, ...(item.structuredInput || {}) });
    setMode(item.mode || "translate");
    setDetailLevel(item.detailLevel || "standard");
    setResult(item.result);
    setEditedSpec(item.result?.interactionSpec || {});
    setRelatedItems(item.relatedItems || []);
    setStatus("success");
    setError("");
  }

  function clearCurrentHistory() {
    setAllHistory((current) =>
      current.filter(
        (item) =>
          !(
            (item.ownerId || "guest") === ownerId &&
            (item.projectId ? item.projectId === projectId : projectId === "default")
          ),
      ),
    );
    onNotice("已清空当前项目历史");
  }

  function restorePointAnalysis(pointId) {
    const record = pointAnalyses[pointId];
    if (!record) return;
    setActivePointId(pointId);
    setResult(record.result);
    setEditedSpec(record.result?.interactionSpec || {});
    setRelatedItems(record.relatedItems || []);
    setStatus("success");
    setError("");
    onNotice(`已切换到「${record.point.title}」`);
  }

  function saveCurrentVersion() {
    if (!mergedResult) {
      onNotice("先生成或恢复一份结果再保存版本");
      return;
    }

    const version = {
      id: `version-${Date.now()}`,
      ownerId,
      projectId,
      projectName: projectConfig.projectName,
      title: mergedResult.recommendedPattern?.name || "交互规范",
      input: workspaceInputText,
      baseInput: input,
      structuredInput,
      mode,
      detailLevel,
      activePointId,
      activePoint: activeInteractionPoint,
      result: mergedResult,
      spec: editedSpec,
      qualityScore,
      note: activeInteractionPoint ? `手动保存：${activeInteractionPoint.title}` : "手动保存：整体分析",
      createdAt: new Date().toISOString(),
    };
    setAllVersions((current) => [version, ...current].filter((item, index) => index < 80));
    onNotice("已保存当前版本");
  }

  function restoreVersion(version) {
    setInput(version.baseInput || version.input || "");
    setStructuredInput({ ...structuredInputDefaults, ...(version.structuredInput || {}) });
    setMode(version.mode || "translate");
    setDetailLevel(version.detailLevel || "standard");
    setActivePointId(version.activePointId || "all");
    setResult(version.result);
    setEditedSpec(version.spec || version.result?.interactionSpec || {});
    setRelatedItems(version.relatedItems || []);
    setStatus("success");
    setError("");
    onNotice("已恢复版本");
  }

  function clearCurrentVersions() {
    setAllVersions((current) =>
      current.filter(
        (item) =>
          !(
            (item.ownerId || "guest") === ownerId &&
            (item.projectId ? item.projectId === projectId : projectId === "default")
          ),
      ),
    );
    setCompareVersionIds([]);
    onNotice("已清空当前项目版本");
  }

  function toggleCompareVersion(versionId) {
    setCompareVersionIds((current) => {
      if (current.includes(versionId)) return current.filter((id) => id !== versionId);
      return [versionId, ...current].slice(0, 2);
    });
  }

  return (
    <section className="workspace-page" aria-labelledby="workspace-title">
      <div className="workspace-hero">
        <div>
          <span className="panel-kicker">Interaction Workspace</span>
          <h1 id="workspace-title">AI 交互规范工作台</h1>
          <p>面向 AI Coding 的交互决策、规范编辑与导出。</p>
        </div>
        <div className="workspace-hero-actions">
          <span className={`ai-status-pill ${isReady ? "ready" : ""}`}>{isReady ? "API 已配置" : "右上角 AI 增强配置"}</span>
          <span>{currentUser ? currentUser.name : "访客模式"}</span>
        </div>
      </div>

      <div className="workspace-grid">
        <form className="workspace-panel workspace-input-panel" onSubmit={(event) => { event.preventDefault(); generate(); }}>
          <label className="ai-textarea-label" htmlFor="workspace-input">
            交互需求
            <textarea
              id="workspace-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="输入一句或一段 Web / 移动端交互需求"
            />
          </label>

          <div className="ai-example-chips" aria-label="工作台示例">
            {workspaceExamples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setInput(example);
                  setStructuredInput({ ...structuredInputDefaults });
                }}
              >
                {example}
              </button>
            ))}
          </div>

          <div className="workspace-structured-card">
            <div className="workspace-section-heading">
              <h3>结构化输入</h3>
              <span>{workspaceStructuredFields.filter(([key]) => String(structuredInput[key] || "").trim()).length}</span>
            </div>
            <div className="workspace-structured-grid">
              {workspaceStructuredFields.map(([key, label, placeholder]) => (
                <label key={key}>
                  {label}
                  <input
                    value={structuredInput[key] || ""}
                    onChange={(event) => updateStructuredInput(key, event.target.value)}
                    placeholder={placeholder}
                  />
                </label>
              ))}
            </div>
            <div className="workspace-mini-actions">
              <button type="button" className="workspace-mini-action secondary" onClick={applyStructuredInputToText}>
                同步到需求
              </button>
              <button type="button" className="workspace-mini-action secondary" onClick={clearStructuredInput}>
                清空结构化输入
              </button>
            </div>
          </div>

          <div className="interaction-points-card">
            <div className="workspace-section-heading">
              <h3>多交互点</h3>
              <span>{interactionPoints.length || 0}</span>
            </div>
            <div className="workspace-mini-actions">
              <button
                type="button"
                className="workspace-mini-action"
                onClick={generateAllPoints}
                disabled={status === "loading" || interactionPoints.length === 0}
              >
                逐项生成全部
              </button>
              {activeInteractionPoint && (
                <button
                  type="button"
                  className="workspace-mini-action secondary"
                  onClick={() => generatePoint(activeInteractionPoint)}
                  disabled={status === "loading"}
                >
                  生成选中点
                </button>
              )}
            </div>
            <div className="interaction-point-list">
              <button
                type="button"
                className={activePointId === "all" ? "active" : ""}
                onClick={() => setActivePointId("all")}
              >
                <strong>整体分析</strong>
                <span>保留全部上下文</span>
              </button>
              {interactionPoints.map((point) => {
                const statusLabel =
                  pointStatuses[point.id] === "loading"
                    ? "生成中"
                    : pointStatuses[point.id] === "error"
                      ? "失败"
                      : pointAnalyses[point.id]
                        ? "已生成"
                        : "未生成";
                return (
                  <button
                    key={point.id}
                    type="button"
                    className={activePointId === point.id ? "active" : ""}
                    onClick={() => setActivePointId(point.id)}
                  >
                    <strong>{point.index}. {point.title}</strong>
                    <span>{point.pattern} · {statusLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {workspaceWarnings.length > 0 && (
            <div className="workspace-warning-list" aria-label="工作台风险提示">
              {workspaceWarnings.map((warning) => (
                <span key={warning}>{warning}</span>
              ))}
            </div>
          )}

          <div className="workspace-controls">
            <label>
              模式
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                {Object.entries(aiModes).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label>
              详细度
              <select value={detailLevel} onChange={(event) => setDetailLevel(event.target.value)}>
                {Object.entries(aiDetailLevels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="workspace-project-card">
            <div className="workspace-section-heading">
              <h3>项目配置</h3>
              <span>{ownerProjects.length}</span>
            </div>
            <div className="workspace-project-switcher">
              <label>
                当前项目
                <select
                  value={projectId}
                  onChange={(event) =>
                    setActiveProjectByOwner((current) => ({ ...current, [ownerId]: event.target.value }))
                  }
                >
                  {ownerProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectName || project.id}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <button type="button" onClick={createProjectProfile}>新建</button>
                <button type="button" onClick={duplicateProjectProfile}>复制</button>
                <button type="button" onClick={deleteProjectProfile}>删除</button>
              </div>
            </div>
            <div className="workspace-controls">
              {[
                ["projectName", "项目"],
                ["framework", "框架"],
                ["componentLibrary", "组件库"],
                ["styling", "样式"],
                ["platform", "平台"],
                ["accessibilityLevel", "可访问性"],
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    value={projectConfig[key] || ""}
                    onChange={(event) => updateProjectConfig(key, event.target.value)}
                  />
                </label>
              ))}
            </div>
            <div className="workspace-project-knowledge">
              <label>
                自定义组件映射
                <textarea
                  value={projectConfig.componentMapping || ""}
                  onChange={(event) => updateProjectConfig("componentMapping", event.target.value)}
                  placeholder={"Drawer = AppSidePanel\nToast = useToast\nCombobox = MemberPicker"}
                />
              </label>
              <label>
                团队术语偏好
                <textarea
                  value={projectConfig.teamTerms || ""}
                  onChange={(event) => updateProjectConfig("teamTerms", event.target.value)}
                  placeholder={"侧滑 = Drawer\n轻提示 = Toast\n确认框 = AlertDialog"}
                />
              </label>
            </div>
            <div className="workspace-project-preview">
              <span>AI 上下文</span>
              <div>
                {projectKnowledgePreview.length > 0 ? (
                  projectKnowledgePreview.map((line, index) => <b key={`${line}-${index}`}>{line}</b>)
                ) : (
                  <b>未配置项目专属映射，AI 将使用通用组件建议。</b>
                )}
              </div>
            </div>
          </div>

          {error && <p className="ai-error">{error}</p>}
          <button type="submit" className="ai-generate-button" disabled={status === "loading"}>
            <Sparkles size={18} />
            {status === "loading" ? "生成中..." : "生成交互规范"}
          </button>
        </form>

        <div className="workspace-result-column">
          {mergedResult && (
            <div className="workspace-score-card">
              <div>
                <span>质量评分</span>
                <p>{mergedResult.recommendedPattern?.name || "推荐模式待确认"}</p>
              </div>
              <strong>{qualityScore}</strong>
              <div className="workspace-score-breakdown">
                {qualityBreakdown.map((item) => (
                  <span key={item.key}>
                    <b>{item.label}</b>
                    <i>{item.score}</i>
                  </span>
                ))}
              </div>
            </div>
          )}
          <AiResultView
            status={status}
            error={error}
            result={mergedResult}
            relatedItems={relatedItems}
            onCopyPrompt={copyPrompt}
            onCopyMarkdown={copyMarkdown}
          />
        </div>
      </div>

      <div className="workspace-tools-grid">
        {mergedResult && (
          <>
            <section className="workspace-panel">
              <div className="workspace-section-heading">
                <h2>模式对比</h2>
                <span>{patternComparisons.length}</span>
              </div>
              <div className="pattern-comparison-grid">
                {patternComparisons.map((pattern) => (
                  <article key={pattern.id} className={pattern.tone}>
                    <span>{pattern.role}</span>
                    <strong>{pattern.name}</strong>
                    <p>{pattern.reason}</p>
                    <b>{pattern.score}</b>
                    <button type="button" onClick={() => regenerateWithPattern(pattern.name)} disabled={status === "loading"}>
                      按此模式生成
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="workspace-panel">
              <div className="workspace-section-heading">
                <h2>交互点导航</h2>
                <span>{interactionPoints.length}</span>
              </div>
              <div className="interaction-review-list">
                {interactionPoints.map((point) => (
                  <article key={point.id}>
                    <span>{point.pattern}</span>
                    <strong>{point.description}</strong>
                    <p>{point.risk}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="workspace-panel">
              <div className="workspace-section-heading">
                <h2>Rule Debugger</h2>
                <button type="button" onClick={copyRuleDebug}>复制 JSON</button>
              </div>
              <div className="rule-debug-grid">
                <article>
                  <span>命中模糊词</span>
                  <p>{ruleDebugData.matchedTerms.length ? ruleDebugData.matchedTerms.join(" / ") : "未命中明显模糊词"}</p>
                </article>
                <article>
                  <span>候选模式</span>
                  <p>{ruleDebugData.candidatePatterns.length ? ruleDebugData.candidatePatterns.join(" / ") : "等待生成候选模式"}</p>
                </article>
                <article>
                  <span>最终选择</span>
                  <p>{ruleDebugData.selectedPattern}{ruleDebugData.confidence ? ` · ${ruleDebugData.confidence}` : ""}</p>
                </article>
                <article>
                  <span>风险规则</span>
                  <p>{ruleDebugData.accessibilityRisks.length ? ruleDebugData.accessibilityRisks.join("；") : "未发现明显风险"}</p>
                </article>
              </div>
              <div className="rule-debug-stack">
                <span>拒绝模式 / 反模式</span>
                {ruleDebugData.rejectedPatterns.length > 0 ? ruleDebugData.rejectedPatterns.slice(0, 4).map((item, index) => (
                  <p key={`${item.name}-${index}`}>{item.name}{item.reason ? `：${item.reason}` : ""}</p>
                )) : <p>当前结果没有拒绝模式。</p>}
              </div>
            </section>

            <section className="workspace-panel">
              <div className="workspace-section-heading">
                <h2>澄清问题</h2>
                <button type="button" onClick={regenerateWithAnswers}>带答案重新生成</button>
              </div>
              <div className="workspace-question-stack">
                {mergedResult.clarificationQuestions.length > 0 ? (
                  mergedResult.clarificationQuestions.slice(0, 4).map((question) => (
                    <article key={question.question}>
                      <strong>{question.question}</strong>
                      <div>
                        {question.options.length > 0 ? question.options.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            className={clarificationAnswers[question.question] === option.label ? "active" : ""}
                            onClick={() => answerClarification(question, option)}
                          >
                            {option.label}
                          </button>
                        )) : <span>暂无选项</span>}
                      </div>
                    </article>
                  ))
                ) : (
                  <p>当前结果没有需要澄清的问题。</p>
                )}
              </div>
            </section>

            <section className="workspace-panel">
              <div className="workspace-section-heading">
                <h2>Spec Editor</h2>
                <div className="workspace-heading-actions">
                  <span>可编辑字段</span>
                  <button type="button" onClick={restoreAiSpecSuggestion}>恢复 AI 建议</button>
                </div>
              </div>
              <div className="spec-editor-grid">
                {aiSpecLabels.map(([key, label]) => {
                  const value = editedSpec[key];
                  const text = Array.isArray(value) ? value.join("\n") : value || "";
                  return (
                    <label key={key}>
                      {label}
                      <textarea value={text} onChange={(event) => updateSpec(key, event.target.value)} />
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="workspace-panel">
              <div className="workspace-section-heading">
                <h2>导出</h2>
                <span>Prompt / Spec / JSON / Ticket</span>
              </div>
            <div className="workspace-export-actions">
              <button type="button" onClick={copyPrompt}><Copy size={16} />Prompt</button>
              <button type="button" onClick={copyMarkdown}><Copy size={16} />Markdown</button>
              <button type="button" onClick={copyJson}><Copy size={16} />JSON</button>
              <button type="button" onClick={downloadMarkdown}><Download size={16} />下载 Markdown</button>
              <button type="button" onClick={downloadJson}><Download size={16} />下载 JSON</button>
              <button type="button" onClick={copyTicket}><Copy size={16} />Jira / Linear</button>
              <button type="button" onClick={saveCurrentVersion}><Copy size={16} />保存版本</button>
            </div>
          </section>
          </>
        )}

        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <h2>逐项结果</h2>
            <span>{Object.keys(pointAnalyses).length}/{interactionPoints.length}</span>
          </div>
          <div className="point-analysis-list">
            {Object.keys(pointAnalyses).length > 0 ? interactionPoints
              .filter((point) => pointAnalyses[point.id])
              .map((point) => {
                const record = pointAnalyses[point.id];
                return (
                  <article key={point.id}>
                    <span>{point.index}. {point.title}</span>
                    <strong>{record.result.recommendedPattern?.name || "推荐模式"}</strong>
                    <p>{record.result.understanding}</p>
                    <button type="button" onClick={() => restorePointAnalysis(point.id)}>
                      恢复到主结果
                    </button>
                  </article>
                );
              }) : <p>点击“逐项生成全部”或选择单个交互点生成。</p>}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <h2>历史</h2>
            <div className="workspace-heading-actions">
              <span>{history.length}</span>
              <button type="button" onClick={clearCurrentHistory} disabled={history.length === 0}>清空历史</button>
            </div>
          </div>
          <div className="workspace-history-list">
            {history.length > 0 ? history.map((item) => (
              <button key={item.id} type="button" onClick={() => restoreHistory(item)}>
                <strong>{item.title}</strong>
                <span>{item.projectName || "Web App"} · {new Date(item.createdAt).toLocaleString()}</span>
              </button>
            )) : <p>生成后会在这里保存最近记录。</p>}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <h2>版本快照</h2>
            <div className="workspace-heading-actions">
              <span>{versions.length}</span>
              <button type="button" onClick={clearCurrentVersions} disabled={versions.length === 0}>清空版本</button>
            </div>
          </div>
          <div className="workspace-version-list">
            {versions.length > 0 ? versions.slice(0, 8).map((version) => {
              const summary = getVersionSummary(version);
              return (
                <article key={version.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={compareVersionIds.includes(version.id)}
                      onChange={() => toggleCompareVersion(version.id)}
                    />
                    对比
                  </label>
                  <button type="button" onClick={() => restoreVersion(version)}>
                    <strong>{summary.title}</strong>
                    <span>{summary.point} · {summary.score} 分 · {new Date(version.createdAt).toLocaleString()}</span>
                  </button>
                </article>
              );
            }) : <p>生成或手动保存后会出现版本快照。</p>}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <h2>版本对比</h2>
            <span>{compareVersions.length}/2</span>
          </div>
          {compareVersions.length === 2 ? (
            <div className="version-compare-table">
              <div className="version-compare-head">
                <strong>{getVersionSummary(compareVersions[0]).title}</strong>
                <strong>{getVersionSummary(compareVersions[1]).title}</strong>
              </div>
              {versionDiffRows.map((row) => (
                <article key={row.key} className={row.changed ? "changed" : ""}>
                  <span>{row.label}</span>
                  <p>{row.left || "未填写"}</p>
                  <p>{row.right || "未填写"}</p>
                </article>
              ))}
            </div>
          ) : (
            <p>在版本快照里勾选两个版本进行对比。</p>
          )}
        </section>
      </div>
    </section>
  );
}

function MobileComponentsPage({ onNotice }) {
  const [activeGroup, setActiveGroup] = useState("all");
  const visibleMobileItems = activeGroup === "all"
    ? mobileComponents
    : mobileComponents.filter((entry) => entry.group === activeGroup);

  return (
    <section className="mobile-page" aria-labelledby="mobile-title">
      <div className="mobile-page-heading">
        <div>
          <span className="panel-kicker">Mobile UI</span>
          <h1 id="mobile-title">移动端 UI 组件</h1>
          <p>和桌面端图鉴分开维护，专注移动端导航、输入、反馈和手势。</p>
        </div>
        <span>{visibleMobileItems.length} 个组件</span>
      </div>

      <div className="mobile-filter-row" aria-label="移动端组件分类">
        <button type="button" className={activeGroup === "all" ? "active" : ""} onClick={() => setActiveGroup("all")}>
          全部
        </button>
        {mobileComponentGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={activeGroup === group.id ? "active" : ""}
            onClick={() => setActiveGroup(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="mobile-component-grid">
        {visibleMobileItems.map((entry) => (
          <article key={entry.id} className="mobile-component-card">
            <MobilePreview type={entry.preview} />
            <div>
              <span>{mobileComponentGroups.find((group) => group.id === entry.group)?.label}</span>
              <h2>{entry.title}</h2>
              <em>{entry.english}</em>
              <p>{entry.summary}</p>
              <small>{entry.usage}</small>
              <ul className="mobile-component-notes">
                <li>触控热区清楚</li>
                <li>状态反馈及时</li>
              </ul>
            </div>
            <button type="button" onClick={() => onNotice(`已查看「${entry.title}」`)}>
              查看
              <ChevronRight size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function MobilePreview({ type }) {
  return (
    <div className={`mobile-preview-phone mobile-preview-${type}`} aria-hidden="true">
      <div className="mobile-phone-top" />
      <div className="mobile-phone-screen">
        {type === "tabbar" && (
          <>
            <i className="mobile-hero-block" />
            <i /><i /><i />
            <div className="mobile-tabbar"><b /><b /><b /><b /></div>
          </>
        )}
        {type === "navbar" && (
          <>
            <div className="mobile-navbar"><b /><span /><b /></div>
            <i className="mobile-hero-block" /><i /><i />
          </>
        )}
        {type === "sheet" && (
          <>
            <i /><i /><i />
            <div className="mobile-sheet"><b /><span /><span /><i /></div>
          </>
        )}
        {type === "actions" && (
          <>
            <i className="mobile-hero-block" />
            <div className="mobile-action-sheet"><span /><span /><span className="danger" /></div>
          </>
        )}
        {type === "search" && (
          <>
            <div className="mobile-search-preview"><Search size={13} /><span /></div>
            <i /><i /><i />
          </>
        )}
        {type === "button" && (
          <>
            <i className="mobile-hero-block" />
            <i /><i />
            <div className="mobile-primary-action-preview">继续</div>
          </>
        )}
        {type === "card" && (
          <>
            <div className="mobile-content-card-preview"><b /><span /><span /></div>
            <div className="mobile-content-card-preview compact"><b /><span /></div>
          </>
        )}
        {type === "otp" && (
          <>
            <i className="mobile-hero-block" />
            <div className="mobile-otp-row"><b /><b /><b /><b /></div>
          </>
        )}
        {type === "refresh" && (
          <>
            <div className="mobile-refresh-dot" />
            <i /><i /><i /><i />
          </>
        )}
        {type === "swipe" && (
          <>
            <div className="mobile-swipe-row"><span /><b>删</b></div>
            <i /><i />
          </>
        )}
        {type === "toast" && (
          <>
            <i /><i />
            <div className="mobile-toast-preview">已保存</div>
          </>
        )}
        {type === "product" && (
          <>
            <div className="mobile-product-img" />
            <i /><i />
            <i className="mobile-product-button" />
          </>
        )}
        {type === "scanner" && (
          <>
            <div className="mobile-scan-frame"><b /><b /><b /><b /></div>
            <i className="mobile-product-button" />
          </>
        )}
        {type === "media" && (
          <>
            <div className="mobile-media-preview"><Play size={18} fill="currentColor" /></div>
            <i /><i />
          </>
        )}
        {type === "picker" && (
          <>
            <div className="mobile-picker-preview">{Array.from({ length: 9 }).map((_, index) => <b key={index} />)}</div>
            <i className="mobile-product-button" />
          </>
        )}
        {type === "stepper" && (
          <>
            <i className="mobile-hero-block" />
            <div className="mobile-stepper-preview"><b>-</b><span>2</span><b>+</b></div>
          </>
        )}
        {type === "empty" && (
          <>
            <div className="mobile-empty-preview"><CircleHelp size={18} /><b /></div>
            <i className="mobile-product-button" />
          </>
        )}
        {type === "browser" && (
          <>
            <div className="mobile-browser-preview"><b /><span /><span /></div>
            <i /><i />
          </>
        )}
        {type === "input" && (
          <>
            <div className="mobile-input-preview"><span>Label</span><b /></div>
            <div className="mobile-input-preview"><span>Value</span><b /></div>
          </>
        )}
        {type === "banner" && (
          <>
            <div className="mobile-banner-preview"><b /><span /></div>
            <i /><i /><i />
          </>
        )}
        {type === "permission" && (
          <>
            <i className="mobile-hero-block" />
            <div className="mobile-permission-preview"><strong>Allow?</strong><b /><b /></div>
          </>
        )}
        {type === "loading" && (
          <>
            <div className="mobile-loading-preview"><b /><b /><b /></div>
            <i /><i />
          </>
        )}
        {type === "list" && (
          <>
            <div className="mobile-list-preview"><b /><span /></div>
            <div className="mobile-list-preview"><b /><span /></div>
            <div className="mobile-list-preview"><b /><span /></div>
          </>
        )}
        {type === "carousel" && (
          <>
            <div className="mobile-carousel-preview"><b /><b /><b /></div>
            <i className="mobile-product-button" />
          </>
        )}
        {type === "map" && (
          <>
            <div className="mobile-map-preview"><b /><i /></div>
            <i className="mobile-product-button" />
          </>
        )}
      </div>
    </div>
  );
}

function getMobilePreviewType(selected) {
  const text = getPreviewSearchText(selected);
  if (!text.trim()) return "navbar";
  if (/otp|\bpin\b|verification code|one-time code|passcode/.test(text)) return "otp";
  if (/modal|dialog|drawer|sheet|popover|overlay|\u5f39\u7a97|\u62bd\u5c49|\u6d6e\u5c42/.test(text)) return "sheet";
  if (/button|cta|submit|confirm|save|delete|cancel|back button|next button|primary button|secondary button|\u6309\u94ae/.test(text)) return "button";
  if (/image picker|photo picker|camera picker|file picker/.test(text)) return "picker";
  if (/haptic/.test(text)) return "toast";
  if (/permission|biometric|face id|touch id|bluetooth/.test(text)) return "permission";
  if (/safe area|splash screen|web view|in-app browser|mini program/.test(text)) return "browser";
  if (/loading overlay|skeleton|load more|infinite scroll/.test(text)) return "loading";
  if (/notification banner|offline banner|install banner|app update prompt|banner/.test(text)) return "banner";
  if (/numeric keyboard|number keyboard|keyboard accessory|form row|text field|textarea|input|\b\w+ field\b|\u8f93\u5165|\u5b57\u6bb5|\u8868\u5355/.test(text)) return "input";
  if (/\bmap view\b|\blocate\b|\bmap\b|\u5730\u56fe/.test(text)) return "map";
  if (/carousel|page indicator/.test(text)) return "carousel";
  if (/list item|mobile card|share card|timeline/.test(text)) return "list";
  if (/command entry/.test(text)) return "search";
  if (/bottom app bar|long press menu|\b(menu|dropdown|context menu|command menu)\b|\u83dc\u5355|\u4e0b\u62c9/.test(text)) return "actions";
  if (/barcode|qr|scanner|\b(scan code|scan qr|scan barcode|document scan)\b|\u626b\u7801/.test(text)) return "scanner";
  if (/date picker|calendar|time picker|month picker|year picker|range picker|picker|\u65e5\u671f|\u65f6\u95f4|\u9009\u62e9\u5668/.test(text)) return "picker";
  if (/recorder|recording|\bvoice\b|audio|video|camera|microphone|media|image|photo|gallery|viewer|player/.test(text)) return "media";
  if (/stepper|quantity|counter/.test(text)) return "stepper";
  if (/empty|no results|not found/.test(text)) return "empty";
  if (/\btabs?\b|\btabbar\b|bottom navigation|bottom nav|\u6807\u7b7e\u9875|\u6807\u7b7e\u680f/.test(text)) return "tabbar";
  if (/\bnav\b|navigation|app bar|navbar|header|\u5bfc\u822a|\u9876\u680f|\u5934\u90e8/.test(text)) return "navbar";
  if (/action sheet|actions|share sheet/.test(text)) return "actions";
  if (/sheet|drawer|bottom sheet/.test(text)) return "sheet";
  if (/search|filter/.test(text)) return "search";
  if (/refresh|pull/.test(text)) return "refresh";
  if (/swipe|gesture|drag/.test(text)) return "swipe";
  if (/toast|snackbar|notice|alert/.test(text)) return "toast";
  if (/\bproduct\b|\bcart\b|\bcheckout\b|\border\b|commerce|payment|coupon/.test(text)) return "product";
  if (/card|badge|tag|chip|text|heading|paragraph|caption|label|link|icon|divider|surface|panel|content|\u5361\u7247|\u6587\u672c|\u6807\u9898|\u94fe\u63a5|\u6807\u7b7e|\u5fbd\u6807/.test(text)) return "card";
  return "navbar";
}

function SearchComposer({ query, setQuery, onSubmit, showQuickQuestions = true }) {
  return (
    <section
      className={`composer-section ${showQuickQuestions ? "" : "home-composer-section"}`}
      aria-labelledby="site-title"
    >
      <div className="composer-title">
        <h1 id="site-title">uiux.wiki</h1>
        <p>用最简单的图和话，看懂常见界面。</p>
      </div>
      <form className="composer" onSubmit={onSubmit} role="search">
        <span className="composer-orb" aria-hidden="true">
          <MessageCircle size={24} strokeWidth={1.8} />
        </span>
        <label className="sr-only" htmlFor="atlas-search">
          搜索 UI 条目
        </label>
        <input
          id="atlas-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索按钮、弹窗、卡片、加载..."
        />
        {query && (
          <button
            className="ghost-icon"
            type="button"
            aria-label="清空搜索"
            onClick={() => setQuery("")}
          >
            <X size={18} />
          </button>
        )}
        <button className="send-button" type="submit" aria-label="搜索">
          <ArrowUp size={22} strokeWidth={2.4} />
        </button>
      </form>
      {showQuickQuestions && (
        <div className="quick-questions" aria-label="快捷问题">
          <span>试试问：</span>
          {quickQuestions.slice(0, 3).map((question) => (
            <button key={question} type="button" onClick={() => setQuery(question)}>
              {question}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function GitHubIcon({ size = 18 }) {
  return (
    <svg className="github-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18A10.9 10.9 0 0 1 12 6.01c.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.15c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

function Header({ activeSection, onSection, deviceMode, onDeviceMode, onAiOpen, currentUser, onAuthOpen }) {
  return (
    <header className="topbar">
      <div className="brand-zone">
        <button type="button" className="brand" onClick={() => onSection("home")}>
          <span>uiux.wiki</span>
          <small>用最简单的图和话，看懂常见界面。</small>
        </button>
        <div className="device-switch" role="group" aria-label="端模式切换">
          {deviceModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={deviceMode === mode.id ? "active" : ""}
              onClick={() => onDeviceMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      <nav className="main-nav" aria-label="主导航">
        {headerSections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection === section.id ? "active" : ""}
            onClick={() => onSection(section.id)}
          >
            {section.label}
          </button>
        ))}
        <button type="button" className="nav-effect-link" onClick={() => { window.location.href = "/lumen/index.html"; }}>
          特效
        </button>
      </nav>
      <div className="top-actions">
        <button
          type="button"
          className={`header-tool ${activeSection === "workspace" ? "active" : ""}`}
          onClick={() => onSection("workspace")}
        >
          <LayoutDashboard size={18} strokeWidth={2.1} />
          工作台
        </button>
        <button type="button" className="header-tool" onClick={onAiOpen}>
          <Sparkles size={18} strokeWidth={2.1} />
          AI 增强
        </button>
        <button type="button" className="header-tool account-trigger" onClick={onAuthOpen}>
          <UserRound size={18} strokeWidth={2.1} />
          {currentUser ? currentUser.name : "登录"}
        </button>
        <a className="header-tool github-link" href="https://github.com/Charlo-O/uiux-wiki" target="_blank" rel="noreferrer" aria-label="打开 GitHub 项目">
          <GitHubIcon size={18} />
        </a>
      </div>
    </header>
  );
}

function HomePage({ items, query, setQuery, onSubmit, selectedId, onChoose, onSection, aiConfig, onAiOpen, onNotice }) {
  const coreItems = (query ? items.slice(0, 12) : homePriorityIds.map((id) => findItem(id)))
    .filter(Boolean);

  function openTag(tag) {
    setQuery(tag);
    const first = uiItems.find((entry) => itemMatchesQuery(entry, tag));
    if (first) onChoose(first);
  }

  return (
    <section className="home-canvas" aria-labelledby="home-title">
      <div className="home-hero">
        <div className="home-hero-copy">
          <h1 id="home-title">看懂每一个 UI 元素</h1>
          <p>用预览、术语和对比快速确认组件叫法与使用边界。</p>
        </div>

        <form className="home-search" onSubmit={onSubmit} role="search">
          <Search size={24} strokeWidth={1.9} aria-hidden="true" />
          <label className="sr-only" htmlFor="atlas-search">
            搜索 UI 条目
          </label>
          <input
            id="atlas-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索按钮、弹窗、转圈圈、小红点、左侧菜单..."
          />
          <button className="sr-only" type="submit">搜索</button>
        </form>

        <div className="home-tags" aria-label="热门标签">
          <span>热门标签：</span>
          {homeQuickTags.map((tag) => (
            <button key={tag} type="button" onClick={() => openTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="home-body">
        <div className="home-entry-grid" aria-label="核心入口">
          {homeEntryCards.map((card, index) => {
            const normalizedCard = card.sectionId === "dictionary"
              ? {
                ...card,
                title: "看词典",
                description: "Modal、Toast、Tabs、Drawer 等术语与叫法。",
                Icon: ParkBookOpen,
              }
              : card;
            const { sectionId, title, description, Icon, iconVariant = sectionId, iconFill } = normalizedCard;
            return (
            <button
              key={sectionId}
              type="button"
              className={`home-entry-card tone-${index + 1}`}
              onClick={() => onSection(sectionId)}
            >
              <span className={`home-entry-icon home-entry-icon-${iconVariant}`} aria-hidden="true">
                <span className="home-entry-icon-mark">
                  <Icon
                    aria-hidden="true"
                    fill={iconFill}
                    size={32}
                    strokeWidth={3.2}
                    theme="multi-color"
                  />
                </span>
              </span>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <ChevronRight className="home-entry-arrow" size={22} strokeWidth={1.7} aria-hidden="true" />
            </button>
            );
          })}
        </div>

        <section className="home-section" aria-labelledby="home-core-title">
          <h2 id="home-core-title">{query ? "搜索结果" : "常用 UI 条目"}</h2>
          <div className="home-core-grid">
            {coreItems.length > 0 ? (
              coreItems.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`home-core-card ${entry.id === selectedId ? "active" : ""}`}
                  onClick={() => onChoose(entry)}
                >
                  <strong>{entry.title}</strong>
                  <MiniPreview type={entry.preview} entry={entry} />
                  <span className="home-core-use">{entry.summary}</span>
                </button>
              ))
            ) : (
              <EmptyList activeSection="all" />
            )}
          </div>
        </section>

        <section className="home-section" aria-labelledby="home-path-title">
          <h2 id="home-path-title">新手路径</h2>
          <div className="home-path-grid">
            {learnerPaths.map(({ title, Icon, points }) => (
              <article key={title} className="home-path-card">
                <span className="home-path-icon">
                  <Icon size={28} strokeWidth={1.8} />
                </span>
                <div className="home-path-content">
                  <h3>{title}</h3>
                  <ul>
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <ChevronRight size={20} strokeWidth={1.8} />
              </article>
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="home-compare-title">
          <h2 id="home-compare-title">常见对比</h2>
          <div className="home-comparison-grid">
            {comparisonLinks.map(({ label, icon: Icon }) => (
              <button key={label} type="button" onClick={() => onSection("comparisons")}>
                <Icon size={22} strokeWidth={1.8} />
                <span>{label}</span>
                <ChevronRight size={20} strokeWidth={1.7} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="home-footer">
        <div className="home-footer-links">
          {homeFooterLinks.map(({ label, Icon, sectionId }) => (
            <button key={label} type="button" onClick={() => onSection(sectionId)}>
              <Icon size={26} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <p>© 2025 UIUX.wiki · 一站式 UI 图鉴参考平台</p>
      </footer>
    </section>
  );
}

function DocumentTabRail({ className, ariaLabel, tabs, activeId, onSelect }) {
  const railRef = useRef(null);
  const [scrollState, setScrollState] = useState({ overflow: false, start: true, end: true });

  const updateScrollState = () => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setScrollState({
      overflow: maxScroll > 2,
      start: rail.scrollLeft <= 2,
      end: rail.scrollLeft >= maxScroll - 2,
    });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    updateScrollState();
    const handleScroll = () => updateScrollState();
    rail.addEventListener("scroll", handleScroll, { passive: true });

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScrollState);
      observer.observe(rail);
      [...rail.children].forEach((child) => observer.observe(child));
    } else {
      window.addEventListener("resize", handleScroll);
    }

    return () => {
      rail.removeEventListener("scroll", handleScroll);
      if (observer) observer.disconnect();
      else window.removeEventListener("resize", handleScroll);
    };
  }, [tabs]);

  useEffect(() => {
    const rail = railRef.current;
    const activeTab = rail?.querySelector('[aria-selected="true"]');
    activeTab?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    const measureTimer = window.setTimeout(updateScrollState, 180);
    return () => window.clearTimeout(measureTimer);
  }, [activeId]);

  const scrollByPage = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(220, rail.clientWidth * 0.7),
      behavior: "smooth",
    });
  };

  const handleKeyDown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeId));
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : event.key === "ArrowRight"
          ? Math.min(tabs.length - 1, activeIndex + 1)
          : Math.max(0, activeIndex - 1);
    if (tabs[nextIndex]) {
      event.preventDefault();
      onSelect(tabs[nextIndex]);
    }
  };

  return (
    <div
      className={[
        "document-tab-rail",
        `${className}-rail`,
        scrollState.overflow ? "can-scroll" : "",
        scrollState.start ? "at-start" : "",
        scrollState.end ? "at-end" : "",
      ].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        className="document-tab-rail-nav prev"
        aria-label="向左浏览分类"
        disabled={!scrollState.overflow || scrollState.start}
        onClick={() => scrollByPage(-1)}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
      <div
        ref={railRef}
        className={className}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const active = activeId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={active ? "active" : ""}
              title={tab.label}
              onClick={() => onSelect(tab)}
            >
              <span>{tab.label}</span>
              <b>{tab.items.length}</b>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="document-tab-rail-nav next"
        aria-label="向右浏览分类"
        disabled={!scrollState.overflow || scrollState.end}
        onClick={() => scrollByPage(1)}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

function AllComponentsPage({ items, query, selectedId, onChoose, deviceMode = "desktop" }) {
  const [activeDocSectionId, setActiveDocSectionId] = useState("all");
  const [activeDocGroupId, setActiveDocGroupId] = useState("all");
  const documentGroups = useMemo(() => {
    const documentGroups = uiDocumentTabs
      .map((tab) => ({
        ...tab,
        label: tab.group,
        items: items.filter((entry) => entry.docGroupId === tab.id),
      }))
      .filter((tab) => tab.items.length > 0);
    const uncategorized = items.filter((entry) => !entry.docGroupId);
    return uncategorized.length > 0
      ? [...documentGroups, { id: "uncategorized", label: "未归类", sectionLabel: "补充", items: uncategorized }]
      : documentGroups;
  }, [items]);
  const documentSections = useMemo(() => {
    const groupsBySection = new Map();
    for (const group of documentGroups) {
      const sectionId = group.sectionId || "uncategorized-section";
      if (!groupsBySection.has(sectionId)) groupsBySection.set(sectionId, []);
      groupsBySection.get(sectionId).push(group);
    }

    const sectionsWithItems = uiDocumentSections
      .map((section) => {
        const groups = groupsBySection.get(section.id) || [];
        return {
          ...section,
          groups,
          items: groups.flatMap((group) => group.items),
        };
      })
      .filter((section) => section.items.length > 0);

    const uncategorizedGroups = groupsBySection.get("uncategorized-section") || [];
    return uncategorizedGroups.length > 0
      ? [...sectionsWithItems, {
          id: "uncategorized-section",
          label: "补充",
          heading: "补充",
          categoryId: "components",
          groups: uncategorizedGroups,
          items: uncategorizedGroups.flatMap((group) => group.items),
        }]
      : sectionsWithItems;
  }, [documentGroups]);
  const sectionTabs = useMemo(() => [
    { id: "all", label: "全部", heading: "全部", groups: documentGroups, items },
    ...documentSections,
  ], [documentGroups, documentSections, items]);
  const activeSection = sectionTabs.find((tab) => tab.id === activeDocSectionId) || sectionTabs[0];
  const currentGroups = activeSection?.id === "all" ? documentGroups : activeSection?.groups || [];
  const categoryTabs = useMemo(() => [
    {
      id: "all",
      label: "全部",
      sectionLabel: activeSection?.label || "文档分类",
      items: activeSection?.items || [],
    },
    ...currentGroups,
  ], [activeSection, currentGroups]);
  const activeGroup = categoryTabs.find((tab) => tab.id === activeDocGroupId) || categoryTabs[0];
  const visibleGroups = activeGroup?.id === "all" ? currentGroups : activeGroup?.items?.length ? [activeGroup] : [];

  useEffect(() => {
    if (!sectionTabs.some((tab) => tab.id === activeDocSectionId && tab.items.length > 0)) {
      setActiveDocSectionId("all");
      setActiveDocGroupId("all");
    }
  }, [activeDocSectionId, sectionTabs]);

  useEffect(() => {
    if (!categoryTabs.some((tab) => tab.id === activeDocGroupId && tab.items.length > 0)) {
      setActiveDocGroupId("all");
    }
  }, [activeDocGroupId, categoryTabs]);

  return (
    <section className="all-components-page" aria-labelledby="all-components-title">
      <div className="all-page-heading">
        <span className="panel-kicker">全部展示</span>
        <h1 id="all-components-title">全部组件</h1>
      </div>
      <DocumentTabRail
        className="document-section-tabs"
        ariaLabel="按文档一级目录筛选全部 UI 条目"
        tabs={sectionTabs}
        activeId={activeSection?.id}
        onSelect={(tab) => {
          setActiveDocSectionId(tab.id);
          setActiveDocGroupId("all");
        }}
      />
      <DocumentTabRail
        className="document-category-tabs"
        ariaLabel="按文档二级目录筛选全部 UI 条目"
        tabs={categoryTabs}
        activeId={activeGroup?.id}
        onSelect={(tab) => setActiveDocGroupId(tab.id)}
      />
      <div className="all-component-groups">
        {visibleGroups.length > 0 ? visibleGroups.map((section) => (
          <section key={section.id} className="all-component-group" aria-labelledby={`${section.id}-showcase-title`}>
            <div className="all-component-group-heading">
              <h2 id={`${section.id}-showcase-title`}>{section.label}</h2>
              <span>{section.items.length}</span>
            </div>
            <div className="component-showcase-grid">
              {section.items.map((entry, index) => (
                <ComponentTile
                  key={entry.id}
                  entry={entry}
                  index={index}
                  active={entry.id === selectedId}
                  onChoose={() => onChoose(entry)}
                  deviceMode={deviceMode}
                />
              ))}
            </div>
          </section>
        )) : (
          <EmptyList activeSection="all" />
        )}
      </div>
    </section>
  );
}

function CommonComparisonsPage({ deviceMode = "desktop", onChoose }) {
  const coverage = sections.map((section) => ({
    ...section,
    count: uiItems.filter((entry) => entry.category === section.id).length,
  }));
  const pairs = comparisonPairs
    .map((pair) => ({
      ...pair,
      left: findItem(pair.leftId),
      right: findItem(pair.rightId),
    }))
    .filter((pair) => pair.left && pair.right);

  return (
    <section className="comparisons-page" aria-labelledby="comparisons-title">
      <div className="comparisons-heading">
        <div>
          <span className="panel-kicker">Common Comparisons</span>
          <h1 id="comparisons-title">常见对比</h1>
          <p>把容易混淆的组件放在同一个画面里，看名称、场景、状态和端模式差异。</p>
        </div>
        <span>{pairs.length} 组对比</span>
      </div>

      <div className="coverage-strip" aria-label="图鉴覆盖统计">
        <strong>覆盖统计</strong>
        {coverage.map((section) => (
          <span key={section.id}>{section.label} {section.count}</span>
        ))}
        <span>总计 {uiItems.length}</span>
      </div>

      <div className="comparison-pair-list">
        {pairs.map((pair) => (
          <article key={pair.title} className="comparison-pair-card">
            <header>
              <div>
                <span>{deviceMode === "mobile" ? "移动端对比" : "桌面端对比"}</span>
                <h2>{pair.title}</h2>
              </div>
              <p>{pair.note}</p>
            </header>
            <div className="comparison-side-grid">
              {[pair.left, pair.right].map((entry) => (
                <button key={entry.id} type="button" onClick={() => onChoose(entry)}>
                  <span>{entry.group}</span>
                  <strong>{entry.title}</strong>
                  <em>{entry.english}</em>
                  <div className="comparison-preview-stage">
                    <LivePreview selected={entry} playground={initialPlayground} variant={getVariantOptions(entry)[0]} deviceMode={deviceMode} />
                  </div>
                  <p>{entry.summary}</p>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AtlasListPanel({
  activeSection,
  listLabel,
  items,
  selectedId,
  onChoose,
  onClear,
  query,
  deviceMode = "desktop",
}) {
  const [activeListTabId, setActiveListTabId] = useState("all");
  const listTabs = useMemo(() => {
    const groups = new Map();
    for (const entry of items) {
      const id = query
        ? entry.category
        : entry.docGroupId || `${entry.category}-${entry.docGroup || entry.group}`;
      const label = query
        ? sectionLabelById.get(entry.category) || entry.category
        : entry.docGroup || entry.group || sectionLabelById.get(entry.category) || entry.category;
      if (!groups.has(id)) groups.set(id, { id, label, items: [] });
      groups.get(id).items.push(entry);
    }
    return [{ id: "all", label: query ? "全部匹配" : "全部", items }, ...Array.from(groups.values())]
      .filter((tab) => tab.items.length > 0);
  }, [items, query]);
  const activeListTab = listTabs.find((tab) => tab.id === activeListTabId) || listTabs[0];
  const visibleItems = activeListTab?.items || items;

  useEffect(() => {
    if (!listTabs.some((tab) => tab.id === activeListTabId)) {
      setActiveListTabId("all");
    }
  }, [activeListTabId, listTabs]);
  const activeLabel = sections.find((section) => section.id === activeSection)?.label || "组件";

  return (
    <section className="conversation-panel atlas-list-panel">
      <div className="list-panel-header">
        <div>
          <span className="panel-kicker">{query ? "搜索结果" : "当前栏目"}</span>
          <h2>{query ? "全部匹配 UI" : `${activeLabel}列表`}</h2>
          <p>{listLabel}</p>
        </div>
        <span className="list-count">{items.length}</span>
      </div>
      {listTabs.length > 1 && (
        <div className="list-filter-tabs" role="tablist" aria-label={`${activeLabel}列表筛选`}>
          {listTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeListTab?.id === tab.id}
              className={activeListTab?.id === tab.id ? "active" : ""}
              onClick={() => setActiveListTabId(tab.id)}
            >
              <span>{tab.label}</span>
              <b>{tab.items.length}</b>
            </button>
          ))}
        </div>
      )}
      <div className="entry-list full-entry-list scrollable">
        {visibleItems.length > 0 ? (
          visibleItems.map((entry, index) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              index={index}
              active={entry.id === selectedId}
              onChoose={() => onChoose(entry)}
              deviceMode={deviceMode}
            />
          ))
        ) : (
          <EmptyList activeSection={activeSection} />
        )}
      </div>
      <button className="clear-button" type="button" onClick={() => {
        setActiveListTabId("all");
        onClear();
      }}>
        <RefreshCcw size={16} />
        重置列表
      </button>
    </section>
  );
}

function ComponentTile({ entry, index, active, onChoose, deviceMode = "desktop" }) {
  const isMobileMode = deviceMode === "mobile";
  return (
    <button
      className={`component-tile ${active ? "active" : ""} ${isMobileMode ? "mobile-mode" : ""}`}
      type="button"
      aria-label={`预览 ${entry.title} ${entry.english}`}
      aria-current={active ? "true" : undefined}
      onClick={onChoose}
    >
      <span className="component-tile-topline">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <small>{sectionLabelById.get(entry.category) || entry.group}</small>
      </span>
      <span className="component-tile-preview">
        {isMobileMode ? (
          <MobilePreview type={getMobilePreviewType(entry)} />
        ) : (
          <MiniPreview type={entry.preview} entry={entry} />
        )}
      </span>
      <span className="component-tile-copy">
        <strong>{entry.title}</strong>
        <em>{entry.english}</em>
        <span>{entry.docGroup || entry.group}</span>
      </span>
    </button>
  );
}

function EntryRow({ entry, index, active, onChoose, deviceMode = "desktop" }) {
  const isMobileMode = deviceMode === "mobile";
  return (
    <button
      className={`entry-row ${active ? "active" : ""} ${isMobileMode ? "mobile-row" : ""}`}
      type="button"
      aria-label={`预览 ${entry.title} ${entry.english}`}
      aria-current={active ? "true" : undefined}
      onClick={onChoose}
    >
      <span className="entry-index">{String(index + 1).padStart(2, "0")}</span>
      {isMobileMode ? (
        <MobilePreview type={getMobilePreviewType(entry)} />
      ) : (
        <MiniPreview type={entry.preview} entry={entry} />
      )}
      <span className="entry-copy">
        <strong>
          {entry.title}
          <em>{entry.english}</em>
        </strong>
        <span>
          <b>{entry.group}</b>
          {entry.summary}
        </span>
      </span>
      <ChevronRight size={22} strokeWidth={1.7} />
    </button>
  );
}

function EmptyList({ activeSection }) {
  const fallbackLabel = activeSection === "all" ? "全部" : sectionLabelById.get(activeSection) || "组件";

  return (
    <div className="empty-list">
      <CircleHelp size={28} strokeWidth={1.6} />
      <strong>没有匹配条目</strong>
      <span>
        {`试试切换到「${fallbackLabel}」的其他关键词。`}
      </span>
    </div>
  );
}

function getDetailHeadingIcon(selected) {
  const text = [selected?.id, selected?.title, selected?.english, selected?.plain]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (/clear filters|filters cleared|清空筛选/.test(text)) return FunnelX;
  return Sparkles;
}

function DetailPanel({
  selected,
  playground,
  setPlayground,
  activeVariant,
  onVariantChange,
  isFavorite,
  onFavorite,
  onShare,
  deviceMode = "desktop",
  aiConfig,
  onAiOpen,
  onNotice,
}) {
  const hasCustomPlayground = false;
  const HeadingIcon = getDetailHeadingIcon(selected);

  return (
    <section className="detail-panel" aria-live="polite">
      <div className="answer-heading">
        <span className="answer-icon" aria-hidden="true">
          <HeadingIcon size={19} strokeWidth={2.1} />
        </span>
        <div>
          <h2>
            {selected.title}
            <span>{selected.english}</span>
          </h2>
          <p>{selected.plain}</p>
        </div>
      </div>

      <div className="answer-section preview-section">
        <h3>预览 · {deviceMode === "mobile" ? "移动端" : "桌面端"}</h3>
        <div className="preview-stage">
          <LivePreview selected={selected} playground={playground} variant={activeVariant} deviceMode={deviceMode} />
        </div>
        <PreviewContext selected={selected} deviceMode={deviceMode} />
      </div>

      <div className="answer-section">
        <h3>{hasCustomPlayground ? "自定义试玩" : "常见变体"}</h3>
        {hasCustomPlayground ? (
          <PlaygroundControls playground={playground} setPlayground={setPlayground} />
        ) : (
          <VariantOverview selected={selected} value={activeVariant} onChange={onVariantChange} />
        )}
      </div>

      <Comparison selected={selected} />

      <AiDetailEnhancement selected={selected} config={aiConfig} onAiOpen={onAiOpen} onNotice={onNotice} />

      <div className="answer-actions">
        <button type="button" onClick={onFavorite}>
          {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          {isFavorite ? "已收藏" : "收藏"}
        </button>
        <button type="button" onClick={onShare}>
          <Share2 size={18} />
          分享
        </button>
      </div>

      <InfoGrid selected={selected} />
    </section>
  );
}

function PreviewModal({ selected, playground, setPlayground, activeVariant, onVariantChange, deviceMode = "desktop", onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const hasCustomPlayground = false;

  return (
    <div className="component-detail-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="component-detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="component-detail-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="component-detail-dialog-heading">
          <span className="panel-kicker">{sectionLabelById.get(selected.category) || selected.group}</span>
          <button type="button" aria-label="关闭预览弹窗" onClick={onClose}>
            <X size={20} />
          </button>
          <h2 id="component-detail-dialog-title">
            {selected.title}
            <span>{selected.english}</span>
          </h2>
          <p>{selected.plain}</p>
        </div>

        <div className="component-detail-dialog-stage">
          <LivePreview selected={selected} playground={playground} variant={activeVariant} deviceMode={deviceMode} />
        </div>

        <PreviewContext selected={selected} deviceMode={deviceMode} />

        <div className="component-detail-dialog-lower">
          <div>
            <h3>{hasCustomPlayground ? "自定义试玩" : "常见变体"}</h3>
            {hasCustomPlayground ? (
              <PlaygroundControls playground={playground} setPlayground={setPlayground} />
            ) : (
              <VariantOverview selected={selected} value={activeVariant} onChange={onVariantChange} />
            )}
          </div>
          <div>
            <h3>使用提醒</h3>
            <ul>
              {selected.do.slice(0, 3).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function LivePreview({ selected, playground, variant, deviceMode = "desktop" }) {
  const variantIndex = getVariantIndex(selected, variant);

  if (deviceMode === "mobile") {
    return (
      <MobileLiveFrame selected={selected}>
        <MobileExperiencePreview selected={selected} variant={variant} />
      </MobileLiveFrame>
    );
  }

  let preview;

  if (selected.isGenerated) preview = <GeneratedEntryLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "layouts") preview = <LayoutLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "styles") preview = <StyleLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "motion") preview = <MotionLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "patterns") preview = <PatternLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "dictionary") {
    if (taxonomyPreviewTypes.has(selected.preview)) {
      preview = <ComponentLivePreview selected={selected} variant={variant} />;
    } else if (selected.preview && selected.preview !== "generic") {
      preview = <ComponentLivePreview selected={selected} variant={variant} />;
    } else {
      const related = findItem(selected.related[0] || "button");
      preview = (
        <ComponentLivePreview
          selected={related.id === selected.id ? selected : related}
          term={selected}
          variant={variant}
        />
      );
    }
  } else {
    preview = <ComponentLivePreview selected={selected} variant={variant} />;
  }

  const previewContent = selected.variants.length === 0 ? preview : (
    <VariantPreviewShell selected={selected} variant={variant} index={variantIndex}>
      {preview}
    </VariantPreviewShell>
  );

  if (deviceMode === "mobile") {
    return <MobileLiveFrame selected={selected}>{previewContent}</MobileLiveFrame>;
  }

  return previewContent;
}

function MobileLiveFrame({ selected, children }) {
  return (
    <div className="mobile-live-frame" aria-label={`${selected.title} 移动端预览`}>
      <div className="mobile-live-top">
        <span />
      </div>
      <div className="mobile-live-screen">
        {children}
      </div>
      <div className="mobile-live-home" />
    </div>
  );
}

function MobileExperiencePreview({ selected, variant = "" }) {
  const type = getMobilePreviewType(selected);
  const title = selected.title || selected.english || "页面";
  const summary = selected.summary || selected.plain || "移动端界面";
  const action = getSemanticAction(selected);
  const meta = variant || selected.group || sectionLabelById.get(selected.category) || "Mobile";
  const chips = [selected.group, selected.docGroup, selected.english].filter(Boolean).slice(0, 3);

  return (
    <div className={`mobile-ui-preview mobile-ui-${type}`}>
      <div className="mobile-ui-status">
        <span>9:41</span>
        <b />
        <span>5G</span>
      </div>
      <div className="mobile-ui-appbar">
        <span className="mobile-ui-icon">‹</span>
        <strong>{title}</strong>
        <span className="mobile-ui-icon">•••</span>
      </div>

      {type === "tabbar" && (
        <>
          <main className="mobile-ui-content mobile-ui-feed">
            <section className="mobile-ui-hero">
              <b>{title}</b>
              <span>{summary}</span>
            </section>
            <article><i /><div><b /><span /></div></article>
            <article><i /><div><b /><span /></div></article>
          </main>
          <nav className="mobile-ui-tabbar">
            <b className="active" /><b /><b /><b />
          </nav>
        </>
      )}

      {type === "search" && (
        <main className="mobile-ui-content mobile-ui-search">
          <label><Search size={14} /><span>搜索 {title}</span></label>
          <div className="mobile-ui-chip-row">{chips.map((chip) => <b key={chip}>{chip}</b>)}</div>
          <article><i /><span /><em /></article>
          <article><i /><span /><em /></article>
          <article><i /><span /><em /></article>
        </main>
      )}

      {type === "button" && (
        <>
          <main className="mobile-ui-content mobile-ui-action-screen">
            <section className="mobile-ui-hero">
              <b>{title}</b>
              <span>{summary}</span>
            </section>
            <article><i /><span /><em /></article>
            <article><i /><span /><em /></article>
          </main>
          <footer className="mobile-ui-buybar"><span>{meta}</span><b>{action.label}</b></footer>
        </>
      )}

      {type === "card" && (
        <main className="mobile-ui-content mobile-ui-card-screen">
          <section><i /><b>{title}</b><span>{summary}</span></section>
          <article><i /><div><b /><span /></div></article>
          <article><i /><div><b /><span /></div></article>
        </main>
      )}

      {type === "input" && (
        <main className="mobile-ui-content mobile-ui-form">
          <section>
            <span>表单字段</span>
            <b>{title}</b>
          </section>
          <label><span>名称</span><i /></label>
          <label><span>说明</span><i /></label>
          <div className="mobile-ui-primary">{action.label}</div>
        </main>
      )}

      {type === "otp" && (
        <main className="mobile-ui-content mobile-ui-otp-screen">
          <section><b>输入验证码</b><span>{summary}</span></section>
          <div>{[0, 1, 2, 3].map((item) => <i key={item}>{item === 0 ? "6" : ""}</i>)}</div>
          <div className="mobile-ui-primary">继续</div>
        </main>
      )}

      {["sheet", "actions"].includes(type) && (
        <>
          <main className="mobile-ui-content mobile-ui-list-screen">
            <article><i /><span /><em /></article>
            <article><i /><span /><em /></article>
            <article><i /><span /><em /></article>
          </main>
          <section className={`mobile-ui-bottom-panel ${type === "actions" ? "actions" : ""}`}>
            <b />
            <strong>{title}</strong>
            <span>{summary}</span>
            <div className="mobile-ui-panel-actions"><i /><i /><i /></div>
          </section>
        </>
      )}

      {["toast", "banner", "permission"].includes(type) && (
        <main className="mobile-ui-content mobile-ui-feedback-screen">
          <article><b>{title}</b><span>{summary}</span></article>
          <article><b>{meta}</b><span /></article>
          {type === "permission" ? (
            <section className="mobile-ui-permission">
              <strong>允许访问？</strong>
              <span>{title}</span>
              <div><i /><i /></div>
            </section>
          ) : (
            <div className={`mobile-ui-floating-message ${type}`}>{type === "banner" ? title : "已完成"}</div>
          )}
        </main>
      )}

      {["product", "stepper"].includes(type) && (
        <>
          <main className="mobile-ui-content mobile-ui-product">
            <section />
            <b>{title}</b>
            <span>{summary}</span>
            <div className="mobile-ui-price-row"><strong>$168</strong><i>-</i><em>1</em><i>+</i></div>
          </main>
          <footer className="mobile-ui-buybar"><span>Total $168</span><b>{action.label}</b></footer>
        </>
      )}

      {["media", "scanner"].includes(type) && (
        <main className={`mobile-ui-content mobile-ui-camera ${type}`}>
          <section>{type === "scanner" ? <><i /><i /><i /><i /></> : <Play size={28} fill="currentColor" />}</section>
          <div><b /><span /></div>
          <footer><i /><b /><i /></footer>
        </main>
      )}

      {type === "picker" && (
        <main className="mobile-ui-content mobile-ui-picker-screen">
          <section>{Array.from({ length: 12 }).map((_, index) => <i key={index} className={index === 5 ? "active" : ""} />)}</section>
          <div className="mobile-ui-primary">完成</div>
        </main>
      )}

      {type === "map" && (
        <main className="mobile-ui-content mobile-ui-map-screen">
          <section><i /><b /></section>
          <article><strong>{title}</strong><span>{summary}</span></article>
        </main>
      )}

      {["refresh", "loading", "list", "swipe", "carousel", "empty", "browser", "navbar"].includes(type) && (
        <main className={`mobile-ui-content mobile-ui-list-screen mobile-ui-${type}-screen`}>
          {type === "refresh" && <div className="mobile-ui-refresh-dot" />}
          {type === "empty" ? (
            <section className="mobile-ui-empty-state"><CircleHelp size={28} /><b>暂无内容</b><span>{summary}</span></section>
          ) : (
            <>
              <article className={type === "swipe" ? "revealed" : ""}><i /><span /><em /></article>
              <article><i /><span /><em /></article>
              <article><i /><span /><em /></article>
              {type === "carousel" && <div className="mobile-ui-carousel-dots"><b /><b /><b /></div>}
            </>
          )}
        </main>
      )}
    </div>
  );
}

function VariantPreviewShell({ selected, variant, index, children }) {
  return (
    <div
      className={`variant-preview-shell ${getVariantPreviewClass(variant, index)}`}
      data-variant={variant}
    >
      <div className="variant-preview-badge">
        <span>{variant || getVariantOptions(selected)[0]}</span>
      </div>
      {children}
    </div>
  );
}

function getSemanticAction(selected) {
  const text = getPreviewSearchText(selected);
  const label = selected?.title || selected?.english || "Action";
  if (/filter/.test(text)) return { kind: "filter", label, icon: SlidersHorizontal, helper: "Apply filters to narrow the current results." };
  if (/sort/.test(text)) return { kind: "sort", label, icon: SlidersHorizontal, helper: "Choose ordering before scanning the list." };
  if (/search/.test(text)) return { kind: "search", label, icon: Search, helper: "Run a search query against the current content." };
  if (/prevent duplicate submit|submit/.test(text)) return { kind: "submit", label, icon: Check, helper: "Submit the current form and show the request state." };
  if (/export|download/.test(text)) return { kind: "download", label, icon: Download, helper: "Download or export the selected data." };
  if (/import|upload/.test(text)) return { kind: "upload", label, icon: ArrowUp, helper: "Upload or import files into the current flow." };
  if (/copy|duplicate/.test(text)) return { kind: "copy", label, icon: Copy, helper: "Copy the current item or result." };
  if (/share/.test(text)) return { kind: "share", label, icon: Share2, helper: "Share the current item with another person or channel." };
  if (/delete|remove|stop|cancel/.test(text)) return { kind: "danger", label, icon: X, helper: "Stop or remove the current item after confirmation." };
  if (/archive/.test(text)) return { kind: "archive", label, icon: Box, helper: "Move the selected item into the archive with a reversible action." };
  if (/restore/.test(text)) return { kind: "restore", label, icon: RefreshCcw, helper: "Restore the archived item to the active list." };
  if (/publish/.test(text)) return { kind: "publish", label, icon: Check, helper: "Publish the draft and make it visible to its audience." };
  if (/save/.test(text)) return { kind: "save", label, icon: Check, helper: "Save the current changes." };
  if (/refresh|retry/.test(text)) return { kind: "refresh", label, icon: RefreshCcw, helper: "Refresh the data and keep the user in place." };
  if (/add|create|new/.test(text)) return { kind: "add", label, icon: Check, helper: "Add this item to the current collection or cart." };
  if (/edit/.test(text)) return { kind: "edit", label, icon: PenTool, helper: "Open an edit state for the selected content." };
  if (/back|previous|next/.test(text)) return { kind: "nav", label, icon: ChevronRight, helper: "Move through the current navigation flow." };
  if (/record|recording/.test(text)) return { kind: "record", label, icon: Play, helper: "Start or stop media recording." };
  return { kind: "default", label, icon: MousePointer2, helper: selected?.summary || "Trigger the primary action for this component." };
}

function hashString(value = "") {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickFrom(values, seed, offset = 0) {
  return values[(seed + offset) % values.length];
}

function getEntryBlueprint(entry) {
  const text = getPreviewSearchText(entry);
  const seed = hashString(`${entry.id}|${entry.title}|${entry.english}|${entry.category}`);
  const lower = text.toLowerCase();
  const isButton = /button|cta|action|submit|cancel|confirm|back|next|save|delete|download|upload|share|copy|retry|refresh|按钮/.test(lower);
  const isInput = /input|field|form|textarea|search|password|输入|表单/.test(lower);
  const isOverlay = /modal|dialog|drawer|sheet|popover|tooltip|overlay|弹窗|抽屉|浮层/.test(lower);
  const isData = /table|grid|list|card|timeline|feed|chart|stat|metric|表格|列表|卡片|图表/.test(lower);
  const isCommerce = /cart|checkout|payment|order|coupon|price|invoice|shipment|商品|订单|支付|结算/.test(lower);
  const isMedia = /image|video|audio|media|file|upload|camera|photo|avatar|文件|图片|媒体/.test(lower);
  const isState = entry.category === "states" || /state|status|loading|empty|error|success|warning|disabled|selected|状态|加载|错误|成功/.test(lower);
  const isNav = /nav|tab|breadcrumb|pagination|menu|sidebar|back|next|导航|菜单/.test(lower);
  const family = isCommerce ? "commerce"
    : isMedia ? "media"
    : isOverlay ? "overlay"
    : isInput ? "input"
    : isData ? "data"
    : isState ? "state"
    : isNav ? "navigation"
    : isButton ? "action"
    : pickFrom(["action", "input", "data", "state", "navigation", "overlay"], seed);
  const tones = [
    { ink: "#111827", accent: "#2563eb", soft: "#dbeafe", line: "#93c5fd" },
    { ink: "#1f2937", accent: "#16a34a", soft: "#dcfce7", line: "#86efac" },
    { ink: "#18181b", accent: "#f59e0b", soft: "#fef3c7", line: "#fcd34d" },
    { ink: "#111827", accent: "#dc2626", soft: "#fee2e2", line: "#fca5a5" },
    { ink: "#0f172a", accent: "#0891b2", soft: "#cffafe", line: "#67e8f9" },
    { ink: "#27272a", accent: "#7c3aed", soft: "#ede9fe", line: "#c4b5fd" },
  ];
  const density = pickFrom(["compact", "balanced", "spacious"], seed, 3);
  const shape = pickFrom(["pill", "square", "soft", "split", "stack"], seed, 7);
  const tone = tones[seed % tones.length];
  return { seed, text, family, tone, density, shape };
}

function getEntryIcon(blueprint) {
  const icons = {
    action: MousePointer2,
    input: PenTool,
    data: LayoutGrid,
    state: Info,
    navigation: ChevronRight,
    overlay: PanelLeft,
    commerce: Bookmark,
    media: Download,
  };
  return icons[blueprint.family] || MousePointer2;
}

function getGeneratedPreviewBase(entry) {
  if (!entry) return "generic";
  if (entry.previewBase) return entry.previewBase;
  if (entry.previewId && String(entry.previewId).includes(":")) {
    const parts = String(entry.previewId).split(":").filter(Boolean);
    return parts[parts.length - 1] || "generic";
  }
  if (entry.preview && String(entry.preview).includes(":")) {
    const parts = String(entry.preview).split(":").filter(Boolean);
    return parts[parts.length - 1] || "generic";
  }
  return entry.preview || "generic";
}

function getStandardPreviewEntry(entry) {
  const previewBase = getGeneratedPreviewBase(entry);
  return {
    ...entry,
    isGenerated: false,
    preview: previewBase,
    previewBase,
  };
}

function getGeneratedPreviewVars(entry) {
  const blueprint = getEntryBlueprint(entry);
  return {
    "--entry-accent": blueprint.tone.accent,
    "--entry-soft": blueprint.tone.soft,
    "--entry-line": blueprint.tone.line,
    "--entry-ink": blueprint.tone.ink,
  };
}

function GeneratedEntryMiniPreview({ entry, large = false }) {
  const standardEntry = getStandardPreviewEntry(entry);
  const previewBase = standardEntry.preview || "generic";
  const safeBase = String(previewBase).replace(/[^a-z0-9_-]/gi, "-");
  const label = entry.english || entry.title || previewBase;
  return (
    <span
      className={`generated-standard-mini generated-preview-${safeBase} ${large ? "large" : ""}`}
      data-preview-id={entry.previewId || entry.preview}
      data-preview-base={previewBase}
      style={getGeneratedPreviewVars(entry)}
    >
      <MiniPreview type={previewBase} entry={standardEntry} large={large} />
      <span className="generated-standard-mini-label">{label}</span>
    </span>
  );
}

function GeneratedEntryLivePreview({ selected, variant = "" }) {
  const standardEntry = getStandardPreviewEntry(selected);
  const previewBase = standardEntry.preview || "generic";
  const safeBase = String(previewBase).replace(/[^a-z0-9_-]/gi, "-");
  let preview;

  if (standardEntry.category === "layouts" || previewBase.includes("layout")) {
    preview = <LayoutLivePreview selected={standardEntry} variant={variant} />;
  } else if (standardEntry.category === "styles" || previewBase.includes("style")) {
    preview = <StyleLivePreview selected={standardEntry} variant={variant} />;
  } else if (standardEntry.category === "motion" || previewBase.includes("motion")) {
    preview = <MotionLivePreview selected={standardEntry} variant={variant} />;
  } else if (standardEntry.category === "patterns" || previewBase.includes("pattern")) {
    preview = <PatternLivePreview selected={standardEntry} variant={variant} />;
  } else {
    preview = <ComponentLivePreview selected={standardEntry} variant={variant} />;
  }

  return (
    <div
      className={`generated-standard-live generated-preview-${safeBase}`}
      data-preview-id={selected.previewId || selected.preview}
      data-preview-base={previewBase}
      style={getGeneratedPreviewVars(selected)}
    >
      {preview}
    </div>
  );
}

function getMiniButtonVisual(entry, action) {
  const text = getPreviewSearchText(entry);
  const source = [entry?.id, entry?.title, entry?.english].filter(Boolean).join(" ").toLowerCase();
  let role = "primary";

  if (/\bcancel\b|dismiss|close|abort/.test(source)) role = "cancel";
  else if (/destructive|danger|delete|remove|discard|stop/.test(source) || action.kind === "danger") role = "destructive";
  else if (/\bsubmit\b|send|apply/.test(source) || action.kind === "submit") role = "submit";
  else if (/\bconfirm\b|approve|accept|\bok\b/.test(source)) role = "confirm";
  else if (/\bback\b|\bprevious\b|go back/.test(source) || (action.kind === "nav" && /\bback\b|\bprevious\b/.test(text))) role = "back";
  else if (/\bnext\b|continue|forward/.test(source) || (action.kind === "nav" && /\bnext\b/.test(text))) role = "next";
  else if (/\bsecondary\b/.test(source)) role = "secondary";
  else if (/\btertiary\b/.test(source)) role = "tertiary";
  else if (/\boutline\b|outlined/.test(source)) role = "outline";
  else if (/\bghost\b|text button|link button/.test(source)) role = "ghost";
  else if (/\bprimary\b|\bcta\b|call to action/.test(source)) role = "primary";
  else if (["download", "upload", "save", "add", "publish"].includes(action.kind)) role = "submit";
  else if (action.kind === "nav") role = "next";

  const tokens = {
    primary: { bg: "#111827", fg: "#ffffff", border: "#111827", iconBg: "#ffffff", iconFg: "#111827", line: "#ffffff", shadow: "0 8px 18px rgba(17, 24, 39, 0.18)" },
    secondary: { bg: "#eef2ff", fg: "#312e81", border: "#c7d2fe", iconBg: "#4338ca", iconFg: "#ffffff", line: "#818cf8", shadow: "none" },
    tertiary: { bg: "#f8fafc", fg: "#334155", border: "#cbd5e1", iconBg: "#e2e8f0", iconFg: "#334155", line: "#94a3b8", shadow: "none" },
    outline: { bg: "#ffffff", fg: "#0f172a", border: "#0f172a", iconBg: "#ffffff", iconFg: "#0f172a", line: "#64748b", shadow: "inset 0 0 0 1px #0f172a" },
    ghost: { bg: "transparent", fg: "#475569", border: "transparent", iconBg: "#f1f5f9", iconFg: "#475569", line: "#cbd5e1", shadow: "none" },
    destructive: { bg: "#fee2e2", fg: "#991b1b", border: "#fca5a5", iconBg: "#dc2626", iconFg: "#ffffff", line: "#ef4444", shadow: "0 8px 18px rgba(220, 38, 38, 0.12)" },
    submit: { bg: "#dcfce7", fg: "#166534", border: "#86efac", iconBg: "#16a34a", iconFg: "#ffffff", line: "#22c55e", shadow: "0 8px 18px rgba(22, 163, 74, 0.12)" },
    cancel: { bg: "#f8fafc", fg: "#64748b", border: "#cbd5e1", iconBg: "#e2e8f0", iconFg: "#64748b", line: "#cbd5e1", shadow: "none" },
    confirm: { bg: "#ecfdf5", fg: "#047857", border: "#6ee7b7", iconBg: "#059669", iconFg: "#ffffff", line: "#10b981", shadow: "0 8px 18px rgba(5, 150, 105, 0.12)" },
    back: { bg: "#eff6ff", fg: "#1d4ed8", border: "#bfdbfe", iconBg: "#2563eb", iconFg: "#ffffff", line: "#60a5fa", shadow: "none" },
    next: { bg: "#fef3c7", fg: "#92400e", border: "#fcd34d", iconBg: "#f59e0b", iconFg: "#ffffff", line: "#f59e0b", shadow: "0 8px 18px rgba(245, 158, 11, 0.12)" },
  };

  const Icon =
    role === "cancel" || role === "destructive" ? X :
    role === "confirm" || role === "submit" ? Check :
    role === "back" || role === "next" ? ChevronRight :
    action.icon || MousePointer2;

  return { role, Icon, ...tokens[role] };
}

function getMenuOptions(selected, isDropdown = false) {
  const text = getPreviewSearchText(selected);
  if (/filter/.test(text)) return ["Status", "Owner", "Date range"];
  if (/sort/.test(text)) return ["Newest first", "Priority", "Name A-Z"];
  if (/share/.test(text)) return ["Copy link", "Invite member", "Share to channel"];
  if (/export/.test(text)) return ["CSV", "Excel", "PDF"];
  if (/import/.test(text)) return ["CSV import", "Excel import", "Template"];
  if (/delete/.test(text)) return ["Archive", "Delete", "Cancel"];
  if (isDropdown) return ["Newest first", "Price low to high", "Available only"];
  return ["Edit", "Copy link", "Delete"];
}

function getFormRows(selected) {
  const text = getPreviewSearchText(selected);
  if (/payment/.test(text)) return ["Card number", "Expiry", "CVC"];
  if (/filter/.test(text)) return ["Status", "Owner", "Date range"];
  if (/search/.test(text)) return ["Search query", "Scope"];
  if (/address/.test(text)) return ["Street", "City", "Postal code"];
  if (/settings|preferences/.test(text)) return ["Preference", "Notification", "Visibility"];
  if (/feedback/.test(text)) return ["Feedback", "Category", "Contact"];
  return ["Email", "Note"];
}

function getSelectOptions(selected) {
  const text = getPreviewSearchText(selected);
  if (/color/.test(text)) return ["#111827", "#2563eb", "#16a34a"];
  if (/payment method/.test(text)) return ["Visa ending 4242", "PayPal", "Apple Pay"];
  if (/file/.test(text)) return ["report.pdf", "image.png", "archive.zip"];
  if (/image|avatar/.test(text)) return ["Cover image", "Avatar", "Gallery"];
  if (/icon/.test(text)) return ["Search", "Check", "Share"];
  if (/member|user|team/.test(text)) return ["Alex", "Design Team", "Reviewers"];
  if (/timezone/.test(text)) return ["UTC+08", "UTC+00", "UTC-05"];
  if (/location/.test(text)) return ["Current location", "Office", "Warehouse"];
  if (/template/.test(text)) return ["Blank", "Report", "Checklist"];
  return ["Active", "Archived", "Draft"];
}

function ActionMockup({ action, selected }) {
  const text = getPreviewSearchText(selected);
  if (action.kind === "filter") {
    return (
      <section className="live-action-mock action-filter">
        <label><input type="checkbox" defaultChecked /> Active</label>
        <label><input type="checkbox" /> Archived</label>
        <button type="button">Apply</button>
      </section>
    );
  }
  if (action.kind === "sort") {
    return (
      <section className="live-action-mock action-sort">
        <label><input type="radio" name="sort-demo" defaultChecked /> Newest first</label>
        <label><input type="radio" name="sort-demo" /> Price low to high</label>
      </section>
    );
  }
  if (action.kind === "copy") {
    return <section className="live-action-mock action-copy"><code>{text.includes("result") ? "AI result.md" : "https://uiux.wiki/item"}</code><span>Copied</span></section>;
  }
  if (action.kind === "share") {
    return <section className="live-action-mock action-share"><button>Link</button><button>Team</button><button>Channel</button></section>;
  }
  if (action.kind === "danger") {
    return <section className="live-action-mock action-danger"><strong>{text.includes("stop") ? "Generation in progress" : "Selected item"}</strong><span>Confirm before continuing.</span></section>;
  }
  if (/cart/.test(text)) {
    return <section className="live-action-mock action-cart"><i /><span>Product</span><b>2</b></section>;
  }
  return <section className="live-action-mock"><i /><i /><i /></section>;
}

function OtpPreviewCard({ selected, variantClass }) {
  return (
    <div className={`live-otp-card ${variantClass}`}>
      <strong>{selected.title}</strong>
      <div>{["6", "2", "", ""].map((digit, index) => <span key={index} className={index === 2 ? "focus" : ""}>{digit}</span>)}</div>
      <small>Paste code or type one digit per cell.</small>
    </div>
  );
}

const buttonSpecificRules = [
  [/social-login-button|social login button/, "social-login"],
  [/sso-button|sso button|single sign-on/, "sso"],
  [/feedback-buttons|feedback buttons/, "feedback"],
  [/thumbs-feedback|thumbs feedback/, "thumbs-feedback"],
  [/dislike-button|dislike button/, "dislike"],
  [/like-button|like button/, "like"],
  [/unfollow-button|unfollow button/, "unfollow"],
  [/follow-button|follow button/, "follow"],
  [/add-to-cart-button|add to cart button/, "add-cart"],
  [/buy-now-button|buy now button/, "buy-now"],
  [/upgrade-button|upgrade button/, "upgrade"],
  [/stop-generating-button|stop generating button|stop-generating|stop generating/, "stop-generating"],
  [/regenerate-button|regenerate button/, "regenerate"],
  [/continue-button|continue button/, "continue"],
  [/apply-suggestion-button|apply suggestion button/, "apply-suggestion"],
  [/insert-result-button|insert result button/, "insert-result"],
  [/replace-text-button|replace text button/, "replace-text"],
  [/copy-result-button|copy result button/, "copy-result"],
  [/play-button|play button/, "play"],
  [/pause-button|pause button/, "pause"],
  [/mute-button|mute button/, "mute"],
  [/record-button|record button|recording button/, "record"],
  [/send-button|send button/, "send"],
  [/report-button|report button/, "report"],
  [/block-button|block button/, "block"],
  [/social-share-button|social share button/, "social-share"],
  [/current-location-button|current location button|locate me button/, "current-location"],
  [/load-more-button|load more button/, "load-more"],
  [/close-button|close button/, "close"],
  [/more-button|more button/, "more"],
  [/help-button|help button/, "help"],
  [/info-button|info button/, "info"],
  [/copy-button|copy button|duplicate-button|duplicate button/, "copy"],
  [/share-button|share button/, "share"],
  [/favorite-button|favorite button/, "favorite"],
  [/pin-button|pin button/, "pin"],
  [/sticky-form-actions|sticky form actions/, "sticky-actions"],
  [/form-actions|form actions/, "form-actions"],
  [/bulk-action-bar|bulk-actions|bulk actions|bulk-action/, "bulk-actions"],
  [/row-actions|row actions/, "row-actions"],
  [/card-actions|card actions/, "card-actions"],
  [/button-group|button group/, "group"],
  [/split-button|split button/, "split"],
  [/toggle-button|toggle button/, "toggle"],
  [/quick-action|quick action/, "quick"],
  [/cta-button|\bcta\b/, "cta"],
  [/sidebar-collapse-button|sidebar collapse button/, "sidebar-collapse"],
  [/previous-button|previous button|back-button|back button/, "previous"],
  [/next-button|next button/, "next"],
  [/forward-button|forward button/, "forward"],
  [/loading-button|loading button/, "loading"],
  [/submit-button|submit button/, "submit"],
  [/reset-button|reset button/, "reset"],
  [/cancel-button|cancel button/, "cancel"],
  [/confirm-button|confirm button/, "confirm"],
  [/done-button|done button/, "done"],
  [/save-button|save button/, "save"],
  [/edit-button|edit button/, "edit"],
  [/destructive-button|destructive button|delete-button|delete button/, "delete"],
  [/download-button|download button/, "download"],
  [/upload-button|upload button/, "upload"],
  [/refresh-button|refresh button/, "refresh"],
  [/retry-button|retry button/, "retry"],
  [/clear-button|clear button/, "clear"],
  [/round-button|round button/, "round"],
  [/square-button|square button/, "square"],
  [/primary-button|primary button/, "primary"],
  [/secondary-button|secondary button/, "secondary"],
  [/tertiary-button|tertiary button/, "tertiary"],
  [/outline-button|outline button/, "outline"],
  [/ghost-button|ghost button/, "ghost"],
  [/text-button|text button/, "text"],
  [/link-button|link button/, "link"],
  [/components-button\b/, "base"],
];

function getButtonSpecificKind(selected) {
  const previewBase = getGeneratedPreviewBase(selected);
  const source = [selected?.id, selected?.title, selected?.english, selected?.previewId, selected?.previewBase]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const isButtonSurface = previewBase === "button" || previewBase === "icon-button" || /button|buttons|action-bar|actions/.test(source);
  if (!isButtonSurface) return "";
  const match = buttonSpecificRules.find(([pattern]) => pattern.test(source));
  return match ? `button-${match[1]}` : "";
}

const buttonSpecificBlueprints = {
  base: { label: "Button", mini: "Btn", badge: "Base", icon: MousePointer2, tone: "neutral", layout: "single", helper: "A button exposes one clear action with a visible target." },
  primary: { label: "Primary action", mini: "Primary", badge: "Primary", icon: Check, tone: "primary", layout: "single", helper: "The strongest button on the surface, used once per decision area." },
  secondary: { label: "Secondary action", mini: "Second", badge: "Secondary", icon: ChevronRight, tone: "secondary", layout: "single", helper: "A lower-emphasis companion action that stays visually separate from primary." },
  tertiary: { label: "Tertiary action", mini: "Third", badge: "Tertiary", icon: MousePointer2, tone: "muted", layout: "single", helper: "A quiet action for low-risk choices inside dense UI." },
  text: { label: "Text action", mini: "Text", badge: "Text", icon: Type, tone: "link", layout: "single", helper: "Looks like text but preserves button behavior and focus affordance." },
  link: { label: "Open details", mini: "Link", badge: "Link", icon: Link2, tone: "link", layout: "single", helper: "Navigates or reveals destination-like content with link styling." },
  outline: { label: "Outline action", mini: "Outline", badge: "Outline", icon: MousePointer2, tone: "outline", layout: "single", helper: "Keeps the shape visible without filling the control." },
  ghost: { label: "Ghost action", mini: "Ghost", badge: "Ghost", icon: MousePointer2, tone: "ghost", layout: "single", helper: "Appears on low-emphasis surfaces and becomes stronger on hover or focus." },
  delete: { label: "Delete item", mini: "Delete", badge: "Destructive", icon: X, tone: "danger", layout: "single", helper: "Danger buttons make the destructive consequence unmistakable." },
  round: { label: "Round", mini: "Round", badge: "Round", icon: Plus, tone: "primary", layout: "shape", helper: "Circular buttons use a compact icon target for repeated actions." },
  square: { label: "Square", mini: "Square", badge: "Square", icon: Square, tone: "neutral", layout: "shape", helper: "Square buttons align with grid-like toolbars and dense control rows." },
  loading: { label: "Saving...", mini: "Load", badge: "Loading", icon: RefreshCcw, tone: "muted", layout: "state", helper: "The label, spinner, and disabled state show that the request is running." },
  submit: { label: "Submit form", mini: "Submit", badge: "Submit", icon: Check, tone: "success", layout: "state", helper: "Submit buttons confirm form intent and reserve room for progress feedback." },
  reset: { label: "Reset fields", mini: "Reset", badge: "Reset", icon: RefreshCcw, tone: "warning", layout: "state", helper: "Reset buttons need a low-emphasis style because they discard local edits." },
  cancel: { label: "Cancel", mini: "Cancel", badge: "Cancel", icon: X, tone: "muted", layout: "state", helper: "Cancel returns the user to the previous state without committing changes." },
  confirm: { label: "Confirm", mini: "OK", badge: "Confirm", icon: Check, tone: "success", layout: "state", helper: "Confirmation buttons use explicit copy and pair with a reversible secondary action." },
  done: { label: "Done", mini: "Done", badge: "Done", icon: Check, tone: "success", layout: "state", helper: "Done closes the flow after the current step has been completed." },
  save: { label: "Save changes", mini: "Save", badge: "Save", icon: Check, tone: "success", layout: "state", helper: "Save buttons show persistence rather than navigation or submission." },
  edit: { label: "Edit profile", mini: "Edit", badge: "Edit", icon: PenTool, tone: "primary", layout: "single", helper: "Edit opens the object in an editable state while keeping context visible." },
  copy: { label: "Copy value", mini: "Copy", badge: "Copy", icon: Copy, tone: "neutral", layout: "icon", helper: "Copy actions should show immediate copied feedback near the trigger." },
  download: { label: "Download CSV", mini: "Down", badge: "Download", icon: Download, tone: "primary", layout: "single", helper: "Download buttons name the file or format that will be produced." },
  upload: { label: "Upload file", mini: "Up", badge: "Upload", icon: ArrowUp, tone: "primary", layout: "single", helper: "Upload buttons should sit beside accepted file hints and progress feedback." },
  refresh: { label: "Refresh data", mini: "Refresh", badge: "Refresh", icon: RefreshCcw, tone: "neutral", layout: "single", helper: "Refresh keeps the user in place and communicates the updated timestamp." },
  retry: { label: "Retry request", mini: "Retry", badge: "Retry", icon: RefreshCcw, tone: "warning", layout: "state", helper: "Retry buttons stay close to the failure message they recover from." },
  clear: { label: "Clear all", mini: "Clear", badge: "Clear", icon: X, tone: "muted", layout: "state", helper: "Clear removes local filters or input and should be reversible when possible." },
  next: { label: "Next step", mini: "Next", badge: "Next", icon: ChevronRight, tone: "primary", layout: "nav", helper: "Next advances the sequence and pairs with a visible previous action." },
  previous: { label: "Previous", mini: "Prev", badge: "Previous", icon: ChevronRight, tone: "muted", layout: "nav", helper: "Previous moves backward without losing the current state." },
  forward: { label: "Forward", mini: "Forward", badge: "Forward", icon: ChevronRight, tone: "neutral", layout: "nav", helper: "Forward buttons restore a later navigation point." },
  "sidebar-collapse": { label: "Collapse sidebar", mini: "Panel", badge: "Sidebar", icon: PanelLeft, tone: "neutral", layout: "nav", helper: "Sidebar controls show the panel edge and keep the content width stable." },
  group: { label: "Button group", mini: "Group", badge: "Group", icon: LayoutGrid, tone: "neutral", layout: "group", helper: "Groups hold related actions with shared spacing and a single alignment line." },
  split: { label: "Export", mini: "Split", badge: "Split", icon: Download, tone: "primary", layout: "group", helper: "Split buttons combine a default action with a menu of alternate actions." },
  toggle: { label: "On", mini: "Toggle", badge: "Toggle", icon: Check, tone: "success", layout: "group", helper: "Toggle buttons expose pressed state and behave like a binary control." },
  quick: { label: "Quick action", mini: "Quick", badge: "Quick", icon: Plus, tone: "primary", layout: "bar", helper: "Quick actions keep the most frequent task one tap away." },
  "bulk-actions": { label: "Bulk actions", mini: "Bulk", badge: "Bulk", icon: SquareCheck, tone: "primary", layout: "bar", helper: "Bulk action bars show selection count and the available operations together." },
  "row-actions": { label: "Row actions", mini: "Rows", badge: "Rows", icon: SlidersHorizontal, tone: "neutral", layout: "bar", helper: "Row actions stay scoped to one table row and avoid stealing table focus." },
  "card-actions": { label: "Card actions", mini: "Cards", badge: "Cards", icon: Bookmark, tone: "neutral", layout: "bar", helper: "Card actions sit in a predictable footer or top-right action area." },
  "form-actions": { label: "Form actions", mini: "Form", badge: "Form", icon: Check, tone: "success", layout: "bar", helper: "Form action bars pair submit, cancel, and save-as-draft in a stable order." },
  "sticky-actions": { label: "Sticky actions", mini: "Sticky", badge: "Sticky", icon: Check, tone: "primary", layout: "bar", helper: "Sticky bars keep the final action visible while long forms scroll." },
  cta: { label: "Start free trial", mini: "CTA", badge: "CTA", icon: Sparkles, tone: "primary", layout: "single", helper: "CTA buttons use concrete offer copy and one dominant visual weight." },
  "social-login": { label: "Continue with Google", mini: "G", badge: "Social login", icon: LogIn, tone: "social", layout: "social", helper: "Provider login buttons show provider identity and equal visual weight." },
  sso: { label: "Continue with SSO", mini: "SSO", badge: "SSO", icon: KeyRound, tone: "social", layout: "sso", helper: "SSO buttons name the organization flow and reinforce secure identity." },
  "social-share": { label: "Share post", mini: "Share", badge: "Social", icon: Share2, tone: "primary", layout: "share", helper: "Social share buttons expose target channels and copy-link feedback." },
  like: { label: "Like", mini: "Like", badge: "Reaction", icon: ThumbsUp, tone: "success", layout: "reaction", helper: "Like buttons show pressed state and nearby count feedback." },
  dislike: { label: "Dislike", mini: "Bad", badge: "Reaction", icon: ThumbsDown, tone: "danger", layout: "reaction", helper: "Dislike buttons mirror the like control and invite optional feedback." },
  feedback: { label: "Helpful?", mini: "Up/Down", badge: "Feedback", icon: ThumbsUp, tone: "neutral", layout: "reaction", helper: "Feedback button groups present positive and negative choices as a pair." },
  "thumbs-feedback": { label: "Was this helpful?", mini: "Thumbs", badge: "Thumbs", icon: ThumbsUp, tone: "neutral", layout: "reaction", helper: "Thumbs feedback keeps the rating compact and can open a reason field." },
  follow: { label: "Follow", mini: "Follow", badge: "Follow", icon: UserPlus, tone: "primary", layout: "follow", helper: "Follow buttons show account context and a clear post-click state." },
  unfollow: { label: "Following", mini: "Unfollow", badge: "Following", icon: UserMinus, tone: "muted", layout: "follow", helper: "Unfollow states should make the active relationship visible before removal." },
  play: { label: "Play", mini: "Play", badge: "Media", icon: Play, tone: "media", layout: "media", helper: "Media buttons align with playback state and timeline position." },
  pause: { label: "Pause", mini: "Pause", badge: "Media", icon: Pause, tone: "media", layout: "media", helper: "Pause replaces play while playback is active." },
  mute: { label: "Muted", mini: "Mute", badge: "Media", icon: VolumeX, tone: "media", layout: "media", helper: "Mute buttons reflect current audio state and provide quick reversal." },
  record: { label: "Record", mini: "REC", badge: "Recorder", icon: Mic, tone: "danger", layout: "media", helper: "Record buttons reserve space for elapsed time and recording state." },
  send: { label: "Send message", mini: "Send", badge: "Send", icon: Send, tone: "primary", layout: "single", helper: "Send buttons sit at the end of an input and become active only with content." },
  report: { label: "Report", mini: "Report", badge: "Report", icon: Info, tone: "warning", layout: "moderation", helper: "Report buttons disclose the reason flow before submission." },
  block: { label: "Block user", mini: "Block", badge: "Block", icon: X, tone: "danger", layout: "moderation", helper: "Block buttons clearly state who or what will be blocked." },
  "add-cart": { label: "Add to cart", mini: "Cart", badge: "Cart", icon: ShoppingCart, tone: "commerce", layout: "commerce", helper: "Cart buttons show quantity or cart feedback after activation." },
  "buy-now": { label: "Buy now", mini: "Buy", badge: "Checkout", icon: ShoppingCart, tone: "commerce", layout: "commerce", helper: "Buy-now buttons skip collection and go directly to checkout." },
  upgrade: { label: "Upgrade plan", mini: "Pro", badge: "Upgrade", icon: Sparkles, tone: "commerce", layout: "commerce", helper: "Upgrade buttons pair the plan value with a clear billing action." },
  "stop-generating": { label: "Stop generating", mini: "Stop", badge: "AI", icon: Square, tone: "danger", layout: "ai", helper: "Generation controls must interrupt streaming output immediately." },
  regenerate: { label: "Regenerate", mini: "Again", badge: "AI", icon: RefreshCcw, tone: "ai", layout: "ai", helper: "Regenerate restarts the result while keeping prior output reachable." },
  continue: { label: "Continue", mini: "Cont.", badge: "AI", icon: Play, tone: "ai", layout: "ai", helper: "Continue resumes an interrupted generation or workflow step." },
  "apply-suggestion": { label: "Apply suggestion", mini: "Apply", badge: "AI", icon: Check, tone: "ai", layout: "ai", helper: "Apply buttons show the exact suggested change before committing it." },
  "insert-result": { label: "Insert result", mini: "Insert", badge: "AI", icon: CornerDownRight, tone: "ai", layout: "ai", helper: "Insert places generated content at the cursor without replacing source text." },
  "replace-text": { label: "Replace text", mini: "Replace", badge: "AI", icon: RefreshCcw, tone: "ai", layout: "ai", helper: "Replace actions need a preview because they overwrite existing content." },
  "copy-result": { label: "Copy result", mini: "Copy", badge: "AI", icon: Copy, tone: "ai", layout: "ai", helper: "Copy-result buttons keep generated output unchanged and show copied feedback." },
  "current-location": { label: "Use current location", mini: "Locate", badge: "Location", icon: MousePointer2, tone: "primary", layout: "location", helper: "Location buttons show permission, accuracy, and the selected pin." },
  "load-more": { label: "Load more", mini: "More", badge: "Pagination", icon: Plus, tone: "neutral", layout: "state", helper: "Load-more buttons reserve list space and show progress below existing items." },
  close: { label: "Close", mini: "Close", badge: "Icon", icon: X, tone: "muted", layout: "icon", helper: "Close buttons need an accessible label and a consistent corner position." },
  more: { label: "More actions", mini: "More", badge: "Icon", icon: SlidersHorizontal, tone: "neutral", layout: "icon", helper: "More buttons open a scoped menu of secondary actions." },
  help: { label: "Open help", mini: "Help", badge: "Icon", icon: CircleHelp, tone: "neutral", layout: "icon", helper: "Help buttons reveal guidance without changing the current data." },
  info: { label: "View info", mini: "Info", badge: "Icon", icon: Info, tone: "neutral", layout: "icon", helper: "Info buttons expose metadata or explanatory copy close to the trigger." },
  share: { label: "Share", mini: "Share", badge: "Icon", icon: Share2, tone: "primary", layout: "icon", helper: "Share buttons make the target channel or copy-link result visible." },
  favorite: { label: "Saved", mini: "Fav", badge: "Icon", icon: Heart, tone: "danger", layout: "icon", helper: "Favorite buttons show pressed state and preserve the saved item count." },
  pin: { label: "Pinned", mini: "Pin", badge: "Icon", icon: BookmarkCheck, tone: "primary", layout: "icon", helper: "Pin buttons keep important content at the top of a list or board." },
};

function getButtonSpecificData(kind, selected) {
  const role = kind.replace(/^button-/, "");
  const preset = buttonSpecificBlueprints[role] || buttonSpecificBlueprints.base;
  return {
    role,
    title: selected?.english || selected?.title || preset.label,
    mini: preset.mini || preset.label,
    badge: preset.badge || "Button",
    label: preset.label,
    helper: preset.helper,
    Icon: preset.icon || MousePointer2,
    tone: preset.tone || "neutral",
    layout: preset.layout || "single",
  };
}

function ButtonSpecificMiniPreview({ kind, className }) {
  const data = getButtonSpecificData(kind);
  const Icon = data.Icon;
  const ButtonIcon = data.role === "previous" ? ChevronRight : Icon;
  const miniButton = (label = data.label, modifier = "primary", MiniIcon = ButtonIcon) => (
    <span className={`button-mini-control ${modifier}`}>
      {MiniIcon && <MiniIcon size={13} style={data.role === "previous" ? { transform: "rotate(180deg)" } : undefined} />}
      <span>{label}</span>
    </span>
  );
  const iconButton = (label, MiniIcon, modifier = "") => (
    <span className={`button-mini-icon ${modifier}`} aria-label={label}>
      <MiniIcon size={14} />
    </span>
  );

  return (
    <span className={className}>
      <span className={`mini-button-specific tone-${data.tone} layout-${data.layout} ${kind}`}>
        {["social", "share"].includes(data.layout) && (
          <span className="button-mini-stack">
            {miniButton(data.layout === "social" ? "Google" : "Share", "outline", data.layout === "social" ? LogIn : Share2)}
            {miniButton(data.layout === "social" ? "GitHub" : "Copy link", "outline", data.layout === "social" ? LogIn : Copy)}
          </span>
        )}
        {data.layout === "sso" && (
          miniButton("Continue with SSO", "outline", KeyRound)
        )}
        {data.layout === "reaction" && (
          <span className="button-mini-group">
            {iconButton("Like", ThumbsUp, data.role === "like" ? "active" : "")}
            {iconButton("Dislike", ThumbsDown, data.role === "dislike" ? "active danger" : "")}
            <span className="button-mini-count">{data.role === "feedback" || data.role === "thumbs-feedback" ? "?" : data.role === "dislike" ? "12" : "128"}</span>
          </span>
        )}
        {data.layout === "follow" && (
          miniButton(data.role === "unfollow" ? "Following" : "Follow", data.role === "unfollow" ? "secondary" : "primary", data.role === "unfollow" ? UserMinus : UserPlus)
        )}
        {data.layout === "media" && (
          miniButton(data.label, data.role === "record" ? "danger" : "secondary", Icon)
        )}
        {data.layout === "commerce" && (
          miniButton(data.label, "primary", ShoppingCart)
        )}
        {data.layout === "ai" && (
          miniButton(data.label, data.role === "stop-generating" ? "danger" : "primary", Icon)
        )}
        {data.layout === "bar" && (
          <span className="button-mini-toolbar">
            <span className="button-mini-count">3</span>
            {miniButton("Save", "primary", Check)}
            {miniButton("Cancel", "secondary", X)}
          </span>
        )}
        {data.layout === "group" && (
          <span className="button-mini-segmented">
            <span className="active">{data.role === "split" ? "Export" : "A"}</span>
            <span>{data.role === "split" ? "More" : "B"}</span>
            <span>C</span>
          </span>
        )}
        {data.layout === "nav" && (
          miniButton(data.label, data.role === "previous" ? "secondary" : "primary", ButtonIcon)
        )}
        {data.layout === "icon" && (
          <span className="button-mini-group icon-row">
            {iconButton(data.label, Icon, data.role === "favorite" || data.role === "pin" ? "active" : "")}
            {iconButton("More", SlidersHorizontal)}
            {iconButton("Close", X)}
          </span>
        )}
        {data.layout === "state" && (
          miniButton(data.label, ["cancel", "clear", "reset", "load-more"].includes(data.role) ? "secondary" : "primary", Icon)
        )}
        {data.layout === "moderation" && (
          miniButton(data.label, data.role === "block" ? "danger" : "secondary", Icon)
        )}
        {data.layout === "location" && (
          miniButton("Use location", "secondary", MousePointer2)
        )}
        {data.layout === "shape" && (
          <span className="button-mini-group shape-row">
            <span className={`button-mini-icon ${data.role}`}>{data.role === "round" ? <Plus size={14} /> : <Square size={14} />}</span>
            {miniButton(data.role === "round" ? "Round" : "Square", "secondary", null)}
          </span>
        )}
        {data.layout === "single" && (
          miniButton(data.label, ["secondary", "tertiary", "outline", "ghost", "text", "link"].includes(data.role) ? data.role : "primary", Icon)
        )}
      </span>
    </span>
  );
}

function ButtonSpecificLivePreview({ selected, kind, variantClass }) {
  const data = getButtonSpecificData(kind, selected);
  const Icon = data.Icon;
  const isPrevious = data.role === "previous";
  return (
    <div className={`live-specific-card specific-button-action tone-${data.tone} layout-${data.layout} ${kind} ${variantClass}`}>
      <header><strong>{selected.title}</strong><span>{data.badge}</span></header>
      {data.layout === "social" && (
        <section className="button-provider-stack">
          <button type="button"><b>G</b> Continue with Google</button>
          <button type="button"><b>GH</b> Continue with GitHub</button>
          <button type="button"><b>A</b> Continue with Apple</button>
        </section>
      )}
      {data.layout === "sso" && (
        <section className="button-sso-panel">
          <label>Workspace domain<input readOnly value="company.example.com" /></label>
          <button type="button"><KeyRound size={17} /> Continue with SSO</button>
          <small><ShieldCheck size={14} /> SAML verified</small>
        </section>
      )}
      {data.layout === "share" && (
        <section className="button-share-panel">
          <button type="button"><Share2 size={17} /> Share post</button>
          <div><span>X</span><span>in</span><span>@</span><span>Link copied</span></div>
        </section>
      )}
      {data.layout === "reaction" && (
        <section className="button-reaction-panel">
          <div>
            <button type="button" className={data.role === "like" ? "active" : ""}><ThumbsUp size={18} /> Like</button>
            <button type="button" className={data.role === "dislike" ? "active danger" : ""}><ThumbsDown size={18} /> Dislike</button>
          </div>
          <strong>{data.role === "dislike" ? "12 not useful" : data.role === "feedback" || data.role === "thumbs-feedback" ? "Was this helpful?" : "128 likes"}</strong>
          {(data.role === "dislike" || data.role === "feedback" || data.role === "thumbs-feedback") && <textarea readOnly value="Tell us what was missing..." />}
        </section>
      )}
      {data.layout === "follow" && (
        <section className="button-follow-panel">
          <b>AL</b>
          <div><strong>Alex Lee</strong><span>{data.role === "unfollow" ? "Following - 12.4k followers" : "12.4k followers"}</span></div>
          <button type="button" className={data.role === "unfollow" ? "muted" : ""}>{data.role === "unfollow" ? <UserMinus size={17} /> : <UserPlus size={17} />}{data.label}</button>
        </section>
      )}
      {data.layout === "media" && (
        <section className="button-media-panel">
          <button type="button" className={data.role === "record" ? "danger" : ""}><Icon size={20} /> {data.label}</button>
          <div>{Array.from({ length: 12 }).map((_, index) => <i key={index} style={{ height: `${12 + (index % 4) * 7}px` }} />)}</div>
          <span>{data.role === "record" ? "REC 00:12" : data.role === "mute" ? "Audio muted" : "01:24 / 03:40"}</span>
        </section>
      )}
      {data.layout === "commerce" && (
        <section className="button-commerce-panel">
          <i />
          <div><strong>Wireless Kit</strong><span>{data.role === "upgrade" ? "Pro plan - $19 / seat" : "$69 - in stock"}</span></div>
          <button type="button"><Icon size={17} /> {data.label}</button>
        </section>
      )}
      {data.layout === "ai" && (
        <section className="button-ai-panel">
          <p>Generated result is ready to review before applying.</p>
          <div><button type="button"><Icon size={17} /> {data.label}</button><button type="button">Dismiss</button></div>
        </section>
      )}
      {data.layout === "bar" && (
        <section className="button-action-bar-panel">
          <span>3 selected</span>
          <button type="button"><Check size={16} /> Save</button>
          <button type="button">Cancel</button>
          <button type="button"><SlidersHorizontal size={16} /> More</button>
        </section>
      )}
      {data.layout === "group" && (
        <section className="button-group-panel">
          <button type="button" className="active">{data.role === "split" ? data.label : "Day"}</button>
          <button type="button">{data.role === "split" ? "More" : "Week"}</button>
          <button type="button">{data.role === "split" ? "CSV" : "Month"}</button>
        </section>
      )}
      {data.layout === "nav" && (
        <section className="button-nav-panel">
          <button type="button">{isPrevious ? <ChevronRight size={17} style={{ transform: "rotate(180deg)" }} /> : <ChevronRight size={17} />} {data.label}</button>
          <span>Step 2 of 4</span>
        </section>
      )}
      {data.layout === "icon" && (
        <section className="button-icon-panel">
          <button type="button" aria-label={data.label}><Icon size={22} /></button>
          <div><strong>{data.label}</strong><span>{data.role === "copy" ? "Copied to clipboard" : data.role === "favorite" ? "Saved to favorites" : data.helper}</span></div>
        </section>
      )}
      {data.layout === "state" && (
        <section className="button-state-panel">
          <button type="button"><Icon size={17} /> {data.label}</button>
          <div><i /><span>{data.role === "loading" ? "Request running" : data.role === "retry" ? "Recover from failed request" : data.badge}</span></div>
        </section>
      )}
      {data.layout === "moderation" && (
        <section className="button-moderation-panel">
          <button type="button"><Icon size={17} /> {data.label}</button>
          <div><label><input type="radio" defaultChecked /> Spam</label><label><input type="radio" /> Harassment</label></div>
        </section>
      )}
      {data.layout === "location" && (
        <section className="button-location-panel">
          <i />
          <button type="button"><MousePointer2 size={17} /> Use current location</button>
          <span>Accuracy 12 m</span>
        </section>
      )}
      {data.layout === "shape" && (
        <section className="button-shape-panel">
          <button type="button" className={data.role}>{data.role === "round" ? <Plus size={20} /> : <Square size={20} />}</button>
          <span>{data.helper}</span>
        </section>
      )}
      {data.layout === "single" && (
        <section className="button-single-panel">
          <button type="button"><Icon size={17} /> {data.label}</button>
          <span>{data.badge}</span>
        </section>
      )}
      <p>{data.helper}</p>
    </div>
  );
}

function getSpecificPreviewKind(selected) {
  const text = getPreviewSearchText(selected);
  if (!text.trim()) return "";
  if (["accessibility", "styles", "layouts", "comparisons"].includes(selected?.category)) return "";

  const buttonKind = getButtonSpecificKind(selected);
  if (buttonKind) return buttonKind;

  if (/font-size-selector|font size selector|font-selector|font selector/.test(text)) return "font-selector-specific";
  if (/payment-method-selector|payment method selector/.test(text)) return "commerce-selector-specific";
  if (/color-selector|color selector/.test(text)) return "color-swatch-specific";
  if (/time-range-picker|time range picker/.test(text)) return "date-time-picker";
  if (/avatar-picker|avatar picker/.test(text)) return "image-picker";
  if (/checkout-steps|checkout steps|checkout stepper/.test(text)) return "checkout-stepper";
  if (/session-timeout-dialog|session timeout dialog/.test(text)) return "session-timeout";
  if (/map-error-state|map error state/.test(text)) return "map-error-state";
  if (!/mobile-map-view|mobile map view/.test(text) && (/map-view|\bmap view\b/.test(text))) return "";
  if (/location-pin|location pin/.test(text)) return "map-marker";
  if (/stock-indicator|stock indicator/.test(text)) return "stock-state";
  if (/safety-notice|safety notice|content-filter-notice|content filter notice|content-filtered|content filtered/.test(text)) return "ai-safety-status";
  if (/inline-cell-editor|inline cell editor|cell-editor|cell editor/.test(text)) return "grid-state";
  if (/empty-collection-state|empty collection state/.test(text)) return "empty-result";

  if (/drag-sort|drag sort/.test(text)) return "drag-sort-specific";
  if (/dictionary-pagination|dictionary pagination/.test(text)) return "dictionary-pagination-specific";
  if (selected?.category === "dictionary" && /dictionary-toast|\btoast\b/.test(text)) return "dictionary-toast-specific";
  if (/dictionary-not-found-state|not-found-state|not found state/.test(text)) return "not-found-state-specific";
  if (/states-multi-select|multi-select|multi select/.test(text)) return "multi-select-state";
  if (selected?.category === "states" && (/\bsorting\b|\bsort\b/.test(text))) return "sorting-state";
  if (/captions-on|captions-off|captions on|captions off/.test(text)) return "caption-state";
  if (/awaiting-confirmation|awaiting confirmation/.test(text)) return "awaiting-confirmation-state";
  if (/awaiting-shipment|awaiting shipment/.test(text)) return "shipment-state";
  if (/citations-available|citations-missing|citation|citations|grounded|ungrounded/.test(text)) return "ai-grounding-indicator";
  if (/model-unavailable|content-filtered|model unavailable|content filtered/.test(text)) return "ai-safety-status";
  if (/context-too-long|quota-exceeded|context too long|quota exceeded|truncated/.test(text)) return "ai-usage";
  if (/high-confidence|low-confidence|needs-human-confirmation|human confirmation|confidence indicator/.test(text)) return "ai-confidence-indicator";
  if (/states-stopped|continuable/.test(text) || (/\bstopped\b/.test(text) && /\bai\b|generation|prompt|model|tool/.test(text))) return "ai-generation-control";
  if (/tool-call-failed|tool call failed|tool failed/.test(text)) return "pattern-error-state";
  if (/tool-calling|tool calling|retrieving/.test(text)) return "ai-tool-call-status";
  if (selected?.category === "states" && /service-unavailable|service unavailable/.test(text)) return "error-state-specific";
  if (selected?.category === "states" && !/service-unavailable|service unavailable|model-unavailable|model unavailable/.test(text) && /retrieving availability|\bavailable\b|\bunavailable\b/.test(text)) return "availability-state";
  if (selected?.category === "states" && /\bbusy\b|\baway\b|skipped|unassigned|assigned|low-priority|low priority/.test(text)) return "task-status-state";

  if (/success-message|success message/.test(text)) return "pattern-success-message";
  if (/warning-message|warning message/.test(text)) return "pattern-warning-message";
  if (/info-message|info message/.test(text)) return "pattern-info-message";
  if (/system-announcement|announcement-board|announcement board|system announcement/.test(text)) return "pattern-announcement";
  if (/notification-settings|notification settings/.test(text)) return "pattern-notification-settings";
  if (/mention-notification|unread-reminder|mention-reminder|mention notification|unread reminder|mention reminder/.test(text)) return "pattern-reminder";
  if (/update-prompt|update prompt/.test(text)) return "pattern-update";
  if (/reconnect-notice|reconnect notice/.test(text)) return "pattern-reconnect";
  if (/first-load|first load/.test(text)) return "pattern-first-load";
  if (/version-upgrade|version upgrade/.test(text)) return "pattern-version-upgrade";
  if (/resource-expired|resource expired/.test(text)) return "pattern-expired";
  if (/empty-project|empty project/.test(text)) return "pattern-empty-project";
  if (/retry-failed-action|retry failed action/.test(text)) return "pattern-retry-failed";

  if (/currency-selector|currency selector/.test(text)) return "currency-selector-specific";
  if (/country-selector|country selector/.test(text)) return "country-selector-specific";
  if (/timezone-selector|timezone selector/.test(text)) return "timezone-selector-specific";
  if (/city-selector|region-selector|city selector|region selector/.test(text)) return "geo-selector-specific";
  if (/sku-selector|size-selector|shipping-method-selector|sku selector|size selector|shipping method selector/.test(text)) return "commerce-selector-specific";
  if (/variable-picker|variable picker/.test(text)) return "variable-picker-specific";
  if (/mention-picker|mention picker/.test(text)) return "mention-picker-specific";
  if (/combobox/.test(text)) return "combobox-specific";
  if (/cascader/.test(text)) return "cascader-specific";
  if (/picker-overlay|picker overlay/.test(text)) return "picker-overlay-specific";
  if (/notification-channel-selector|notification channel selector/.test(text)) return "notification-channel-selector-specific";

  if (/footer-navigation|footer navigation/.test(text)) return "footer-navigation-specific";
  if (/previous-next-navigation|previous next navigation|previous-next|previous next/.test(text)) return "previous-next-specific";
  if (/anchor-navigation|anchor navigation/.test(text)) return "anchor-navigation-specific";
  if (/infinite-scroll-navigation|infinite scroll navigation|infinite-scroll/.test(text)) return "infinite-scroll-specific";
  if (/recent-navigation|favorite-navigation|recent navigation|favorite navigation/.test(text)) return "recent-favorite-navigation-specific";

  if (/props-table|props table/.test(text)) return "props-table-specific";
  if (/table-filter|table filter/.test(text)) return "table-filter-specific";
  if (/saved-view-settings|saved view settings/.test(text)) return "";
  if (/saved-view|saved view/.test(text)) return "saved-view-specific";
  if (/empty-table-state|empty table state/.test(text)) return "empty-table-specific";
  if (/aggregate-row|aggregate row/.test(text)) return "aggregate-row-specific";
  if (/group-row|group row/.test(text)) return "group-row-specific";

  if (/product-list|product list/.test(text)) return "product-list-specific";
  if (/order-list|order list/.test(text)) return "order-list-specific";
  if (/product-gallery|product gallery/.test(text)) return "product-gallery-specific";
  if (/product-reviews|product reviews/.test(text)) return "product-reviews-specific";
  if (/subscription-management|subscription management/.test(text)) return "subscription-management-specific";
  if (/permissions-settings|file-permissions|authorized-apps|keyboard-shortcuts-settings|login-history|permissions settings|file permissions|authorized apps|keyboard shortcuts settings|login history/.test(text)) return "security-list-specific";
  if (/danger-zone|danger zone/.test(text)) return "danger-zone-specific";
  if (/ticket-list|ticket list/.test(text)) return "ticket-list-specific";
  if (/faq-list|faq-item|docs-page|help-center-entry|support-entry|glossary|keyboard-shortcuts-help|faq list|faq item|docs page|help center entry|support entry|keyboard shortcuts help/.test(text)) return "help-entry-specific";
  if (/ticket-status|status-page-entry|service-status|ticket status|status page entry|service status/.test(text)) return "service-status-specific";
  if (/image-annotation|image annotation/.test(text)) return "image-annotation-specific";
  if (/image-carousel|image carousel/.test(text)) return "image-carousel-specific";

  if (/error-message|network-error|server-error|timeout|rate-limited|rate limited/.test(text)) return "pattern-error-state";
  if (/partial-success|partial success/.test(text)) return "partial-success-state";
  if (/offline-notice|offline notice|offline-mode|offline mode/.test(text)) return "offline-banner";
  if (/rate-experience|rate experience/.test(text)) return "rating-feedback";
  if (/ai-feedback|ai feedback/.test(text)) return "ai-feedback";
  if (/^online$|states-online|\bonline\b|^connected$|\bconnected\b|undelivered|unsynced|unpublished/.test(text)) return "connection-state";
  if (/loaded|complete-data|complete data|partial-data|partial data|stale-data|stale data|cached|has-more|has more|no-more|no more|end-of-pagination|end of pagination/.test(text)) return "data-state";
  if (/validation-success|submit-success|query-success|filters-cleared|tool-call-success|validation success|submit success|query success|filters cleared|tool call success/.test(text)) return "operation-success-state";
  if (/dictionary-loading-overlay|loading overlay/.test(text)) return "loading-overlay-specific";
  if (/dictionary-alert-dialog|alert dialog/.test(text)) return "alert-dialog-specific";
  if (/dictionary-confirmation-dialog|confirmation dialog/.test(text)) return "confirmation-dialog-specific";
  if (/search-box|search box|mobile-search-bar|mobile search bar/.test(text)) return "search-box-specific";
  if (/dictionary-error-state|offline-state|server-error-state|rate-limit-state|error state|offline state|server error state|rate limit state/.test(text)) return "error-state-specific";
  if (/mobile-qr-scanner|barcode-scanner|qr scanner|barcode scanner/.test(text)) return "qr-scanner";
  if (/share-sheet|share sheet/.test(text)) return "action-sheet-specific";
  if (/mobile-empty-state|mobile empty state/.test(text)) return "empty-result";
  if (/mobile-pull-to-refresh|pull to refresh/.test(text)) return "pull-refresh-specific";
  if (/mobile-swipe-action|swipe action|drag-sort|drag sort/.test(text)) return "swipe-action-specific";
  if (/maintenance|maintenance notice|maintenance state/.test(text)) return "maintenance-state";
  if (/\bsteps\b|step item|progress stepper|tutorial steps/.test(text)) return "steps-control";
  if (/tab-panel|tab panel/.test(text)) return "tab-panel-specific";
  if (/keyboard-shortcuts-panel|keyboard shortcuts panel|shortcut-help-dialog|shortcut help dialog|shortcut table|keyboardshortcuttable/.test(text)) return "shortcut-panel";
  if (/shortcut-entry|shortcut entry/.test(text)) return "shortcut-entry";
  if (/offline-banner|offline banner/.test(text)) return "offline-banner";
  if (/warning-result|warning result/.test(text)) return "warning-result";
  if (/fieldset|field-set|field set/.test(text)) return "fieldset-specific";
  if (/wizard-form|wizard form|multi step form/.test(text)) return "wizard-form-specific";
  if (/checkout-steps|checkout steps|checkout stepper/.test(text)) return "checkout-stepper";
  if (/language-selector|language selector/.test(text)) return "i18n-selector";
  if (/role-selector|role selector/.test(text)) return "role-selector-specific";
  if (/layer-selector|layer selector|floor-selector|floor selector|radius-selector|radius selector/.test(text)) return "map-selector";
  if (/navigation-rail|navigation rail/.test(text)) return "navigation-rail-specific";
  if (/page-number|page number/.test(text)) return "page-number-specific";
  if (/comparison-table|comparison table/.test(text)) return "comparison-table-specific";
  if (/api-reference-table|api reference table|proptable|prop table/.test(text)) return "api-table-specific";
  if (/table-pagination|table pagination/.test(text)) return "table-pagination-specific";
  if (/table-toolbar|table toolbar/.test(text)) return "table-toolbar-specific";
  if (/variantmatrix|state.?matrix|variant matrix|state matrix/.test(text)) return "matrix-table";
  if (/product-card|product card/.test(text)) return "product-card-specific";
  if (/product-detail|product detail/.test(text)) return "product-detail-specific";
  if (/variant-selector|variant selector/.test(text)) return "variant-selector-specific";
  if (/social-login-button|social login button/.test(text)) return "social-login-button";
  if (/card-number-field|card number field/.test(text)) return "card-number-field";
  if (/security-settings|security settings/.test(text)) return "security-settings";
  if (/api-key-list|api key list/.test(text)) return "api-key-list";
  if (/image-editor|image editor/.test(text)) return "image-editor-specific";
  if (/support-chat|support chat/.test(text)) return "support-chat";
  if (/docsnav|docs navigation/.test(text)) return "docs-navigation";
  if (/docstoc|docs table of contents|table-of-contents|table of contents/.test(text)) return "toc";
  if (/themetoggle|theme toggle|densitytoggle|density toggle|languagetoggle|language toggle/.test(text)) return "react-toggle-specific";
  if (/colorswatch|color swatch/.test(text)) return "color-swatch-specific";
  if (/spacingscale|spacing scale/.test(text)) return "spacing-scale-specific";
  if (/typographyscale|typography scale/.test(text)) return "typography-scale-specific";
  if (/motiontimeline|motion timeline/.test(text)) return "motion-timeline-specific";
  if (/statusbadge|status badge/.test(text)) return "status-badge-specific";
  if (/loadingstate|loading state/.test(text)) return "loading-state-specific";
  if (/media-list-item|media list item/.test(text)) return "media-list-item";
  if (/stop-ai-generation|stop ai generation|stop-generating|stop generating|continue generation|regenerate/.test(text)) return "ai-generation-control";
  if (/states-stopped|continuable|tool-calling|tool calling/.test(text) || (/\bstopped\b/.test(text) && /\bai\b|generation|prompt|model|tool/.test(text))) return /tool/.test(text) ? "ai-tool-call-status" : "ai-generation-control";
  if (/prompt-composer|prompt composer/.test(text)) return "ai-prompt-composer";
  if (/context-attachment|context attachment/.test(text)) return "ai-context-attachment";
  if (/context-panel|context panel|file-context-card|file context card|web-context-card|web context card/.test(text)) return "ai-context-panel";
  if (/streaming-text|streaming text/.test(text)) return "ai-streaming-text";
  if (/tool-call-status|tool call status/.test(text)) return "ai-tool-call-status";
  if (/tool-call-log|tool call log/.test(text)) return "ai-tool-call-log";
  if (/apply-suggestion|apply suggestion/.test(text)) return "ai-suggestion-action";
  if (/confidence-indicator|confidence indicator|low-confidence|high-confidence|needs-human-confirmation|human confirmation/.test(text)) return "ai-confidence-indicator";
  if (/grounding-indicator|grounding indicator|citations-available|citations-missing|citation|citations|grounded|ungrounded/.test(text)) return "ai-grounding-indicator";
  if (/context-too-long|quota-exceeded|context too long|quota exceeded/.test(text)) return "ai-usage";
  if (/model-unavailable|content-filtered|model unavailable|content filtered/.test(text)) return "ai-safety-status";
  if (/external-link|external link/.test(text)) return "external-link";
  if (/skip-link|skip link/.test(text)) return "skip-link";
  if (/table-of-contents|table of contents/.test(text)) return "toc";
  if (/breadcrumb-item|breadcrumb item/.test(text)) return "breadcrumb-item";
  if (/bottom-navigation|bottom navigation|bottom nav|dictionary-bottom-navigation|tab-bar|tab bar/.test(text)) return "bottom-navigation-specific";
  if (/action-sheet|action sheet|dictionary-action-sheet/.test(text)) return "action-sheet-specific";
  if (/date-range-picker|date range picker|date-picker|date picker|time-picker|time picker|dictionary-date|dictionary-time/.test(text)) return "date-time-picker";
  if (/dictionary-otp-input|otp input|verification code|one-time code|pin input/.test(text)) return "otp-input-specific";
  if (/dictionary-data-grid|dictionary-tree-table|dictionary-pivot-table|data grid|tree table|pivot table/.test(text)) return "structured-table";
  if (/dictionary-tree|tree-view|tree view|directory-tree|file-tree|organization-tree|permission-tree|checkable-tree|draggable-tree/.test(text)) return "tree-view";
  if (/tree-select|tree select/.test(text)) return "tree-select";
  if (/\btransfer\b|transfer-list|dual-list|dual list/.test(text)) return "transfer-list";
  if (/icon-picker|icon picker/.test(text)) return "icon-picker";
  if (/emoji-picker|emoji picker/.test(text)) return "emoji-picker";
  if (/like-selection|like selection|reaction/.test(text)) return "reaction-picker";
  if (/column-settings|column settings|column-picker|column picker|column-visibility|column visibility/.test(text)) return "column-control";
  if (/split-button|split button/.test(text)) return "split-button-specific";
  if (/bulk-action-bar|bulk action bar|row-actions|row actions|card-actions|card actions/.test(text)) return "action-bar";
  if (/pricing-table|pricing table/.test(text)) return "pricing-table";
  if (/docs-navigation|docs navigation|document navigation/.test(text)) return "docs-navigation";
  if (/role-permissions|role permissions/.test(text)) return "role-permission-matrix";
  if (/permission-request|permission request/.test(text)) return "access-request";
  if (/permission-denied|permission denied|unauthorized|forbidden/.test(text)) return "access-denied";
  if (/decorative-icon|decorative icon/.test(text)) return "decorative-icon";
  if (/brand-icon|brand icon/.test(text)) return "brand-icon";
  if (/expand-icon|expand icon/.test(text)) return "expand-icon";
  if (/close-button|close button/.test(text)) return "close-button";
  if (/more-button|more button/.test(text)) return "more-button";
  if (/help-button|help button/.test(text)) return "help-button";
  if (/favorite-button|favorite button/.test(text)) return "favorite-button";
  if (/components-tag|dictionary-tag|\btag\b|chip/.test(text)) return "tag-chip";

  if (/card-header|card header/.test(text)) return "card-header";
  if (/card-footer|card footer/.test(text)) return "card-footer";
  if (/stat-card|metric card|stat card/.test(text)) return "stat-card";
  if (/profile-card|profile card|components-profile-card-2/.test(text)) return "profile-card";
  if (/detail-list|detail list/.test(text)) return "detail-list";
  if (/avatar-group|avatar group/.test(text)) return "avatar-group";
  if (/countdown/.test(text)) return "countdown";
  if (/result-page|result page|success state|components-success-state/.test(text)) return "result-page";
  if (/unauthenticated/.test(text)) return "auth-empty";
  if (/empty-result|no results|empty result/.test(text)) return "empty-result";

  if (/bottom-sheet-selection|mobile-filtering/.test(text)) return "mobile-task-sheet";
  if (/sku-bottom-sheet|sku bottom sheet/.test(text)) return "sku-sheet";
  if (/address-sheet|address sheet/.test(text)) return "address-sheet-specific";
  if (/payment-method-sheet|payment method sheet/.test(text)) return "payment-method-sheet-specific";
  if (/bottom-sheet|bottom sheet|dictionary-bottom-sheet/.test(text)) return "bottom-sheet";
  if (/navigation-drawer|mobile-navigation-drawer|navigation drawer/.test(text)) return "navigation-drawer";
  if (/detail-drawer|detail drawer/.test(text)) return "detail-drawer";
  if (/notification-center|notification center/.test(text)) return "notification-center";
  if (/fullscreen-modal|full-screen modal|fullscreen modal/.test(text)) return "fullscreen-modal";
  if (/non-modal-dialog|non-modal dialog/.test(text)) return "non-modal-dialog";
  if (/form-dialog|form dialog/.test(text)) return "form-dialog";
  if (/backdrop/.test(text)) return "backdrop";
  if (/portal/.test(text)) return "portal";
  if (/session-timeout-dialog|session timeout dialog/.test(text)) return "session-timeout";
  if (/permission-dialog|permission dialog|permission-request/.test(text)) return "permission-dialog";
  if (/share-dialog|share dialog/.test(text)) return "share-dialog";
  if (/lightbox/.test(text)) return "lightbox";
  if (/mobile-toast|mobile toast/.test(text)) return "mobile-toast";
  if (/snackbar/.test(text)) return "snackbar";
  if (/system-notification|system notification/.test(text)) return "system-notification";
  if (/info-alert|info alert/.test(text)) return "info-alert";

  if (/map-legend|map legend/.test(text)) return "map-legend";
  if (/map-marker|map marker|marker-cluster|marker cluster/.test(text)) return "map-marker";
  if (/map-chart|map chart|geo-heatmap|geo heatmap|heatmap-layer|heatmap layer/.test(text)) return "map-visual";
  if (/\bheatmap\b|heat map/.test(text)) return "chart-heatmap";
  if (/empty-chart-state|empty chart state/.test(text)) return "chart-empty-state";
  if (/chart-loading-state|chart loading state/.test(text)) return "chart-loading-state";
  if (/empty-map-state|empty map state/.test(text)) return "map-empty-state";
  if (/map-error-state|map error state/.test(text)) return "map-error-state";
  if (/treemap/.test(text)) return "chart-treemap";
  if (/chart-tooltip|chart tooltip/.test(text)) return "chart-tooltip";
  if (/chart-refresh|chart refresh/.test(text)) return "chart-refresh";
  if (/chart-export|chart export/.test(text)) return "chart-export";
  if (/flowchart-editor|flowchart editor/.test(text)) return "flowchart-editor";
  if (/diff-viewer|diff viewer/.test(text)) return "diff-viewer";
  if (/markdown-editor|markdown editor/.test(text)) return "markdown-editor";
  if (/rich-text-editor|text-editor|rich text editor|text editor/.test(text)) return "rich-text-editor";
  if (/formula-editor|formula editor/.test(text)) return "formula-editor";
  if (/editor-toolbar|formatting-toolbar|floating-formatting-toolbar|editor toolbar|formatting toolbar/.test(text)) return "editor-toolbar";
  if (/preview-toggle|preview toggle/.test(text)) return "preview-toggle";

  if (/upload-list|upload list/.test(text)) return "upload-list";
  if (/upload-status|upload status/.test(text)) return "upload-status";
  if (/save-status|save status/.test(text)) return "save-status";
  if (/image-picker|image picker|photo-library-picker|photo library picker/.test(text)) return "image-picker";
  if (/file-picker|file picker/.test(text)) return "file-picker";
  if (/folder-tree|folder tree/.test(text)) return "folder-tree";
  if (/broken-image-state|broken image/.test(text)) return "broken-image";
  if (/image-placeholder|placeholder-image|placeholder image/.test(text)) return "image-placeholder";
  if (/image-upload|image upload|image-insert|image insert/.test(text)) return "image-upload";
  if (/product-image-carousel|product image carousel/.test(text)) return "product-carousel";
  if (/image-gallery|image gallery|image-carousel|image carousel/.test(text)) return "image-grid";
  if (/pdf-viewer|pdf viewer/.test(text)) return "document-viewer";
  if (/file-thumbnail|file thumbnail/.test(text)) return "file-thumbnail";
  if (/patterns-file-preview|file-preview|file preview/.test(text)) return "document-viewer";
  if (/\bfolder\b/.test(text)) return "folder";
  if (/file-path|file path/.test(text)) return "file-path";
  if (/file-version|file version/.test(text)) return "file-version";
  if (/file-grid|file grid/.test(text)) return "file-grid";
  if (/code-file-viewer|code file viewer/.test(text)) return "code-file-viewer";
  if (/avatar-upload|avatar upload/.test(text)) return "avatar-upload";
  if (/document-viewing|document viewing|pdf-reading|pdf reading|document viewer|pdf reader/.test(text)) return "document-viewer";
  if (/video-playback|video playback|audio-playback|audio playback|file playback|media playback/.test(text)) return "media-viewer";
  if (/rename-file|rename file|move-file|move file|delete-file|delete file|file-download|file download|file-share|file share|patterns-rename-file|patterns-move-file|patterns-file-download|patterns-file-share/.test(text)) return "file-operation";
  if (/image-grid|image grid/.test(text)) return "image-grid";
  if (/image-cropper|crop image|image cropper/.test(text)) return "image-cropper";
  if (/image-compare|image compare/.test(text)) return "image-compare";
  if (/image-viewer|image preview|responsive-image|cover-image|\bthumbnail\b|\bimage\b/.test(text)) return "image-viewer";
  if (/waveform/.test(text)) return "waveform";

  if (/product-grid|product grid/.test(text)) return "product-grid";
  if (/product-price|original-price|discount-price|price display/.test(text)) return "price-display";
  if (/coupon-input|coupon input/.test(text)) return "coupon-input";
  if (/quantity-selector|quantity selector/.test(text)) return "quantity-selector";
  if (/components-payment-form|card-form|card form|payment form/.test(text)) return "payment-form";
  if (/login-panel|signup-panel|login form|signup form|forgot-password|reset-password|components-login-form|components-signup-form/.test(text)) return "auth-form";
  if (/user-menu|account-menu|user menu|account menu/.test(text)) return "account-menu";
  if (/session-management|session management/.test(text)) return "session-management";
  if (/cancel-subscription-confirmation|cancel subscription confirmation|account-deletion-confirmation|account deletion confirmation/.test(text)) return "";
  if (/account-deletion|account deletion/.test(text)) return "account-deletion";
  if (/token-meter|quota-meter|usage-meter/.test(text)) return "usage-meter";
  if (/backup-codes|backup codes/.test(text)) return "backup-codes";

  if (/model-selector|tool-selector|mode-selector|model selector|tool selector|mode selector/.test(text)) return "ai-selector";
  if (/prompt-suggestions|prompt-template|prompt-variables|prompt suggestions|prompt template|prompt variables/.test(text)) return "prompt-assist";
  if (/generated-result|ai-translation-result|ai-rewrite-suggestion|inline-suggestion|generated result|inline suggestion/.test(text)) return "ai-result";
  if (/ai-feedback-form|ai feedback form/.test(text)) return "ai-feedback";
  if (/token-usage|cost-estimate|context-window-notice|token usage|cost estimate|context window/.test(text)) return "ai-usage";

  if (/locale-selector|currency-selector|timezone-selector|country-selector|locale selector|currency selector|timezone selector|country selector/.test(text)) return "i18n-selector";
  if (/address-format-form|phone-number-input|address format|phone number/.test(text)) return "locale-form";
  if (/locale-aware-search|locale-aware-sort|localized search|localized sorting/.test(text)) return "locale-search";
  if (/rtl-toggle|rtl toggle/.test(text)) return "rtl-toggle";
  if (/unit-switcher|measurement-system-switcher|unit switcher|measurement system/.test(text)) return "unit-switcher";
  if (/multilingual-content-editor|multilingual content editor/.test(text)) return "multilingual-editor";

  if (/checkout-bar|sticky-checkout|cart-bar/.test(text)) return "mobile-checkout-bar";
  if (/mobile-coupon|coupon-sheet|coupon sheet/.test(text)) return "mobile-coupon";
  if (/mobile-order-card|order-card-2|mobile order card/.test(text)) return "mobile-order-card";
  if (/mobile-checkout|checkout-mobile/.test(text)) return "mobile-checkout-bar";
  if (/mobile-sorting|mobile-sort-sheet/.test(text)) return "mobile-sort-sheet";
  if (/sticky-bottom-action/.test(text)) return "sticky-bottom-action";
  if (/keyboard-avoidance/.test(text)) return "mobile-keyboard-avoidance";
  if (/status-bar|status bar/.test(text)) return "mobile-status-bar";
  if (/safe-area|safe area/.test(text)) return "mobile-safe-area";
  if (/splash-screen|splash screen/.test(text)) return "mobile-splash-screen";
  if (/mobile-segmented-control/.test(text)) return "mobile-segmented-control";
  if (/segmented-control|segmented control/.test(text)) return "segmented-control-specific";
  if (/numeric-keyboard|number keyboard/.test(text)) return "mobile-numeric-keyboard";
  if (/keyboard-accessory-bar|keyboard accessory/.test(text)) return "mobile-keyboard-accessory";
  if (/native-picker|wheel-picker|native picker|wheel picker/.test(text)) return "mobile-wheel-picker";
  if (/mobile-location-picker|location picker/.test(text)) return "mobile-location-picker";
  if (/current-location-indicator|current location indicator|location-pin|location pin|current-location-button|current location button/.test(text)) return "location-control";
  if (/biometric-prompt|face-id-prompt|touch-id-prompt|biometric prompt|face id|touch id/.test(text)) return "biometric-prompt";
  if (/mobile-haptic-feedback|haptic feedback/.test(text)) return "haptic-feedback";
  if (/mobile-command-entry|command entry/.test(text)) return "mobile-command-entry";
  if (/mobile-camera-capture|camera-capture|camera capture/.test(text)) return "mobile-camera-capture";
  if (/nfc-scan|nfc scan/.test(text)) return "nfc-scan";
  if (/bluetooth-connection|bluetooth connection/.test(text)) return "bluetooth-connection";
  if (/orientation-notice|orientation notice/.test(text)) return "orientation-notice";
  if (/mobile-map-view|mobile map view/.test(text)) return "mobile-map-view";
  if (/locate-me-button|locate me/.test(text)) return "locate-me";
  if (/sku-bottom-sheet|sku bottom sheet/.test(text)) return "sku-sheet";
  if (/address-sheet|address sheet/.test(text)) return "address-sheet-specific";
  if (/payment-method-sheet|payment method sheet/.test(text)) return "payment-method-sheet-specific";
  if (/mobile-filter-sheet|mobile-filtering|bottom-sheet-selection/.test(text)) return "mobile-task-sheet";
  if (/video-recorder|video recorder/.test(text)) return "video-recorder";
  if (/mobile-voice-input|voice input|patterns-voice-input/.test(text)) return "voice-input";
  if (/mobile-voice-recorder|audio-recorder|video-recorder|recording|recorder/.test(text)) return "recorder";
  if (/push-permission|location-permission|camera-permission|permission prompt/.test(text)) return "mobile-permission";
  if (/waiting-upload|upload-paused|upload-resumed|upload-canceled|previewing/.test(text)) return "file-state";
  if (/in-stock|low-stock|out-of-stock|preorder/.test(text)) return "stock-state";
  if (/pending-payment|payment-processing|payment-success|payment-failed|states-payment/.test(text)) return "payment-state";
  if (/subscription-active|subscription-expired|cancel-subscription/.test(text)) return "subscription-state";
  if (/column-hidden|column-visible|row-disabled|row-expanded|row-collapsed|column-frozen|column-pinned|resizing-column|cell-editing|row-editing/.test(text)) return "grid-state";

  if (/dictionary-command-palette|command palette/.test(text)) return "command-palette-specific";
  if (/kanban/.test(text)) return "kanban";
  if (/activity-feed|activity feed/.test(text)) return "activity-feed";
  if (/thumbs-feedback|thumbs feedback/.test(text)) return "thumbs-feedback";
  if (/scan-qr-code|scan qr code|scan qr/.test(text)) return "qr-scanner";
  if (/qr-login|qr login/.test(text)) return "qr-login";
  if (/download-invoice|download invoice/.test(text)) return "download-invoice";
  if (/remove-from-cart|remove from cart/.test(text)) return "cart-removal";
  if (/order-confirmation|order confirmation/.test(text)) return "order-confirmation-specific";
  if (/request-refund|return-item|remove-from-cart|order-confirmation/.test(text)) return "commerce-recovery";

  return "";
}

const selectorPreviewKinds = [
  "currency-selector-specific",
  "country-selector-specific",
  "timezone-selector-specific",
  "geo-selector-specific",
  "commerce-selector-specific",
  "font-selector-specific",
  "variable-picker-specific",
  "mention-picker-specific",
  "combobox-specific",
  "cascader-specific",
  "picker-overlay-specific",
  "notification-channel-selector-specific",
];

const feedbackPreviewKinds = [
  "pattern-success-message",
  "pattern-warning-message",
  "pattern-info-message",
  "pattern-announcement",
  "pattern-notification-settings",
  "pattern-reminder",
  "pattern-update",
  "pattern-reconnect",
  "pattern-first-load",
  "pattern-version-upgrade",
  "pattern-expired",
  "pattern-empty-project",
  "pattern-retry-failed",
  "dictionary-toast-specific",
];

const statePreviewKinds = [
  "not-found-state-specific",
  "multi-select-state",
  "sorting-state",
  "caption-state",
  "awaiting-confirmation-state",
  "shipment-state",
  "availability-state",
  "task-status-state",
];

const navigationPreviewKinds = [
  "footer-navigation-specific",
  "previous-next-specific",
  "anchor-navigation-specific",
  "infinite-scroll-specific",
  "recent-favorite-navigation-specific",
];

function getSelectorPreviewData(kind, selected) {
  const text = getPreviewSearchText(selected);
  if (kind === "currency-selector-specific") {
    return { badge: "Currency", caption: "Currency code and symbol stay explicit.", options: ["CNY - yuan", "USD - dollar", "EUR - euro"], active: 1 };
  }
  if (kind === "country-selector-specific") {
    return { badge: "Country", caption: "Country selection uses country names, not locales.", options: ["China", "United States", "Germany"], active: 0 };
  }
  if (kind === "timezone-selector-specific") {
    return { badge: "Timezone", caption: "Offsets and city labels prevent ambiguous time choices.", options: ["UTC+08 Shanghai", "UTC+00 London", "UTC-07 Los Angeles"], active: 0 };
  }
  if (kind === "geo-selector-specific") {
    return /region/.test(text)
      ? { badge: "Region", caption: "Region choices are grouped by geography.", options: ["East China", "North America", "Western Europe"], active: 0 }
      : { badge: "City", caption: "City selector shows place names with search-ready labels.", options: ["Shanghai", "Beijing", "Shenzhen"], active: 0 };
  }
  if (kind === "commerce-selector-specific") {
    if (/shipping/.test(text)) return { badge: "Shipping", caption: "Shipping methods include speed and cost.", options: ["Standard free", "Express $12", "Store pickup"], active: 1 };
    if (/sku/.test(text)) return { badge: "SKU", caption: "SKU options expose the exact purchasable variant.", options: ["SKU-BLK-M", "SKU-BLU-L", "SKU-GRN-S"], active: 0 };
    return { badge: "Size", caption: "Size selector communicates availability per option.", options: ["S", "M - selected", "L - low stock"], active: 1 };
  }
  if (kind === "font-selector-specific") {
    return /size/.test(text)
      ? { badge: "Type size", caption: "Font size choices preview their scale.", options: ["12 px", "16 px", "24 px"], active: 1 }
      : { badge: "Font", caption: "Font choices preview family names.", options: ["Inter", "Roboto Mono", "Source Serif"], active: 0 };
  }
  if (kind === "variable-picker-specific") {
    return { badge: "Variable", caption: "Template variables are inserted as tokens.", options: ["{{first_name}}", "{{plan_name}}", "{{renewal_date}}"], active: 0 };
  }
  if (kind === "mention-picker-specific") {
    return { badge: "Mention", caption: "Mention picker shows people, teams, or channels.", options: ["@alex", "@design-team", "#release"], active: 0 };
  }
  if (kind === "cascader-specific") {
    return { badge: "Cascader", caption: "Hierarchical choices show parent and child path.", options: ["Asia / China", "Europe / Germany", "America / US"], active: 0 };
  }
  if (kind === "picker-overlay-specific") {
    return { badge: "Overlay", caption: "Picker overlay keeps trigger, search, and choices connected.", options: ["Search field", "Pinned choices", "Confirm footer"], active: 1 };
  }
  if (kind === "notification-channel-selector-specific") {
    return { badge: "Channel", caption: "Notification channels state delivery surface.", options: ["Email", "Push", "Slack"], active: 1 };
  }
  return { badge: "Combobox", caption: "Combobox combines text input, filtering, and option selection.", options: ["Search result", "Suggested item", "Create new"], active: 0 };
}

function getFeedbackPreviewData(kind, selected) {
  const text = getPreviewSearchText(selected);
  if (kind === "pattern-success-message") return { tone: "success", icon: Check, title: "Saved successfully", body: "The change is live for the workspace.", action: "View record" };
  if (kind === "pattern-warning-message") return { tone: "warning", icon: Info, title: "Review required", body: "Some settings may affect active users.", action: "Review" };
  if (kind === "pattern-info-message") return { tone: "info", icon: Info, title: "Heads up", body: "This information helps the user understand the next step.", action: "Got it" };
  if (kind === "pattern-announcement") return { tone: "info", icon: BookOpen, title: /board/.test(text) ? "Announcement board" : "System announcement", body: "Maintenance starts at 02:00 UTC.", action: "Read update" };
  if (kind === "pattern-notification-settings") return { tone: "info", icon: SlidersHorizontal, title: "Notification settings", body: "Email, push, and workspace channels can be tuned separately.", action: "Open settings" };
  if (kind === "pattern-reminder") return { tone: "info", icon: MessageCircle, title: /mention/.test(text) ? "You were mentioned" : "Unread reminder", body: "A relevant update needs attention.", action: "Open thread" };
  if (kind === "pattern-update") return { tone: "info", icon: RefreshCcw, title: "Update available", body: "Refresh when ready to load the newest version.", action: "Refresh" };
  if (kind === "pattern-reconnect") return { tone: "warning", icon: RefreshCcw, title: "Connection lost", body: "Trying to reconnect without losing local edits.", action: "Retry now" };
  if (kind === "pattern-first-load") return { tone: "info", icon: Sparkles, title: "Preparing workspace", body: "Loading the first useful screen and core data.", action: "Continue" };
  if (kind === "pattern-version-upgrade") return { tone: "success", icon: ArrowUp, title: "Version upgraded", body: "New components and fixes are ready.", action: "See changes" };
  if (kind === "pattern-expired") return { tone: "warning", icon: CalendarClock, title: "Resource expired", body: "Request a fresh link or regenerate the file.", action: "Regenerate" };
  if (kind === "pattern-empty-project") return { tone: "empty", icon: LayoutGrid, title: "No projects yet", body: "Create a project or import an existing workspace.", action: "Create project" };
  if (kind === "pattern-retry-failed") return { tone: "danger", icon: RefreshCcw, title: "Action failed", body: "The previous attempt did not complete.", action: "Retry action" };
  return { tone: "success", icon: Check, title: "File archived", body: "The toast gives one clear status and optional undo.", action: "Undo" };
}

function getStatePreviewData(kind, selected) {
  const text = getPreviewSearchText(selected);
  if (kind === "not-found-state-specific") return { tone: "empty", title: "Not found", body: "The requested record no longer exists.", meta: "404", action: "Back to list" };
  if (kind === "multi-select-state") return { tone: "info", title: "3 selected", body: "Bulk actions are available for the current selection.", meta: "Multi select", action: "Clear" };
  if (kind === "sorting-state") return { tone: "info", title: "Sorted by newest", body: "The active sort is visible and reversible.", meta: "Sort", action: "Change sort" };
  if (kind === "caption-state") return /off/.test(text)
    ? { tone: "warning", title: "Captions off", body: "The media still offers a captions control.", meta: "CC off", action: "Turn on" }
    : { tone: "success", title: "Captions on", body: "Captions are visible and synchronized.", meta: "CC on", action: "Settings" };
  if (kind === "awaiting-confirmation-state") return { tone: "warning", title: "Awaiting confirmation", body: "The action is paused until the user confirms.", meta: "Pending", action: "Confirm" };
  if (kind === "shipment-state") return { tone: "info", title: "Awaiting shipment", body: "Order is paid and waiting for fulfillment.", meta: "Order", action: "View order" };
  if (kind === "availability-state") {
    if (/retrieving/.test(text)) return { tone: "info", title: "Retrieving availability", body: "Checking current inventory before enabling purchase.", meta: "Checking", action: "Refresh" };
    if (/unavailable/.test(text)) return { tone: "danger", title: "Unavailable", body: "This item cannot be selected right now.", meta: "Blocked", action: "Notify me" };
    return { tone: "success", title: "Available", body: "This choice can be selected now.", meta: "Ready", action: "Select" };
  }
  if (/away/.test(text)) return { tone: "warning", title: "Away", body: "The assignee is not currently active.", meta: "Presence", action: "Reassign" };
  if (/busy/.test(text)) return { tone: "warning", title: "Busy", body: "The user is active but not available.", meta: "Presence", action: "Message" };
  if (/skipped/.test(text)) return { tone: "empty", title: "Skipped", body: "This step was intentionally bypassed.", meta: "Workflow", action: "Restore" };
  if (/unassigned/.test(text)) return { tone: "warning", title: "Unassigned", body: "No owner has been selected.", meta: "Owner", action: "Assign" };
  if (/low-priority|low priority/.test(text)) return { tone: "info", title: "Low priority", body: "The item is queued behind urgent work.", meta: "Priority", action: "Change" };
  return { tone: "success", title: "Assigned", body: "The item has an owner and can move forward.", meta: "Owner", action: "View owner" };
}

function SpecificLivePreview({ selected, kind, variantClass }) {
  const title = selected.title;
  const previewText = getPreviewSearchText(selected);

  if (kind.startsWith("button-")) {
    return <ButtonSpecificLivePreview selected={selected} kind={kind} variantClass={variantClass} />;
  }

  if (kind === "external-link" || kind === "skip-link") {
    return (
      <div className={`live-specific-card specific-link ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{kind === "external-link" ? "New tab" : "Focus visible"}</span></header>
        <section><Link2 size={18} /><b>{kind === "external-link" ? "docs.example.com" : "Skip to main content"}</b><ChevronRight size={16} /></section>
        <p>{kind === "external-link" ? "Shows destination, external target, and open behavior before navigation." : "Appears on keyboard focus and jumps directly to the main landmark."}</p>
      </div>
    );
  }

  if (["decorative-icon", "brand-icon", "expand-icon"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-icon ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{kind === "decorative-icon" ? "aria-hidden" : kind === "brand-icon" ? "Brand" : "Disclosure"}</span></header>
        <section>
          {kind === "brand-icon" ? <b className="brand-mark">UI</b> : kind === "expand-icon" ? <button type="button"><ChevronRight size={22} /> Expanded</button> : <i aria-hidden="true" />}
          <p>{kind === "decorative-icon" ? "Decorative icons support text and do not receive focus." : kind === "brand-icon" ? "Brand marks need clear space, contrast, and single-color fallback." : "Disclosure icons mirror expanded and collapsed state."}</p>
        </section>
      </div>
    );
  }

  if (["close-button", "more-button", "help-button", "favorite-button"].includes(kind)) {
    const Icon = kind === "close-button" ? X : kind === "more-button" ? SlidersHorizontal : kind === "help-button" ? CircleHelp : Bookmark;
    const label = kind === "close-button" ? "Close panel" : kind === "more-button" ? "More actions" : kind === "help-button" ? "Open help" : "Saved";
    return (
      <div className={`live-specific-card specific-button ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><button type="button" aria-label={label}><Icon size={20} /></button></header>
        <section><span>{label}</span><small>{kind === "more-button" ? "Menu opened" : kind === "favorite-button" ? "Pressed state" : "Target stays explicit"}</small></section>
      </div>
    );
  }

  if (kind === "tag-chip") {
    return (
      <div className={`live-filter-chip-card specific-tag-chip ${variantClass}`}>
        <strong>{title}</strong>
        <div><span>Design <X size={13} /></span><span className="selected">Selected</span><span>Beta</span></div>
        <button type="button">Clear tags</button>
      </div>
    );
  }

  if (selectorPreviewKinds.includes(kind)) {
    const data = getSelectorPreviewData(kind, selected);
    return (
      <div className={`live-specific-card specific-control semantic-specific selector-specific ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{data.badge}</span></header>
        <section className="specific-selector contextual-selector">
          {kind === "combobox-specific" && <label><Search size={15} /><input readOnly value="Search choices" /></label>}
          {data.options.map((option, index) => (
            <button key={option} type="button" className={index === data.active ? "active" : ""}>{option}</button>
          ))}
          <span>{data.caption}</span>
        </section>
      </div>
    );
  }

  if (["steps-control", "tab-panel-specific", "shortcut-panel", "shortcut-entry", "offline-banner", "warning-result", "fieldset-specific", "wizard-form-specific", "role-selector-specific", "map-selector", "navigation-rail-specific", "page-number-specific", "react-toggle-specific", "color-swatch-specific", "spacing-scale-specific", "typography-scale-specific", "motion-timeline-specific", "status-badge-specific", "loading-state-specific", "pattern-error-state", "partial-success-state", "rating-feedback", "connection-state", "data-state", "operation-success-state", "loading-overlay-specific", "alert-dialog-specific", "confirmation-dialog-specific", "search-box-specific", "error-state-specific", "pull-refresh-specific", "swipe-action-specific", "drag-sort-specific", "dictionary-pagination-specific", ...feedbackPreviewKinds, ...statePreviewKinds, ...navigationPreviewKinds].includes(kind)) {
    const isLayer = /layer/.test(getPreviewSearchText(selected));
    const isFloor = /floor/.test(getPreviewSearchText(selected));
    const isRadius = /radius/.test(getPreviewSearchText(selected));
    const stateText = previewText;
    const isOffline = /offline|disconnected|undelivered|unsynced|unpublished/.test(stateText);
    const isRate = /rate/.test(stateText);
    const isTimeout = /timeout/.test(stateText);
    const isPartial = /partial/.test(stateText);
    const feedback = feedbackPreviewKinds.includes(kind) ? getFeedbackPreviewData(kind, selected) : null;
    const statePreview = statePreviewKinds.includes(kind) ? getStatePreviewData(kind, selected) : null;
    const FeedbackIcon = feedback?.icon || Info;
    return (
      <div className={`live-specific-card specific-control semantic-specific ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{selected.category === "react" ? "React UI" : feedback ? "Feedback" : statePreview ? "State" : navigationPreviewKinds.includes(kind) ? "Navigation" : "Control"}</span></header>
        {feedback && <section className={`specific-result ${feedback.tone}`}><FeedbackIcon size={28} /><b>{feedback.title}</b><span>{feedback.body}</span><button>{feedback.action}</button></section>}
        {statePreview && <section className={`specific-result ${statePreview.tone}`}><b>{statePreview.title}</b><span>{statePreview.body}</span><small>{statePreview.meta}</small><button>{statePreview.action}</button></section>}
        {kind === "footer-navigation-specific" && <nav className="specific-footer-nav"><button>Terms</button><button className="active">Docs</button><button>Status</button><button>Contact</button></nav>}
        {kind === "previous-next-specific" && <section className="specific-prev-next"><button>Previous</button><b>Page 2 of 8</b><button>Next</button></section>}
        {kind === "anchor-navigation-specific" && <nav className="specific-anchor-nav"><a>Overview</a><a className="active">Usage</a><a>API</a><a>FAQ</a></nav>}
        {kind === "infinite-scroll-specific" && <section className="specific-infinite-scroll"><article /><article /><article /><b>Loading more results</b></section>}
        {kind === "recent-favorite-navigation-specific" && <nav className="specific-recent-nav"><button><CalendarClock size={15} />Recent</button><button className="active"><Bookmark size={15} />Favorites</button><button><Search size={15} />Find</button></nav>}
        {kind === "dictionary-pagination-specific" && <section className="specific-page-number"><button>Prev</button><button>1</button><button className="active">2</button><button>3</button><button>Next</button></section>}
        {kind === "steps-control" && <section className="specific-steps"><b className="done">1. Cart</b><b className="active">2. Shipping</b><b>3. Pay</b><span>Current step has label and progress.</span></section>}
        {kind === "tab-panel-specific" && <section className="specific-tab-panel"><nav><button className="active">Overview</button><button>Specs</button><button>Activity</button></nav><main><strong>Overview panel</strong><p>Panel content changes with the selected tab.</p></main></section>}
        {kind === "shortcut-panel" && <section className="specific-shortcuts"><b>Command</b><b>Shortcut</b><span>Open search</span><kbd>Ctrl K</kbd><span>Save changes</span><kbd>Ctrl S</kbd><span>Close panel</span><kbd>Esc</kbd></section>}
        {kind === "shortcut-entry" && <section className="specific-command-entry"><Search size={16} /><b>Search commands</b><kbd>Ctrl K</kbd></section>}
        {kind === "offline-banner" && <section className="specific-banner warning"><b>Offline mode</b><span>Changes are saved locally and will sync after reconnect.</span><button>Retry</button></section>}
        {kind === "warning-result" && <section className="specific-result warning"><Info size={28} /><b>Needs attention</b><span>Some items could not be processed.</span><button>Review issues</button></section>}
        {kind === "pattern-error-state" && <section className="specific-result danger"><Info size={28} /><b>{isRate ? "Rate limit reached" : isTimeout ? "Request timed out" : "Something failed"}</b><span>{isRate ? "Wait 58 seconds before retrying." : isTimeout ? "The server did not respond in time." : "Check the issue and retry the operation."}</span><button>{isRate ? "View quota" : "Retry"}</button></section>}
        {kind === "partial-success-state" && <section className="specific-result warning"><Check size={28} /><b>Partially completed</b><span>8 items succeeded, 2 need review.</span><button>Review failed items</button></section>}
        {kind === "rating-feedback" && <section className="specific-rating"><b>Rate this experience</b><div><button>1</button><button>2</button><button>3</button><button className="active">4</button><button>5</button></div><textarea readOnly value="Tell us what worked well..." /></section>}
        {kind === "connection-state" && <section className={`specific-connection ${isOffline ? "offline" : "online"}`}><b>{isOffline ? "Needs sync" : "Connected"}</b><span>{isOffline ? "Message is queued until the connection returns." : "Realtime updates are active."}</span><button>{isOffline ? "Retry sync" : "View status"}</button></section>}
        {kind === "data-state" && <section className="specific-data-state"><b>{isPartial ? "Partial data" : /no-more|end-of-pagination/.test(stateText) ? "End of list" : /cached|stale/.test(stateText) ? "Cached data" : "Data loaded"}</b><span>{isPartial ? "Some rows are hidden until refresh completes." : /no-more|end-of-pagination/.test(stateText) ? "No more results to load." : /cached|stale/.test(stateText) ? "Showing saved data from the last refresh." : "128 rows are ready."}</span><div><i /><i /><i /></div></section>}
        {kind === "operation-success-state" && <section className="specific-result success"><Check size={28} /><b>{/filters/.test(stateText) ? "Filters cleared" : /tool/.test(stateText) ? "Tool call succeeded" : /query/.test(stateText) ? "Query completed" : "Validation passed"}</b><span>{/filters/.test(stateText) ? "Showing all results again." : "The next step is ready."}</span><button>Continue</button></section>}
        {kind === "loading-overlay-specific" && <section className="specific-loading-overlay"><main><i /><i /><i /></main><div><b>Loading</b><span>Keep the layout in place while data arrives.</span></div></section>}
        {kind === "alert-dialog-specific" && <section className="specific-dialog-mini danger"><b>Warning</b><span>This action may affect active users.</span><footer><button>Cancel</button><button>Continue</button></footer></section>}
        {kind === "confirmation-dialog-specific" && <section className="specific-dialog-mini"><b>Confirm changes</b><span>Review before applying this update.</span><footer><button>Back</button><button>Confirm</button></footer></section>}
        {kind === "search-box-specific" && <section className="specific-search-box"><Search size={17} /><input readOnly value="Search UI components" /><button>Clear</button><div><span>Button</span><span>Search field</span><span>Filter panel</span></div></section>}
        {kind === "error-state-specific" && <section className="specific-result danger"><Info size={28} /><b>{isOffline ? "Offline" : isRate ? "Rate limit" : "Server error"}</b><span>{isOffline ? "Reconnect to sync changes." : isRate ? "Try again after the cooldown." : "The request failed on the server."}</span><button>{isRate ? "Wait and retry" : "Retry"}</button></section>}
        {kind === "pull-refresh-specific" && <section className="specific-pull-refresh"><b>Pull to refresh</b><i /><span>Release at the threshold to reload.</span><main><p /><p /><p /></main></section>}
        {kind === "swipe-action-specific" && <section className="specific-swipe-action"><article><span>Message from Alex</span><button>Archive</button><button className="danger">Delete</button></article><b>Drag handle</b></section>}
        {kind === "drag-sort-specific" && <section className="specific-drag-sort"><article><b>1</b><span>Inbox rules</span><button>::</button></article><article className="active"><b>2</b><span>Billing alerts</span><button>::</button></article><article><b>3</b><span>Release notes</span><button>::</button></article></section>}
        {kind === "fieldset-specific" && <fieldset className="specific-fieldset"><legend>Billing address</legend><label>Street<input readOnly value="88 Market St" /></label><label>City<input readOnly value="Shanghai" /></label></fieldset>}
        {kind === "wizard-form-specific" && <section className="specific-wizard-form"><div><b className="done">Account</b><b className="active">Profile</b><b>Confirm</b></div><label>Company<input readOnly value="Kandong UI" /></label><button>Next step</button></section>}
        {kind === "role-selector-specific" && <section className="specific-selector"><button className="active">Admin</button><button>Editor</button><button>Viewer</button><span>Role controls permissions.</span></section>}
        {kind === "map-selector" && <section className="specific-selector map-selector"><button className="active">{isLayer ? "Streets" : isFloor ? "1F" : isRadius ? "1 km" : "Map"}</button><button>{isLayer ? "Satellite" : isFloor ? "2F" : isRadius ? "3 km" : "Traffic"}</button><button>{isLayer ? "Traffic" : isFloor ? "B1" : isRadius ? "5 km" : "Zones"}</button><span>{isLayer ? "Map layer" : isFloor ? "Indoor floor" : "Search radius"}</span></section>}
        {kind === "navigation-rail-specific" && <nav className="specific-nav-rail"><button className="active"><Grid2X2 size={16} />Home</button><button><Search size={16} />Search</button><button><Bookmark size={16} />Saved</button><button><UserRound size={16} />Me</button></nav>}
        {kind === "page-number-specific" && <section className="specific-page-number"><button>1</button><button className="active">2</button><button>3</button><span>...</span><button>12</button></section>}
        {kind === "react-toggle-specific" && <section className="specific-react-toggle"><button className="active">Light</button><button>Dark</button><button>System</button><span>Token-aware toggle component</span></section>}
        {kind === "color-swatch-specific" && <section className="specific-swatch-grid">{["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#f8fafc"].map((color) => <b key={color} style={{ background: color }}><span>{color}</span></b>)}</section>}
        {kind === "spacing-scale-specific" && <section className="specific-scale spacing">{[4, 8, 12, 16, 24].map((size) => <b key={size}><i style={{ width: `${size * 3}px` }} />{size}px</b>)}</section>}
        {kind === "typography-scale-specific" && <section className="specific-scale type"><b className="h1">Heading</b><b className="body">Body text</b><b className="caption">Caption</b></section>}
        {kind === "motion-timeline-specific" && <section className="specific-motion-timeline"><b>0ms</b><i /><b>160ms</b><i /><b>320ms</b><span>Enter, hold, exit</span></section>}
        {kind === "status-badge-specific" && <section className="specific-status-badges"><b className="success">Active</b><b className="warning">Pending</b><b className="danger">Blocked</b></section>}
        {kind === "loading-state-specific" && <section className="specific-loading-state"><i /><b /><b /><span>Loading data with reserved layout.</span></section>}
      </div>
    );
  }

  if (["comparison-table-specific", "api-table-specific", "table-pagination-specific", "table-toolbar-specific", "matrix-table", "props-table-specific", "table-filter-specific", "saved-view-specific", "empty-table-specific", "aggregate-row-specific", "group-row-specific"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-table ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>Table</span></header>
        {kind === "comparison-table-specific" && <section><b>Feature</b><b>Starter</b><b>Pro</b><span>SAML</span><span>No</span><span>Yes</span><span>Seats</span><span>3</span><span>25</span></section>}
        {kind === "api-table-specific" && <section><b>Prop</b><b>Type</b><b>Default</b><span>variant</span><span>string</span><span>solid</span><span>disabled</span><span>boolean</span><span>false</span></section>}
        {kind === "props-table-specific" && <section><b>Prop</b><b>Type</b><b>Required</b><span>value</span><span>string</span><span>Yes</span><span>onChange</span><span>function</span><span>No</span></section>}
        {kind === "table-pagination-specific" && <section className="specific-table-pagination"><b>Rows 21-40 of 128</b><div><button>Prev</button><button className="active">2</button><button>3</button><button>Next</button></div></section>}
        {kind === "table-toolbar-specific" && <section className="specific-table-toolbar"><Search size={16} /><button>Filter</button><button>Columns</button><button>Export</button><span>3 selected</span></section>}
        {kind === "table-filter-specific" && <section className="specific-table-toolbar"><Search size={16} /><button className="active">Status: active</button><button>Date range</button><button>Clear</button></section>}
        {kind === "saved-view-specific" && <section><b>Saved view</b><b>Filters</b><b>Owner</b><span>At risk accounts</span><span>3 rules</span><span>Alex</span><span>Renewals</span><span>2 rules</span><span>Sales</span></section>}
        {kind === "empty-table-specific" && <section className="specific-table-empty"><CircleHelp size={28} /><b>No rows</b><span>Adjust filters or import a CSV.</span><button>Import rows</button></section>}
        {kind === "aggregate-row-specific" && <section><b>Metric</b><b>Current</b><b>Total</b><span>Revenue</span><span>$12.4k</span><span>$98k</span><span>Rows</span><span>24</span><span>128</span></section>}
        {kind === "group-row-specific" && <section><b>Group</b><b>Items</b><b>Status</b><span>Enterprise</span><span>18 rows</span><span>Expanded</span><span>SMB</span><span>42 rows</span><span>Collapsed</span></section>}
        {kind === "matrix-table" && <section><b>Variant</b><b>Default</b><b>Disabled</b><span>Primary</span><span>Pass</span><span>Pass</span><span>Ghost</span><span>Pass</span><span>Needs review</span></section>}
      </div>
    );
  }

  if (["product-card-specific", "product-detail-specific", "variant-selector-specific", "social-login-button", "card-number-field", "security-settings", "api-key-list", "support-chat", "product-list-specific", "order-list-specific", "product-gallery-specific", "product-reviews-specific", "subscription-management-specific", "security-list-specific", "danger-zone-specific", "ticket-list-specific", "help-entry-specific", "service-status-specific"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-domain ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{kind.includes("product") || kind.includes("order") || kind.includes("subscription") || kind.includes("variant") ? "Commerce" : kind.includes("security") || kind.includes("api-key") || kind.includes("danger") ? "Security" : kind.includes("ticket") || kind.includes("help") || kind.includes("status") ? "Support" : "Domain"}</span></header>
        {kind === "product-card-specific" && <section className="specific-product-card"><i /><b>Everyday tote</b><strong>$68</strong><span>In stock</span><button>Add to cart</button></section>}
        {kind === "product-detail-specific" && <section className="specific-product-detail"><aside><i /><i /><i /></aside><main><b>Wireless Kit</b><strong>$168</strong><span>Color: Black</span><button>Buy now</button></main></section>}
        {kind === "variant-selector-specific" && <section className="specific-selector"><b>Color</b><button>Black</button><button className="active">Blue</button><b>Size</b><button>M</button><button>L</button><span>3 left in stock</span></section>}
        {kind === "product-list-specific" && <section className="specific-product-list"><article><i /><b>Tote</b><span>$68</span></article><article><i /><b>Desk lamp</b><span>$42</span></article><article><i /><b>Notebook</b><span>$16</span></article></section>}
        {kind === "order-list-specific" && <section className="specific-order-list"><b>Order #1024</b><span>Paid - shipping today</span><b>Order #1025</b><span>Refund requested</span><b>Order #1026</b><span>Awaiting payment</span></section>}
        {kind === "product-gallery-specific" && <section className="specific-product-gallery"><i className="hero" /><i /><i /><i /></section>}
        {kind === "product-reviews-specific" && <section className="specific-review-list"><b>4.8 average</b><span>Alex: Great build quality.</span><span>Mia: Shipping was fast.</span><button>Write review</button></section>}
        {kind === "subscription-management-specific" && <section className="specific-subscription"><b>Pro monthly</b><span>Renews Jul 21</span><div><button>Change plan</button><button className="danger">Cancel</button></div></section>}
        {kind === "social-login-button" && <section className="specific-social-login"><button>G Continue with Google</button><button>GH Continue with GitHub</button><button>A Continue with Apple</button></section>}
        {kind === "card-number-field" && <section className="specific-card-field"><label>Card number<input readOnly value="4242 4242 4242 4242" /></label><b>Visa</b><span>Valid card number</span></section>}
        {kind === "security-settings" && <section className="specific-security-list"><label><span>Two-factor authentication</span><input type="checkbox" defaultChecked /></label><label><span>Session alerts</span><input type="checkbox" /></label><button>Rotate password</button></section>}
        {kind === "security-list-specific" && <section className="specific-security-list"><label><span>File permissions</span><input type="checkbox" defaultChecked /></label><label><span>Authorized apps</span><input type="checkbox" /></label><label><span>Login history alerts</span><input type="checkbox" defaultChecked /></label></section>}
        {kind === "danger-zone-specific" && <section className="specific-danger-zone"><b>Danger zone</b><span>Deleting this workspace cannot be undone.</span><input readOnly value="DELETE" /><button className="danger">Delete workspace</button></section>}
        {kind === "api-key-list" && <section className="specific-api-keys"><b>Production key</b><span>Read/write - used today</span><button>Revoke</button><b>Analytics key</b><span>Read only - 12 days ago</span><button>Rotate</button></section>}
        {kind === "support-chat" && <section className="specific-support-chat"><b>Support online</b><p>Hi, how can we help with your billing issue?</p><span>You: I need an invoice.</span><footer><input readOnly value="Type a reply..." /><button>Send</button></footer></section>}
        {kind === "ticket-list-specific" && <section className="specific-ticket-list"><b>#4821 Login issue</b><span>Open - high</span><b>#4822 Invoice request</b><span>Waiting on customer</span><b>#4823 Feature question</b><span>Solved</span></section>}
        {kind === "help-entry-specific" && <section className="specific-help-entry"><Search size={17} /><b>Search help articles</b><span>FAQ, glossary, docs, and shortcut help live here.</span><button>Open article</button></section>}
        {kind === "service-status-specific" && <section className="specific-service-status"><b className="success">API operational</b><b className="warning">Search degraded</b><b>Uptime 99.98%</b><button>Subscribe</button></section>}
      </div>
    );
  }

  if (kind === "image-editor-specific") {
    return (
      <div className={`live-specific-card specific-media image-editor-specific ${variantClass}`}>
        <header><strong>{title}</strong><button type="button">Apply</button></header>
        <section className="specific-image-editor"><nav><button>Crop</button><button>Adjust</button><button>Annotate</button></nav><main><i /><b /><b /></main><aside><span>Brightness</span><b /><span>Crop 4:3</span></aside></section>
      </div>
    );
  }

  if (["bottom-navigation-specific", "action-sheet-specific", "date-time-picker", "otp-input-specific", "structured-table", "tree-view", "tree-select", "transfer-list", "icon-picker", "emoji-picker", "reaction-picker", "column-control", "split-button-specific", "action-bar", "segmented-control-specific", "pricing-table", "docs-navigation", "role-permission-matrix", "access-request", "access-denied", "checkout-stepper"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-control ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{kind.includes("navigation") ? "Navigation" : kind.includes("table") ? "Data" : kind.includes("permission") || kind.includes("access") ? "Access" : "Control"}</span></header>
        {kind === "bottom-navigation-specific" && <nav className="specific-bottom-nav"><button className="active">Home</button><button>Search</button><button>Saved</button><button>Profile</button></nav>}
        {kind === "action-sheet-specific" && <section className="specific-action-sheet"><b /><button>Share</button><button>Copy link</button><button className="danger">Delete</button><button>Cancel</button></section>}
        {kind === "date-time-picker" && <section className="specific-date-picker"><header><b>Jun 2026</b><span>14:30</span></header><div>{Array.from({ length: 14 }).map((_, index) => <i key={index} className={index === 8 ? "selected" : ""}>{index + 10}</i>)}</div></section>}
        {kind === "otp-input-specific" && <section className="specific-otp">{["6", "2", "", ""].map((digit, index) => <b key={index} className={index === 2 ? "focus" : ""}>{digit}</b>)}<small>Paste one-time code</small></section>}
        {kind === "structured-table" && <section className="specific-structured-table"><b>Name</b><b>Q1</b><b>Q2</b><span>Parent / Child row</span><span>$42k</span><span>$58k</span></section>}
        {kind === "tree-view" && <section className="specific-tree"><b>Components</b><span>Button</span><span>Input</span><b>Patterns</b><span>Checkout</span></section>}
        {kind === "tree-select" && <section className="specific-tree-select"><button>Choose item</button><b>Components</b><label><input type="checkbox" defaultChecked /> Button</label><label><input type="checkbox" /> Input</label></section>}
        {kind === "transfer-list" && <section className="specific-transfer"><aside><b>Available</b><span>Viewer</span><span>Editor</span></aside><nav><button>→</button><button>←</button></nav><aside><b>Selected</b><span>Admin</span></aside></section>}
        {kind === "icon-picker" && <section className="specific-picker-grid icons"><Search size={18} /><Check size={18} /><Share2 size={18} /><Bookmark size={18} /><SlidersHorizontal size={18} /><Info size={18} /></section>}
        {kind === "emoji-picker" && <section className="specific-picker-grid emoji"><b>😀</b><b>🎉</b><b>👍</b><b>❤️</b><b>🔥</b><b>✅</b></section>}
        {kind === "reaction-picker" && <section className="specific-reaction"><button className="active">Like</button><button>Love</button><button>Insightful</button><span>12 selected</span></section>}
        {kind === "column-control" && <section className="specific-column-control"><label><input type="checkbox" defaultChecked /> Name</label><label><input type="checkbox" defaultChecked /> Status</label><label><input type="checkbox" /> Cost</label><button>Pin column</button></section>}
        {kind === "split-button-specific" && <section className="specific-split-button"><button>Save</button><button><ChevronRight size={15} /></button><div><span>Save as draft</span><span>Save and publish</span></div></section>}
        {kind === "action-bar" && <section className="specific-action-bar"><span>3 selected</span><button>Archive</button><button>Export</button><button className="danger">Delete</button></section>}
        {kind === "segmented-control-specific" && <section className="specific-segmented"><button className="active">List</button><button>Board</button><button>Calendar</button></section>}
        {kind === "pricing-table" && <section className="specific-pricing-table"><article><b>Starter</b><strong>$12</strong><span>Basic</span></article><article className="featured"><b>Pro</b><strong>$29</strong><span>Team</span></article><article><b>Scale</b><strong>$79</strong><span>SAML</span></article></section>}
        {kind === "docs-navigation" && <section className="specific-docs-nav"><aside><b>Guide</b><span>Install</span><span className="active">Components</span><span>API</span></aside><main><strong>Components</strong><p /></main></section>}
        {kind === "role-permission-matrix" && <section className="specific-role-matrix"><b>Role</b><b>Read</b><b>Write</b><span>Admin</span><span>Yes</span><span>Yes</span><span>Viewer</span><span>Yes</span><span>No</span></section>}
        {kind === "access-request" && <section className="specific-access"><b>Request access</b><span>Role approval required before continuing.</span><button>Request access</button></section>}
        {kind === "access-denied" && <section className="specific-access denied"><b>Access denied</b><span>You need permission to view this resource.</span><button>Sign in</button></section>}
        {kind === "checkout-stepper" && <section className="specific-checkout-stepper"><b className="done">Address</b><b className="active">Payment</b><b>Review</b><footer><span>2 of 3</span><button>Continue checkout</button></footer></section>}
      </div>
    );
  }

  if (["card-header", "card-footer", "stat-card", "profile-card", "detail-list", "avatar-group", "countdown", "result-page", "auth-empty", "empty-result", "toc", "breadcrumb-item", "maintenance-state"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-content ${kind} ${variantClass}`}>
        {kind === "card-header" && <><header><strong>Quarterly report</strong><button type="button">Edit</button></header><section><span>Owner</span><b>Design Ops</b></section></>}
        {kind === "card-footer" && <><main><strong>Project card</strong><p>Summary content sits above the footer slot.</p></main><footer><span>Updated today</span><button type="button">Open</button></footer></>}
        {kind === "stat-card" && <><small>{title}</small><strong className="metric-value">128K</strong><section><b>+12.4%</b><i /><i /><i /></section></>}
        {kind === "profile-card" && <><section className="profile-row"><b>AL</b><div><strong>Alex Lee</strong><span>Product Designer</span></div></section><footer><button>Message</button><button>View profile</button></footer></>}
        {kind === "detail-list" && <><strong>{title}</strong>{["Status: Active", "Owner: Alex", "Updated: Today"].map((row) => <div key={row}><span>{row.split(": ")[0]}</span><b>{row.split(": ")[1]}</b></div>)}</>}
        {kind === "avatar-group" && <><strong>{title}</strong><section className="avatar-stack"><b>A</b><b>M</b><b>K</b><span>+8</span></section><small>Shows overlap, count overflow, and presence.</small></>}
        {kind === "countdown" && <><strong>{title}</strong><div className="timer">04:58</div><button type="button">Extend</button></>}
        {kind === "result-page" && <><Check size={34} /><strong>Payment complete</strong><span>Receipt #2048 is ready.</span><button type="button">View receipt</button></>}
        {kind === "auth-empty" && <><UserRound size={34} /><strong>Sign in required</strong><span>Log in to save this item and continue.</span><button type="button">Log in</button></>}
        {kind === "empty-result" && <><Search size={32} /><strong>No matching results</strong><span>Clear filters or try another keyword.</span><button type="button">Clear filters</button></>}
        {kind === "toc" && <><strong>{title}</strong><nav className="specific-toc"><a>Intro</a><a className="active">Usage</a><a>API</a><a>Examples</a></nav><small>Shows section anchors and current scroll position.</small></>}
        {kind === "breadcrumb-item" && <><strong>{title}</strong><section className="specific-crumb"><span>Home</span><ChevronRight size={14} /><b>Current item</b></section><small>Represents one crumb, current state, and separator relationship.</small></>}
        {kind === "maintenance-state" && <><Info size={34} /><strong>Scheduled maintenance</strong><span>Payments are paused until 02:00 UTC.</span><section><b>Impact: checkout</b><b>ETA: 35 min</b></section><button type="button">Subscribe updates</button></>}
      </div>
    );
  }

  if (["bottom-sheet", "navigation-drawer", "detail-drawer", "notification-center", "fullscreen-modal", "non-modal-dialog", "form-dialog", "backdrop", "portal", "session-timeout", "permission-dialog", "share-dialog", "lightbox", "mobile-toast", "snackbar", "system-notification", "info-alert"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-overlay ${kind} ${variantClass}`}>
        <main><i /><i /><i /></main>
        <section>
          <header><strong>{title}</strong><span>{kind.includes("sheet") ? "Bottom" : kind.includes("drawer") ? "Panel" : kind.includes("toast") || kind === "snackbar" ? "Message" : "Overlay"}</span></header>
          {kind === "navigation-drawer" && ["Dashboard", "Components", "Settings"].map((row, index) => <button key={row} className={index === 1 ? "active" : ""}>{row}</button>)}
          {kind === "detail-drawer" && ["Order #1024", "Status: Shipped", "Total: $140"].map((row) => <b key={row}>{row}</b>)}
          {kind === "notification-center" && ["Unread mention", "Build finished", "Invoice ready"].map((row) => <b key={row}>{row}</b>)}
          {kind === "form-dialog" && <><input readOnly value="name@example.com" /><button>Submit</button></>}
          {kind === "session-timeout" && <><strong className="timer">01:30</strong><button>Extend session</button></>}
          {kind === "permission-dialog" && <><p>Allow camera access for scanning?</p><div><button>Not now</button><button>Allow</button></div></>}
          {kind === "share-dialog" && <><input readOnly value="https://uiux.wiki/item" /><div><button>Copy</button><button>Invite</button></div></>}
          {kind === "lightbox" && <><div className="lightbox-frame" /><footer><button>Prev</button><button>Zoom</button><button>Next</button></footer></>}
          {kind === "backdrop" && <><p>Dimmed scrim behind the active dialog.</p><button>Click outside</button></>}
          {kind === "portal" && <><b>App root</b><ChevronRight size={16} /><b>Overlay root</b></>}
          {kind === "fullscreen-modal" && <><p>Full viewport body with persistent close action.</p><button>Close</button></>}
          {kind === "non-modal-dialog" && <><p>Floating dialog keeps page controls reachable.</p><button>Done</button></>}
          {(kind === "bottom-sheet" || kind === "mobile-toast" || kind === "snackbar" || kind === "system-notification" || kind === "info-alert") && <><p>{kind === "snackbar" ? "File archived." : kind === "info-alert" ? "Plan changes take effect next cycle." : "Mobile-safe message surface."}</p><button>{kind === "snackbar" ? "Undo" : "OK"}</button></>}
        </section>
      </div>
    );
  }

  if (["chart-treemap", "chart-heatmap", "chart-empty-state", "chart-loading-state", "chart-tooltip", "chart-refresh", "chart-export", "map-legend", "map-visual", "map-marker", "map-empty-state", "map-error-state"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-chart ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{kind === "chart-refresh" ? "Updated 2m ago" : kind === "chart-export" ? "CSV / PDF" : kind === "map-legend" ? "Map key" : kind.startsWith("map-") || kind === "map-visual" ? "Spatial data" : "Data"}</span></header>
        {kind === "map-legend" ? (
          <section className="map-legend-preview">
            <b><i />Open</b>
            <b><i />Busy</b>
            <b><i />Outage</b>
            <span>Layer legend</span>
          </section>
        ) : kind === "map-visual" || kind === "map-marker" ? (
          <section className="map-visual-preview">
            <i />
            <b />
            <b />
            <b />
            <em>{kind === "map-marker" ? "Selected pin" : "Heat 72%"}</em>
          </section>
        ) : kind === "map-empty-state" || kind === "map-error-state" ? (
          <section className={`map-state-preview ${kind}`}>
            <i />
            <b>{kind === "map-error-state" ? "Map unavailable" : "No places in this area"}</b>
            <span>{kind === "map-error-state" ? "Reload layers or check network." : "Zoom out or clear filters."}</span>
            <button>{kind === "map-error-state" ? "Retry" : "Clear filters"}</button>
          </section>
        ) : kind === "chart-treemap" ? (
          <section className="treemap"><b /><b /><b /><b /></section>
        ) : kind === "chart-heatmap" ? (
          <section className="chart-heatmap-grid">{Array.from({ length: 20 }).map((_, index) => <b key={index} className={`level-${index % 5}`} />)}<span>Mon-Fri intensity</span></section>
        ) : kind === "chart-empty-state" || kind === "chart-loading-state" ? (
          <section className={`chart-state-preview ${kind}`}>
            {kind === "chart-loading-state" ? <><i /><i /><i /></> : <CircleHelp size={30} />}
            <b>{kind === "chart-loading-state" ? "Loading chart data" : "No chart data"}</b>
            <span>{kind === "chart-loading-state" ? "Axes and legend stay reserved." : "Choose a date range with data."}</span>
          </section>
        ) : (
          <section className="chart-bars">{[38, 72, 54, 86, 62].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}<em>{kind === "chart-tooltip" ? "$12.4K" : kind === "chart-refresh" ? "Refresh" : "Export"}</em></section>
        )}
      </div>
    );
  }

  if (["flowchart-editor", "diff-viewer", "markdown-editor", "rich-text-editor", "formula-editor", "editor-toolbar", "preview-toggle", "code-file-viewer", "multilingual-editor"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-editor ${kind} ${variantClass}`}>
        <nav><button>B</button><button>I</button><button>Link</button><span>{kind === "diff-viewer" ? "Diff" : kind === "preview-toggle" ? "Edit / Preview" : "Saved"}</span></nav>
        {kind === "flowchart-editor" && <section className="flowchart"><b>Start</b><i /><b>Review</b><i /><b>Ship</b></section>}
        {kind === "diff-viewer" && <section className="diff"><b>- old line</b><b>+ new line</b><b>+ added state</b></section>}
        {kind === "formula-editor" && <section><input readOnly value="SUM(revenue) / COUNT(users)" /><small>Result: 42.8</small></section>}
        {kind === "preview-toggle" && <section className="toggle-preview"><button>Edit</button><button className="active">Preview</button><button>Split</button></section>}
        {kind === "multilingual-editor" && <section><b>EN source</b><b>ZH translation</b><span>Missing: JA</span></section>}
        {!["flowchart-editor", "diff-viewer", "formula-editor", "preview-toggle", "multilingual-editor"].includes(kind) && <section><b># Heading</b><p>Editable content with preview and formatting controls.</p></section>}
      </div>
    );
  }

  if (["file-thumbnail", "folder", "folder-tree", "file-path", "file-version", "file-grid", "file-picker", "avatar-upload", "document-viewer", "media-viewer", "media-list-item", "file-operation", "upload-list", "upload-status", "product-carousel", "image-picker", "image-grid", "image-cropper", "image-compare", "image-viewer", "image-placeholder", "image-upload", "broken-image", "waveform", "image-annotation-specific", "image-carousel-specific"].includes(kind)) {
    const operation = /delete/.test(getPreviewSearchText(selected)) ? "Delete" : /move/.test(getPreviewSearchText(selected)) ? "Move" : /share/.test(getPreviewSearchText(selected)) ? "Share" : /download/.test(getPreviewSearchText(selected)) ? "Download" : "Rename";
    return (
      <div className={`live-specific-card specific-media ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><button type="button">{kind === "avatar-upload" ? "Replace" : kind === "file-operation" ? operation : kind.includes("upload") ? "Manage" : "Open"}</button></header>
        {kind === "file-grid" || kind === "image-grid" ? <section className="media-grid">{Array.from({ length: 6 }).map((_, index) => <i key={index} />)}</section> : null}
        {kind === "file-path" && <section className="path-row"><span>Home</span><ChevronRight size={14} /><span>Reports</span><ChevronRight size={14} /><b>Q2.pdf</b></section>}
        {kind === "file-version" && <ol><li className="done">v3 current</li><li>v2 yesterday</li><li>v1 draft</li></ol>}
        {kind === "folder" && <section className="folder-tile"><b /><span>Design assets</span><small>24 files</small></section>}
        {kind === "folder-tree" && <section className="folder-tree-list"><b>Design assets</b><span>Images</span><span>Icons</span><span>Exports</span></section>}
        {kind === "file-picker" && <section className="file-picker-list"><span>report.pdf</span><span>brief.docx</span><span>assets.zip</span><button>Choose file</button></section>}
        {kind === "avatar-upload" && <section className="avatar-upload"><b>AL</b><i /></section>}
        {kind === "document-viewer" && <section className="document-reader"><aside><b>PDF</b><span>12 pages</span></aside><main><i /><i /><i /></main><footer><button>Outline</button><button>Zoom</button></footer></section>}
        {kind === "media-viewer" && <section className="media-player-frame"><Play size={24} fill="currentColor" /><b /><span>01:24 / 03:40</span></section>}
        {kind === "media-list-item" && <section className="media-list-item"><i><Play size={16} fill="currentColor" /></i><div><b>Episode preview</b><span>03:42 · Ready to play</span></div><button>Play</button></section>}
        {kind === "file-operation" && <section className="file-operation-row"><b>report.pdf</b><span>{operation} this file</span><button className={operation === "Delete" ? "danger" : ""}>{operation}</button></section>}
        {kind === "upload-list" && <section className="upload-queue"><b>design-spec.pdf</b><span>72%</span><b>cover.png</b><span>Queued</span><b>video-demo.mp4</b><span>Retry</span></section>}
        {kind === "upload-status" && <section className="upload-status-card"><b>Uploading assets.zip</b><div className="meter"><i /></div><span>4.8 MB of 12 MB</span><button>Pause</button></section>}
        {kind === "product-carousel" && <section className="product-carousel-preview"><button>Prev</button><i /><button>Next</button><footer><b className="active" /><b /><b /></footer></section>}
        {kind === "image-carousel-specific" && <section className="product-carousel-preview image-carousel-preview"><button>Prev</button><i /><button>Next</button><footer><b className="active" /><b /><b /></footer></section>}
        {kind === "image-picker" && <section className="image-picker-grid">{Array.from({ length: 4 }).map((_, index) => <i key={index} className={index === 1 ? "selected" : ""} />)}<button>Choose image</button></section>}
        {kind === "image-annotation-specific" && <section className="image-annotation-preview"><i /><b>Comment pin</b><span>Crop boundary</span><button>Resolve</button></section>}
        {kind === "image-cropper" && <section className="cropper"><i /><b /></section>}
        {kind === "image-compare" && <section className="compare"><i /><i /><b /></section>}
        {kind === "image-placeholder" && <section className="image-placeholder-card"><i /><b /><span>Waiting for image</span></section>}
        {kind === "image-upload" && <section className="image-upload-dropzone"><b>+</b><span>Drop image or browse</span></section>}
        {kind === "broken-image" && <section className="broken-image-card"><b>!</b><span>Image failed to load</span><button>Retry</button></section>}
        {kind === "waveform" && <section className="waveform">{Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ height: `${18 + (index % 5) * 8}px` }} />)}</section>}
        {kind === "image-viewer" && <section className="image-frame"><i /></section>}
        {kind === "file-thumbnail" && <section className="file-thumb"><b>PDF</b><span>report.pdf</span></section>}
      </div>
    );
  }

  if (["product-grid", "price-display", "coupon-input", "quantity-selector", "payment-form", "auth-form", "account-menu", "session-management", "account-deletion", "usage-meter", "backup-codes", "stock-state", "payment-state", "subscription-state", "commerce-recovery", "download-invoice", "cart-removal", "order-confirmation-specific"].includes(kind)) {
    const commerceText = getPreviewSearchText(selected);
    const stockCopy = /out-of-stock|out of stock/.test(commerceText)
      ? { title: "Out of stock", detail: "Notify customers when this item returns.", action: "Notify me" }
      : /preorder/.test(commerceText)
        ? { title: "Preorder", detail: "Ships after launch window opens.", action: "Preorder" }
        : /in-stock|in stock/.test(commerceText)
          ? { title: "In stock", detail: "24 units available", action: "Add to cart" }
          : { title: "Low stock", detail: "Only 3 left", action: "Add to cart" };
    const paymentCopy = /pending-payment|pending payment/.test(commerceText)
      ? { title: "Payment pending", detail: "Waiting for customer confirmation.", action: "Pay now" }
      : /processing|payment-processing|payment processing/.test(commerceText)
        ? { title: "Payment processing", detail: "Bank authorization in progress.", action: "View status" }
        : /success|payment-success|payment success/.test(commerceText)
          ? { title: "Payment successful", detail: "Receipt is ready.", action: "View receipt" }
          : { title: "Payment failed", detail: "Visa ending 4242", action: "Retry payment" };
    const subscriptionCopy = /expired/.test(commerceText)
      ? { title: "Subscription expired", detail: "Access is paused until renewal.", action: "Renew plan" }
      : /cancel/.test(commerceText)
        ? { title: "Cancel subscription", detail: "Plan remains active until Jul 21.", action: "Confirm cancel" }
        : { title: "Renews Jul 21", detail: "Pro monthly plan", action: "Manage plan" };
    return (
      <div className={`live-specific-card specific-commerce ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{kind.includes("payment") ? "$140.80" : kind.includes("subscription") ? "Pro" : "Commerce"}</span></header>
        {kind === "product-grid" && <section className="product-grid">{Array.from({ length: 4 }).map((_, index) => <article key={index}><i /><b>$ {29 + index * 10}</b><button>Add</button></article>)}</section>}
        {kind === "price-display" && <section><span className="old-price">$99</span><strong className="metric-value">$69</strong><small>30% off, tax included</small></section>}
        {kind === "coupon-input" && <section className="inline-form"><input readOnly value="SAVE20" /><button>Apply</button></section>}
        {kind === "quantity-selector" && <section className="quantity-row"><button>-</button><b>2</b><button>+</button><small>8 in stock</small></section>}
        {kind === "payment-form" && <section><label>Card number<input readOnly value="4242 4242 4242 4242" /></label><button>Pay now</button></section>}
        {kind === "auth-form" && <section><label>Email<input readOnly value="alex@example.com" /></label><label>Password<input readOnly type="password" value="password" /></label><button>Sign in</button></section>}
        {kind === "account-menu" && <section className="account-menu"><b>AL</b><span>alex@example.com</span><button>Log out</button></section>}
        {kind === "session-management" && <section><b>MacBook Pro</b><span>Shanghai - active now</span><button>Revoke</button></section>}
        {kind === "account-deletion" && <section><input readOnly value="DELETE" /><button className="danger">Delete account</button></section>}
        {kind === "usage-meter" && <section><b>72% used</b><div className="meter"><i /></div><small>Resets Jun 30</small></section>}
        {kind === "backup-codes" && <section className="backup-codes">{["8F4K-2A", "92LM-7P", "USED"].map((code) => <b key={code}>{code}</b>)}</section>}
        {kind === "stock-state" && <section><b className="stock">{stockCopy.title}</b><span>{stockCopy.detail}</span><button>{stockCopy.action}</button></section>}
        {kind === "payment-state" && <section><b>{paymentCopy.title}</b><span>{paymentCopy.detail}</span><button>{paymentCopy.action}</button></section>}
        {kind === "subscription-state" && <section><b>{subscriptionCopy.title}</b><span>{subscriptionCopy.detail}</span><button>{subscriptionCopy.action}</button></section>}
        {kind === "commerce-recovery" && <section><b>Refund requested</b><span>Reason: wrong size</span><button>Track request</button></section>}
        {kind === "download-invoice" && <section><b>Invoice #2048</b><span>PDF ready</span><button>Download PDF</button></section>}
        {kind === "cart-removal" && <section className="cart-removal"><b>Wireless Kit removed</b><span>Item moved out of cart.</span><button>Undo</button></section>}
        {kind === "order-confirmation-specific" && <section className="order-confirmation"><b>Order #1024 confirmed</b><span>Paid by Visa ending 4242</span><button>View order</button></section>}
      </div>
    );
  }

  if (["ai-selector", "prompt-assist", "ai-result", "ai-feedback", "ai-usage", "ai-generation-control", "ai-prompt-composer", "ai-context-attachment", "ai-context-panel", "ai-streaming-text", "ai-tool-call-status", "ai-tool-call-log", "ai-suggestion-action", "ai-confidence-indicator", "ai-grounding-indicator", "ai-safety-status"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-ai ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>AI</span></header>
        {kind === "ai-selector" && <section><button className="active">Fast model</button><button>Reasoning model</button><small>128k context</small></section>}
        {kind === "prompt-assist" && <section className="prompt-chips"><b>{`{{tone}}`}</b><b>{`{{audience}}`}</b><b>Summarize</b></section>}
        {kind === "ai-result" && <section><p>Generated answer with cited source and apply/reject actions.</p><div><button>Apply</button><button>Reject</button></div></section>}
        {kind === "ai-feedback" && <section><div><button>Good</button><button>Bad</button></div><textarea readOnly value="Missing detail about edge cases." /></section>}
        {kind === "ai-usage" && <section><b>38k / 128k tokens</b><div className="meter"><i /></div><small>Estimated cost $0.42</small></section>}
        {kind === "ai-generation-control" && <section><p>Generating response...</p><div className="meter"><i /></div><div><button>Stop</button><button>Continue</button><button>Regenerate</button></div></section>}
        {kind === "ai-prompt-composer" && <section className="ai-prompt-composer"><textarea readOnly value="Summarize the uploaded design notes for a product team." /><footer><b>2 attachments</b><button>Generate</button></footer></section>}
        {kind === "ai-context-attachment" && <section className="ai-context-attachment"><b>Context</b><span>design-spec.pdf</span><span>meeting-notes.md</span><button>Add source</button></section>}
        {kind === "ai-context-panel" && <section className="ai-context-panel"><aside><b>Sources</b><span>file.pdf</span><span>web page</span></aside><main><b>Selected context</b><p>3 chunks attached to the next prompt.</p><button>Remove source</button></main></section>}
        {kind === "ai-streaming-text" && <section className="ai-streaming-preview"><p>Drafting answer<span className="cursor">|</span></p><b /><b /><small>Streaming token by token</small></section>}
        {kind === "ai-tool-call-status" && <section className="ai-tool-status"><b className="running">Search docs</b><b>Read file</b><b className="done">Summarize result</b></section>}
        {kind === "ai-tool-call-log" && <section className="ai-tool-log"><b>Tool call log</b><ol><li>search_docs(query)</li><li>read_file(src/App.jsx)</li><li>summarize_context()</li></ol><button>View trace</button></section>}
        {kind === "ai-suggestion-action" && <section className="ai-suggestion-preview"><p>Replace vague button copy with a clear action label.</p><div><button>Apply suggestion</button><button>Dismiss</button></div></section>}
        {kind === "ai-confidence-indicator" && <section className="ai-confidence-preview"><strong>Confidence 84%</strong><div className="meter"><i /></div><small>High confidence with two cited sources.</small></section>}
        {kind === "ai-grounding-indicator" && <section className="ai-grounding-preview"><b>Grounded</b><span>3 sources attached</span><ol><li>Design spec</li><li>Usage logs</li><li>Help article</li></ol></section>}
        {kind === "ai-safety-status" && <section className="ai-safety-status"><b>Needs review</b><span>Model unavailable or content filtered.</span><button>Try another model</button></section>}
      </div>
    );
  }

  if (["i18n-selector", "locale-form", "locale-search", "rtl-toggle", "unit-switcher"].includes(kind)) {
    return (
      <div className={`live-specific-card specific-i18n ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>Locale</span></header>
        {kind === "i18n-selector" && <section><label><input type="radio" defaultChecked /> zh-CN</label><label><input type="radio" /> en-US</label><label><input type="radio" /> ar-SA</label></section>}
        {kind === "locale-form" && <section><input readOnly value="+86 138 0000 0000" /><input readOnly value="Shanghai, China" /></section>}
        {kind === "locale-search" && <section><Search size={16} /><b>Åland / Aalborg / 阿里</b><small>Locale-aware order</small></section>}
        {kind === "rtl-toggle" && <section dir="rtl"><button>RTL</button><span>{"البداية -> النهاية"}</span></section>}
        {kind === "unit-switcher" && <section><button className="active">km</button><button>mi</button><button>kg</button><button>lb</button></section>}
      </div>
    );
  }

  if (kind === "save-status") {
    return (
      <div className={`live-specific-card specific-status save-status ${variantClass}`}>
        <header><strong>{title}</strong><span>Autosave</span></header>
        <section className="save-status-card">
          <b>All changes saved</b>
          <div className="status-steps"><i className="done" /><i className="done" /><i /></div>
          <span>Last saved 14 seconds ago</span>
          <button>View version</button>
        </section>
      </div>
    );
  }

  if (["mobile-checkout-bar", "mobile-coupon", "mobile-order-card", "mobile-task-sheet", "mobile-sort-sheet", "sticky-bottom-action", "mobile-keyboard-avoidance", "mobile-status-bar", "mobile-safe-area", "mobile-splash-screen", "mobile-segmented-control", "mobile-numeric-keyboard", "mobile-keyboard-accessory", "mobile-wheel-picker", "mobile-location-picker", "location-control", "biometric-prompt", "haptic-feedback", "mobile-command-entry", "mobile-camera-capture", "nfc-scan", "bluetooth-connection", "orientation-notice", "mobile-map-view", "locate-me", "sku-sheet", "address-sheet-specific", "payment-method-sheet-specific", "voice-input", "recorder", "video-recorder", "mobile-permission", "file-state", "grid-state", "command-palette-specific", "kanban", "activity-feed", "thumbs-feedback", "qr-login", "qr-scanner"].includes(kind)) {
    const mobileText = getPreviewSearchText(selected);
    const permissionCopy = /push/.test(mobileText)
      ? "Allow push notifications for updates?"
      : /camera/.test(mobileText)
        ? "Allow camera access for scanning?"
        : "Allow location while using the app?";
    const fileStateCopy = /waiting-upload|waiting upload/.test(mobileText)
      ? { file: "design-spec.pdf", status: "Waiting in queue", action: "Start upload" }
      : /upload-resumed|upload resumed/.test(mobileText)
        ? { file: "design-spec.pdf", status: "Uploading again at 58%", action: "Pause" }
        : /upload-canceled|upload canceled/.test(mobileText)
          ? { file: "design-spec.pdf", status: "Upload canceled", action: "Restart" }
          : /previewing/.test(mobileText)
            ? { file: "report.pdf", status: "Preview opening", action: "Open" }
            : { file: "report.pdf", status: "Paused at 42%", action: "Resume" };
    return (
      <div className={`live-specific-card specific-mobile ${kind} ${variantClass}`}>
        <header><strong>{title}</strong><span>{kind.startsWith("mobile") ? "Mobile" : "State"}</span></header>
        {kind === "mobile-checkout-bar" && <footer className="sticky-bar"><span>2 items</span><strong>$168</strong><button>Checkout</button></footer>}
        {kind === "mobile-coupon" && <section className="coupon-ticket"><strong>$20 OFF</strong><span>Orders over $99</span><button>Claim</button></section>}
        {kind === "mobile-order-card" && <section><b>Order #1024</b><span>Shipped today</span><div><button>Track</button><button>Refund</button></div></section>}
        {kind === "mobile-task-sheet" && <section className="bottom-task"><b /><label><input type="checkbox" defaultChecked /> Available</label><label><input type="checkbox" /> On sale</label><button>Apply</button></section>}
        {kind === "mobile-sort-sheet" && <section className="bottom-task sort-sheet"><b /><label><input type="radio" name="mobile-sort" defaultChecked /> Newest first</label><label><input type="radio" name="mobile-sort" /> Price low to high</label><button>Apply sort</button></section>}
        {kind === "sticky-bottom-action" && <footer className="sticky-bar sticky-action"><span>Ready</span><strong>Primary action</strong><button>Continue</button></footer>}
        {kind === "mobile-keyboard-avoidance" && <section className="keyboard-avoidance"><input readOnly value="alex@example.com" /><b>Keyboard</b><button>Done</button></section>}
        {kind === "mobile-status-bar" && <section className="mobile-status-bar-preview"><span>9:41</span><b /><b /><b /></section>}
        {kind === "mobile-safe-area" && <section className="mobile-safe-area-preview"><header>Safe top</header><main>Content stays inside safe area</main><footer>Home indicator</footer></section>}
        {kind === "mobile-splash-screen" && <section className="mobile-splash-preview"><b>UI</b><span>Loading workspace...</span></section>}
        {kind === "mobile-segmented-control" && <section className="mobile-segmented-preview"><button className="active">Day</button><button>Week</button><button>Month</button></section>}
        {kind === "mobile-numeric-keyboard" && <section className="mobile-keypad-preview">{["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((key) => <button key={key}>{key}</button>)}</section>}
        {kind === "mobile-keyboard-accessory" && <section className="mobile-keyboard-accessory-preview"><div><button>Done</button><button>Next</button></div><b>Keyboard</b></section>}
        {kind === "mobile-wheel-picker" && <section className="mobile-wheel-picker-preview"><span>09</span><b>10</b><span>11</span><span>AM</span><b>PM</b></section>}
        {kind === "mobile-location-picker" && <section className="mobile-location-picker-preview"><i /><b>Choose location</b><button>Use current</button></section>}
        {kind === "location-control" && <section className="location-control-preview"><i /><b>Current location</b><span>Accuracy 12 m</span><button>Use pin</button></section>}
        {kind === "biometric-prompt" && <section className="biometric-prompt-preview"><b>Face ID</b><span>Authenticate to continue</span><button>Use passcode</button></section>}
        {kind === "haptic-feedback" && <section className="haptic-feedback-preview"><button>Press</button><span>Haptic pulse</span><i /><i /><i /></section>}
        {kind === "mobile-command-entry" && <section className="mobile-command-entry-preview"><Search size={16} /><b>Run command</b><span>⌘K</span></section>}
        {kind === "mobile-camera-capture" && <section className="camera-capture"><i /><b /><button>Capture</button></section>}
        {kind === "nfc-scan" && <section className="nfc-scan"><b>NFC</b><span>Hold near reader</span><i /></section>}
        {kind === "bluetooth-connection" && <section className="bluetooth-connection"><b>Bluetooth</b><span>Keyboard MX pairing...</span><div className="meter"><i /></div></section>}
        {kind === "orientation-notice" && <section className="orientation-notice"><b>Rotate device</b><span>Landscape is required for this view.</span><button>Got it</button></section>}
        {kind === "mobile-map-view" && <section className="mobile-map-view"><i /><b>Current location</b><span>Nearby results</span></section>}
        {kind === "locate-me" && <section className="locate-me"><i /><button>Locate me</button><span>Accuracy 12 m</span></section>}
        {kind === "sku-sheet" && <section className="sku-sheet"><b>Color</b><div><button>Black</button><button className="active">Blue</button></div><b>Size</b><div><button>M</button><button>L</button></div><button>Add to cart</button></section>}
        {kind === "address-sheet-specific" && <section className="address-sheet"><b>Ship to</b><label><input type="radio" defaultChecked /> Home · 88 Market St</label><label><input type="radio" /> Office · 12 Lake Rd</label><button>Use address</button></section>}
        {kind === "payment-method-sheet-specific" && <section className="payment-method-sheet"><b>Payment method</b><label><input type="radio" defaultChecked /> Visa ending 4242</label><label><input type="radio" /> PayPal</label><button>Pay now</button></section>}
        {kind === "voice-input" && <section><button className="mic">Mic</button><p>Transcribing voice input...</p></section>}
        {kind === "recorder" && <section className="waveform">{Array.from({ length: 14 }).map((_, index) => <i key={index} style={{ height: `${18 + (index % 4) * 9}px` }} />)}<button>Stop</button></section>}
        {kind === "video-recorder" && <section className="video-recorder-preview"><i /><span>REC 00:12</span><button>Stop</button></section>}
        {kind === "mobile-permission" && <section><p>{permissionCopy}</p><div><button>Not now</button><button>Allow</button></div></section>}
        {kind === "file-state" && <section><b>{fileStateCopy.file}</b><span>{fileStateCopy.status}</span><button>{fileStateCopy.action}</button></section>}
        {kind === "grid-state" && <section className="grid-state-table"><b>Name</b><b className="pinned">Status</b><span>Row editing</span><input readOnly value="Active" /></section>}
        {kind === "command-palette-specific" && <section><div><Search size={16} /><span>Search commands</span></div><b>Open file</b><b>Toggle theme</b></section>}
        {kind === "kanban" && <section className="kanban"><b>Todo</b><b>Doing</b><b>Done</b></section>}
        {kind === "activity-feed" && <section><b>Alex commented</b><span>2 min ago</span><b>Build deployed</b></section>}
        {kind === "thumbs-feedback" && <section><button>Thumbs up</button><button>Thumbs down</button><textarea readOnly value="Tell us why" /></section>}
        {kind === "qr-login" && <section className="qr-frame"><b /><b /><b /><span>Scan to log in</span></section>}
        {kind === "qr-scanner" && <section className="qr-frame"><b /><b /><b /><span>Align QR code inside the frame</span></section>}
      </div>
    );
  }

  return null;
}

const resultMiniKinds = new Set([
  ...feedbackPreviewKinds,
  ...statePreviewKinds,
  "connection-state",
  "data-state",
  "operation-success-state",
  "pattern-error-state",
  "partial-success-state",
  "error-state-specific",
  "offline-banner",
  "warning-result",
  "loading-state-specific",
  "loading-overlay-specific",
]);

function getResultMiniData(kind, selected) {
  const text = getPreviewSearchText(selected);
  if (statePreviewKinds.includes(kind)) {
    const data = getStatePreviewData(kind, selected);
    return { ...data, Icon: data.tone === "danger" ? X : data.tone === "warning" ? Info : data.tone === "empty" ? CircleHelp : Check };
  }
  if (feedbackPreviewKinds.includes(kind)) {
    const data = getFeedbackPreviewData(kind, selected);
    return { tone: data.tone, title: data.title, body: data.body, meta: "Feedback", action: data.action, Icon: data.icon || Info };
  }
  if (kind === "connection-state") {
    const offline = /offline|disconnected|undelivered|unsynced|unpublished/.test(text);
    return { tone: offline ? "warning" : "success", title: offline ? "Needs sync" : "Connected", body: offline ? "Queued until connection returns." : "Realtime updates are active.", meta: offline ? "Offline" : "Online", action: offline ? "Retry" : "Status", Icon: offline ? RefreshCcw : Check };
  }
  if (kind === "data-state") {
    const partial = /partial/.test(text);
    const stale = /cached|stale/.test(text);
    return { tone: partial || stale ? "warning" : "info", title: partial ? "Partial data" : stale ? "Cached data" : "Data loaded", body: partial ? "Some rows still need refresh." : stale ? "Showing last saved data." : "Rows are ready.", meta: "Data", action: "Refresh", Icon: partial || stale ? Info : Check };
  }
  if (kind === "operation-success-state") return { tone: "success", title: /filters/.test(text) ? "Filters cleared" : "Completed", body: "The next step is ready.", meta: "Success", action: "Continue", Icon: Check };
  if (kind === "partial-success-state") return { tone: "warning", title: "Partial success", body: "Some items need review.", meta: "Mixed", action: "Review", Icon: Info };
  if (kind === "loading-state-specific" || kind === "loading-overlay-specific") return { tone: "info", title: "Loading", body: "Layout is reserved while data arrives.", meta: "Busy", action: "Wait", Icon: RefreshCcw };
  if (kind === "offline-banner") return { tone: "warning", title: "Offline mode", body: "Local edits wait for reconnect.", meta: "Network", action: "Retry", Icon: RefreshCcw };
  if (kind === "warning-result") return { tone: "warning", title: "Needs attention", body: "Review the affected items.", meta: "Warning", action: "Review", Icon: Info };
  return { tone: "danger", title: /rate/.test(text) ? "Rate limit" : /timeout/.test(text) ? "Timeout" : "Error", body: "The user needs a recovery path.", meta: "Error", action: "Retry", Icon: X };
}

function SpecificMiniPreview({ kind, className, selected = null }) {
  if (kind.startsWith("button-")) {
    return <ButtonSpecificMiniPreview kind={kind} className={className} />;
  }

  if (resultMiniKinds.has(kind)) {
    const data = getResultMiniData(kind, selected);
    const Icon = data.Icon || Info;
    return (
      <span className={className}>
        <span className={`mini-result-specific tone-${data.tone} ${kind}`}>
          <span className="mini-result-icon"><Icon size={13} /></span>
          <span className="mini-result-copy"><b>{data.title}</b><i>{data.meta}</i></span>
          <span className="mini-result-action">{data.action}</span>
        </span>
      </span>
    );
  }

  const group =
    kind.includes("chart") || kind.startsWith("map-") ? "chart" :
    kind.includes("editor") || kind.includes("diff") || kind.includes("formula") ? "editor" :
    kind.includes("mobile") || kind.includes("sheet") || kind.includes("toast") || kind.includes("recorder") || kind.includes("voice") || kind.includes("qr") || kind.includes("scan") || kind.includes("keyboard") || kind.includes("sticky") || kind.includes("bluetooth") || kind.includes("nfc") || kind.includes("orientation") || kind.includes("camera") || kind.includes("map") || kind.includes("locate") || kind.includes("location") || kind.includes("sku") || kind.includes("address") || kind.includes("biometric") || kind.includes("haptic") || kind.includes("command-entry") || kind.includes("safe-area") || kind.includes("splash") || kind.includes("status-bar") || kind.includes("segmented") ? "mobile" :
    kind.includes("payment") || kind.includes("cart") || kind.includes("stock") || kind.includes("coupon") ? "commerce" :
    kind.includes("ai") || kind.includes("prompt") || kind.includes("generation") ? "ai" :
    kind.includes("i18n") || kind.includes("locale") || kind.includes("rtl") || kind.includes("unit") ? "i18n" :
    kind.includes("image") || kind.includes("file") || kind.includes("folder") || kind.includes("upload") || kind.includes("carousel") || kind.includes("waveform") || kind.includes("media") || kind.includes("document") ? "media" :
    kind.includes("drawer") || kind.includes("modal") || kind.includes("dialog") || kind.includes("lightbox") ? "overlay" :
    kind.includes("save-status") ? "status" :
    "ui";

  return (
    <span className={className}>
      <span className={`mini-specific ${group} ${kind}`}>
        {group === "chart" && <><i /><i /><i /><b /></>}
        {group === "editor" && <><strong>B</strong><b /><b /><em /></>}
        {group === "mobile" && (
          kind.includes("checkout") || kind.includes("cart") ? <><i /><b>$168</b><strong /></> :
          kind.includes("sort") ? <><b /><strong /><strong /></> :
          kind.includes("task-sheet") || kind.includes("filter") ? <><b /><i /><i /><em /></> :
          kind.includes("recorder") || kind.includes("voice") ? <><i /><i /><i /><strong /></> :
          kind.includes("permission") || kind.includes("biometric") ? <><b>Allow</b><i /><strong /></> :
          kind.includes("map") || kind.includes("locate") ? <><i /><b /><b /><strong /></> :
          kind.includes("nfc") ? <><b>NFC</b><i /><strong /></> :
          kind.includes("bluetooth") ? <><b>BT</b><i /><i /><strong /></> :
          kind.includes("camera") || kind.includes("video") ? <><i /><b>REC</b><strong /></> :
          kind.includes("keyboard") ? <><b>1</b><b>2</b><b>3</b><strong /></> :
          kind.includes("segmented") ? <><b>Day</b><i /><i /><strong /></> :
          <><b /><i /><i /><strong /></>
        )}
        {group === "commerce" && <><i /><b>$</b><strong /></>}
        {group === "ai" && <><Sparkles size={14} /><b /><b /></>}
        {group === "i18n" && <><b>zh</b><i /><b>RTL</b></>}
        {group === "media" && <><i /><i /><b /></>}
        {group === "overlay" && <><i /><b /><b /></>}
        {group === "status" && <><b /><i /><i /><strong /></>}
        {group === "ui" && <><b /><i /><i /></>}
      </span>
    </span>
  );
}

function ComponentLivePreview({ selected, term, variant = "" }) {
  const id = selected.preview && selected.preview !== "generic" ? selected.preview : selected.id;
  const variantIndex = getVariantIndex(selected, variant);
  const variantClass = getVariantPreviewClass(variant, variantIndex);
  const isDangerVariant = variantHas(variant, ["错误", "危险", "删除", "失败"]);
  const isReadonlyVariant = variantHas(variant, ["只读", "禁用"]);
  const hasIconVariant = variantHas(variant, ["图标", "搜索", "建议", "命令"]);
  const hasClearVariant = variantHas(variant, ["清除"]);
  const hasRecommendationVariant = variantHas(variant, ["建议", "推荐"]);
  const specificKind = getSpecificPreviewKind(selected);

  if (specificKind) {
    const specificPreview = <SpecificLivePreview selected={selected} kind={specificKind} variantClass={variantClass} />;
    if (specificPreview) return specificPreview;
  }

  if (taxonomyPreviewTypes.has(selected.preview)) {
    return <TaxonomyLivePreview selected={selected} variant={variant} variantClass={variantClass} />;
  }

  if (id === "button") {
    const action = getSemanticAction(selected);
    const ActionIcon = action.icon;
    return (
      <div className={`live-button-card live-semantic-action ${action.kind} ${variantClass}`}>
        <button type="button" className={action.kind === "danger" ? "danger" : ""}>
          <ActionIcon size={18} />
          <span>{action.label}</span>
        </button>
        <small>{action.helper}</small>
        <ActionMockup action={action} selected={selected} />
      </div>
    );
  }

  if (id === "otp-input") {
    return <OtpPreviewCard selected={selected} variantClass={variantClass} />;
  }

  if (id === "button") {
    return (
      <div className={`live-button-card ${variantClass}`}>
        <button type="button">{variant || "主要操作"}</button>
        <button type="button">次要操作</button>
        <button type="button" className="danger">危险操作</button>
      </div>
    );
  }

  if (["text", "text-field", "textarea", "search", "password-field", "autocomplete"].includes(id)) {
    return (
      <div className={`live-card live-form-card ${variantClass}`}>
        <label>{selected.title}</label>
        {id === "textarea" ? (
          <textarea
            defaultValue={variantHas(variant, ["字数"]) ? "这是一段可以编辑的长文本。 38 / 120" : "这是一段可以编辑的长文本。"}
            readOnly={isReadonlyVariant}
          />
        ) : (
          <div className={`live-input ${id === "search" || id === "autocomplete" || hasIconVariant ? "info" : ""}`}>
            {(id === "search" || hasIconVariant) && <Search size={18} />}
            <input
              type={id === "password-field" ? "password" : "text"}
              defaultValue={
                id === "password-field"
                  ? "password"
                  : id === "autocomplete" || hasRecommendationVariant
                    ? "北京"
                    : isDangerVariant
                      ? "hello@"
                      : ""
              }
              placeholder={id === "password-field" ? "请输入密码" : isDangerVariant ? "输入内容有误" : "请输入内容"}
              readOnly={isReadonlyVariant}
            />
            {hasClearVariant && <X size={16} />}
            {(id === "autocomplete" || hasRecommendationVariant) && <span>推荐</span>}
          </div>
        )}
        <small>
          {isDangerVariant
            ? "请修正当前输入后再继续。"
            : isReadonlyVariant
              ? "当前内容只读，不允许直接编辑。"
              : id === "password-field"
                ? "至少 8 位，建议包含数字。"
                : "输入时应该有清楚的焦点和帮助说明。"}
        </small>
      </div>
    );
  }

  if (["modal", "confirmation", "term-modal"].includes(id) || id.includes("delete")) {
    return (
      <div className={`live-modal-scene ${variantClass}`}>
        <div className="live-page-lines"><i /><i /><i /></div>
        <div className="live-dialog">
          <strong>{variant || (selected.title.includes("删除") ? "删除文件？" : selected.title)}</strong>
          <span>{selected.plain}</span>
          <div>
            <button type="button">取消</button>
            <button type="button" className="danger">确认</button>
          </div>
        </div>
      </div>
    );
  }

  if (["toast", "term-toast", "notification", "success-state", "error-state", "alert"].includes(id)) {
    const tone = isDangerVariant || id.includes("error") || id === "alert"
      ? "danger"
      : variantHas(variant, ["警告", "通知"])
        ? "warning"
        : "success";
    return (
      <div className={`live-alert-demo ${tone} ${variantClass}`}>
        <div className="live-alert">
          <Check size={18} />
          <div>
            <strong>{variant || (tone === "danger" ? "需要处理" : tone === "warning" ? "有新提醒" : "保存成功")}</strong>
            <span>{selected.summary}</span>
          </div>
          <X size={16} />
        </div>
      </div>
    );
  }

  if (["table", "data-grid"].includes(id)) {
    const tableText = getPreviewSearchText(selected);
    const tableAction = /export/.test(tableText) ? "Export" : /import/.test(tableText) ? "Import" : /copy/.test(tableText) ? "Copy" : "";
    if (/filter|sort|selection|props table|api reference|pagination|tree table|data grid/.test(tableText)) {
      const heads = /props|api/.test(tableText) ? ["Name", "Type", "Default"] : ["Name", "Status", "Updated"];
      return (
        <div className={`live-table live-data-grid-variant ${variantClass}`}>
          {heads.map((head, index) => <b key={head}>{head}{/filter/.test(tableText) && index === 1 ? " Filter" : /sort/.test(tableText) && index === 2 ? " Sort" : ""}</b>)}
          {["Row A", "Active", "Today", "Row B", "Pending", "Yesterday", "Row C", "Done", "Jun 21"].map((cell, index) => (
            <span key={`${cell}-${index}`}>{/selection/.test(tableText) && index % 3 === 0 ? "☑ " : ""}{cell}</span>
          ))}
        </div>
      );
    }
    if (tableAction) {
      const ActionIcon = tableAction === "Export" ? Download : tableAction === "Import" ? ArrowUp : Copy;
      return (
        <div className={`live-table live-data-grid-variant table-action-preview ${variantClass}`}>
          <header><strong>{selected.title}</strong><button type="button"><ActionIcon size={15} /> {tableAction}</button></header>
          {["Name", "Status", "Updated"].map((head) => <b key={head}>{head}</b>)}
          {["Q2 revenue", "Ready", "Today", "Customers", "Ready", "Jun 21"].map((cell, index) => (
            <span key={`${cell}-${index}`}>{cell}</span>
          ))}
        </div>
      );
    }
    return (
      <div className={`live-table ${variantClass}`}>
        {["名称", "状态", "时间"].map((head) => <b key={head}>{head}</b>)}
        {["订单 A", "完成", "今天", "订单 B", "待处理", "昨天", "订单 C", "失败", "周一"].map((cell, index) => (
          <span key={`${cell}-${index}`} className={cell === "失败" ? "danger-text" : cell === "完成" ? "success-text" : ""}>{cell}</span>
        ))}
      </div>
    );
  }

  if (id === "card" && /invoice|receipt/.test(getPreviewSearchText(selected))) {
    const isInvoice = /invoice/.test(getPreviewSearchText(selected));
    return (
      <div className={`live-document-card ${isInvoice ? "invoice" : "receipt"} ${variantClass}`}>
        <header><strong>{isInvoice ? "Invoice #INV-2026-018" : "Receipt #RC-2048"}</strong><span>{isInvoice ? "Due" : "Paid"}</span></header>
        <section><b>{isInvoice ? "ACME Design Ltd." : "Card ending 2048"}</b><i /></section>
        <div><span>Subtotal</span><b>$128.00</b></div>
        <div><span>{isInvoice ? "Tax" : "Paid at"}</span><b>{isInvoice ? "$12.80" : "10:32"}</b></div>
        <footer><span>Total</span><strong>$140.80</strong></footer>
      </div>
    );
  }

  if (id === "card" && /order card/.test(getPreviewSearchText(selected))) {
    return (
      <div className={`live-order-card ${variantClass}`}>
        <header><strong>Order #1024</strong><span>Shipped</span></header>
        <main><i /><div><b>Wireless Kit</b><span>2 items · $168</span></div></main>
        <footer><button type="button">Track</button><button type="button">Support</button></footer>
      </div>
    );
  }

  if (id === "card") {
    return (
      <div className={`live-content-card ${variantClass}`}>
        <i />
        <strong>{variant || "内容卡片"}</strong>
        <p>{selected.plain}</p>
        <button type="button">查看详情</button>
      </div>
    );
  }

  if (id === "skeleton") {
    return (
      <div className={`live-skeleton-card ${variantClass}`}>
        <i /><b /><b /><b />
      </div>
    );
  }

  if (id === "empty" || id === "empty-state") {
    const text = getPreviewSearchText(selected);
    if (/cart|basket/.test(text)) {
      return (
        <div className={`live-empty-cart-card ${variantClass}`}>
          <Box size={34} />
          <strong>Cart is empty</strong>
          <span>Add saved items or continue shopping before checkout.</span>
          <section><i /><i /><i /></section>
          <button type="button">Continue shopping</button>
        </div>
      );
    }
    if (/help|faq|support/.test(text)) {
      return (
        <div className={`live-empty-help-card ${variantClass}`}>
          <div><Search size={18} /><span>No articles found</span></div>
          <strong>{selected.title}</strong>
          <p>Try another keyword or contact support.</p>
          <button type="button">Contact support</button>
        </div>
      );
    }
    if (/file|document/.test(text)) {
      return (
        <div className={`live-empty-file-card ${variantClass}`}>
          <Download size={32} />
          <strong>No files yet</strong>
          <span>Upload a document to make preview and file actions available.</span>
          <button type="button">Upload file</button>
        </div>
      );
    }
    return (
      <div className={`live-empty-card ${variantClass}`}>
        <CircleHelp size={34} />
        <strong>{variantHas(variant, ["搜索"]) ? "没有找到结果" : variantHas(variant, ["失败"]) ? "加载失败" : "这里还没有内容"}</strong>
        <span>{selected.summary}</span>
        <button type="button">创建一个</button>
      </div>
    );
  }

  if (id === "floating-action-button") {
    return (
      <div className={`live-fab-card ${variantClass}`}>
        <i /><i /><i />
        <button type="button" aria-label="新建">{variantHas(variant, ["扩展"]) ? "新建" : "+"}</button>
      </div>
    );
  }

  if (["progress", "spinner", "file-upload"].includes(id)) {
    if (id === "spinner") {
      return (
        <div className="live-spinner-card">
          <i aria-hidden="true" />
          <strong>{variant || "正在加载"}</strong>
          <span>{selected.summary}</span>
        </div>
      );
    }

    if (id === "file-upload") {
      return (
        <div className={`live-upload-card ${variantClass}`}>
          <strong>{variant || "拖拽文件到这里"}</strong>
          <span>{variantHas(variant, ["图片"]) ? "支持 PNG、JPG，上传后显示缩略图。" : "支持 PNG、PDF、ZIP，上传后显示进度。"}</span>
          <div className="live-progress-bar"><i /></div>
        </div>
      );
    }

    return (
      <div className={`live-progress-card ${variantClass}`}>
        <strong>{variant || selected.title}</strong>
        <div className="live-progress-bar"><i /></div>
        <span>{variantHas(variant, ["不确定"]) ? "正在处理，请稍候" : "正在处理 62%"}</span>
      </div>
    );
  }

  if (id === "file-preview") {
    const text = getPreviewSearchText(selected);
    if (/image|background/.test(text)) {
      return (
        <div className={`live-image-preview-card ${variantClass}`}>
          <section><i /><i /><i /></section>
          <footer><button type="button">Zoom</button><button type="button">Crop</button></footer>
        </div>
      );
    }
    if (/document|pdf|reading mode|file viewer/.test(text)) {
      return (
        <div className={`live-file-preview-card document-viewer ${variantClass}`}>
          <aside><strong>DOC</strong><span>12 pages</span></aside>
          <main><header><button>−</button><span>82%</span><button>+</button></header><b /><b /><b /><i /></main>
          <footer><span>Outline</span><span>Comments</span><span>Download</span></footer>
        </div>
      );
    }
    return (
      <div className={`live-file-preview-card ${variantClass}`}>
        <aside><strong>PDF</strong><span>12 pages</span></aside>
        <main><header><button>−</button><span>82%</span><button>+</button></header><b /><b /><b /><i /></main>
      </div>
    );
  }

  if (id === "file-action") {
    const action = getSemanticAction(selected);
    const ActionIcon = action.icon;
    const target = /invoice/.test(getPreviewSearchText(selected)) ? "invoice.pdf" : /image/.test(getPreviewSearchText(selected)) ? "cover.png" : "report.pdf";
    return (
      <div className={`live-file-action-card ${variantClass}`}>
        <strong>{selected.title}</strong>
        <div><span>{target}</span><button type="button"><ActionIcon size={15} /> {action.label}</button></div>
        <small>{action.helper}</small>
      </div>
    );
  }

  if (id === "file-action") {
    return (
      <div className={`live-file-action-card ${variantClass}`}>
        <strong>{selected.title}</strong>
        <div><span>report.pdf</span><button type="button">Rename</button><button type="button">Move</button></div>
        <small>File actions show the target file and the operation, not an upload dropzone.</small>
      </div>
    );
  }

  if (id === "slider") {
    return (
      <div className={`live-slider-card ${variantClass}`}>
        <strong>{variantHas(variant, ["范围"]) ? "价格 20 - 80" : "音量 62%"}</strong>
        <input type="range" defaultValue={variantHas(variant, ["刻度"]) ? "80" : "62"} />
        <span>滑杆适合连续数值，而不是少量固定选项。</span>
      </div>
    );
  }

  if (id === "switcher") {
    return (
      <div className={`live-switcher-card ${variantClass}`}>
        <header>
          <strong>{variant || selected.title}</strong>
          <span>Current</span>
        </header>
        <div>
          {["Workspace", "Team", "Archive"].map((label, index) => (
            <button key={label} type="button" className={index === 0 ? "active" : ""}>{label}</button>
          ))}
        </div>
        <small>Switcher changes context directly, instead of opening a long option menu.</small>
      </div>
    );
  }

  if (id === "quantity-stepper") {
    return (
      <div className={`live-quantity-stepper-card ${variantClass}`}>
        <strong>{selected.title}</strong>
        <div>
          <button type="button" aria-label="Decrease">-</button>
          <span>2</span>
          <button type="button" aria-label="Increase">+</button>
        </div>
        <small>Use steppers for small bounded quantities with clear minimum and maximum.</small>
      </div>
    );
  }

  if (id === "date-picker" || id === "calendar") {
    return (
      <div className={`live-calendar-card ${variantClass}`}>
        <header><strong>{variantHas(variant, ["周"]) ? "本周日程" : variantHas(variant, ["日程"]) ? "今天日程" : "2026 年 6 月"}</strong><span>今天</span></header>
        <div>
          {Array.from({ length: 35 }).map((_, index) => (
            <i key={index} className={index === 15 ? "selected" : index === 19 ? "range" : ""}>
              {index + 1 <= 30 ? index + 1 : ""}
            </i>
          ))}
        </div>
      </div>
    );
  }

  if (id === "form") {
    const rows = getFormRows(selected);
    return (
      <div className={`live-form-card live-context-form ${variantClass}`}>
        <strong>{selected.title}</strong>
        {rows.map((row, index) => (
          <label key={row}>
            <span>{row}</span>
            {index === rows.length - 1 && /filter|settings|preferences/.test(getPreviewSearchText(selected)) ? (
              <input type="checkbox" defaultChecked={index === 1} />
            ) : (
              <input defaultValue={index === 0 && /search/.test(getPreviewSearchText(selected)) ? "dashboard" : ""} />
            )}
          </label>
        ))}
        <button type="button">{/payment/.test(getPreviewSearchText(selected)) ? "Pay now" : /filter/.test(getPreviewSearchText(selected)) ? "Apply filters" : /search/.test(getPreviewSearchText(selected)) ? "Search" : "Submit"}</button>
      </div>
    );
  }

  if (id === "form") {
    return (
      <div className={`live-form-card ${variantClass}`}>
        <label>邮箱</label>
        <input defaultValue="hello@example.com" />
        <label>备注</label>
        <textarea defaultValue="这是一组真实表单字段。" />
        <button type="button">提交</button>
      </div>
    );
  }

  if (["checkbox", "radio", "switch"].includes(id)) {
    return (
      <div className={`live-settings-card ${variantClass}`}>
        <label><input type="checkbox" defaultChecked /> 接收通知</label>
        <label><input type="radio" name="demo-radio" defaultChecked /> 默认选项</label>
        <label className="live-toggle"><span>自动保存</span><i /></label>
        <input type="range" defaultValue="62" />
      </div>
    );
  }

  if (["menu", "dropdown", "select", "context-menu"].includes(id)) {
    const isDropdown = id === "dropdown" || id === "select";
    const options = isDropdown ? getSelectOptions(selected) : getMenuOptions(selected, isDropdown);
    const isColor = /color/.test(getPreviewSearchText(selected));
    const pickerText = getPreviewSearchText(selected);
    if (isDropdown && /file picker|image picker|avatar picker|payment method/.test(pickerText)) {
      return (
        <div className={`live-picker-card ${/image|avatar/.test(pickerText) ? "image-picker" : /payment/.test(pickerText) ? "payment-picker" : "file-picker"} ${variantClass}`}>
          <header><strong>{selected.title}</strong><button type="button">Choose</button></header>
          {/file/.test(pickerText) && <section>{["report.pdf", "invoice.pdf", "brief.doc"].map((file) => <span key={file}><b />{file}</span>)}</section>}
          {/image|avatar/.test(pickerText) && <section>{Array.from({ length: 6 }).map((_, index) => <i key={index} className={index === 1 ? "selected" : ""} />)}</section>}
          {/payment/.test(pickerText) && <section>{["Visa ending 4242", "PayPal", "Apple Pay"].map((method, index) => <label key={method}><input type="radio" name="pay-method" defaultChecked={index === 0} />{method}</label>)}</section>}
        </div>
      );
    }
    return (
      <div className={`live-menu-card ${isDropdown ? "dropdown" : ""} ${isColor ? "color-picker" : ""} ${variantClass}`}>
        <div className="live-menu-trigger">
          <span>{variant || selected.title}</span>
          <ChevronRight size={18} />
        </div>
        <div className="live-menu-popover">
          {options.map((label, index) => (
            <span key={label} className={/delete/i.test(label) ? "danger-text" : ""}>
              {isColor && <i style={{ background: label }} />}
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (["menu", "dropdown", "select", "context-menu"].includes(id)) {
    const isDropdown = id === "dropdown" || id === "select";
    return (
      <div className={`live-menu-card ${isDropdown ? "dropdown" : ""} ${variantClass}`}>
        <div className="live-menu-trigger">
          <span>{variant || (isDropdown ? "排序方式" : "更多操作")}</span>
          <ChevronRight size={18} />
        </div>
        <div className="live-menu-popover">
          {(isDropdown ? ["最新优先", "价格从低到高", "只看可用"] : ["编辑", "复制链接", "删除"]).map((label, index) => (
            <span key={label} className={index === 2 && !isDropdown ? "danger-text" : ""}>
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (["link", "breadcrumb"].includes(id)) {
    return (
      <div className={`live-link-card ${variantClass}`}>
        <span>帮助中心</span>
        <ChevronRight size={18} />
        <strong>{variant || selected.title}</strong>
        <p>{selected.plain}</p>
      </div>
    );
  }

  if (id === "icon-button") {
    return (
      <div className={`live-icon-button-card ${variantClass}`}>
        <button type="button" aria-label="搜索"><Search size={20} /></button>
        <button type="button" aria-label="收藏"><Bookmark size={20} /></button>
        <button type="button" aria-label="分享"><Share2 size={20} /></button>
      </div>
    );
  }

  if (id === "back-button") {
    return (
      <div className={`live-back-button-card ${variantClass}`}>
        <header><button type="button"><ChevronRight size={18} /> Back</button><span>Detail</span></header>
        <main><strong>{variant || selected.title}</strong><p>{selected.plain}</p></main>
        <footer><i /><span>Returns to previous list without losing scroll position.</span></footer>
      </div>
    );
  }

  if (["top-navigation", "sidebar", "breadcrumb", "pagination", "stepper", "bottom-navigation", "back-button"].includes(id)) {
    return (
      <div className={`live-nav-card ${id} ${variantClass}`}>
        <header><span>首页</span><span>组件</span><span>设置</span></header>
        <aside><b /><b /><b /></aside>
        <main>
          <strong>{variant || selected.title}</strong>
          <p>{selected.plain}</p>
          <div><i /><i /><i /></div>
        </main>
      </div>
    );
  }

  if (id === "accordion") {
    return (
      <div className={`live-accordion-card ${variantClass}`}>
        <details open><summary>常见问题</summary><p>{selected.plain}</p></details>
        <details><summary>更多说明</summary></details>
      </div>
    );
  }

  if (id === "action-sheet") {
    return (
      <div className={`live-action-sheet-card ${variantClass}`}>
        <main><i /><i /><i /></main>
        <section>
          <b />
          <button type="button">分享</button>
          <button type="button">复制链接</button>
          <button type="button" className="danger">删除</button>
          <button type="button">取消</button>
        </section>
      </div>
    );
  }

  if (id === "drawer") {
    const drawerText = getPreviewSearchText(selected);
    if (/filter|sort|cart/.test(drawerText)) {
      return (
        <div className={`live-drawer-card live-context-drawer ${variantClass}`}>
          <aside>
            <strong>{selected.title}</strong>
            {/filter/.test(drawerText) && <><label><input type="checkbox" defaultChecked /> Active</label><label><input type="checkbox" /> On sale</label><button>Apply filters</button></>}
            {/sort/.test(drawerText) && <><label><input type="radio" name="drawer-sort" defaultChecked /> Newest first</label><label><input type="radio" name="drawer-sort" /> Top rated</label></>}
            {/cart/.test(drawerText) && <><span>Wireless Kit ×2</span><span>Total $168</span><button>Checkout</button></>}
          </aside>
          <main><i /><i /><i /></main>
        </div>
      );
    }
    return (
      <div className={`live-drawer-card ${variantClass}`}>
        <aside><strong>{variant || "抽屉标题"}</strong><span>设置</span><span>通知</span><span>账户</span></aside>
        <main><i /><i /><i /></main>
      </div>
    );
  }

  if (["popover", "tooltip"].includes(id)) {
    return (
      <div className={`live-popover-card ${id} ${variantClass}`}>
        <button type="button">悬停/点击目标</button>
        <div><strong>{variant || selected.title}</strong><span>{selected.summary}</span></div>
      </div>
    );
  }

  if (id === "carousel") {
    return (
      <div className={`live-carousel-card ${variantClass}`}>
        <div><strong>推荐内容</strong><span>1 / 3</span></div>
        <section><i /><i /><i /></section>
        <footer><b /><b /><b /></footer>
      </div>
    );
  }

  if (["tabs"].includes(id)) {
    return (
      <div className={`live-tabs-card ${variantClass}`}>
        <div className="live-tabs"><b>概览</b><span>详情</span><span>设置</span></div>
        <div className="live-content-block">
          <strong>{variant || selected.title}</strong>
          <p>{selected.plain}</p>
        </div>
      </div>
    );
  }

  if (id === "list") {
    return (
      <div className={`live-list-card ${variantClass}`}>
        {["订单更新", "设计任务", "用户反馈"].map((label, index) => (
          <div key={label}><b>{index + 1}</b><strong>{label}</strong><span>刚刚更新</span></div>
        ))}
      </div>
    );
  }

  if (id === "timeline") {
    return (
      <div className={`live-timeline-card ${variantClass}`}>
        {["提交", "审核", "发布"].map((label, index) => (
          <div key={label} className={index === 1 ? "active" : ""}><i /><strong>{label}</strong><span>第 {index + 1} 步</span></div>
        ))}
      </div>
    );
  }

  if (id === "rating") {
    return (
      <div className={`live-rating-card ${variantClass}`}>
        <strong>{variantHas(variant, ["数字"]) ? "9.6" : "4.8"}</strong>
        <div>{variantHas(variant, ["表情"]) ? "😍 😐 😕" : "★★★★★"}</div>
        <span>{selected.summary}</span>
      </div>
    );
  }

  if (["chat-bubble", "comment-box"].includes(id)) {
    return (
      <div className={`live-message-card ${id} ${variantClass}`}>
        <div><strong>{variant || (id === "chat-bubble" ? "小明" : "评论")}</strong><p>{selected.plain}</p></div>
        <input placeholder={id === "comment-box" ? "写下评论..." : "输入消息..."} />
      </div>
    );
  }

  if (id === "tag" && /filter/.test(getPreviewSearchText(selected))) {
    return (
      <div className={`live-filter-chip-card ${variantClass}`}>
        <strong>Applied filters</strong>
        <div><span>Status: Active <X size={13} /></span><span>Owner: Me <X size={13} /></span></div>
        <button type="button">Clear all</button>
      </div>
    );
  }

  if (["badge", "avatar", "tag"].includes(id)) {
    return (
      <div className={`live-social-card ${variantClass}`}>
        <div className="live-avatar">UI</div>
        <div>
          <strong>{variant || selected.title}</strong>
          <p>{selected.summary}</p>
          <span className="live-tag">{id === "rating" ? "4.8 分" : "新内容"}</span>
        </div>
      </div>
    );
  }

  if (id === "filter-panel") {
    return (
      <div className={`live-filter-card ${variantClass}`}>
        <strong>{variant || selected.title}</strong>
        <label><input type="checkbox" defaultChecked /> Active</label>
        <label><input type="checkbox" /> Promotion</label>
        <div><span>0</span><i /><span>100</span></div>
        <button type="button">Apply filters</button>
      </div>
    );
  }

  if (id === "sort-control") {
    return (
      <div className={`live-sort-card ${variantClass}`}>
        <span>Sort</span>
        <button type="button">Newest first</button>
        <button type="button">Price ascending</button>
        <button type="button">Top rated</button>
      </div>
    );
  }

  if (id === "command-palette") {
    return (
      <div className={`live-command-card ${variantClass}`}>
        <div><Search size={18} /><span>输入命令或搜索页面</span></div>
        <b>打开组件图鉴</b>
        <b>切换减少动效</b>
      </div>
    );
  }

  if (id === "media-player") {
    if (/voice|recorder|recording|audio recorder|video recorder/.test(getPreviewSearchText(selected))) {
      return (
        <div className={`live-recorder-card ${variantClass}`}>
          <header><span className="recording-dot" /><strong>{/video/.test(getPreviewSearchText(selected)) ? "Video recording" : "Voice recording"}</strong><b>00:18</b></header>
          <section>{Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ height: `${18 + (index % 5) * 8}px` }} />)}</section>
          <footer><button type="button">Pause</button><button type="button">Stop</button></footer>
        </div>
      );
    }
    return (
      <div className={`live-media-card ${variantClass}`}>
        <section><Play size={28} fill="currentColor" /></section>
        <div><b /><span>01:26 / 03:40</span></div>
      </div>
    );
  }

  if (id === "shopping-cart") {
    const text = getPreviewSearchText(selected);
    if (/payment status|refund status|order status/.test(text)) {
      const status = /refund/.test(text)
        ? { title: "Refund processing", meta: "$48.00", step: "Bank transfer" }
        : /payment/.test(text)
          ? { title: "Payment received", meta: "$140.80", step: "Receipt issued" }
          : { title: "Order shipped", meta: "#1024", step: "Out for delivery" };
      return (
        <div className={`live-commerce-status-card ${variantClass}`}>
          <header><strong>{selected.title}</strong><span>{status.meta}</span></header>
          <section><b>{status.title}</b><small>{status.step}</small></section>
          <ol>
            <li className="done">Created</li>
            <li className="done">{/refund/.test(text) ? "Approved" : "Paid"}</li>
            <li>{/refund/.test(text) ? "Refunded" : "Delivered"}</li>
          </ol>
        </div>
      );
    }
    if (/payment form/.test(text)) {
      return (
        <div className={`live-payment-form-card ${variantClass}`}>
          <strong>Payment</strong>
          <label>Card number<input value="4242 4242 4242 4242" readOnly /></label>
          <div><label>MM/YY<input value="06/28" readOnly /></label><label>CVC<input value="123" readOnly /></label></div>
          <button type="button">Pay $140.80</button>
        </div>
      );
    }
    if (/coupon/.test(text)) {
      return (
        <div className={`live-coupon-card ${variantClass}`}>
          <strong>$20 OFF</strong>
          <span>Orders over $99</span>
          <button type="button">Apply coupon</button>
        </div>
      );
    }
    if (/order summary|order detail|checkout/.test(text)) {
      return (
        <div className={`live-order-summary-card ${variantClass}`}>
          <header><strong>Order summary</strong><span>#1024</span></header>
          <div><span>Items</span><b>$128.00</b></div>
          <div><span>Shipping</span><b>$12.00</b></div>
          <footer><span>Total</span><strong>$140.00</strong></footer>
        </div>
      );
    }
    return (
      <div className={`live-cart-card ${variantClass}`}>
        <strong>{variant || "购物车"}</strong>
        <div><span>UI 模板包</span><b>¥129</b></div>
        <div><span>图标资源</span><b>¥39</b></div>
        <button type="button">去结算</button>
      </div>
    );
  }

  if (["toolbar"].includes(id)) {
    return (
      <div className={`live-tool-card ${variantClass}`}>
        <div className="live-toolbar"><button>筛选</button><button>排序</button><button>导出</button></div>
        <div className="live-content-block">
          <strong>{variant || selected.title}</strong>
          <p>{selected.plain}</p>
        </div>
      </div>
    );
  }

  if (id === "barcode" && /scanner|scan|qr/.test(getPreviewSearchText(selected))) {
    return (
      <div className={`live-scanner-card ${variantClass}`}>
        <header><strong>{variant || selected.title}</strong><span>Camera</span></header>
        <section><b /><b /><b /><b /><i /></section>
        <footer><span>Align QR or barcode inside the frame</span></footer>
      </div>
    );
  }

  if (id === "barcode") {
    return (
      <div className={`live-barcode-card ${variantClass}`}>
        <strong>{variant || selected.title}</strong>
        <div className="live-barcode-lines">{Array.from({ length: 18 }).map((_, index) => <i key={index} />)}</div>
        <span>Code 128 / QR / scan result</span>
      </div>
    );
  }

  return (
    <div className={`live-generic-card ${variantClass}`}>
      <MiniPreview type={selected.preview} entry={selected} large />
      <strong>{variant || term?.title || selected.title}</strong>
      <p>{term?.plain || selected.plain}</p>
    </div>
  );
}

function getPreviewSearchText(selected) {
  return [selected?.id, selected?.title, selected?.english, selected?.group].join(" ").toLowerCase();
}

function getA11yPreviewKind(selected, type) {
  if (type !== "a11y" && type !== "a11y-focus") return type;
  const text = getPreviewSearchText(selected);
  if (/name|description|aria-label|aria-description|label/.test(text)) return "a11y-name";
  if (/semantic|landmark|heading|skip/.test(text)) return "a11y-structure";
  if (/focus|keyboard|shortcut|tab/.test(text)) return "a11y-focus";
  if (/reader|live|announcement|announced|status/.test(text)) return "a11y-announcement";
  if (/contrast|color blind|high contrast|palette/.test(text)) return "a11y-contrast";
  if (/reduced motion|motion/.test(text)) return "a11y-motion";
  if (/touch target|target size|target/.test(text)) return "a11y-target";
  if (/form|association|error association/.test(text)) return "a11y-form";
  if (/alt text|caption|chart description|image|video/.test(text)) return "a11y-alt-text";
  if (/test|audit|check/.test(text)) return "a11y-testing";
  return type === "a11y-focus" ? "a11y-focus" : "a11y-name";
}

function getI18nPreviewKind(selected, type) {
  if (type !== "i18n") return type;
  const text = getPreviewSearchText(selected);
  if (/language|locale/.test(text)) return "i18n-locale";
  if (/translation|missing/.test(text)) return "i18n-translation";
  if (/plural/.test(text)) return "i18n-plural";
  if (/date|time|number|currency|unit|address|phone|name order|format/.test(text)) return "i18n-format";
  if (/rtl|ltr|bidirectional|direction/.test(text)) return "i18n-direction";
  if (/long text|truncation|expansion/.test(text)) return "i18n-text";
  if (/search|sorting|sort/.test(text)) return "i18n-search";
  if (/compliance|region/.test(text)) return "i18n-compliance";
  return "i18n-locale";
}

function getStatusPreviewKind(selected, type = "status-indicator") {
  if (type !== "status-indicator") return type;
  const text = getPreviewSearchText(selected);
  if (/empty|no results|not found|404/.test(text)) return "empty";
  if (/status message/.test(text)) return "alert";
  if (/file validation|virus scan|virus scanning|scan failed/.test(text)) return "security";
  if (/virus scanning/.test(text)) return "security";
  if (/transcoding|saving|autosaving|reviewing|in-review|sending|bulk action running/.test(text)) return "progress";
  if (/media states/.test(text) && /\bended\b/.test(text)) return "media-player";
  if (/(date|calendar)/.test(text) && /\bended\b/.test(text)) return "date-picker";
  if (/通知、消息与社交状态|notification|social/.test(text) && /\b(delivered|muted|unmuted)\b/.test(text)) return "status-indicator";
  if (/stopped|buffering|fullscreen|picture-in-picture|replay|seeking|captions|muted|unmuted/.test(text)) return "media-player";
  if (/yesterday|past|future|has-events|no-events|all-day|recurring event|scheduled|upcoming|booked/.test(text)) return "date-picker";
  if (/unsorted|ascending|descending/.test(text)) return "sort-control";
  if (/unfiltered|filtered/.test(text)) return "filter-panel";
  if (/column frozen|column pinned|resizing column|cell editing|row editing/.test(text)) return "data-grid";
  if (/bulk selecting/.test(text)) return "checkbox";
  if (/unsaved/.test(text)) return "editor";
  if (/\bunlocked\b/.test(text)) return "status-indicator";
  if (/conflict resolved|published|restored|copied|shipped|returned|archived|refreshed/.test(text)) return "toast";
  if (/conflict|rejected|deleted|soft-deleted|\blocked\b|\bblocked\b|overdue|high-priority|discontinued|not-purchasable/.test(text)) return "alert";
  if (/checking-out|in-transit|returning|trialing/.test(text)) return "shopping-cart";
  if (/read receipt/.test(text)) return "status-indicator";
  if (/\bunread\b|\bread\b|\bmentioned\b/.test(text)) return "notification";
  if (/pinned|unpinned|liked|unliked|following|not-following/.test(text)) return "button";
  if (/editing/.test(text)) return "editor";
  if (/previewing/.test(text)) return "media-player";
  if (/character counter|counter|countdown/.test(text)) return "badge";
  if (/autosave|draft/.test(text)) return "editor";
  if (/account settings|configuration summary/.test(text)) return "form";
  if (/unsupported format/.test(text)) return "alert";
  if (/\bincomplete\b|未完成/.test(text)) return "status-indicator";
  if (/\bcanceled\b|\bcancelled\b|\bretried\b|\bretryable\b/.test(text)) return "status-indicator";
  if (/loading|pending|progress|processing|syncing|generating|streaming|uploading|downloading|validating|submitting|requesting|reconnecting|queued|sorting|dragging/.test(text)) return "progress";
  if (/failed|error|warning|risk|denied|forbidden|unauthorized|unauthenticated|timeout|expired|rate limit|server|invalid|over limit|offline|disconnected|canceled|too large|selection limit|not-droppable|degraded|broken/.test(text)) return "alert";
  if (/success|completed|approved|saved|synced|delivered|done|passed|sent|valid\b|under limit|resumed|connected|online/.test(text)) return "toast";
  if (/\bunselected\b|\binactive\b|\bnon-clickable\b|\bnon clickable\b/.test(text)) return "status-indicator";
  if (/\bselected\b|checked|partially selected|select all|single select|multi select/.test(text)) return "checkbox";
  if (/expanded|collapsed|accordion|row expanded|row collapsed/.test(text)) return "accordion";
  if (/focus|keyboard focus|focus visible/.test(text)) return "a11y-focus";
  if (/readonly|editable|non-editable|filled|filling|typing|touched|untouched|dirty|pristine|original value|autofilled|password visible|password hidden|required|optional/.test(text)) return "text";
  if (/disabled|enabled|\bactive\b|hover|pressed|default|\bclickable\b|visited|highlighted|current|open|closed|visible|hidden|resettable|previous item|next item|creatable|droppable|grouped|ungrouped/.test(text)) return "button";
  if (/playing|paused|\bmuted\b|camera|recording|\blive\b|media|audio|video/.test(text)) return "media-player";
  if (/payment|order|cart|stock|subscription|invoice|refund/.test(text)) return "shopping-cart";
  if (/date|time|calendar|today|tomorrow/.test(text)) return "date-picker";
  if (/ai|tool|citation|model|confidence|context|prompt/.test(text)) return "command-palette";
  return "status-indicator";
}

function getTermPreviewKind(selected, type = "term-card") {
  if (type !== "term-card") return type;
  const text = getPreviewSearchText(selected);
  if (/data grid/.test(text)) return "data-grid";
  if (/tree table|pivot table|\btable\b/.test(text)) return "table";
  if (/date picker|time picker|calendar picker|month picker|year picker|date range picker/.test(text)) return "date-picker";
  if (/otp input|pin input|verification code|one-time code/.test(text)) return "otp-input";
  if (/bottom navigation|bottom nav|tab bar/.test(text)) return "bottom-navigation";
  if (/action sheet/.test(text)) return "action-sheet";
  if (/modal|dialog|confirmation|alert dialog/.test(text)) return "modal";
  if (/drawer|sheet|bottom sheet|side sheet/.test(text)) return "drawer";
  if (/backdrop|overlay/.test(text)) return "modal";
  if (/steps/.test(text)) return "stepper";
  if (/skip link/.test(text)) return "a11y-structure";
  if (/toast|snackbar/.test(text)) return "toast";
  if (/notification|banner|callout|alert/.test(text)) return "alert";
  if (/tooltip/.test(text)) return "tooltip";
  if (/popover|hover card/.test(text)) return "popover";
  if (/\btabs?\b|tab panel/.test(text)) return "tabs";
  if (/pagination/.test(text)) return "pagination";
  if (/breadcrumb/.test(text)) return "breadcrumb";
  if (/navigation|nav bar|side navigation|rail/.test(text)) return "top-navigation";
  if (/command|menu|dropdown|context menu|mega menu/.test(text)) return "menu";
  if (/text field|input|textarea|password|search box|combobox|autocomplete/.test(text)) return "text";
  if (/^dictionary-form\b|\bform item\b/.test(text)) return "form";
  if (/select|picker|cascader|tree select/.test(text)) return "select";
  if (/slider|stepper|range/.test(text)) return "slider";
  if (/checkbox/.test(text)) return "checkbox";
  if (/radio/.test(text)) return "radio";
  if (/switch|toggle/.test(text)) return "switch";
  if (/file upload|dropzone/.test(text)) return "file-upload";
  if (/table|data grid|tree table|pivot/.test(text)) return "table";
  if (/list|tree|kanban|feed/.test(text)) return "list";
  if (/card|stat card|metric card|source card|citation card/.test(text)) return "card";
  if (/chart|sparkline|graph|calendar|timeline/.test(text)) return text.includes("calendar") ? "date-picker" : text.includes("timeline") ? "timeline" : "chart";
  if (/avatar/.test(text)) return "avatar";
  if (/badge|tag|chip/.test(text)) return "badge";
  if (/prompt|model|ai|generated|streaming|tool call/.test(text)) return "command-palette";
  if (/empty/.test(text)) return "empty";
  if (/success state/.test(text)) return "toast";
  if (/error state|warning state|permission denied|offline state|server error|rate limit|maintenance/.test(text)) return "alert";
  if (/no results state|not found state/.test(text)) return "empty";
  if (/loading|skeleton|spinner|progress/.test(text)) return text.includes("spinner") ? "spinner" : "progress";
  return "term-card";
}

function A11yTaxonomyPreview({ selected, type, label, variantClass }) {
  const kind = getA11yPreviewKind(selected, type);

  if (kind === "a11y-name") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-name ${variantClass}`}>
        <strong>{label}</strong>
        <label><span>Name</span><input value="Email address" readOnly /></label>
        <p>可访问名称和描述要让读屏用户知道控件身份、目的和当前状态。</p>
      </div>
    );
  }

  if (kind === "a11y-structure") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-structure ${variantClass}`}>
        <strong>{label}</strong>
        <section><b>Header</b><b>Main</b><b>H2</b><b>Skip</b></section>
        <p>语义结构、landmark、标题层级和跳过链接要形成可导航的信息骨架。</p>
      </div>
    );
  }

  if (kind === "a11y-announcement") {
    const text = getPreviewSearchText(selected);
    const message = /error/.test(text)
      ? "Error. Email address is invalid."
      : /status/.test(text)
        ? "Status changed. Upload complete."
        : "Saved. Upload complete.";
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-announcement ${variantClass}`}>
        <strong>{label}</strong>
        <article className={/error/.test(text) ? "danger" : ""}><i /> <span aria-live={/error/.test(text) ? "assertive" : "polite"}>{message}</span></article>
        <p>状态变化要通过 live region 或等价文本被及时公告，而不是只改变颜色。</p>
      </div>
    );
  }

  if (kind === "a11y-contrast") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-contrast ${variantClass}`}>
        <strong>{label}</strong>
        <section><b>AA</b><span>7.8:1</span><i /></section>
        <p>文本、边框和状态色需要满足对比度要求，高对比模式要重新校准。</p>
      </div>
    );
  }

  if (kind === "a11y-motion") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-motion ${variantClass}`}>
        <strong>{label}</strong>
        <section><span>Reduced motion</span><button type="button">On</button></section>
        <p>减少动效应移除非必要位移，保留状态变化和操作反馈。</p>
      </div>
    );
  }

  if (kind === "a11y-target") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-target ${variantClass}`}>
        <strong>{label}</strong>
        <section><button type="button">44 x 44</button><button type="button">Tap</button></section>
        <p>触控目标要足够大，并给相邻操作留出间距。</p>
      </div>
    );
  }

  if (kind === "a11y-form") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-form ${variantClass}`}>
        <strong>{label}</strong>
        <label><span>Email</span><input value="name@example.com" readOnly /></label>
        <small>Error text is associated with the field.</small>
      </div>
    );
  }

  if (kind === "a11y-alt-text") {
    const text = getPreviewSearchText(selected);
    const caption = /video captions|captions/.test(text)
      ? "00:18 Speaker: captions stay synchronized"
      : "Alt text / captions / chart summary";
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-alt ${variantClass}`}>
        <strong>{label}</strong>
        <figure><i /><figcaption>{caption}</figcaption></figure>
        <p>非文本内容要有等价说明，图表还需要趋势和结论。</p>
      </div>
    );
  }

  if (kind === "a11y-testing") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-testing ${variantClass}`}>
        <strong>{label}</strong>
        <ul><li>Keyboard</li><li>Reader</li><li>Contrast</li></ul>
        <p>测试要覆盖键盘、读屏、对比度、缩放和移动端触控。</p>
      </div>
    );
  }

  return (
    <div className={`live-taxonomy-card taxonomy-a11y taxonomy-a11y-focus ${variantClass}`}>
      <strong>{label}</strong>
      <section><button type="button">1</button><button type="button" className="focused">2</button><button type="button">3</button></section>
      <p>{kind === "a11y-focus" ? "焦点顺序、陷阱和返回路径要清楚。" : "读屏公告、可访问名称和触控目标要完整。"}</p>
    </div>
  );
}

function I18nTaxonomyPreview({ selected, type, label, variantClass }) {
  const kind = getI18nPreviewKind(selected, type);

  if (kind === "i18n-locale") {
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-locale ${variantClass}`}>
        <strong>{label}</strong>
        <div><span>Language</span><b>中文 / EN</b></div>
        <div><span>Region</span><b>CN / US</b></div>
        <p>语言和地区要分开处理，避免把翻译、格式和内容偏好混在一起。</p>
      </div>
    );
  }

  if (kind === "i18n-translation") {
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-translation ${variantClass}`}>
        <strong>{label}</strong>
        <pre>checkout.submit_label</pre>
        <div><span>Missing</span><b>Fallback</b></div>
        <p>翻译键、缺失翻译和 fallback 要可追踪，不能只显示空白。</p>
      </div>
    );
  }

  if (kind === "i18n-plural") {
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-plural ${variantClass}`}>
        <strong>{label}</strong>
        <div><span>1</span><b>1 item</b></div>
        <div><span>5</span><b>5 items</b></div>
        <p>复数规则要按 locale 处理，不要用简单字符串拼接。</p>
      </div>
    );
  }

  if (kind === "i18n-format") {
    const text = getPreviewSearchText(selected);
    const rows =
      /time/.test(text) ? [["24h", "14:30"], ["12h", "2:30 PM"]] :
      /number/.test(text) ? [["US", "1,280.5"], ["DE", "1.280,5"]] :
      /unit/.test(text) ? [["Metric", "24 km"], ["Imperial", "14.9 mi"]] :
      /address/.test(text) ? [["CN", "Shanghai Jing'an 88"], ["US", "88 Market St, SF"]] :
      /phone/.test(text) ? [["CN", "+86 138 0000 0000"], ["US", "+1 (415) 555-0100"]] :
      /name order/.test(text) ? [["ZH", "Wang Xiaoming"], ["EN", "Alex Chen"]] :
      /currency/.test(text) ? [["CNY", "CNY 1,280.00"], ["USD", "USD 178.40"]] :
      [["Date", "2026/06/21"], ["Money", "CNY 1,280.00"]];
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-format ${variantClass}`}>
        <strong>{label}</strong>
        {rows.map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}
        <div><span>Money</span><b>¥1,280.00</b></div>
        <p>日期、时间、数字、货币、单位和姓名地址顺序都要按地区格式化。</p>
      </div>
    );
  }

  if (kind === "i18n-direction") {
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-direction ${variantClass}`}>
        <strong>{label}</strong>
        <div><span>LTR</span><b>Start → End</b></div>
        <div dir="rtl"><span>RTL</span><b>بداية ← نهاية</b></div>
        <p>RTL/LTR 和双向文本要验证图标方向、阅读顺序和布局镜像。</p>
      </div>
    );
  }

  if (kind === "i18n-text") {
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-text ${variantClass}`}>
        <strong>{label}</strong>
        <article><b /> <b /> <b className="long" /></article>
        <p>长文本扩展和本地化截断要保证按钮、卡片和表格不溢出。</p>
      </div>
    );
  }

  if (kind === "i18n-search") {
    const isSort = /sorting|sort/.test(getPreviewSearchText(selected));
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-search ${variantClass}`}>
        <strong>{label}</strong>
        {isSort && <section><span>Collator</span><b>{"Aalborg -> Aland -> Shanghai"}</b></section>}
        <div><Search size={16} /><b>Å / A / 阿</b></div>
        <p>搜索和排序要尊重 locale collator、大小写、重音符和分词规则。</p>
      </div>
    );
  }

  if (kind === "i18n-compliance") {
    return (
      <div className={`live-taxonomy-card taxonomy-i18n taxonomy-i18n-compliance ${variantClass}`}>
        <strong>{label}</strong>
        <section><SquareCheck size={18} /><span>Region rules</span></section>
        <p>区域合规要覆盖文案、单位、隐私提示和本地法律要求。</p>
      </div>
    );
  }

  return (
    <div className={`live-taxonomy-card taxonomy-i18n ${variantClass}`}>
      <strong>{label}</strong>
      <div><span>zh-CN</span><b>保存成功</b></div>
      <div dir="rtl"><span>RTL</span><b>تم الحفظ</b></div>
      <p>长文本、RTL 和地区格式都要验证。</p>
    </div>
  );
}

function getReactPreviewMode(selected) {
  const text = getPreviewSearchText(selected);
  if (/prompt|composer/.test(text)) return "prompt";
  if (/context|source/.test(text)) return "context";
  if (/tool-call|tool call|status/.test(text)) return "tool";
  if (/feedback|safety|notice/.test(text)) return "feedback";
  if (/ai|model|generated|result/.test(text)) return "ai";
  if (/search|filter|tag|sort|category|nav/.test(text)) return "filter";
  if (/tile|row|list|empty|header|detail|entry/.test(text)) return "list";
  if (/segmented|switcher|slider|selector|inspector|toggle|token|icon|control/.test(text)) return "control";
  if (/playground|variant|anatomy|guideline|code|copy|source|comparison|info|explore|example/.test(text)) return "playground";
  if (/loading|skeleton|badge|state/.test(text)) return "state";
  return "surface";
}

function ReactTaxonomyPreview({ selected, type, label, variantClass }) {
  const mode = getReactPreviewMode(selected);
  const badge = type === "react-preview" ? "Preview" : "React UI";
  const text = getPreviewSearchText(selected);
  const surfaceTitle =
    /provider/.test(text) ? "Context scope" :
    /boundary/.test(text) ? "Boundary state" :
    /shell|layout|root/.test(text) ? "Shell frame" :
    /page|screen|route/.test(text) ? "Route surface" :
    "Reusable surface";
  const surfaceBody =
    /provider/.test(text) ? "Shared state is scoped, named, and recoverable." :
    /boundary/.test(text) ? "Failure, loading, and empty states stay isolated." :
    /shell|layout|root/.test(text) ? "Navigation, content, and overlay slots are explicit." :
    /page|screen|route/.test(text) ? "Route content exposes header, body, and primary action." :
    "Component slots, state, and actions are visible in the preview.";
  return (
    <div className={`live-taxonomy-card taxonomy-react taxonomy-react-${mode} ${variantClass}`}>
      <header><strong>{label}</strong><span>{badge}</span></header>
      {mode === "prompt" && <section className="react-preview-prompt"><textarea readOnly value="Ask the assistant to summarize this release note." /><footer><b>2 context files</b><button>Run</button></footer></section>}
      {mode === "context" && <section className="react-preview-context"><aside><b>Sources</b><span>design-spec.pdf</span><span>roadmap.md</span></aside><main><b>Selected context</b><span>3 chunks attached</span></main></section>}
      {mode === "tool" && <section className="react-preview-tool"><b className="running">Search docs</b><b className="done">Read source</b><b>Summarize result</b></section>}
      {mode === "feedback" && <section className="react-preview-feedback"><div><button>Helpful</button><button>Needs work</button></div><textarea readOnly value="Add citations for the claim." /></section>}
      {mode === "ai" && <section className="react-preview-ai"><Sparkles size={18} /><b>Generated result</b><span>Answer card with apply, cite, and regenerate actions.</span><button>Apply</button></section>}
      {mode === "filter" && <section className="react-preview-filter"><Search size={16} /><b>Search entries</b><input readOnly value="Search entries" /><button className="active">Design</button><button>Sort</button></section>}
      {mode === "list" && <section className="react-preview-list"><article><b>Entry row</b><span>Updated today</span></article><article className="active"><b>Selected detail</b><span>Usage and variants</span></article><article><b>Empty state</b><span>No matches</span></article></section>}
      {mode === "control" && <section className="react-preview-control"><button className="active">Desktop</button><button>Mobile</button><input type="range" min="0" max="100" defaultValue="64" /><b>Variant selected</b></section>}
      {mode === "playground" && <section className="react-preview-playground"><nav><button>Preview</button><button className="active">Code</button><button>Guidelines</button></nav><pre>{`<Component variant="solid" />`}</pre></section>}
      {mode === "state" && <section className="react-preview-state"><b>Loading state</b><div className="meter"><i /></div><span>Status badge and reserved layout stay visible.</span></section>}
      {mode === "surface" && <section className="react-preview-surface"><b>{surfaceTitle}</b><span>{surfaceBody}</span><footer><button>Inspect props</button><button>Open preview</button></footer></section>}
    </div>
  );
}

function TaxonomyLivePreview({ selected, variant, variantClass }) {
  const type = selected.preview;
  const label = type === "i18n" || type.startsWith("i18n-") ? selected.title : variant || selected.title;
  const group = selected.group || "UI";

  if (type === "text-content") {
    if (/date display|time display|relative time|reading time/.test(getPreviewSearchText(selected))) {
      return (
        <div className={`live-taxonomy-card taxonomy-time-display ${variantClass}`}>
          <small>{group}</small>
          <strong>{label}</strong>
          <section><b>{/reading/.test(getPreviewSearchText(selected)) ? "5 min read" : /relative/.test(getPreviewSearchText(selected)) ? "3 min ago" : /time/.test(getPreviewSearchText(selected)) ? "14:30 UTC+8" : "2026-06-21"}</b></section>
          <p>Display-only time values should read as formatted text, not as an interactive date picker.</p>
        </div>
      );
    }
    return (
      <div className={`live-taxonomy-card taxonomy-text ${variantClass}`}>
        <small>{group}</small>
        <h4>{label}</h4>
        <p>{selected.summary}</p>
        <span>辅助说明 · 错误提示 · 长文本换行</span>
      </div>
    );
  }

  if (type === "icon-system") {
    return (
      <div className={`live-taxonomy-card taxonomy-icons ${variantClass}`}>
        <strong>{label}</strong>
        <div>
          <button type="button" aria-label="信息"><Info size={20} /></button>
          <button type="button" aria-label="成功"><Check size={20} /></button>
          <button type="button" aria-label="搜索"><Search size={20} /></button>
          <button type="button" aria-label="更多"><SlidersHorizontal size={20} /></button>
        </div>
        <p>图标需要语义、尺寸和状态一致。</p>
      </div>
    );
  }

  if (type === "divider") {
    return (
      <div className={`live-taxonomy-card taxonomy-divider ${variantClass}`}>
        <strong>{label}</strong>
        <section><span /><i /><span /></section>
        <footer><b /> <b /> <b /></footer>
      </div>
    );
  }

  if (type === "term-card") {
    const termKind = getTermPreviewKind(selected, type);
    if (termKind !== "term-card") {
      return <ComponentLivePreview selected={{ ...selected, preview: termKind }} term={selected} variant={label} />;
    }
  }

  if (type === "panel" || type === "term-card") {
    if (/color panel|color/.test(getPreviewSearchText(selected))) {
      return (
        <div className={`live-taxonomy-card taxonomy-color-panel ${variantClass}`}>
          <header><span>Palette</span><button type="button">Save</button></header>
          <section>{["#111827", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#ffffff"].map((color) => <i key={color} style={{ background: color }} />)}</section>
          <label>HEX<b>#2563EB</b><input value="#2563EB" readOnly /></label>
        </div>
      );
    }
    return (
      <div className={`live-taxonomy-card taxonomy-panel ${variantClass}`}>
        <header><span>{group}</span><button type="button">操作</button></header>
        <strong>{label}</strong>
        <p>{selected.plain}</p>
        <footer><i /><i /><i /></footer>
      </div>
    );
  }

  if (type === "code-block" || type === "keyboard-key") {
    return (
      <div className={`live-taxonomy-card taxonomy-code ${variantClass}`}>
        <header><strong>{label}</strong><button type="button">复制</button></header>
        {type === "keyboard-key" ? (
          <div className="taxonomy-keys"><kbd>Ctrl</kbd><kbd>K</kbd><kbd>Enter</kbd></div>
        ) : (
          <pre>{`<${selected.english.replace(/\s+/g, "")} state="default" />`}</pre>
        )}
        <span>复制成功、长内容滚动、焦点状态都要可见。</span>
      </div>
    );
  }

  if (type === "status-indicator") {
    const statusKind = getStatusPreviewKind(selected, type);
    if (statusKind !== "status-indicator") {
      return <ComponentLivePreview selected={{ ...selected, preview: statusKind }} variant={label} />;
    }

    return (
      <div className={`live-taxonomy-card taxonomy-status ${variantClass}`}>
        <strong>{label}</strong>
        <div><span className="ok">在线</span><span className="warn">同步中</span><span className="bad">失败</span></div>
        <p>{selected.summary}</p>
      </div>
    );
  }

  if (type === "chart") {
    if (/filter|time range|export|refresh/.test(getPreviewSearchText(selected))) {
      return (
        <div className={`live-taxonomy-card taxonomy-chart taxonomy-chart-controls ${variantClass}`}>
          <header><strong>{label}</strong><span>Last 30 days</span></header>
          <nav><button>7D</button><button className="active">30D</button><button>Export</button></nav>
          <div>{[42, 68, 54, 86, 72].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
        </div>
      );
    }
    return (
      <div className={`live-taxonomy-card taxonomy-chart ${variantClass}`}>
        <header><strong>{label}</strong><span>单位 / 趋势</span></header>
        <div>{[42, 68, 54, 86, 72].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
        <p>图表要提供标题、单位、图例和空数据状态。</p>
      </div>
    );
  }

  if (type === "editor") {
    return (
      <div className={`live-taxonomy-card taxonomy-editor ${variantClass}`}>
        <div className="taxonomy-toolbar"><button>B</button><button>I</button><button>链接</button><span>已保存</span></div>
        <section><strong>{label}</strong><p>{selected.plain}</p></section>
      </div>
    );
  }

  if (type === "security") {
    if (/captcha|human verification/.test(getPreviewSearchText(selected))) {
      return (
        <div className={`live-taxonomy-card taxonomy-security taxonomy-captcha ${variantClass}`}>
          <strong>{label}</strong>
          <section><SquareCheck size={18} /><span>I am not a robot</span></section>
          <div><b /><b /><b /></div>
          <p>Human verification needs a visible challenge state, not a password authorization panel.</p>
        </div>
      );
    }
    if (/virus|scan|file validation|validation status/.test(getPreviewSearchText(selected))) {
      return (
        <div className={`live-taxonomy-card taxonomy-security taxonomy-file-scan ${variantClass}`}>
          <strong>{label}</strong>
          <section><span>report.pdf</span><b>Scanning</b></section>
          <div><i /><i /><i className="active" /></div>
          <p>File security states must show the file target, scan progress, and the safe or risky outcome.</p>
        </div>
      );
    }
    return (
      <div className={`live-taxonomy-card taxonomy-security ${variantClass}`}>
        <strong>{label}</strong>
        <label>身份验证<input value="••••••" readOnly /></label>
        <div><button type="button">取消</button><button type="button">确认授权</button></div>
        <span>权限、过期和错误状态必须可恢复。</span>
      </div>
    );
  }

  if (type === "map") {
    return (
      <div className={`live-taxonomy-card taxonomy-map ${variantClass}`}>
        <strong>{label}</strong>
        <section><i /><i /><b /></section>
        <p>地图要有列表/输入替代、定位权限说明和加载失败路径。</p>
      </div>
    );
  }

  if (type === "help") {
    return (
      <div className={`live-taxonomy-card taxonomy-help ${variantClass}`}>
        <div><Search size={18} /><span>搜索帮助文档</span></div>
        <strong>{label}</strong>
        <p>{selected.summary}</p>
        <button type="button">查看指南</button>
      </div>
    );
  }

  if (type === "a11y" || type === "a11y-focus" || type.startsWith("a11y-")) {
    return <A11yTaxonomyPreview selected={selected} type={type} label={label} variantClass={variantClass} />;
  }

  if (type === "i18n" || type.startsWith("i18n-")) {
    return <I18nTaxonomyPreview selected={selected} type={type} label={label} variantClass={variantClass} />;
  }

  if (type === "a11y" || type === "a11y-focus") {
    return (
      <div className={`live-taxonomy-card taxonomy-a11y ${variantClass}`}>
        <strong>{label}</strong>
        <section><button type="button">1</button><button type="button" className="focused">2</button><button type="button">3</button></section>
        <p>{type === "a11y-focus" ? "焦点顺序、陷阱和返回路径要清楚。" : "读屏公告、可访问名称和触控目标要完整。"}</p>
      </div>
    );
  }

  if (type === "i18n") {
    return (
      <div className={`live-taxonomy-card taxonomy-i18n ${variantClass}`}>
        <strong>{label}</strong>
        <div><span>zh-CN</span><b>保存成功</b></div>
        <div dir="rtl"><span>RTL</span><b>تم الحفظ</b></div>
        <p>长文本、RTL 和地区格式都要验证。</p>
      </div>
    );
  }

  if (type === "react-component" || type === "react-preview") {
    return <ReactTaxonomyPreview selected={selected} type={type} label={label} variantClass={variantClass} />;
  }

  if (type === "mobile-preview") {
    return (
      <div className={`live-taxonomy-card taxonomy-mobile ${variantClass}`}>
        <MobilePreview type={getMobilePreviewType(selected)} />
        <strong>{label}</strong>
        <div className="taxonomy-phone">
          <header>{label}</header>
          <main><i /><i /><i /></main>
          <footer><button type="button">主要操作</button></footer>
        </div>
        <p>移动端要考虑触摸、safe area、权限和非 hover 替代。</p>
      </div>
    );
  }

  return (
    <div className={`live-taxonomy-card taxonomy-default ${variantClass}`}>
      <strong>{label}</strong>
      <p>{selected.summary}</p>
      <footer><span>{group}</span><span>状态</span><span>移动端</span></footer>
    </div>
  );
}

function LayoutLivePreview({ selected, variant }) {
  const idTemplates = {
    "single-column": "article",
    "two-column": "split",
    "sidebar-layout": "app",
    dashboard: "dashboard",
    "card-grid": "gallery",
    feed: "feed",
    "master-detail": "master",
    "settings-page": "settings",
    "checkout-page": "checkout",
    "three-column": "three",
    "sticky-header": "article",
    "sticky-sidebar": "app",
    masonry: "masonry",
    "split-pane": "split",
    wizard: "wizard",
    "fullscreen-modal": "modal",
    "landing-page": "landing",
    "profile-page": "profile",
    "search-results-page": "searchResults",
    "detail-page": "detail",
  };
  const previewTemplates = {
    "layout-single": "article",
    "layout-two": "split",
    "layout-three": "three",
    "layout-sidebar": "app",
    "layout-dashboard": "dashboard",
    "layout-feed": "feed",
    "layout-masonry": "masonry",
    "layout-sticky-header": "stickyHeader",
    "layout-sticky-sidebar": "app",
    "layout-sticky-action-bar": "stickyActionBar",
    "layout-mobile-bottom-sheet": "bottomSheetLayout",
    "layout-map": "mapLayout",
    "layout-bottom-nav": "mobileBottomNav",
    "layout-mobile-checkout": "mobileCheckout",
    "layout-auth": "auth",
    "layout-cart": "cart",
    "layout-order-detail": "orderDetail",
    "layout-payment-result": "paymentResult",
    "layout-pricing": "pricing",
    "layout-subscription": "subscription",
    "layout-billing": "billing",
    "layout-permission-settings": "permissionSettings",
    "layout-settings": "settings",
    "layout-split": "split",
    "layout-wizard": "wizard",
    "layout-checkout": "checkout",
    "layout-detail": "detail",
    "layout-grid": "gallery",
    "layout-fullscreen-modal": "modal",
    "layout-landing": "landing",
    "layout-profile": "profile",
    "layout-search-results": "searchResults",
    "layout-master": "master",
    "layout-docs-help": "docsHelp",
    "layout-error-page": "errorPage",
    "layout-maintenance-page": "maintenancePage",
    "layout-inbox": "inbox",
    "layout-chat": "chat",
    "layout-ide": "ide",
    "layout-whiteboard": "whiteboard",
    "layout-kanban": "kanbanLayout",
    "layout-calendar": "calendarLayout",
    "layout-timeline": "timelineLayout",
    "layout-filter-results": "filterResults",
    "layout-mobile-chat": "mobileChat",
  };
  const template = idTemplates[selected.id] || previewTemplates[selected.preview] || "article";

  return (
    <div className={`live-layout-demo detailed-layout ${selected.preview} layout-template-${template}`}>
      <div className="layout-browser-bar">
        <b />
        <span>{variant || selected.title}</span>
        <i />
      </div>
      <LayoutScene template={template} />
    </div>
  );
}

function LayoutScene({ template }) {
  if (template === "docsHelp") {
    return (
      <div className="layout-scene layout-docs-help-scene">
        <aside><strong>Docs</strong><span>Getting started</span><span className="active">Components</span><span>FAQ</span></aside>
        <main><header><Search size={16} /><span>Search help articles</span></header><article><b>Accordion FAQ</b><p /></article><article><b>API reference</b><p /></article></main>
      </div>
    );
  }

  if (template === "errorPage" || template === "maintenancePage") {
    return (
      <div className={`layout-scene layout-state-page-scene ${template}`}>
        <main><i /><strong>{template === "errorPage" ? "404" : "Maintenance"}</strong><span>{template === "errorPage" ? "The page cannot be found." : "Service returns at 02:00 UTC."}</span><div><button>Go back</button><button>Retry</button></div></main>
      </div>
    );
  }

  if (template === "inbox") {
    return (
      <div className="layout-scene layout-inbox-scene">
        <aside><strong>Inbox</strong><span className="active">Billing update</span><span>Design review</span><span>Release note</span></aside>
        <main><header><b>Billing update</b><span>Today 10:24</span></header><p /><p /><footer><button>Reply</button><button>Archive</button></footer></main>
      </div>
    );
  }

  if (template === "chat" || template === "mobileChat") {
    return (
      <div className={`layout-scene ${template === "mobileChat" ? "layout-mobile-chat-scene" : "layout-chat-scene"}`}>
        <aside><strong>Team</strong><span className="active">Alex</span><span>Mina</span><span>Support</span></aside>
        <main><header>Alex online</header><b>Hello, can you review this?</b><span>Sure, sending notes now.</span><footer><input readOnly value="Write a message..." /><button>Send</button></footer></main>
      </div>
    );
  }

  if (template === "ide") {
    return (
      <div className="layout-scene layout-ide-scene">
        <aside><strong>src</strong><span>App.jsx</span><span>data.js</span><span>styles.css</span></aside>
        <main><b>function Preview()</b><p /><p /><p /></main>
        <footer><span>Terminal</span><b>npm run build passed</b></footer>
      </div>
    );
  }

  if (template === "whiteboard") {
    return (
      <div className="layout-scene layout-whiteboard-scene">
        <nav><button>Pen</button><button>Sticky</button><button>Shape</button></nav>
        <main><i /><b /><b /><span>Idea map</span></main>
      </div>
    );
  }

  if (template === "kanbanLayout") {
    return (
      <div className="layout-scene layout-kanban-scene">
        {["Todo", "Doing", "Done"].map((column, index) => <section key={column}><strong>{column}</strong><article /><article className={index === 1 ? "active" : ""} /></section>)}
      </div>
    );
  }

  if (template === "calendarLayout") {
    return (
      <div className="layout-scene layout-calendar-scene">
        <header><strong>June 2026</strong><button>Today</button></header>
        <main>{Array.from({ length: 14 }).map((_, index) => <b key={index} className={index === 5 || index === 9 ? "busy" : ""}>{index + 1}</b>)}</main>
      </div>
    );
  }

  if (template === "timelineLayout") {
    return (
      <div className="layout-scene layout-timeline-scene">
        {["Draft", "Review", "Published"].map((row, index) => <article key={row}><i /><div><strong>{row}</strong><span>{index === 2 ? "Done" : "Pending"}</span></div></article>)}
      </div>
    );
  }

  if (template === "filterResults") {
    return (
      <div className="layout-scene layout-filter-results-scene">
        <aside><strong>Filters</strong><label><input type="checkbox" defaultChecked /> In stock</label><label><input type="checkbox" /> On sale</label><button>Apply</button></aside>
        <main>{["Result A", "Result B", "Result C"].map((row) => <article key={row}><i /><div><b>{row}</b><span>Matched item</span></div></article>)}</main>
      </div>
    );
  }

  if (template === "dashboard") {
    return (
      <div className="layout-scene layout-dashboard-scene">
        <nav><b>总览</b><span>订单</span><span>用户</span><span>报表</span></nav>
        <main>
          <div className="layout-dashboard-header">
            <strong>今日概览</strong>
            <span>更新于 12:30</span>
          </div>
          {["收入", "转化", "留存"].map((label, index) => (
            <article key={label}><span>{label}</span><strong>{index === 0 ? "¥86k" : index === 1 ? "12.8%" : "74%"}</strong></article>
          ))}
          <section><b /><b /><b /><b /><span>近 7 日趋势</span></section>
        </main>
      </div>
    );
  }

  if (template === "gallery" || template === "masonry") {
    return (
      <div className={`layout-scene layout-card-scene ${template === "masonry" ? "masonry" : ""}`}>
        {["模板 A", "案例 B", "组件 C", "资源 D", "页面 E", "图标 F"].map((label, index) => (
          <article key={label} className={index % 3 === 1 ? "tall" : ""}>
            <i />
            <strong>{label}</strong>
            <span>查看详情</span>
          </article>
        ))}
      </div>
    );
  }

  if (template === "feed") {
    return (
      <div className="layout-scene layout-feed-scene">
        {["设计系统更新", "移动端体验", "组件规范"].map((title) => (
          <article key={title}><i /><div><strong>{title}</strong><span>作者 · 12 分钟前</span><p /></div></article>
        ))}
      </div>
    );
  }

  if (template === "mobileBottomNav") {
    return (
      <div className="layout-scene layout-mobile-bottom-nav-scene">
        <main><i /><b /><b /><b /></main>
        <nav><button className="active">Home</button><button>Search</button><button>Saved</button><button>Profile</button></nav>
      </div>
    );
  }

  if (template === "mobileCheckout") {
    return (
      <div className="layout-scene layout-mobile-checkout-scene">
        <main>
          <header><span>Cart</span><strong>2 items</strong></header>
          <article><i /><div><b>Everyday tote</b><span>Qty 1</span></div><em>$88</em></article>
          <article><i /><div><b>Desk lamp</b><span>Qty 1</span></div><em>$80</em></article>
          <section><span>Delivery</span><b>Today, 18:00</b></section>
        </main>
        <footer><div><span>Total</span><strong>$168</strong></div><button>Checkout</button></footer>
      </div>
    );
  }

  if (template === "bottomSheetLayout") {
    return (
      <div className="layout-scene layout-mobile-bottom-sheet-scene">
        <main><header>Product</header><i /><b /><b /></main>
        <section><b /><strong>Choose options</strong><label><input type="radio" defaultChecked /> Standard</label><label><input type="radio" /> Express</label><button>Apply</button></section>
      </div>
    );
  }

  if (template === "stickyHeader") {
    return (
      <div className="layout-scene layout-sticky-header-scene">
        <header><strong>Sticky header</strong><nav><span>Overview</span><span>Details</span><span>Activity</span></nav></header>
        <main><article /><article /><article /><article /></main>
      </div>
    );
  }

  if (template === "stickyActionBar") {
    return (
      <div className="layout-scene layout-sticky-action-bar-scene">
        <main><strong>Review changes</strong><p /><p /><p /></main>
        <footer><span>3 unsaved edits</span><button>Discard</button><button>Save</button></footer>
      </div>
    );
  }

  if (template === "mapLayout") {
    return (
      <div className="layout-scene layout-map-scene">
        <aside><strong>Layers</strong><span>Stores</span><span>Traffic</span><span>Delivery zones</span></aside>
        <main><i /><b className="pin primary" /><b className="pin" /><b className="pin secondary" /></main>
        <section><strong>Selected area</strong><span>12 active locations</span><button>Route</button></section>
      </div>
    );
  }

  if (template === "auth") {
    return (
      <div className="layout-scene layout-auth-scene">
        <aside><strong>Welcome back</strong><span>Product workspace</span><i /></aside>
        <main><strong>Sign in</strong><input placeholder="Email" /><input placeholder="Password" /><button>Continue</button></main>
      </div>
    );
  }

  if (template === "cart") {
    return (
      <div className="layout-scene layout-cart-scene">
        <main>
          <article><i /><span>Desk lamp</span><b>$80</b></article>
          <article><i /><span>Everyday tote</span><b>$88</b></article>
          <article><i /><span>Coupon</span><b>- $12</b></article>
        </main>
        <aside><span>Subtotal</span><strong>$168</strong><button>Checkout</button></aside>
      </div>
    );
  }

  if (template === "orderDetail") {
    return (
      <div className="layout-scene layout-order-detail-scene">
        <main><strong>Order #1024</strong><span>Paid</span><span>Packed</span><span>Out for delivery</span></main>
        <aside><b>$168</b><em>2 items</em><button>Track order</button></aside>
      </div>
    );
  }

  if (template === "paymentResult") {
    return (
      <div className="layout-scene layout-payment-result-scene">
        <main><i /><strong>Payment successful</strong><span>Receipt sent to your email.</span><button>View order</button></main>
      </div>
    );
  }

  if (template === "pricing") {
    return (
      <div className="layout-scene layout-pricing-scene">
        {["Starter", "Pro", "Team"].map((plan, index) => <article key={plan} className={index === 1 ? "featured" : ""}><span>{plan}</span><strong>{index === 0 ? "$12" : index === 1 ? "$29" : "$79"}</strong><button>{index === 1 ? "Choose" : "Compare"}</button></article>)}
      </div>
    );
  }

  if (template === "subscription") {
    return (
      <div className="layout-scene layout-subscription-scene">
        <main><strong>Current plan</strong><b>Pro monthly</b><span>Renews Jul 21</span></main>
        <aside><button>Change plan</button><button>Update payment</button><button>Cancel subscription</button></aside>
      </div>
    );
  }

  if (template === "billing") {
    return (
      <div className="layout-scene layout-billing-scene">
        <main><strong>Invoices</strong><span>Jun 2026</span><span>May 2026</span><span>Apr 2026</span></main>
        <aside><span>Payment method</span><b>Visa 4242</b><button>Download invoice</button></aside>
      </div>
    );
  }

  if (template === "permissionSettings") {
    return (
      <div className="layout-scene layout-permission-settings-scene">
        <aside><strong>Members</strong><span>Owner</span><span>Editor</span><span>Viewer</span></aside>
        <main><b>Role permissions</b><span>Read</span><span>Write</span><span>Invite</span></main>
      </div>
    );
  }

  if (template === "app" || template === "master") {
    return (
      <div className="layout-scene layout-app-scene">
        <aside><strong>导航</strong><span>首页</span><span>组件</span><span>设置</span></aside>
        <main>
          {["按钮", "输入框", "弹窗"].map((item, index) => <button key={item} className={index === 0 ? "active" : ""}>{item}</button>)}
        </main>
        <section><strong>详情</strong><p>选中项的内容、状态和操作入口。</p><button>打开</button></section>
      </div>
    );
  }

  if (template === "settings") {
    return (
      <div className="layout-scene layout-settings-scene">
        <aside><strong>设置</strong><span>账号</span><span>通知</span><span>安全</span></aside>
        <main>
          {["邮件通知", "自动保存", "减少动效"].map((label, index) => (
            <label key={label}>{label}<i className={index === 1 ? "on" : ""} /></label>
          ))}
        </main>
      </div>
    );
  }

  if (template === "checkout") {
    return (
      <div className="layout-scene layout-checkout-scene">
        <main><strong>Shipping details</strong><input placeholder="Name" /><input placeholder="Address" /><button>Continue</button></main>
        <aside><span>Order summary</span><b>$168</b><em>2 items</em></aside>
      </div>
    );
  }

  if (template === "three" || template === "split") {
    return (
      <div className="layout-scene layout-three-scene">
        <aside><strong>文件</strong><span>页面一</span><span>页面二</span></aside>
        <main><strong>编辑区</strong><p /><p /><button>保存</button></main>
        <section><strong>属性</strong><span>宽度 1200</span><span>颜色 #111</span></section>
      </div>
    );
  }

  if (template === "wizard") {
    return (
      <div className="layout-scene layout-wizard-scene">
        <div className="layout-steps"><b>1 资料</b><b>2 验证</b><b>3 完成</b></div>
        <main><strong>填写资料</strong><input placeholder="邮箱" /><input placeholder="公司" /><button>下一步</button></main>
      </div>
    );
  }

  if (template === "modal") {
    return (
      <div className="layout-scene layout-modal-scene">
        <div className="layout-page-dim"><span /><span /><span /></div>
        <main><strong>编辑资料</strong><input placeholder="标题" /><button>保存</button></main>
      </div>
    );
  }

  if (template === "landing") {
    return (
      <div className="layout-scene layout-landing-scene">
        <main><span>uiux.wiki</span><strong>看懂界面语言</strong><button>开始浏览</button></main>
        <aside><i /><i /><i /></aside>
      </div>
    );
  }

  if (template === "profile") {
    return (
      <div className="layout-scene layout-profile-scene">
        <aside><i /><strong>Alex Chen</strong><span>Product Designer</span></aside>
        <main><b>42 项作品</b><b>12k 关注</b><p /></main>
      </div>
    );
  }

  if (template === "searchResults") {
    return (
      <div className="layout-scene layout-search-scene">
        <header><Search size={16} /><span>搜索组件</span></header>
        <aside><b>筛选</b><label><input type="checkbox" defaultChecked /> 组件</label><label><input type="checkbox" /> 场景</label></aside>
        <main>{["按钮", "搜索框", "筛选面板"].map((item) => <article key={item}><strong>{item}</strong><span>匹配结果</span></article>)}</main>
      </div>
    );
  }

  if (template === "detail") {
    return (
      <div className="layout-scene layout-detail-scene">
        <aside><i /></aside>
        <main><strong>商品详情</strong><p>介绍、参数、评价与操作。</p><button>加入购物车</button></main>
      </div>
    );
  }

  return (
    <div className="layout-scene layout-article-scene">
      <article>
        <span>指南</span>
        <strong>单列阅读页面</strong>
        <p>标题、正文、插图和行动按钮按自然阅读顺序向下排列。</p>
        <button>继续阅读</button>
      </article>
    </div>
  );
}

function StyleLivePreview({ selected, variant = "" }) {
  const variantClass = getVariantPreviewClass(variant, getVariantIndex(selected, variant));
  const text = getPreviewSearchText(selected);
  const isStateStyle = selected.preview === "style-state";
  const isPlatformStyle = selected.preview === "style-platform";

  if (isStateStyle || isPlatformStyle) {
    const platformKind =
      /rtl/.test(text) ? "rtl" :
      /safe area/.test(text) ? "safe" :
      /scrollbar/.test(text) ? "scrollbar" :
      /cursor/.test(text) ? "cursor" :
      /print/.test(text) ? "print" :
      "platform";
    return (
      <div className={`live-style-demo semantic-style ${selected.preview} style-${platformKind} ${variantClass}`}>
        {isStateStyle ? (
          <>
            <article><span>Default</span><button type="button">Action</button></article>
            <article><span>{selected.english}</span><button type="button" disabled={/disabled/.test(text)} className={/pressed|selected/.test(text) ? "active" : ""}>Action</button></article>
          </>
        ) : (
          <>
            {platformKind === "rtl" && <article dir="rtl"><span>RTL</span><strong>Settings to Billing</strong><button type="button">Save</button></article>}
            {platformKind === "safe" && <article className="safe-area-card"><header>Safe top</header><main>Content</main><footer>Home indicator</footer></article>}
            {platformKind === "scrollbar" && <article className="scrollbar-card"><strong>Scrollable area</strong><p /><p /><p /><i /></article>}
            {platformKind === "cursor" && <article className="cursor-card"><MousePointer2 size={24} /><strong>Pointer target</strong><button type="button">Hover</button></article>}
            {platformKind === "print" && <article className="print-card"><strong>Invoice</strong><p /><p /><span>Page 1 / 2</span></article>}
            {platformKind === "platform" && <article><span>{selected.title}</span><strong>{variant || selected.summary}</strong><button type="button">Preview</button></article>}
            <article><span>Fallback</span><strong>{variant || selected.variants[0] || "Responsive"}</strong><button type="button">Compare</button></article>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`live-style-demo ${selected.preview} ${variantClass}`}>
      <article>
        <span>{selected.title}</span>
        <strong>{variant || selected.summary}</strong>
        <button type="button">查看效果</button>
      </article>
      <article>
        <span>对比</span>
        <strong>{variant || selected.variants[0] || "标准"}</strong>
        <button type="button">切换</button>
      </article>
    </div>
  );
}

function MotionLivePreview({ selected, variant = "" }) {
  const type = selected.preview || "motion-fade";
  const label = variant || selected.title;
  const variantClass = getVariantPreviewClass(variant, getVariantIndex(selected, variant));
  let scene;

  if (type === "motion-haptic") {
    scene = (
      <div className="motion-scene motion-scene-haptic">
        <button type="button">Press</button>
        <i /><i /><i />
      </div>
    );
  } else if (type === "motion-number") {
    scene = (
      <div className="motion-scene motion-scene-number">
        <strong>12,480</strong>
        <span>+18%</span>
      </div>
    );
  } else if (type === "motion-stagger") {
    scene = (
      <div className="motion-scene motion-scene-stagger">
        <i /><i /><i /><i />
      </div>
    );
  } else if (type === "motion-spring") {
    scene = (
      <div className="motion-scene motion-scene-spring">
        <b /><b /><span>spring</span>
      </div>
    );
  } else if (type === "motion-overlay") {
    scene = (
      <div className="motion-scene motion-scene-overlay">
        <main><i /><i /></main>
        <section><strong>{label}</strong><button>Done</button></section>
      </div>
    );
  } else if (type === "motion-menu") {
    scene = (
      <div className="motion-scene motion-scene-menu">
        <button>Open</button>
        <nav><span>Rename</span><span>Share</span><span>Delete</span></nav>
      </div>
    );
  } else if (type === "motion-tabs") {
    scene = (
      <div className="motion-scene motion-scene-tabs">
        <nav><b className="active">One</b><b>Two</b><b>Three</b></nav>
        <i />
      </div>
    );
  } else if (type === "motion-pull-refresh") {
    scene = (
      <div className="motion-scene motion-scene-refresh">
        <b>Pull</b>
        <i />
        <span>Release to refresh</span>
      </div>
    );
  } else if (type === "motion-chart") {
    scene = (
      <div className="motion-scene motion-scene-chart">
        {[35, 68, 48, 82, 56].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
      </div>
    );
  } else if (type === "motion-loading") {
    scene = (
      <div className="motion-scene motion-scene-loading">
        <i />
        <b />
        <b />
        <span />
      </div>
    );
  } else if (type === "motion-success" || type === "motion-error" || type === "motion-attention") {
    scene = (
      <div className={`motion-scene motion-scene-feedback ${type}`}>
        <strong>{type === "motion-error" ? "!" : type === "motion-attention" ? "i" : "✓"}</strong>
        <span>{type === "motion-error" ? "Retry" : type === "motion-attention" ? "Notice" : "Done"}</span>
      </div>
    );
  } else if (type === "motion-slide" || type === "motion-page") {
    scene = (
      <div className="motion-scene motion-scene-slide">
        <aside><b /><b /></aside>
        <main><strong>{label}</strong><i /><i /></main>
      </div>
    );
  } else if (type === "motion-press" || type === "motion-scale" || type === "motion-hover") {
    scene = (
      <div className="motion-scene motion-scene-press">
        <button type="button">{label}</button>
        <span />
      </div>
    );
  } else if (type === "motion-expand") {
    scene = (
      <div className="motion-scene motion-scene-expand">
        <header><strong>{label}</strong><i /></header>
        <p />
        <p />
      </div>
    );
  } else if (type === "motion-list") {
    scene = (
      <div className="motion-scene motion-scene-list">
        <i />
        <i className="active" />
        <i />
      </div>
    );
  } else if (type === "motion-drag") {
    scene = (
      <div className="motion-scene motion-scene-drag">
        <b />
        <span />
      </div>
    );
  } else if (type === "motion-spatial") {
    scene = (
      <div className="motion-scene motion-scene-spatial">
        <i />
        <b />
        <i />
      </div>
    );
  } else if (type === "motion-reduced") {
    scene = (
      <div className="motion-scene motion-scene-reduced">
        <strong>Reduced</strong>
        <span />
      </div>
    );
  } else {
    scene = (
      <div className="motion-scene motion-scene-fade">
        <section />
        <section />
      </div>
    );
  }

  return (
    <div className={`live-motion-demo ${type} ${variantClass}`}>
      {scene}
      <p>{selected.plain}</p>
    </div>
  );
}

function PatternLivePreview({ selected, variant = "" }) {
  const config = {
    "pattern-filter": {
      title: "Filter results",
      scene: "filter",
      checks: ["Available", "Promotion", "Top rated"],
      action: "Apply",
    },
    "pattern-signup": {
      title: "Create account",
      scene: "signup",
      fields: ["Email", "Code", "Password"],
      action: "Sign up",
      steps: ["Profile", "Verify", "Done"],
    },
    "pattern-sort": {
      title: "Sort results",
      scene: "sort",
      chips: ["Newest", "Price", "Rating"],
      action: "Apply sort",
    },
    "pattern-settings": {
      title: "Preferences",
      scene: "settings",
      checks: ["Notifications", "Autosave", "Reduced motion"],
      action: "Save",
    },
    "pattern-error": {
      title: "Recover error",
      scene: "error",
      fields: ["Check the current content and retry."],
      action: "Retry",
      danger: true,
    },
    "login-pattern": {
      title: "登录账号",
      scene: "auth",
      fields: ["邮箱", "密码"],
      action: "登录",
      meta: "忘记密码?",
    },
    "pattern-login": {
      title: "登录账号",
      scene: "auth",
      fields: ["邮箱", "密码"],
      action: "登录",
      meta: "忘记密码?",
    },
    "search-pattern": {
      title: "搜索结果",
      scene: "search",
      fields: ["搜索 UI 关键词"],
      action: "搜索",
      chips: ["组件", "场景", "词典"],
    },
    "pattern-search": {
      title: "搜索结果",
      scene: "search",
      fields: ["搜索 UI 关键词"],
      action: "搜索",
      chips: ["组件", "场景", "词典"],
    },
    "filter-pattern": {
      title: "筛选商品",
      scene: "filter",
      checks: ["可用", "促销", "高评分"],
      action: "应用筛选",
    },
    "upload-pattern": {
      title: "上传文件",
      scene: "upload",
      fields: ["拖拽或选择文件"],
      action: "上传",
      progress: true,
    },
    "pattern-upload": {
      title: "上传文件",
      scene: "upload",
      fields: ["拖拽或选择文件"],
      action: "上传",
      progress: true,
    },
    import: {
      title: "Import data",
      scene: "upload",
      fields: ["CSV, XLSX, JSON"],
      action: "Import",
      progress: true,
    },
    export: {
      title: "Export table",
      scene: "operation",
      rows: ["Filtered rows", "CSV", "Ready"],
      action: "Export",
    },
    download: {
      title: "Download file",
      scene: "operation",
      rows: ["Report.pdf", "Ready", "Signed URL"],
      action: "Download",
    },
    "checkout-pattern": {
      title: "确认订单",
      scene: "checkout",
      rows: ["UI 模板包 ¥129", "图标资源 ¥39"],
      action: "支付",
    },
    "pattern-checkout": {
      title: "确认订单",
      scene: "checkout",
      rows: ["UI 模板包 ¥129", "图标资源 ¥39"],
      action: "支付",
    },
    "delete-confirmation": {
      title: "删除文件?",
      scene: "delete",
      fields: ["此操作无法撤销"],
      action: "确认删除",
      danger: true,
    },
    "pattern-delete": {
      title: "确认操作?",
      scene: "delete",
      fields: ["此操作需要确认后才能继续"],
      action: "确认",
      danger: true,
    },
    "signup-pattern": {
      title: "创建账号",
      scene: "signup",
      fields: ["邮箱", "验证码", "密码"],
      action: "注册",
      steps: ["资料", "验证", "完成"],
    },
    "sort-pattern": {
      title: "排序方式",
      scene: "sort",
      chips: ["最新", "价格", "评分"],
      action: "应用排序",
    },
    "onboarding-pattern": {
      title: "新手引导",
      scene: "onboarding",
      steps: ["欢迎", "选择目标", "开始使用"],
      action: "下一步",
    },
    "settings-pattern": {
      title: "偏好设置",
      scene: "settings",
      checks: ["通知", "自动保存", "减少动效"],
      action: "保存设置",
    },
    "form-fill-pattern": {
      title: "填写资料",
      scene: "form",
      fields: ["姓名", "电话", "备注"],
      action: "提交",
    },
    "pattern-form": {
      title: "处理信息",
      scene: "form",
      fields: ["主要输入", "补充说明", "状态反馈"],
      action: "继续",
    },
    "pattern-operation": {
      title: "Record operation",
      scene: "operation",
      rows: ["Draft", "Published", "Archived"],
      action: "Apply",
    },
    "leave-confirmation": {
      title: "Leave page?",
      scene: "confirm",
      fields: ["Unsaved edits will be kept as a draft."],
      action: "Leave",
    },
    "terms-acceptance": {
      title: "Accept terms",
      scene: "confirm",
      fields: ["Review terms and confirm before continuing."],
      action: "Accept",
    },
    "delete-account": {
      title: "Delete account",
      scene: "account-security",
      fields: ["Type DELETE to confirm account removal."],
      action: "Delete account",
      danger: true,
    },
    "device-management": {
      title: "Device management",
      scene: "account-security",
      rows: ["MacBook Pro", "iPhone", "Windows PC"],
      action: "Revoke device",
    },
    "api-key-management": {
      title: "API key management",
      scene: "account-security",
      rows: ["sk-live-24...", "Read only", "Last used today"],
      action: "Rotate key",
    },
    "edit-profile": {
      title: "Edit profile",
      scene: "profile-form",
      fields: ["Display name", "Role", "Bio"],
      action: "Save profile",
    },
    "view-product-detail": {
      title: "Product detail",
      scene: "product-detail",
      rows: ["Wireless Kit", "$168", "In stock"],
      action: "Add to cart",
    },
    "patterns-column-visibility": {
      title: "Column visibility",
      scene: "table-control",
      checks: ["Name", "Status", "Updated"],
      action: "Apply columns",
    },
    "bulk-selection": {
      title: "Bulk selection",
      scene: "table-control",
      checks: ["Row 1", "Row 2", "Row 3"],
      action: "Apply to selected",
    },
    "order-tracking": {
      title: "Order tracking",
      scene: "tracking",
      rows: ["Paid", "Packed", "Out for delivery"],
      action: "Track order",
    },
    "view-faq": {
      title: "FAQ",
      scene: "help",
      rows: ["Shipping", "Returns", "Account"],
      action: "Open article",
    },
    "contact-support": {
      title: "Contact support",
      scene: "help",
      rows: ["Subject", "Priority", "Message"],
      action: "Send message",
    },
    "view-ticket": {
      title: "View ticket",
      scene: "help",
      rows: ["Ticket #2048", "In progress", "Last reply today"],
      action: "Reply",
    },
    "release-notes": {
      title: "Release notes",
      scene: "help",
      rows: ["Version 2.4", "New components", "Fixed previews"],
      action: "Read notes",
    },
    archive: {
      title: "Archive item",
      scene: "operation",
      rows: ["Selected item", "Active", "Will be archived"],
      action: "Archive",
    },
    restore: {
      title: "Restore item",
      scene: "operation",
      rows: ["Archived item", "Hidden", "Ready to restore"],
      action: "Restore",
    },
    publish: {
      title: "Publish draft",
      scene: "operation",
      rows: ["Draft", "Review passed", "Audience ready"],
      action: "Publish",
    },
    "prevent-duplicate-submit": {
      title: "Prevent duplicate submit",
      scene: "operation",
      rows: ["Submit locked", "Request pending", "Retry disabled"],
      action: "Submitting...",
    },
    "save-draft": {
      title: "Save draft",
      scene: "operation",
      rows: ["Draft content", "Unsaved changes", "Local copy ready"],
      action: "Save draft",
    },
    autosave: {
      title: "Autosave",
      scene: "operation",
      rows: ["Editing", "Saving...", "Saved 2s ago"],
      action: "Autosave on",
    },
    submitting: {
      title: "Submitting",
      scene: "operation",
      rows: ["Form locked", "Request pending", "Please wait"],
      action: "Submitting...",
    },
    "submit-success": {
      title: "Submit success",
      scene: "operation",
      rows: ["Request sent", "Server accepted", "Confirmation ready"],
      action: "View result",
    },
    "submit-failure": {
      title: "Submit failure",
      scene: "error",
      fields: ["Submission failed. Check errors and retry."],
      action: "Retry submit",
      danger: true,
    },
    "submit-feedback": {
      title: "Submit feedback",
      scene: "form",
      fields: ["Feedback", "Category", "Contact email"],
      action: "Submit feedback",
    },
    "submit-ticket": {
      title: "Submit ticket",
      scene: "form",
      fields: ["Subject", "Priority", "Description"],
      action: "Submit ticket",
    },
    "pattern-collaboration": {
      title: "Team workflow",
      scene: "collaboration",
      rows: ["Owner", "Reviewer", "Mention"],
      action: "Assign",
    },
    "pattern-feedback": {
      title: "Feedback center",
      scene: "feedback",
      rows: ["Success", "Warning", "Offline"],
      action: "Review",
    },
    "pattern-ai": {
      title: "AI workflow",
      scene: "ai",
      rows: ["Prompt", "Draft", "Review"],
      action: "Apply",
    },
    "pattern-media": {
      title: "Media review",
      scene: "media",
      rows: ["Preview", "Crop", "Rename"],
      action: "Open",
    },
    "pattern-mobile": {
      title: "Mobile flow",
      scene: "mobile",
      action: "Continue",
    },
    "pattern-onboarding": {
      title: "新手引导",
      scene: "onboarding",
      steps: ["欢迎", "选择目标", "开始使用"],
      action: "下一步",
    },
    "error-message-pattern": {
      title: "输入有误",
      scene: "error",
      fields: ["邮箱格式不正确"],
      action: "重新填写",
      danger: true,
    },
  };
  const specificKind = getSpecificPreviewKind(selected);
  if (specificKind) {
    return (
      <div className={`live-pattern-demo detailed-pattern specific-pattern ${selected.preview} ${getVariantPreviewClass(variant, getVariantIndex(selected, variant))}`}>
        <SpecificLivePreview selected={selected} kind={specificKind} variantClass={getVariantPreviewClass(variant, getVariantIndex(selected, variant))} />
      </div>
    );
  }
  const data = config[selected.id] || config[selected.preview] || { title: selected.title, fields: ["示例输入"], action: "继续" };

  return (
    <div className={`live-pattern-demo detailed-pattern ${selected.preview} ${getVariantPreviewClass(variant, getVariantIndex(selected, variant))}`}>
      <PatternScene data={data} selected={selected} />
    </div>
  );
}

function PatternScene({ data, selected }) {
  if (data.scene === "search" || data.scene === "sort") {
    return (
      <div className="pattern-panel pattern-search-scene">
        <header className="pattern-search-bar">
          <Search size={18} />
          <input aria-label="搜索关键词" readOnly value={data.scene === "sort" ? "组件资源" : "UI 关键词"} />
          <button type="button">{data.action}</button>
        </header>
        <div className="pattern-chips">{(data.chips || ["最新", "价格", "评分"]).map((chip, index) => <b key={chip} className={`pattern-chip ${index === 0 ? "active" : ""}`}>{chip}</b>)}</div>
        <main>{["按钮 Button", "搜索框 Search", "筛选 Filter"].map((row, index) => <article key={row}><strong>{row}</strong><span>{selected.summary}</span><em>{index === 0 ? "高度匹配" : "相关结果"}</em></article>)}</main>
      </div>
    );
  }

  if (data.scene === "filter") {
    return (
      <div className="pattern-panel pattern-filter-scene">
        <aside>
          <strong>筛选</strong>
          {data.checks.map((check, index) => <label key={check}><input type="checkbox" defaultChecked={index === 0} /> {check}</label>)}
          <button>{data.action}</button>
        </aside>
        <main>{["模板", "图标", "页面"].map((item) => <article key={item}><i /><strong>{item}</strong><span>¥{item === "模板" ? "129" : "39"}</span></article>)}</main>
      </div>
    );
  }

  if (data.scene === "upload") {
    return (
      <div className="pattern-panel pattern-upload-scene">
        <div className="upload-drop"><ArrowUp size={24} /><strong>{data.title}</strong><span>{data.fields?.[0] || "PNG, PDF, ZIP"}</span></div>
        <article><span>{data.action === "Import" ? "customers.csv" : "design-system.zip"}</span><b>62%</b></article>
        <div className="live-progress-bar"><i /></div>
        <button>{data.action}</button>
      </div>
    );
  }

  if (data.scene === "checkout") {
    return (
      <div className="pattern-panel pattern-checkout-scene">
        <main>{data.rows.map((row) => <span key={row}>{row}</span>)}<strong>合计 ¥168</strong></main>
        <aside><b>支付方式</b><label><input type="radio" defaultChecked /> 微信支付</label><label><input type="radio" /> 银行卡</label><button>{data.action}</button></aside>
      </div>
    );
  }

  if (data.scene === "delete" || data.scene === "error") {
    return (
      <div className={`pattern-panel pattern-danger-scene ${data.scene}`}>
        <div className="pattern-file-list"><span>报告.pdf</span><span>草稿.doc</span><span>截图.png</span></div>
        <section>
          <strong>{data.title}</strong>
          <p>{data.fields[0]}</p>
          <div><button>取消</button><button className="danger">{data.action}</button></div>
        </section>
      </div>
    );
  }

  if (data.scene === "confirm") {
    return (
      <div className="pattern-panel pattern-confirm-scene">
        <main><strong>{data.title}</strong><p>{data.fields?.[0]}</p></main>
        <footer><button type="button">Cancel</button><button type="button">{data.action}</button></footer>
      </div>
    );
  }

  if (data.scene === "account-security") {
    return (
      <div className="pattern-panel pattern-security-scene">
        <header><strong>{data.title}</strong><button type="button" className={data.danger ? "danger" : ""}>{data.action}</button></header>
        <section>
          {(data.rows || data.fields || ["Primary device", "Recovery key", "Last active"]).map((row, index) => (
            <article key={row} className={index === 0 ? "active" : ""}><SquareCheck size={16} /><span>{row}</span><b /></article>
          ))}
        </section>
      </div>
    );
  }

  if (data.scene === "profile-form") {
    return (
      <div className="pattern-panel pattern-profile-form-scene">
        <aside><b>AL</b><button type="button">Replace photo</button></aside>
        <main>{data.fields.map((field) => <label key={field}>{field}<input readOnly value={field === "Display name" ? "Alex Lee" : ""} /></label>)}<button>{data.action}</button></main>
      </div>
    );
  }

  if (data.scene === "product-detail") {
    return (
      <div className="pattern-panel pattern-product-detail-scene">
        <aside><i /><nav><b /><b /><b /></nav></aside>
        <main>{data.rows.map((row) => <span key={row}>{row}</span>)}<button>{data.action}</button></main>
      </div>
    );
  }

  if (data.scene === "table-control") {
    return (
      <div className="pattern-panel pattern-table-control-scene">
        <header><strong>{data.title}</strong><button>{data.action}</button></header>
        <section>{(data.checks || ["Name", "Status", "Updated"]).map((check, index) => <label key={check}><input type="checkbox" defaultChecked={index < 2} /> {check}</label>)}</section>
        <main><b>Name</b><b>Status</b><b>Updated</b><span>Selected row</span><span>Ready</span><span>Today</span></main>
      </div>
    );
  }

  if (data.scene === "tracking") {
    return (
      <div className="pattern-panel pattern-tracking-scene">
        <strong>{data.title}</strong>
        <ol>{data.rows.map((row, index) => <li key={row} className={index < 2 ? "done" : "active"}>{row}</li>)}</ol>
        <button>{data.action}</button>
      </div>
    );
  }

  if (data.scene === "help") {
    return (
      <div className="pattern-panel pattern-help-scene">
        <aside>{data.rows.map((row, index) => <button key={row} className={index === 0 ? "active" : ""}>{row}</button>)}</aside>
        <main><strong>{data.title}</strong><p>{selected.summary}</p><button>{data.action}</button></main>
      </div>
    );
  }

  if (data.scene === "operation") {
    return (
      <div className="pattern-panel pattern-operation-scene">
        <aside>
          {(data.rows || ["Draft", "Published", "Archived"]).map((row, index) => (
            <button key={row} type="button" className={index === 1 ? "active" : ""}>{row}</button>
          ))}
        </aside>
        <main>
          <strong>{selected.title}</strong>
          <p>{selected.summary}</p>
          <footer>
            <button type="button">Cancel</button>
            <button type="button">{data.action}</button>
          </footer>
        </main>
      </div>
    );
  }

  if (data.scene === "collaboration") {
    return (
      <div className="pattern-panel pattern-collaboration-scene">
        <header>
          <strong>{selected.title}</strong>
          <button type="button">{data.action}</button>
        </header>
        <section>
          {(data.rows || ["Owner", "Reviewer", "Mention"]).map((row, index) => (
            <article key={row} className={index === 1 ? "active" : ""}>
              <i />
              <span>{row}</span>
              <b />
            </article>
          ))}
        </section>
        <footer><span /> <span /> <span /></footer>
      </div>
    );
  }

  if (data.scene === "feedback") {
    return (
      <div className="pattern-panel pattern-feedback-scene">
        <strong>{selected.title}</strong>
        {(data.rows || ["Success", "Warning", "Offline"]).map((row, index) => (
          <article key={row} className={index === 1 ? "warn" : index === 2 ? "muted" : "ok"}>
            <b />
            <span>{row}</span>
            <button type="button">{index === 2 ? "Retry" : data.action}</button>
          </article>
        ))}
      </div>
    );
  }

  if (data.scene === "ai") {
    return (
      <div className="pattern-panel pattern-ai-scene">
        <header><Sparkles size={18} /><strong>{selected.title}</strong></header>
        <main>
          {(data.rows || ["Prompt", "Draft", "Review"]).map((row, index) => (
            <article key={row} className={index === 1 ? "active" : ""}>
              <span>{row}</span>
              <b />
            </article>
          ))}
        </main>
        <button type="button">{data.action}</button>
      </div>
    );
  }

  if (data.scene === "media") {
    return (
      <div className="pattern-panel pattern-media-scene">
        <section><Play size={22} fill="currentColor" /><span /></section>
        <aside>
          {(data.rows || ["Preview", "Crop", "Rename"]).map((row, index) => (
            <button key={row} type="button" className={index === 0 ? "active" : ""}>{row}</button>
          ))}
        </aside>
      </div>
    );
  }

  if (data.scene === "mobile") {
    return (
      <div className="pattern-panel pattern-mobile-scene">
        <MobilePreview type={getMobilePreviewType(selected)} />
        <section>
          <strong>{selected.title}</strong>
          <p>{selected.summary}</p>
          <button type="button">{data.action}</button>
        </section>
      </div>
    );
  }

  if (data.scene === "onboarding") {
    return (
      <div className="pattern-panel pattern-onboarding-scene">
        <div className="pattern-steps">{data.steps.map((step, index) => <b key={step} className={index === 0 ? "active" : ""}>{step}</b>)}</div>
        <main><strong>先选择你的目标</strong><p>快速理解组件、布局和场景。</p><button>{data.action}</button></main>
      </div>
    );
  }

  if (data.scene === "settings") {
    return (
      <div className="pattern-panel pattern-settings-scene">
        <strong>{data.title}</strong>
        {data.checks.map((check, index) => <label key={check}>{check}<i className={index === 1 ? "on" : ""} /></label>)}
        <button>{data.action}</button>
      </div>
    );
  }

  const formFields = data.fields || ["邮箱", "密码"];

  return (
    <div className={`pattern-panel pattern-form-scene ${data.scene}`}>
      {data.steps && <div className="pattern-steps">{data.steps.map((step, index) => <b key={step} className={index === 0 ? "active" : ""}>{step}</b>)}</div>}
      <header><strong>{data.title}</strong><span>{selected.summary}</span></header>
      {formFields.map((field) => <input key={field} placeholder={field} type={field.includes("密码") ? "password" : "text"} />)}
      {data.meta && <small>{data.meta}</small>}
      <button>{data.action}</button>
    </div>
  );
}

function PlaygroundButton({ playground }) {
  const loading = playground.state === "loading";
  const disabled = playground.state === "disabled" || loading;
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "demo-button",
        `demo-${playground.style}`,
        `demo-radius-${playground.radius}`,
        loading ? "is-loading" : "",
      ].join(" ")}
    >
      {loading && <span className="spinner-dot" aria-hidden="true" />}
      {playground.style === "text" ? "文字按钮" : "主要按钮"}
    </button>
  );
}

function PlaygroundControls({ playground, setPlayground }) {
  return (
    <div className="control-stack">
      <SegmentedControl
        label="样式"
        value={playground.style}
        options={styleLabels}
        onChange={(style) => setPlayground((current) => ({ ...current, style }))}
      />
      <SegmentedControl
        label="状态"
        value={playground.state}
        options={stateLabels}
        onChange={(state) => setPlayground((current) => ({ ...current, state }))}
      />
      <SegmentedControl
        label="圆角"
        value={playground.radius}
        options={radiusLabels}
        onChange={(radius) => setPlayground((current) => ({ ...current, radius }))}
      />
    </div>
  );
}

function VariantOverview({ selected, value, onChange }) {
  const variants = getVariantOptions(selected);
  const activeValue = variants.includes(value) ? value : variants[0];

  return (
    <div className="generic-controls">
      {variants.map((variant) => (
        <button
          key={variant}
          type="button"
          className={variant === activeValue ? "active" : ""}
          aria-pressed={variant === activeValue}
          onClick={() => onChange(variant)}
        >
          {variant}
        </button>
      ))}
    </div>
  );
}

function PreviewContext({ selected, deviceMode = "desktop" }) {
  const mobileRows = deviceMode === "mobile"
    ? [
        ["移动端策略", ["触控热区至少 44px", "hover 信息改为点击或长按", "复杂浮层优先 Bottom Sheet"]],
      ]
    : [];
  const rows = [
    ...mobileRows,
    ["常见状态", selected.states],
    ["常见用途", selected.useCases],
    ["相关条目", selected.related.map((id) => findItem(id).title)],
  ].filter(([, values]) => values.length > 0);

  if (rows.length === 0) return null;

  return (
    <div className="preview-context">
      {rows.slice(0, 3).map(([label, values]) => (
        <div key={label}>
          <span>{label}</span>
          <p>{values.slice(0, 4).join(" / ")}</p>
        </div>
      ))}
    </div>
  );
}

function SegmentedControl({ label, value, options, onChange }) {
  return (
    <div className="segmented-row">
      <span>{label}</span>
      <div className="segmented-control">
        {Object.entries(options).map(([key, optionLabel]) => (
          <button
            key={key}
            type="button"
            className={value === key ? "active" : ""}
            onClick={() => onChange(key)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoGrid({ selected }) {
  const blocks = [
    ["常见用途", selected.useCases],
    ["常见变体", selected.variants],
    ["状态", selected.states],
    ["不要这样用", selected.dont],
    ["无障碍提醒", selected.accessibility],
  ].filter(([, values]) => values.length > 0);

  return (
    <div className="info-grid">
      {blocks.slice(0, 5).map(([label, values]) => (
        <div key={label}>
          <h3>{label}</h3>
          <ul>
            {values.slice(0, 4).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Comparison({ selected }) {
  const comparison = selected.comparison || {
    left: selected.title,
    right: findItem(selected.related[0] || "button").title,
    note: "先看它解决的问题，再判断是否需要换成相似 UI。",
  };

  return (
    <div className="comparison-row">
      <div>
        <strong>{comparison.left}</strong>
        <span>{selected.summary}</span>
      </div>
      <span className="versus">vs</span>
      <div>
        <strong>{comparison.right}</strong>
        <span>{comparison.note}</span>
      </div>
      <ChevronRight size={22} strokeWidth={1.7} />
    </div>
  );
}

function ExploreSection({ activeSection, onSection, onChoose }) {
  const grouped = sections.map((section) => ({
    ...section,
    items: uiItems.filter((entry) => entry.category === section.id),
  }));

  return (
    <section className="explore-section" aria-labelledby="explore-title">
      <div className="section-heading">
        <h2 id="explore-title">完整图鉴</h2>
        <p>所有栏目都可以搜索、收藏和打开详情。</p>
      </div>
      <div className="section-board">
        {grouped.map((section) => (
          <article key={section.id} className={activeSection === section.id ? "current" : ""}>
            <button type="button" className="board-title" onClick={() => onSection(section.id)}>
              <span>{section.label}</span>
              <small>{section.items.length}</small>
              <ChevronRight size={18} />
            </button>
            <p>{categoryDescriptions[section.id]}</p>
            <div className="board-links">
              {section.items.map((entry) => (
                <button key={entry.id} type="button" onClick={() => onChoose(entry)}>
                  {entry.title}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="qa-strip">
        {[
          ["Toast / Alert / Modal", "轻提示、警告和弹窗的打断程度不同。"],
          ["按钮 / 链接", "动作和跳转不要混用。"],
          ["卡片 / 列表 / 表格", "看对象、看连续内容、看数据对比。"],
        ].map(([title, text]) => (
          <div key={title}>
            <CornerDownRight size={18} />
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileMiniPreview({ type }) {
  if (type === "scanner") return <span className="mini-mobile-kind mini-mobile-scanner"><b /><b /><b /><b /></span>;
  if (type === "media") return <span className="mini-mobile-kind mini-mobile-media"><Play size={15} fill="currentColor" /><b /></span>;
  if (type === "picker") return <span className="mini-mobile-kind mini-mobile-picker">{Array.from({ length: 9 }).map((_, index) => <b key={index} />)}</span>;
  if (type === "stepper") return <span className="mini-mobile-kind mini-mobile-stepper"><b>-</b><span>2</span><b>+</b></span>;
  if (type === "empty") return <span className="mini-mobile-kind mini-mobile-empty"><CircleHelp size={16} /><b /></span>;
  if (type === "otp") return <span className="mini-mobile-kind mini-mobile-otp"><b /><b /><b /><b /></span>;
  if (type === "search") return <span className="mini-mobile-kind mini-mobile-search"><Search size={14} /><b /></span>;
  if (type === "sheet" || type === "actions") return <span className="mini-mobile-kind mini-mobile-sheet"><i /><b /><b /></span>;
  if (type === "swipe" || type === "refresh") return <span className="mini-mobile-kind mini-mobile-gesture"><i /><b /><b /></span>;
  if (type === "toast") return <span className="mini-mobile-kind mini-mobile-toast"><Check size={14} /><b /></span>;
  if (type === "browser") return <span className="mini-mobile-kind mini-mobile-browser"><i /><b /><b /></span>;
  if (type === "input") return <span className="mini-mobile-kind mini-mobile-input"><span>Label</span><b /><span>Value</span><b /></span>;
  if (type === "banner") return <span className="mini-mobile-kind mini-mobile-banner"><i /><b /><b /></span>;
  if (type === "permission") return <span className="mini-mobile-kind mini-mobile-permission"><strong>Allow?</strong><b /><b /></span>;
  if (type === "loading") return <span className="mini-mobile-kind mini-mobile-loading"><b /><b /><b /></span>;
  if (type === "list") return <span className="mini-mobile-kind mini-mobile-list"><i /><b /><i /><b /></span>;
  if (type === "carousel") return <span className="mini-mobile-kind mini-mobile-carousel"><b /><b /><b /></span>;
  if (type === "map") return <span className="mini-mobile-kind mini-mobile-map"><i /><b /></span>;
  if (type === "product") return <span className="mini-mobile-kind mini-mobile-product"><i /><b /><b /></span>;
  if (type === "tabbar") return <span className="mini-mobile-kind mini-mobile-tabbar"><i /><b /><b /><b /></span>;
  return <span className="mini-mobile-kind mini-mobile-navbar"><i /><b /><b /></span>;
}

function A11yMiniPreview({ type }) {
  if (type === "a11y-name") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-name"><span>Label</span><b /></span>;
  if (type === "a11y-structure") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-structure"><em /><strong /><b /></span>;
  if (type === "a11y-announcement") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-announcement"><i /><b /><span>Live</span></span>;
  if (type === "a11y-contrast") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-contrast"><strong>AA</strong><b /><i /></span>;
  if (type === "a11y-motion") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-motion"><b /><span>off</span></span>;
  if (type === "a11y-target") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-target"><span>44</span><span>Tap</span></span>;
  if (type === "a11y-form") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-form"><span>Input</span><b /><i /></span>;
  if (type === "a11y-alt-text") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-alt"><i /><b>Alt</b><span /></span>;
  if (type === "a11y-testing") return <span className="mini-taxonomy mini-a11y-kind mini-a11y-testing"><b /><b /><b /></span>;
  return <span className="mini-taxonomy mini-taxonomy-a11y"><span>1</span><span>2</span><span>3</span></span>;
}

function I18nMiniPreview({ type }) {
  if (type === "i18n-locale") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-locale"><b>EN</b><i /><b>CN</b></span>;
  if (type === "i18n-translation") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-translation"><code>key</code><b /></span>;
  if (type === "i18n-plural") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-plural"><b>1</b><span>item</span><b>5</b></span>;
  if (type === "i18n-format") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-format"><span>日期</span><b>¥</b><i /></span>;
  if (type === "i18n-direction") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-direction"><b>LTR</b><i /><b>RTL</b></span>;
  if (type === "i18n-text") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-text"><b /><b /><b className="long" /></span>;
  if (type === "i18n-search") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-search"><Search size={14} /><b>A/Å</b></span>;
  if (type === "i18n-compliance") return <span className="mini-taxonomy mini-i18n-kind mini-i18n-compliance"><SquareCheck size={15} /><b>EU</b></span>;
  return <span className="mini-taxonomy mini-taxonomy-i18n"><b>zh</b><i /><b>RTL</b></span>;
}

function ReactMiniPreview({ entry }) {
  const mode = entry ? getReactPreviewMode(entry) : "surface";
  if (mode === "prompt") return <span className="mini-taxonomy mini-taxonomy-react mini-react-prompt"><b>Prompt</b><i /><b>Run</b></span>;
  if (mode === "context") return <span className="mini-taxonomy mini-taxonomy-react mini-react-context"><b>Src</b><i /><b>Ctx</b></span>;
  if (mode === "tool") return <span className="mini-taxonomy mini-taxonomy-react mini-react-tool"><b>Run</b><i /><b>Done</b></span>;
  if (mode === "feedback") return <span className="mini-taxonomy mini-taxonomy-react mini-react-feedback"><b>Good</b><i /><b>Fix</b></span>;
  if (mode === "ai") return <span className="mini-taxonomy mini-taxonomy-react mini-react-ai"><Sparkles size={13} /><b>Result</b></span>;
  if (mode === "filter") return <span className="mini-taxonomy mini-taxonomy-react mini-react-filter"><Search size={13} /><b>Filter</b></span>;
  if (mode === "list") return <span className="mini-taxonomy mini-taxonomy-react mini-react-list"><b>Row</b><i /><b>Detail</b></span>;
  if (mode === "control") return <span className="mini-taxonomy mini-taxonomy-react mini-react-control"><b>On</b><i /><b>64</b></span>;
  if (mode === "playground") return <span className="mini-taxonomy mini-taxonomy-react mini-react-playground"><b>Code</b><i /><b>UI</b></span>;
  if (mode === "state") return <span className="mini-taxonomy mini-taxonomy-react mini-react-state"><b>Load</b><i /><b>OK</b></span>;
  return <span className="mini-taxonomy mini-taxonomy-react mini-react-surface"><b>UI</b><i /><b>Slot</b></span>;
}

function MiniPreview({ type, large = false, entry = null }) {
  if (entry?.isGenerated) {
    return <GeneratedEntryMiniPreview entry={entry} large={large} />;
  }

  const safeTypeClass = String(type || "generic").replace(/[^a-z0-9_-]/gi, "-");
  const className = `mini-preview preview-${safeTypeClass} ${large ? "large" : ""}`;
  const specificKind = entry ? getSpecificPreviewKind(entry) : "";

  if (specificKind) {
    return <SpecificMiniPreview kind={specificKind} className={className} selected={entry} />;
  }

  if (type === "a11y" || type === "a11y-focus" || type.startsWith("a11y-")) {
    return <span className={className}><A11yMiniPreview type={getA11yPreviewKind(entry, type)} entry={entry} /></span>;
  }

  if (type === "i18n" || type.startsWith("i18n-")) {
    return <span className={className}><I18nMiniPreview type={getI18nPreviewKind(entry, type)} entry={entry} /></span>;
  }

  if (type === "mobile-preview") {
    return <span className={className}><MobileMiniPreview type={getMobilePreviewType(entry)} /></span>;
  }

  if (type === "status-indicator" && entry) {
    const statusKind = getStatusPreviewKind(entry, type);
    if (statusKind !== "status-indicator") return <MiniPreview type={statusKind} large={large} entry={entry} />;
  }

  if (type === "term-card" && entry) {
    const termKind = getTermPreviewKind(entry, type);
    if (termKind !== "term-card") return <MiniPreview type={termKind} large={large} entry={entry} />;
  }

  if (entry && type === "pattern-operation") {
    const action = getSemanticAction(entry);
    const ActionIcon = action.icon;
    return (
      <span className={className}>
        <span className={`pattern-mini-card pattern-mini-operation semantic ${action.kind}`}>
          <span className="pattern-mini-files"><span /><span /><span /></span>
          <span className="pattern-mini-dialog"><strong>{entry.english || entry.title}</strong><span /><span className="pattern-mini-button"><ActionIcon size={12} /> {action.label}</span></span>
        </span>
      </span>
    );
  }

  if (type.includes("layout")) return <LayoutPreview type={type} large={large} />;
  if (type.includes("style")) return <StylePreview type={type} large={large} />;
  if (type.includes("motion")) return <MotionPreview type={type} large={large} />;
  if (type.includes("pattern")) return <PatternPreview type={type} large={large} />;

  if (entry && type === "button") {
    const action = getSemanticAction(entry);
    const visual = getMiniButtonVisual(entry, action);
    const ActionIcon = visual.Icon;
    const buttonTone = (
      visual.role === "destructive" ? "danger" :
      visual.role === "submit" || visual.role === "confirm" ? "success" :
      visual.role === "outline" ? "outline" :
      visual.role === "ghost" ? "ghost" :
      visual.role === "tertiary" ? "tertiary" :
      visual.role === "secondary" || visual.role === "cancel" || visual.role === "back" ? "secondary" :
      "primary"
    );
    return (
      <span className={className}>
        <span className={`mini-standard-button mini-button-${visual.role} ${action.kind}`}>
          <span className={`button-mini-control ${buttonTone}`}>
            <ActionIcon size={13} style={visual.role === "back" ? { transform: "rotate(180deg)" } : undefined} />
            <span>{action.label}</span>
          </span>
        </span>
      </span>
    );
  }

  if (type === "otp-input") {
    return (
      <span className={className}>
        <span className="mini-otp-input"><b>6</b><b>2</b><b /><b /></span>
      </span>
    );
  }

  if (entry && ["menu", "dropdown", "select", "context-menu"].includes(type)) {
    const isDropdown = type === "dropdown" || type === "select";
    const options = isDropdown ? getSelectOptions(entry) : getMenuOptions(entry, isDropdown);
    return (
      <span className={className}>
        <span className="mini-context-menu">
          <strong>{entry.title}<ChevronRight size={13} /></strong>
          <em>{options.slice(0, 2).map((option) => <span key={option}>{option}</span>)}</em>
        </span>
      </span>
    );
  }

  if (entry && type === "form" && /filter|search|feedback|settings/.test(getPreviewSearchText(entry))) {
    const rows = getFormRows(entry);
    return (
      <span className={className}>
        <span className="mini-context-form"><strong>{entry.title}</strong>{rows.slice(0, 2).map((row) => <b key={row} />)}<i /></span>
      </span>
    );
  }

  if (entry && type === "file-action") {
    const action = getSemanticAction(entry);
    const ActionIcon = action.icon;
    return (
      <span className={className}>
        <span className="mini-file-action semantic"><b>{entry.title || action.label}</b><ActionIcon size={13} /><i /></span>
      </span>
    );
  }

  if (entry && type === "tag" && /filter/.test(getPreviewSearchText(entry))) {
    return (
      <span className={className}>
        <span className="mini-filter-chips"><b>Status ×</b><b>Owner ×</b></span>
      </span>
    );
  }

  switch (type) {
    case "button":
      return (
        <span className={className}>
          <span className="mini-solid">确定</span>
          <span className="mini-outline">取消</span>
          <span className="mini-text">更多</span>
        </span>
      );
    case "text":
      return (
        <span className={className}>
          <span className="mini-input">请输入内容 <X size={13} /></span>
        </span>
      );
    case "modal":
      return (
        <span className={className}>
          <span className="mini-modal">
            <strong>删除文件?</strong>
            <small>此操作无法撤销。</small>
            <em><b>取消</b><b>删除</b></em>
          </span>
        </span>
      );
    case "toast":
      return (
        <span className={className}>
          <span className="mini-toast"><Check size={14} /> 保存成功 <X size={13} /></span>
        </span>
      );
    case "tabs":
      return (
        <span className={className}>
          <span className="mini-tabs"><b>标签一</b><b>标签二</b><b>标签三</b></span>
        </span>
      );
    case "icon-button":
      return (
        <span className={className}>
          <span className="mini-icon-buttons"><i /><i /><i /></span>
        </span>
      );
    case "link":
      return (
        <span className={className}>
          <span className="mini-link-row">查看详情 <ChevronRight size={14} /></span>
        </span>
      );
    case "menu":
      return (
        <span className={className}>
          <span className="mini-menu">
            <i><b /><b /><b /></i>
            <em><span>编辑</span><span>复制</span><span>删除</span></em>
          </span>
        </span>
      );
    case "action-sheet":
      return (
        <span className={className}>
          <span className="mini-action-sheet">
            <i><b /><b /><b /></i>
            <em><span>分享</span><span>复制</span><span>删除</span></em>
          </span>
        </span>
      );
    case "dropdown":
    case "select":
      return (
        <span className={className}>
          <span className="mini-dropdown">
            <strong>最新优先 <ChevronRight size={13} /></strong>
            <em><span>价格</span><span>评分</span></em>
          </span>
        </span>
      );
    case "floating-action-button":
      return (
        <span className={className}>
          <span className="mini-fab">+</span>
        </span>
      );
    case "toolbar":
      return (
        <span className={className}>
          <span className="mini-toolbar"><b>B</b><b>I</b><b>↗</b><i /></span>
        </span>
      );
    case "command-palette":
      return (
        <span className={className}>
          <span className="mini-command"><strong>搜索命令</strong><b /><b /></span>
        </span>
      );
    case "textarea":
      return (
        <span className={className}>
          <span className="mini-textarea"><b /><b /><b /></span>
        </span>
      );
    case "search":
      return (
        <span className={className}>
          <span className="mini-search"><Search size={14} /><b>搜索关键词</b></span>
        </span>
      );
    case "password-field":
      return (
        <span className={className}>
          <span className="mini-password"><b>••••••••</b><i /></span>
        </span>
      );
    case "slider":
      return (
        <span className={className}>
          <span className="mini-slider"><i /><b /></span>
        </span>
      );
    case "switcher":
      return (
        <span className={className}>
          <span className="mini-switcher"><b>App</b><i /><b>Team</b></span>
        </span>
      );
    case "quantity-stepper":
      return (
        <span className={className}>
          <span className="mini-quantity-stepper"><b>-</b><span>2</span><b>+</b></span>
        </span>
      );
    case "date-picker":
    case "calendar":
      return (
        <span className={className}>
          <span className="mini-calendar">{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</span>
        </span>
      );
    case "file-upload":
      return (
        <span className={className}>
          <span className="mini-upload"><ArrowUp size={16} /><b>上传文件</b></span>
        </span>
      );
    case "file-preview":
      return (
        <span className={className}>
          <span className="mini-file-preview"><strong>PDF</strong><b /><b /></span>
        </span>
      );
    case "file-action":
      return (
        <span className={className}>
          <span className="mini-file-action"><b>file.pdf</b><i /><i /></span>
        </span>
      );
    case "autocomplete":
      return (
        <span className={className}>
          <span className="mini-autocomplete"><strong>北京</strong><em>北京市</em><em>北京南站</em></span>
        </span>
      );
    case "top-navigation":
      return (
        <span className={className}>
          <span className="mini-topnav"><b /><i /><i /><i /></span>
        </span>
      );
    case "sidebar":
      return (
        <span className={className}>
          <span className="mini-sidebar"><b /><i /><i /><i /></span>
        </span>
      );
    case "breadcrumb":
      return (
        <span className={className}>
          <span className="mini-breadcrumb"><b>首页</b><i /> <b>组件</b><i /> <b>菜单</b></span>
        </span>
      );
    case "pagination":
      return (
        <span className={className}>
          <span className="mini-pagination"><i /><b>1</b><i /><i /></span>
        </span>
      );
    case "stepper":
      return (
        <span className={className}>
          <span className="mini-stepper"><b>1</b><i /><b>2</b><i /><b>3</b></span>
        </span>
      );
    case "bottom-navigation":
      return (
        <span className={className}>
          <span className="mini-bottomnav"><b /><i /><i /><i /></span>
        </span>
      );
    case "back-button":
      return (
        <span className={className}>
          <span className="mini-back">← 返回</span>
        </span>
      );
    case "card":
      return (
        <span className={className}>
          <span className="mini-card"><i /><b /><b /><b /></span>
        </span>
      );
    case "skeleton":
      return (
        <span className={className}>
          <span className="mini-skeleton"><i /><b /><b /><b /></span>
        </span>
      );
    case "table":
      return (
        <span className={className}>
          <span className="mini-table">{Array.from({ length: 9 }).map((_, index) => <i key={index} />)}</span>
        </span>
      );
    case "badge":
      return (
        <span className={className}>
          <span className="mini-badge">消息 <b>3</b></span>
        </span>
      );
    case "switch":
      return (
        <span className={className}>
          <span className="mini-switch active"><i /></span>
          <span className="mini-switch"><i /></span>
        </span>
      );
    case "checkbox":
      return (
        <span className={className}>
          <span className="mini-check checked"><Check size={12} /></span>
          <span className="mini-check" />
          <span className="mini-line" />
        </span>
      );
    case "radio":
      return (
        <span className={className}>
          <span className="mini-radio active" />
          <span className="mini-radio" />
          <span className="mini-line" />
        </span>
      );
    case "progress":
      return (
        <span className={className}>
          <span className="mini-progress"><i /></span>
        </span>
      );
    case "tooltip":
      return (
        <span className={className}>
          <span className="mini-outline">?</span>
          <span className="mini-tip">说明</span>
        </span>
      );
    case "accordion":
      return (
        <span className={className}>
          <span className="mini-accordion"><b>问题一</b><i /><b>问题二</b></span>
        </span>
      );
    case "drawer":
      return (
        <span className={className}>
          <span className="mini-drawer"><i /><b /><b /><b /></span>
        </span>
      );
    case "list":
      return (
        <span className={className}>
          <span className="mini-list"><b /><b /><b /></span>
        </span>
      );
    case "avatar":
      return (
        <span className={className}>
          <span className="mini-avatar">UI</span>
        </span>
      );
    case "tag":
      return (
        <span className={className}>
          <span className="mini-tags"><b>新</b><b>热门</b><b>推荐</b></span>
        </span>
      );
    case "popover":
      return (
        <span className={className}>
          <span className="mini-popover"><b>目标</b><em>浮层说明</em></span>
        </span>
      );
    case "carousel":
      return (
        <span className={className}>
          <span className="mini-carousel"><i /><i /><i /><b /><b /><b /></span>
        </span>
      );
    case "timeline":
      return (
        <span className={className}>
          <span className="mini-timeline"><i /><b /><i /><b /><i /></span>
        </span>
      );
    case "alert":
    case "confirmation":
    case "success-state":
    case "error-state":
    case "notification":
      return (
        <span className={className}>
          <span className={`mini-status ${type}`}><i /><b /><b /></span>
        </span>
      );
    case "spinner":
      return (
        <span className={className}>
          <span className="mini-spinner" />
        </span>
      );
    case "form":
      return (
        <span className={className}>
          <span className="mini-form"><b /><b /><i /></span>
        </span>
      );
    case "data-grid":
      return (
        <span className={className}>
          <span className="mini-datagrid">{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</span>
        </span>
      );
    case "filter-panel":
      return (
        <span className={className}>
          <span className="mini-filter"><b /><b /><i /></span>
        </span>
      );
    case "sort-control":
      return (
        <span className={className}>
          <span className="mini-sort"><b>排序</b><i /><i /></span>
        </span>
      );
    case "media-player":
      return (
        <span className={className}>
          <span className="mini-media"><Play size={17} fill="currentColor" /><b /></span>
        </span>
      );
    case "chat-bubble":
      return (
        <span className={className}>
          <span className="mini-chat"><b>你好</b><b>收到</b></span>
        </span>
      );
    case "comment-box":
      return (
        <span className={className}>
          <span className="mini-comment"><b /><i>发送</i></span>
        </span>
      );
    case "rating":
      return (
        <span className={className}>
          <span className="mini-rating">★★★★★ <b>4.8</b></span>
        </span>
      );
    case "shopping-cart":
      return (
        <span className={className}>
          <span className="mini-cart"><b>2</b><i /><strong>¥168</strong></span>
        </span>
      );
    case "text-content":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-text"><strong>标题</strong><b /><b /><i /></span>
        </span>
      );
    case "icon-system":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-icons"><Info size={15} /><Check size={15} /><Search size={15} /><SlidersHorizontal size={15} /></span>
        </span>
      );
    case "divider":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-divider"><b /><i /><b /></span>
        </span>
      );
    case "panel":
    case "term-card":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-panel"><strong /><b /><b /><i /></span>
        </span>
      );
    case "code-block":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-code"><b /><b /><b /><i /></span>
        </span>
      );
    case "keyboard-key":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-keys"><kbd>⌘</kbd><kbd>K</kbd><kbd>↵</kbd></span>
        </span>
      );
    case "barcode":
      return (
        <span className={className}>
          <span className="mini-barcode">{Array.from({ length: 16 }).map((_, index) => <i key={index} />)}</span>
        </span>
      );
    case "status-indicator":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-status"><b /><b /><b /></span>
        </span>
      );
    case "chart":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-chart"><i /><i /><i /><i /></span>
        </span>
      );
    case "editor":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-editor"><em /><b /><b /><b /></span>
        </span>
      );
    case "security":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-security"><SquareCheck size={16} /><b /><i /></span>
        </span>
      );
    case "map":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-map"><i /><i /><b /></span>
        </span>
      );
    case "help":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-help"><Search size={14} /><b /><b /></span>
        </span>
      );
    case "a11y":
    case "a11y-focus":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-a11y"><span>1</span><span>2</span><span>3</span></span>
        </span>
      );
    case "i18n":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-i18n"><b>zh</b><i /><b>RTL</b></span>
        </span>
      );
    case "react-component":
    case "react-preview":
      return (
        <span className={className}>
          <ReactMiniPreview entry={entry} />
        </span>
      );
    case "mobile-preview":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-mobile"><strong /><b /><i /></span>
        </span>
      );
    case "taxonomy":
      return (
        <span className={className}>
          <span className="mini-taxonomy mini-taxonomy-default"><b /><span /><i /></span>
        </span>
      );
    case "empty":
      return (
        <span className={className}>
          <span className="mini-empty"><CircleHelp size={20} /><b /></span>
        </span>
      );
    default:
      return (
        <span className={className}>
          <span className="mini-generic"><SlidersHorizontal size={20} /><b /><b /></span>
        </span>
      );
  }
}

function getLayoutMiniTemplate(type = "") {
  const value = String(type);
  if (/dashboard|pricing|billing|permission|settings|admin|portal|workspace/.test(value)) return "dashboard";
  if (/sidebar|sticky-sidebar|master|inbox|docs-help|ide/.test(value)) return "sidebar";
  if (/chat|mobile-chat/.test(value)) return "chat";
  if (/kanban/.test(value)) return "kanban";
  if (/calendar/.test(value)) return "calendar";
  if (/timeline/.test(value)) return "timeline";
  if (/map/.test(value)) return "map";
  if (/sticky-action-bar|footer/.test(value)) return "footer";
  if (/checkout|cart|order|payment|subscription/.test(value)) return "commerce";
  if (/bottom-nav|mobile-bottom/.test(value)) return "mobileNav";
  if (/bottom-sheet|modal|fullscreen/.test(value)) return "overlay";
  if (/auth|login|signup/.test(value)) return "auth";
  if (/search|filter-results/.test(value)) return "search";
  if (/grid|masonry|card/.test(value)) return "grid";
  if (/feed/.test(value)) return "feed";
  if (/three/.test(value)) return "three";
  if (/two|split/.test(value)) return "split";
  if (/sticky-header|landing|profile|detail|single/.test(value)) return "article";
  return "article";
}

function LayoutPreview({ type, large }) {
  const template = getLayoutMiniTemplate(type);
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`layout-preview semantic-layout-preview ${type} layout-mini-${template}`}>
        {template === "dashboard" && <><nav><b /><b /><b /></nav><main><strong /><i /><i /><i /></main></>}
        {template === "sidebar" && <><aside><b /><b /><b /></aside><main><strong /><i /><i /><i /></main></>}
        {template === "chat" && <><aside><b /><b /></aside><main><i /><i className="out" /><footer /></main></>}
        {template === "kanban" && <>{["Todo", "Doing", "Done"].map((column) => <section key={column}><b>{column}</b><i /><i /></section>)}</>}
        {template === "calendar" && <><header /><main>{Array.from({ length: 12 }).map((_, index) => <i key={index} className={index === 4 || index === 8 ? "active" : ""} />)}</main></>}
        {template === "timeline" && <>{["Draft", "Review", "Done"].map((step) => <article key={step}><em /><div><b>{step}</b><i /></div></article>)}</>}
        {template === "map" && <><main><i className="pin" /><i className="pin alt" /></main><aside><b /><b /></aside></>}
        {template === "footer" && <><main><b /><i /><i /></main><footer><span>3 edits</span><span className="layout-mini-action">Save</span></footer></>}
        {template === "commerce" && <><main><article><i /><b /></article><article><i /><b /></article></main><aside><strong>$168</strong><span className="layout-mini-action">Pay</span></aside></>}
        {template === "mobileNav" && <><main><i /><i /></main><footer><b /><b className="active" /><b /></footer></>}
        {template === "overlay" && <><main><i /><i /><i /></main><section><b /><span className="layout-mini-action">Done</span></section></>}
        {template === "auth" && <><aside><strong /></aside><main><b /><i /><span className="layout-mini-action">Sign in</span></main></>}
        {template === "search" && <><header><Search size={12} /><b /></header><aside><i /><i /></aside><main><article /><article /></main></>}
        {template === "grid" && <>{Array.from({ length: 6 }).map((_, index) => <article key={index} className={index === 1 ? "tall" : ""}><i /><b /></article>)}</>}
        {template === "feed" && <>{Array.from({ length: 3 }).map((_, index) => <article key={index}><i /><div><b /><span /></div></article>)}</>}
        {template === "three" && <><aside /><main><b /><i /><i /></main><section><b /><i /></section></>}
        {template === "split" && <><main><b /><i /><i /></main><aside><b /><i /></aside></>}
        {template === "article" && <><article><span /><strong /><i /><i /><span className="layout-mini-action">Read</span></article></>}
      </span>
    </span>
  );
}

function getStyleMiniKind(type = "") {
  const value = String(type);
  if (/token/.test(value)) return "token";
  if (/gradient/.test(value)) return "gradient";
  if (/color/.test(value)) return "color";
  if (/type|typography/.test(value)) return "type";
  if (/spacing/.test(value)) return "spacing";
  if (/radius/.test(value)) return "radius";
  if (/border|divider/.test(value)) return "border";
  if (/shadow/.test(value)) return "shadow";
  if (/transparency|opacity|blur/.test(value)) return "transparency";
  if (/icon/.test(value)) return "icons";
  if (/density/.test(value)) return "density";
  if (/dark|theme/.test(value)) return "theme";
  if (/brand/.test(value)) return "brand";
  if (/platform/.test(value)) return "platform";
  if (/state/.test(value)) return "state";
  if (/emphasis/.test(value)) return "emphasis";
  return "surface";
}

function StylePreview({ type, large }) {
  const kind = getStyleMiniKind(type);
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`style-preview semantic-style-preview ${type} style-mini-${kind}`}>
        {kind === "token" && <><code>color.action</code><b /><b /><b /></>}
        {kind === "color" && <><i className="swatch a" /><i className="swatch b" /><i className="swatch c" /><i className="swatch d" /></>}
        {kind === "gradient" && <><i className="gradient-strip main" /><i className="gradient-strip warm" /><i className="gradient-chip" /></>}
        {kind === "type" && <><strong>Ag</strong><b /><b className="short" /></>}
        {kind === "spacing" && <><span /><i /><span className="wide" /></>}
        {kind === "radius" && <><i className="r0" /><i className="r1" /><i className="r2" /></>}
        {kind === "border" && <><i className="solid" /><i className="dashed" /><i className="focus" /></>}
        {kind === "shadow" && <><i className="low" /><i className="mid" /><i className="high" /></>}
        {kind === "transparency" && <><main /><section /><b /></>}
        {kind === "icons" && <><Info size={15} /><Check size={15} /><Search size={15} /><X size={15} /></>}
        {kind === "density" && <><article /><article className="dense" /></>}
        {kind === "theme" && <><main className="light" /><main className="dark" /></>}
        {kind === "brand" && <><strong>UI</strong><b /><i /></>}
        {kind === "platform" && <><main /><footer /></>}
        {kind === "state" && <><span className="style-mini-state-control">Default</span><span className="style-mini-state-control active">Pressed</span><span className="style-mini-state-control disabled">Disabled</span></>}
        {kind === "emphasis" && <><article /><article className="strong" /></>}
        {kind === "surface" && <><i /><b /><b /></>}
      </span>
    </span>
  );
}

function getMotionMiniKind(type = "") {
  const value = String(type);
  if (/haptic/.test(value)) return "haptic";
  if (/hover/.test(value)) return "hover";
  if (/number/.test(value)) return "number";
  if (/stagger/.test(value)) return "stagger";
  if (/spring|bounce/.test(value)) return "spring";
  if (/overlay|dialog|popover/.test(value)) return "overlay";
  if (/menu/.test(value)) return "menu";
  if (/tabs?/.test(value)) return "tabs";
  if (/pull-refresh|refresh/.test(value)) return "refresh";
  if (/chart/.test(value)) return "chart";
  if (/loading|spinner|skeleton|progress/.test(value)) return "loading";
  if (/success|confetti|celebration/.test(value)) return "success";
  if (/error|shake/.test(value)) return "error";
  if (/attention|warning/.test(value)) return "attention";
  if (/slide|page|route|drawer|sheet/.test(value)) return "slide";
  if (/scale/.test(value)) return "scale";
  if (/press|tap/.test(value)) return "press";
  if (/expand|collapse/.test(value)) return "expand";
  if (/list|row|sort|reorder/.test(value)) return "list";
  if (/drag|swipe|gesture/.test(value)) return "drag";
  if (/spatial/.test(value)) return "spatial";
  if (/reduced|performance|a11y/.test(value)) return "reduced";
  return "fade";
}

function MotionPreview({ type, large }) {
  const kind = getMotionMiniKind(type);
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`motion-preview semantic-motion-preview ${type} motion-mini-${kind}`}>
        {kind === "haptic" && <><span className="motion-mini-action">Tap</span><i /><i /><i /></>}
        {kind === "hover" && <><span className="motion-mini-action">Hover</span><i /></>}
        {kind === "number" && <><strong>12,480</strong><span>+18%</span></>}
        {kind === "stagger" && <>{Array.from({ length: 4 }).map((_, index) => <i key={index} style={{ "--delay": `${index * 90}ms` }} />)}</>}
        {kind === "spring" && <><b /><b className="target" /><span>spring</span></>}
        {kind === "overlay" && <><main /><section><b /><span className="motion-mini-action">Done</span></section></>}
        {kind === "menu" && <><span className="motion-mini-action">Open</span><nav><b /><b /><b /></nav></>}
        {kind === "tabs" && <><nav><b /><b /><b /></nav><i /></>}
        {kind === "refresh" && <><strong>Pull</strong><i /><span>Release</span></>}
        {kind === "chart" && <>{[32, 58, 42, 72, 50].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</>}
        {kind === "loading" && <><i className="spinner" /><b /><b /></>}
        {["success", "error", "attention"].includes(kind) && <><strong>{kind === "error" ? "!" : kind === "attention" ? "i" : "OK"}</strong><span>{kind}</span></>}
        {kind === "slide" && <><aside /><main><b /><i /></main></>}
        {kind === "scale" && <><span className="motion-mini-action">Scale</span><i /></>}
        {kind === "press" && <><span className="motion-mini-action">Press</span><i /></>}
        {kind === "expand" && <><header /><p /><p className="open" /></>}
        {kind === "list" && <><i /><i className="active" /><i /></>}
        {kind === "drag" && <><main /><b /></>}
        {kind === "spatial" && <><i /><b /><i /></>}
        {kind === "reduced" && <><strong>Reduced</strong><span /></>}
        {kind === "fade" && <><section /><section className="next" /></>}
      </span>
    </span>
  );
}

function PatternPreview({ type, large }) {
  const scene = type.replace("pattern-", "");
  const isFormScene = ["login", "signup", "form", "error"].includes(scene);
  const isSearchScene = ["search", "sort"].includes(scene);

  function renderScene() {
    if (isFormScene) {
      return (
        <span className={`pattern-mini-card pattern-mini-form ${scene === "error" ? "danger" : ""}`}>
          <span className="pattern-mini-title">{scene === "login" ? "账号登录" : scene === "signup" ? "创建账号" : scene === "error" ? "表单错误" : "资料填写"}</span>
          <span className="pattern-mini-input" />
          <span className="pattern-mini-input short" />
          <span className="pattern-mini-action" />
        </span>
      );
    }

    if (isSearchScene) {
      return (
        <span className="pattern-mini-card pattern-mini-search">
          <span className="pattern-mini-query"><Search size={13} /><span>搜索 UI</span></span>
          <span className="pattern-mini-tabs"><span /><span /><span /></span>
          <span className="pattern-mini-results"><span /><span /><span /></span>
        </span>
      );
    }

    if (scene === "filter") {
      return (
        <span className="pattern-mini-card pattern-mini-filter">
          <span className="pattern-mini-side"><span /><span /><span /></span>
          <span className="pattern-mini-products"><span /><span /><span /><span /></span>
        </span>
      );
    }

    if (scene === "upload") {
      return (
        <span className="pattern-mini-card pattern-mini-upload">
          <span className="pattern-mini-drop"><ArrowUp size={14} /><span>上传</span></span>
          <span className="pattern-mini-progress"><span /></span>
        </span>
      );
    }

    if (scene === "checkout") {
      return (
        <span className="pattern-mini-card pattern-mini-checkout">
          <span className="pattern-mini-order"><span /><span /><strong>¥168</strong></span>
          <span className="pattern-mini-pay"><span /><span className="pattern-mini-button">支付</span></span>
        </span>
      );
    }

    if (scene === "delete") {
      return (
        <span className="pattern-mini-card pattern-mini-danger">
          <span className="pattern-mini-files"><span /><span /><span /></span>
          <span className="pattern-mini-dialog"><strong>删除?</strong><span /><span className="pattern-mini-button">确认</span></span>
        </span>
      );
    }

    if (scene === "operation") {
      return (
        <span className="pattern-mini-card pattern-mini-operation">
          <span className="pattern-mini-files"><span /><span /><span /></span>
          <span className="pattern-mini-dialog"><strong>Record</strong><span /><span className="pattern-mini-button">Apply</span></span>
        </span>
      );
    }

    if (scene === "collaboration") {
      return (
        <span className="pattern-mini-card pattern-mini-collaboration">
          <span className="pattern-mini-avatars"><i /><i /><i /></span>
          <span className="pattern-mini-thread"><span /><span /><span /></span>
        </span>
      );
    }

    if (scene === "feedback") {
      return (
        <span className="pattern-mini-card pattern-mini-feedback">
          <span className="pattern-mini-notice ok"><i /><span /></span>
          <span className="pattern-mini-notice warn"><i /><span /></span>
          <span className="pattern-mini-notice muted"><i /><span /></span>
        </span>
      );
    }

    if (scene === "ai") {
      return (
        <span className="pattern-mini-card pattern-mini-ai">
          <span className="pattern-mini-ai-prompt"><Sparkles size={13} /><span /></span>
          <span className="pattern-mini-ai-result"><b /><b /><b /></span>
        </span>
      );
    }

    if (scene === "media") {
      return (
        <span className="pattern-mini-card pattern-mini-media">
          <span className="pattern-mini-media-view"><Play size={15} fill="currentColor" /></span>
          <span className="pattern-mini-media-tools"><b /><b /><b /></span>
        </span>
      );
    }

    if (scene === "mobile") {
      return (
        <span className="pattern-mini-card pattern-mini-mobile">
          <span className="pattern-mini-phone"><i /><b /><b /></span>
        </span>
      );
    }

    if (scene === "onboarding") {
      return (
        <span className="pattern-mini-card pattern-mini-onboarding">
          <span className="pattern-mini-steps"><span /><span /><span /></span>
          <span className="pattern-mini-welcome"><strong>欢迎</strong><span /><span className="pattern-mini-button">下一步</span></span>
        </span>
      );
    }

    if (scene === "settings") {
      return (
        <span className="pattern-mini-card pattern-mini-settings">
          <span className="pattern-mini-setting"><span>通知</span><i /></span>
          <span className="pattern-mini-setting"><span>保存</span><i /></span>
          <span className="pattern-mini-setting"><span>动效</span><i /></span>
        </span>
      );
    }

    return (
      <span className="pattern-mini-card pattern-mini-default">
        <span className="pattern-mini-title">场景</span>
        <span className="pattern-mini-input" />
        <span className="pattern-mini-action" />
      </span>
    );
  }

  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`pattern-preview ${type}`}>
        {renderScene()}
      </span>
    </span>
  );
}
