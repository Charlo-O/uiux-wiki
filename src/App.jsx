import { useEffect, useMemo, useState } from "react";
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
  Grid2X2,
  Info,
  LayoutGrid,
  Link2,
  MessageCircle,
  MousePointer2,
  PanelLeft,
  PenTool,
  Play,
  RefreshCcw,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  SquareCheck,
  Type,
  UserRound,
  X,
} from "lucide-react";
import {
  categoryDescriptions,
  findItem,
  quickQuestions,
  sections,
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
  { id: "dictionary", label: "状态" },
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
    Icon: Grid2X2,
  },
  {
    sectionId: "patterns",
    title: "看交互",
    description: "点击、悬停、拖拽、展开...",
    Icon: MousePointer2,
  },
  {
    sectionId: "dictionary",
    title: "看状态",
    description: "默认、加载、成功、错误...",
    Icon: ChartPie,
  },
  {
    sectionId: "layouts",
    title: "看布局",
    description: "栅格、容器、间距、对齐...",
    Icon: LayoutGrid,
  },
  {
    sectionId: "styles",
    title: "看样式",
    description: "颜色、字体、圆角、阴影...",
    Icon: Type,
  },
  {
    sectionId: "motion",
    title: "看动效",
    description: "过渡、微动效、页面动效...",
    Icon: Sparkles,
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
    preview: "product",
  },
  {
    id: "mobile-date-picker",
    title: "日期选择器",
    english: "Date Picker",
    group: "input",
    summary: "移动端日期、时间或范围选择。",
    usage: "适合预约、出行、订单筛选和报表范围。",
    preview: "sheet",
  },
  {
    id: "mobile-stepper",
    title: "步进器",
    english: "Stepper",
    group: "input",
    summary: "用加减按钮调整数字。",
    usage: "适合数量、人数、库存和评分项。",
    preview: "actions",
  },
  {
    id: "mobile-form-row",
    title: "表单行",
    english: "Form Row",
    group: "input",
    summary: "移动端设置项、资料项和输入项。",
    usage: "适合个人资料、地址、设置和偏好。",
    preview: "search",
  },
  {
    id: "mobile-empty-state",
    title: "空状态",
    english: "Empty State",
    group: "feedback",
    summary: "解释当前没有内容并引导下一步。",
    usage: "适合搜索无结果、列表为空、首次使用。",
    preview: "toast",
  },
  {
    id: "mobile-skeleton",
    title: "骨架屏",
    english: "Skeleton",
    group: "feedback",
    summary: "数据加载时保持布局稳定。",
    usage: "适合列表、卡片、详情页和 feed 加载。",
    preview: "refresh",
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
    preview: "product",
  },
  {
    id: "mobile-checkout-bar",
    title: "结算栏",
    english: "Checkout Bar",
    group: "commerce",
    summary: "固定底部展示金额和主操作。",
    usage: "适合购物车、订单确认、课程购买。",
    preview: "tabbar",
  },
  {
    id: "mobile-coupon",
    title: "优惠券",
    english: "Coupon",
    group: "commerce",
    summary: "展示优惠信息、领取状态和使用条件。",
    usage: "适合营销活动、会员权益、结算页。",
    preview: "actions",
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
    const id = window.location.hash.replace("#", "");
    if (id && uiItems.some((entry) => entry.id === id)) chooseItem(findItem(id));
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
        aiReady={Boolean(aiConfig.apiKey && aiConfig.model)}
        onAiOpen={() => setAiPanelOpen(true)}
        onSearchFocus={() => document.getElementById("atlas-search")?.focus()}
        onAbout={() => setNotice("uiux.wiki 是一站式 UI 图鉴参考平台")}
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
      </div>
    </div>
  );
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

function Header({ activeSection, onSection, deviceMode, onDeviceMode, aiReady, onAiOpen, onSearchFocus, onAbout, currentUser, onAuthOpen }) {
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
      </nav>
      <div className="top-actions">
        <button
          type="button"
          className={`header-tool ${activeSection === "workspace" ? "active" : ""}`}
          onClick={() => onSection("workspace")}
        >
          <Sparkles size={18} strokeWidth={2.1} />
          工作台
        </button>
        <button type="button" className={`header-tool ai-trigger ${aiReady ? "ready" : ""}`} onClick={onAiOpen}>
          <Sparkles size={19} strokeWidth={2.1} />
          AI 增强
        </button>
        <button type="button" className="header-tool account-trigger" onClick={onAuthOpen}>
          <UserRound size={18} strokeWidth={2.1} />
          {currentUser ? currentUser.name : "登录"}
        </button>
        <button type="button" className="header-tool" onClick={onSearchFocus}>
          <Search size={20} strokeWidth={2.1} />
          搜索
        </button>
        <button type="button" className="header-tool" onClick={onAbout}>
          <Info size={19} strokeWidth={2.1} />
          关于
        </button>
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
      <div className="home-annotations" aria-hidden="true">
        <span className="home-annotation search-note"><b>俗称搜索</b><i /></span>
        <span className="home-annotation entry-note"><b>核心入口</b><i /></span>
        <span className="home-annotation core-note"><b>P0优先内容</b><i /></span>
        <span className="home-annotation path-note"><b>新手路径</b><i /></span>
        <span className="home-annotation compare-note"><b>常见对比</b><i /></span>
      </div>

      <div className="home-hero">
        <div className="home-hero-copy">
          <h1 id="home-title">看懂每一个 UI 元素</h1>
          <p>组件、交互、状态、布局、样式、动效，一站式 UI 图鉴</p>
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

      <AiInlineTranslator config={aiConfig} onAiOpen={onAiOpen} onNotice={onNotice} />

      <div className="home-body">
        <div className="home-entry-grid" aria-label="核心入口">
          {homeEntryCards.map(({ sectionId, title, description, Icon }, index) => (
            <button
              key={sectionId}
              type="button"
              className={`home-entry-card tone-${index + 1}`}
              onClick={() => onSection(sectionId)}
            >
              <span className="home-entry-icon">
                <Icon size={34} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <ChevronRight size={28} strokeWidth={1.8} />
            </button>
          ))}
        </div>

        <section className="home-section" aria-labelledby="home-core-title">
          <h2 id="home-core-title">{query ? "搜索结果" : "P0 核心内容"}</h2>
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
                  <MiniPreview type={entry.preview} />
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
            {learnerPaths.map(({ title, Icon, points }, index) => (
              <article key={title} className={`home-path-card path-${index + 1}`}>
                <span className="home-path-icon">
                  <Icon size={34} strokeWidth={1.8} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <ul>
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
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

function AllComponentsPage({ items, query, selectedId, onChoose, deviceMode = "desktop" }) {
  const grouped = sections
    .map((section) => ({
      ...section,
      items: items.filter((entry) => entry.category === section.id),
    }))
    .filter((section) => !query || section.items.length > 0);

  return (
    <section className="all-components-page" aria-labelledby="all-components-title">
      <div className="all-page-heading">
        <span className="panel-kicker">全部展示</span>
        <h1 id="all-components-title">全部组件</h1>
      </div>
      <div className="all-component-groups">
        {grouped.length > 0 ? grouped.map((section) => (
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
}) {
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
      <div className={`entry-list full-entry-list ${activeSection === "components" ? "scrollable" : ""}`}>
        {items.length > 0 ? (
          items.map((entry, index) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              index={index}
              active={entry.id === selectedId}
              onChoose={() => onChoose(entry)}
            />
          ))
        ) : (
          <EmptyList activeSection={activeSection} />
        )}
      </div>
      <button className="clear-button" type="button" onClick={onClear}>
        <RefreshCcw size={16} />
        重置列表
      </button>
    </section>
  );
}

function ComponentTile({ entry, index, active, onChoose, deviceMode = "desktop" }) {
  return (
    <button
      className={`component-tile ${active ? "active" : ""} ${deviceMode === "mobile" ? "mobile-mode" : ""}`}
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
        {deviceMode === "mobile" ? (
          <span className="tile-phone-preview">
            <MiniPreview type={entry.preview} />
          </span>
        ) : (
          <MiniPreview type={entry.preview} />
        )}
      </span>
      <span className="component-tile-copy">
        <strong>{entry.title}</strong>
        <em>{entry.english}</em>
        <span>{entry.group}</span>
      </span>
    </button>
  );
}

function EntryRow({ entry, index, active, onChoose }) {
  return (
    <button
      className={`entry-row ${active ? "active" : ""}`}
      type="button"
      aria-label={`预览 ${entry.title} ${entry.english}`}
      aria-current={active ? "true" : undefined}
      onClick={onChoose}
    >
      <span className="entry-index">{String(index + 1).padStart(2, "0")}</span>
      <MiniPreview type={entry.preview} />
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

  return (
    <section className="detail-panel" aria-live="polite">
      <div className="answer-heading">
        <span className="answer-icon" aria-hidden="true">
          <Sparkles size={19} fill="currentColor" strokeWidth={1.8} />
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
  let preview;

  if (selected.category === "layouts") preview = <LayoutLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "styles") preview = <StyleLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "motion") preview = <MotionLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "patterns") preview = <PatternLivePreview selected={selected} variant={variant} />;
  else if (selected.category === "dictionary") {
    const related = findItem(selected.related[0] || "button");
    preview = (
      <ComponentLivePreview
        selected={related.id === selected.id ? selected : related}
        term={selected}
        variant={variant}
      />
    );
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

function ComponentLivePreview({ selected, term, variant = "" }) {
  const id = selected.id;
  const variantIndex = getVariantIndex(selected, variant);
  const variantClass = getVariantPreviewClass(variant, variantIndex);
  const isDangerVariant = variantHas(variant, ["错误", "危险", "删除", "失败"]);
  const isReadonlyVariant = variantHas(variant, ["只读", "禁用"]);
  const hasIconVariant = variantHas(variant, ["图标", "搜索", "建议", "命令"]);
  const hasClearVariant = variantHas(variant, ["清除"]);
  const hasRecommendationVariant = variantHas(variant, ["建议", "推荐"]);

  if (id === "button") {
    return (
      <div className={`live-button-card ${variantClass}`}>
        <button type="button">{variant || "主要操作"}</button>
        <button type="button">次要操作</button>
        <button type="button" className="danger">危险操作</button>
      </div>
    );
  }

  if (["text-field", "textarea", "search", "password-field", "autocomplete"].includes(id)) {
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
    return (
      <div className={`live-table ${variantClass}`}>
        {["名称", "状态", "时间"].map((head) => <b key={head}>{head}</b>)}
        {["订单 A", "完成", "今天", "订单 B", "待处理", "昨天", "订单 C", "失败", "周一"].map((cell, index) => (
          <span key={`${cell}-${index}`} className={cell === "失败" ? "danger-text" : cell === "完成" ? "success-text" : ""}>{cell}</span>
        ))}
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

  if (id === "empty-state") {
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

  if (id === "slider") {
    return (
      <div className={`live-slider-card ${variantClass}`}>
        <strong>{variantHas(variant, ["范围"]) ? "价格 20 - 80" : "音量 62%"}</strong>
        <input type="range" defaultValue={variantHas(variant, ["刻度"]) ? "80" : "62"} />
        <span>滑杆适合连续数值，而不是少量固定选项。</span>
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

  if (id === "drawer") {
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
        <strong>{variant || "筛选"}</strong>
        <label><input type="checkbox" defaultChecked /> 可用</label>
        <label><input type="checkbox" /> 促销</label>
        <div><span>0</span><i /><span>100</span></div>
      </div>
    );
  }

  if (id === "sort-control") {
    return (
      <div className={`live-sort-card ${variantClass}`}>
        <span>排序</span>
        <button type="button">{variant || "最新优先"}</button>
        <button type="button">价格升序</button>
        <button type="button">评分最高</button>
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
    return (
      <div className={`live-media-card ${variantClass}`}>
        <section><Play size={28} fill="currentColor" /></section>
        <div><b /><span>01:26 / 03:40</span></div>
      </div>
    );
  }

  if (id === "shopping-cart") {
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

  return (
    <div className={`live-generic-card ${variantClass}`}>
      <MiniPreview type={selected.preview} large />
      <strong>{variant || term?.title || selected.title}</strong>
      <p>{term?.plain || selected.plain}</p>
    </div>
  );
}

function LayoutLivePreview({ selected, variant }) {
  const template = {
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
  }[selected.id] || "article";

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
        <main><strong>收货信息</strong><input placeholder="姓名" /><input placeholder="地址" /><button>继续</button></main>
        <aside><span>订单摘要</span><b>¥168</b><em>2 件商品</em></aside>
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
  return (
    <div className={`live-motion-demo ${selected.preview} ${getVariantPreviewClass(variant, getVariantIndex(selected, variant))}`}>
      <div className="motion-target"><Play size={24} fill="currentColor" /></div>
      <p>{variant || selected.plain}</p>
    </div>
  );
}

function PatternLivePreview({ selected, variant = "" }) {
  const config = {
    "login-pattern": {
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
    "checkout-pattern": {
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
    "error-message-pattern": {
      title: "输入有误",
      scene: "error",
      fields: ["邮箱格式不正确"],
      action: "重新填写",
      danger: true,
    },
  };
  const data = config[selected.id] || { title: selected.title, fields: ["示例输入"], action: "继续" };

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
        <div className="upload-drop"><ArrowUp size={24} /><strong>拖拽文件到这里</strong><span>PNG, PDF, ZIP</span></div>
        <article><span>design-system.zip</span><b>62%</b></article>
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

function MiniPreview({ type, large = false }) {
  const className = `mini-preview preview-${type} ${large ? "large" : ""}`;

  if (type.includes("layout")) return <LayoutPreview type={type} large={large} />;
  if (type.includes("style")) return <StylePreview type={type} large={large} />;
  if (type.includes("motion")) return <MotionPreview type={type} large={large} />;
  if (type.includes("pattern")) return <PatternPreview type={type} large={large} />;

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

function LayoutPreview({ type, large }) {
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`layout-preview ${type}`}>
        <i /><i /><i /><i /><i /><i />
      </span>
    </span>
  );
}

function StylePreview({ type, large }) {
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`style-preview ${type}`}>
        <i /><b /><b />
      </span>
    </span>
  );
}

function MotionPreview({ type, large }) {
  return (
    <span className={`mini-preview ${large ? "large" : ""}`}>
      <span className={`motion-preview ${type}`}>
        <i />
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
