import expandedUiIndex from "../docs/ui-item-name-index-expanded.md?raw";

export const sections = [
  { id: "components", label: "组件" },
  { id: "layouts", label: "布局" },
  { id: "styles", label: "样式" },
  { id: "motion", label: "动效" },
  { id: "patterns", label: "场景" },
  { id: "dictionary", label: "词典" },
  { id: "states", label: "状态" },
  { id: "mobile", label: "移动端" },
  { id: "react", label: "React" },
  { id: "accessibility", label: "无障碍" },
];

const commonNotes = {
  accessibility: ["可用键盘访问", "焦点状态清楚", "不要只靠颜色表达状态"],
  do: ["名称写清楚", "状态要能被看懂", "和周围内容保持一致"],
  dont: ["不要让它看起来可点却不能点", "不要把同一层级做得都很抢眼", "不要省略错误或禁用原因"],
};

const relatedAliases = {
  "help-text": "tooltip",
  contrast: "color",
  accessibility: "accessible-name",
};

const defaultRelatedByCategory = {
  components: ["button", "card"],
  layouts: ["single-column", "two-column"],
  styles: ["color", "typography"],
  motion: ["fade-motion", "slide-motion"],
  patterns: ["login-pattern", "search-pattern"],
  dictionary: ["button", "card"],
  states: ["toast", "alert"],
  mobile: ["bottom-navigation", "drawer"],
  react: ["button", "card"],
  accessibility: ["accessible-name", "button"],
};

function compactUnique(values) {
  return (values || [])
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function filledArray(value, fallback) {
  const source = Array.isArray(value) && value.length > 0 ? value : fallback;
  return compactUnique(source);
}

function normalizeRelated(value, category) {
  const fallback = defaultRelatedByCategory[category] || defaultRelatedByCategory.components;
  const source = filledArray(value, fallback);
  return source
    .map((id) => relatedAliases[id] || id)
    .filter((id, index, array) => id && array.indexOf(id) === index);
}

function fallbackAliases(merged, details) {
  return compactUnique([
    merged.english,
    merged.group,
    details.label,
    merged.title,
  ].filter((value) => value !== merged.title));
}

function fallbackTags(merged, details) {
  return compactUnique([
    details.label,
    merged.group,
    merged.preview,
    "UI",
  ]);
}

function fallbackSummary(merged, details) {
  const title = merged.title || merged.english || merged.id;
  const group = merged.group || details.label;
  return `${title} 是「${group}」中的${details.label}条目，用于${details.purpose}。`;
}

function fallbackPlain(merged, details) {
  const title = merged.title || merged.english || merged.id;
  const group = merged.group || details.label;
  return `${title} 需要说明它在「${group}」中的用途、触发方式、状态边界和异常处理，避免只留下一个模糊名称。`;
}

function fallbackWhenToUse(merged, details, useCases) {
  const title = merged.title || merged.english || merged.id;
  const cases = filledArray(useCases, details.useCases).slice(0, 3).join("、");
  return cases ? `当界面需要处理${cases}时使用 ${title}。` : `当界面需要${details.purpose}时使用 ${title}。`;
}

function item(data) {
  const merged = {
    aliases: [],
    tags: [],
    variants: [],
    states: [],
    useCases: [],
    do: commonNotes.do,
    dont: commonNotes.dont,
    accessibility: commonNotes.accessibility,
    related: [],
    preview: "generic",
    comparison: null,
    ...data,
  };
  const details = generatedCategoryDetails[merged.category] || generatedCategoryDetails.components;
  const summary = merged.summary || merged.description || fallbackSummary(merged, details);
  const plain = merged.plain || merged.purpose || merged.whenToUse || fallbackPlain(merged, details);
  const variants = filledArray(merged.variants, details.variants);
  const states = filledArray(merged.states, details.states);
  const useCases = filledArray(merged.useCases, details.useCases);
  const preview =
    merged.category === "dictionary" && (!merged.preview || merged.preview === "generic")
      ? "term-card"
      : merged.preview;

  return {
    ...merged,
    summary,
    plain,
    description: merged.description || plain,
    purpose: merged.purpose || summary,
    whenToUse: merged.whenToUse || fallbackWhenToUse(merged, details, useCases),
    aliases: filledArray(merged.aliases, fallbackAliases(merged, details)),
    tags: filledArray(merged.tags, fallbackTags(merged, details)),
    preview,
    variants,
    states,
    useCases,
    do: filledArray(merged.do, commonNotes.do),
    dont: filledArray(merged.dont, commonNotes.dont),
    accessibility: filledArray(merged.accessibility, commonNotes.accessibility),
    related: normalizeRelated(merged.related, merged.category),
  };
}

const generatedCategoryDetails = {
  components: {
    label: "组件",
    purpose: "承载具体界面功能",
    states: ["默认", "悬停", "聚焦", "禁用", "加载", "错误"],
    variants: ["基础型", "紧凑型", "强调型", "带辅助信息"],
    useCases: ["产品界面", "后台系统", "移动端页面", "表单与流程"],
  },
  layouts: {
    label: "布局",
    purpose: "组织页面结构和内容层级",
    states: ["桌面端", "平板端", "移动端", "内容溢出", "空数据"],
    variants: ["单栏", "多栏", "固定区域", "响应式"],
    useCases: ["应用骨架", "详情页面", "数据页面", "移动端适配"],
  },
  styles: {
    label: "样式",
    purpose: "表达视觉层级、品牌气质和状态反馈",
    states: ["默认", "强调", "弱化", "禁用", "高对比"],
    variants: ["轻量", "标准", "强强调", "品牌化"],
    useCases: ["视觉规范", "设计 Token", "组件主题", "响应式平台"],
  },
  motion: {
    label: "动效",
    purpose: "解释状态变化、空间关系和操作反馈",
    states: ["进入", "进行中", "完成", "退出", "减少动效"],
    variants: ["快速反馈", "标准过渡", "空间转场", "低动效"],
    useCases: ["状态切换", "弹层进出", "数据加载", "手势反馈"],
  },
  patterns: {
    label: "场景",
    purpose: "串联多个组件完成真实任务",
    states: ["初始", "编辑中", "提交中", "成功", "失败"],
    variants: ["桌面流程", "移动流程", "高风险流程", "空状态流程"],
    useCases: ["业务流程", "交互规范", "AI Coding Prompt", "验收标准"],
  },
  dictionary: {
    label: "词典",
    purpose: "帮助识别 UI 术语和常见叫法",
    states: ["术语", "别名", "易混淆", "推荐用法"],
    variants: ["中文叫法", "英文术语", "团队俗称", "反模式提醒"],
    useCases: ["术语查询", "需求澄清", "团队沟通", "交互审查"],
  },
  states: {
    label: "状态",
    purpose: "描述组件或流程在不同条件下的表现",
    states: ["触发前", "触发中", "已完成", "可恢复", "异常"],
    variants: ["交互状态", "数据状态", "系统状态", "业务状态"],
    useCases: ["状态矩阵", "验收条件", "异常处理", "可访问性公告"],
  },
  mobile: {
    label: "移动端",
    purpose: "适配触控、窄屏和设备能力",
    states: ["默认", "触摸反馈", "展开", "收起", "离线"],
    variants: ["iOS 风格", "Android 风格", "底部操作", "全屏任务"],
    useCases: ["移动导航", "手势列表", "底部弹层", "设备能力"],
  },
  react: {
    label: "React",
    purpose: "组织页面级组件、Provider 和预览工具",
    states: ["挂载", "加载", "错误边界", "空状态", "已更新"],
    variants: ["页面组件", "Provider", "列表组件", "预览工具"],
    useCases: ["应用架构", "页面拆分", "预览系统", "文档 Playground"],
  },
  accessibility: {
    label: "无障碍",
    purpose: "保证界面可被键盘、读屏和本地化场景稳定使用",
    states: ["可聚焦", "已公告", "高对比", "RTL", "长文本"],
    variants: ["键盘访问", "读屏文本", "国际化", "对比度"],
    useCases: ["无障碍检查", "国际化适配", "表单关联", "状态公告"],
  },
};

const generatedSectionMap = [
  ["页面级 React 组件", "react"],
  ["可访问性与国际化", "accessibility"],
  ["移动端组件", "mobile"],
  ["状态字段汇总", "states"],
  ["词典", "dictionary"],
  ["组件", "components"],
  ["布局", "layouts"],
  ["样式", "styles"],
  ["动效", "motion"],
  ["场景", "patterns"],
];

function splitIndexedName(value) {
  const normalized = value.replace(/^\d+\.\s*/, "").trim();
  const parts = normalized.split(/\s+\/\s+/);
  if (parts.length > 1) {
    return {
      title: parts[0].trim(),
      english: parts.slice(1).join(" / ").trim(),
    };
  }

  const title = normalized.trim();
  const looksEnglish = /^[A-Za-z][A-Za-z0-9 .:&/+()-]*$/.test(title);
  return {
    title,
    english: looksEnglish ? title : title,
  };
}

function normalizeForKey(value) {
  return String(value || "").trim().toLowerCase();
}

function slugifyItem(value, fallback) {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function categoryFromHeading(heading) {
  const match = generatedSectionMap.find(([needle]) => heading.includes(needle));
  return match ? match[1] : "components";
}

function headingLabel(value) {
  return splitIndexedName(value).title;
}

function buildDocumentCategoryIndex(markdown) {
  const sections = [];
  const categories = [];
  const itemGroups = new Map();
  const groupIds = new Map();
  let section = "";
  let sectionLabel = "";
  let sectionId = "";
  let categoryId = "";
  let group = "";
  let groupId = "";

  for (const line of markdown.split(/\r?\n/)) {
    const sectionMatch = line.match(/^##\s+(.+)$/);
    const groupMatch = line.match(/^###\s+(.+)$/);
    const itemMatch = line.match(/^\d+\.\s+(.+)$/);

    if (sectionMatch) {
      section = sectionMatch[1].trim();
      const sectionName = splitIndexedName(section);
      sectionLabel = sectionName.title;
      sectionId = `doc-${slugifyItem(sectionName.english || sectionName.title, `section-${sections.length + 1}`)}`;
      categoryId = categoryFromHeading(section);
      group = "";
      groupId = "";
      sections.push({
        id: sectionId,
        label: sectionLabel,
        heading: section,
        categoryId,
      });
      continue;
    }

    if (groupMatch && section) {
      const groupName = splitIndexedName(groupMatch[1]);
      group = groupName.title;
      groupId = `${sectionId}-${slugifyItem(groupName.english || groupName.title, `${sectionId}-${categories.length + 1}`)}`;
      groupIds.set(`${sectionLabel}\n${group}`, groupId);
      categories.push({
        id: groupId,
        section,
        sectionId,
        sectionLabel,
        categoryId,
        group,
      });
      continue;
    }

    if (!itemMatch || !section || !group || !groupId) continue;
    const { title, english } = splitIndexedName(itemMatch[1]);
    [title, english].filter(Boolean).forEach((name) => {
      const key = normalizeForKey(name);
      if (!itemGroups.has(key)) {
        itemGroups.set(key, { docGroupId: groupId, docGroup: group, docSection: sectionLabel });
      }
    });
  }

  return { sections, categories, itemGroups, groupIds };
}

const documentCategoryIndex = buildDocumentCategoryIndex(expandedUiIndex);
const manualDocumentGroupById = {
  "filter-panel": "搜索、筛选与浏览场景",
  "sort-control": "菜单与命令",
  "landing-page": "页面结构布局",
  "detail-page": "页面结构布局",
  theme: "设计 Token",
  "settings-pattern": "认证与账户场景",
  "term-cta": "操作与按钮",
};

function documentGroupByLabel(label) {
  const match = documentCategoryIndex.categories.find((category) => category.group === label);
  return match
    ? { docGroupId: match.id, docGroup: match.group, docSection: match.sectionLabel }
    : null;
}

function inferPreview(title, english, category, group) {
  const text = `${title} ${english} ${group}`.toLowerCase();
  const coreText = `${title} ${english}`.toLowerCase();

  if (category === "states") {
    if (/filters cleared/.test(coreText)) return "toast";
    if (/undelivered|unsynced|unpublished/.test(coreText)) return "status-indicator";
    if (/^online$|^connected$|online |connected /.test(coreText)) return "status-indicator";
    if (/loaded|complete data|partial data|stale data|cached|has more|no more|end of pagination/.test(coreText)) return "status-indicator";
    if (/empty|no results|not found/.test(coreText)) return "empty";
    if (/failed|error|warning|risk|denied|forbidden|unauthorized|timeout/.test(coreText)) return "alert";
    if (/unsaved/.test(coreText)) return "alert";
    if (/refreshed|archived/.test(coreText)) return "toast";
    if (/success|completed|approved|saved|synced|delivered|done|passed/.test(coreText)) return "toast";
    if (/loading|pending|progress|processing|syncing|generating|streaming/.test(coreText)) return "progress";
    if (/selected|checked/.test(coreText)) return "checkbox";
    if (/active|expanded|collapsed|enabled|disabled|visible|hidden|open|closed|focused|hover|pressed/.test(coreText)) return "status-indicator";
    if (/empty|no results|not found|空|无结果|不存在/.test(text)) return "empty";
    if (/loading|pending|progress|processing|syncing|generating|streaming|加载|处理中|同步|生成/.test(text)) return "progress";
    if (/failed|error|warning|risk|denied|forbidden|unauthorized|timeout|错误|失败|警告|风险|无权限|超时/.test(text)) return "alert";
    if (/unsaved|未保存/.test(text)) return "alert";
    if (/refreshed|archived|已刷新|已归档/.test(text)) return "toast";
    if (/success|completed|approved|saved|synced|delivered|成功|完成|通过|已保存|已同步|已送达/.test(text)) return "toast";
    if (/selected|checked|active|expanded|collapsed|enabled|disabled|选中|勾选|展开|收起|启用|禁用/.test(text)) return "checkbox";
    if (/online|offline|connected|disconnected|health|quality|status|在线|离线|连接|健康|状态/.test(text)) return "status-indicator";
    if (/playing|paused|muted|camera|recording|live|media|播放|暂停|静音|相机|录音|直播/.test(text)) return "media-player";
    if (/payment|\border\b|cart|stock|subscription|交易|支付|订单|库存|订阅/.test(text)) return "shopping-cart";
    if (/date|time|calendar|today|tomorrow|日期|时间|日历|今天|明天/.test(text)) return "date-picker";
    if (/ai|tool|citation|model|confidence|context|prompt|模型|引用|置信|上下文/.test(text)) return "command-palette";
    return "status-indicator";
  }

  if (category === "react") {
    if (/variantmatrix|variant matrix|statematrix|state matrix|proptable|prop table|api reference table/.test(text)) return "react-matrix";
    if (/docsnav|docs nav|docstoc|docs toc|keyboardshortcuttable|keyboard shortcut table/.test(text)) return "react-docs";
    if (/themetoggle|theme toggle|densitytoggle|density toggle|languagetoggle|language toggle/.test(text)) return "react-control";
    if (/colorswatch|color swatch|spacingscale|spacing scale|typographyscale|typography scale|motiontimeline|motion timeline|statusbadge|status badge|emptystate|empty state|loadingstate|loading state/.test(text)) return "react-ui";
    if (/preview|canvas|inspector|frame|live|device/.test(text)) return "react-preview";
    if (/playground|code|docs|prop|matrix|example|copy/.test(text)) return "code-block";
    if (/control|selector|toggle|switcher|slider|inspector|toolbar/.test(text)) return "react-preview";
    if (/provider|context|boundary|layout|shell|container|app|root|page|screen|route|detail|list/.test(text)) return "react-component";
    return "react-component";
  }

  if (category === "accessibility") {
    if (/accessible name|accessible description/.test(text)) return "a11y-name";
    if (/semantic html|landmark|heading structure|skip link/.test(text)) return "a11y-structure";
    if (/focus|keyboard|shortcut|tab/.test(text)) return "a11y-focus";
    if (/screen reader|reader|live region|announcement|status announcement|error announcement/.test(text)) return "a11y-announcement";
    if (/contrast|color|high contrast/.test(text)) return "a11y-contrast";
    if (/reduced motion|motion/.test(text)) return "a11y-motion";
    if (/touch target|target size/.test(text)) return "a11y-target";
    if (/form association|label association|input association/.test(text)) return "a11y-form";
    if (/chart alt text|image alt text|alt text|caption|video captions/.test(text)) return "a11y-alt-text";
    if (/accessibility testing|testing|audit/.test(text)) return "a11y-testing";
    if (/language$|language |locale$|locale /.test(text)) return "i18n-locale";
    if (/translation key|missing translation|translation/.test(text)) return "i18n-translation";
    if (/plural/.test(text)) return "i18n-plural";
    if (/date localization|time localization|number localization|currency localization|unit localization|address localization|phone localization|name order/.test(text)) return "i18n-format";
    if (/rtl|ltr|bidirectional/.test(text)) return "i18n-direction";
    if (/long text|truncation|text expansion/.test(text)) return "i18n-text";
    if (/localized search|localized sorting|search|sorting/.test(text)) return "i18n-search";
    if (/regional compliance|compliance/.test(text)) return "i18n-compliance";
    if (/translation|locale|language|rtl|ltr|plural|localization|国际化|语言|地区|翻译|本地化/.test(text)) return "i18n";
    if (/focus|keyboard|shortcut|tab|焦点|键盘|快捷键/.test(text)) return "a11y-focus";
    if (/reader|live region|announcement|alt text|caption|读屏|公告|替代文本|字幕/.test(text)) return "a11y";
    if (/contrast|color|high contrast|对比|颜色/.test(text)) return "a11y";
    return "a11y";
  }

  if (category === "layouts") {
    if (/app shell|app-shell|admin layout|portal layout|workspace layout/.test(coreText)) return "layout-sidebar";
    if (/ecommerce layout/.test(coreText)) return "layout-cart";
    if (/responsive layout|fluid layout|fullscreen layout|page container|container layout/.test(coreText)) return "layout-grid";
    if (/fixed width layout|content layout|article layout|listing page layout|page body|section layout/.test(coreText)) return "layout-single";
    if (/page header|footer layout|page footer|sticky layout/.test(coreText)) return "layout-sticky-header";
    if (/flex layout|row layout|column layout|stack layout|inline layout|cluster layout|centered layout|space-between layout|wrap layout|spacing layout|ratio layout/.test(coreText)) return "layout-two";
    if (/onboarding flow/.test(coreText)) return "layout-wizard";
    if (/data table layout/.test(coreText)) return "layout-dashboard";
    if (/chart detail layout/.test(coreText)) return "layout-detail";
    if (/grouped list layout/.test(coreText)) return "layout-master";
    if (/keyboard avoiding layout|mobile web layout|mobile tab layout|safe area layout/.test(coreText)) return "layout-mobile-checkout";
    if (/mobile list detail layout/.test(coreText)) return "layout-mobile-chat";
    if (/documentation layout|docs layout|help center page|faq page|docs page/.test(coreText)) return "layout-docs-help";
    if (/error page/.test(coreText)) return "layout-error-page";
    if (/maintenance page/.test(coreText)) return "layout-maintenance-page";
    if (/inbox layout|mail layout/.test(coreText)) return "layout-inbox";
    if (/chat layout/.test(coreText)) return "layout-chat";
    if (/ide layout|code editor layout/.test(coreText)) return "layout-ide";
    if (/whiteboard layout/.test(coreText)) return "layout-whiteboard";
    if (/kanban layout/.test(coreText)) return "layout-kanban";
    if (/calendar layout/.test(coreText)) return "layout-calendar";
    if (/timeline layout/.test(coreText)) return "layout-timeline";
    if (/sidebar filter results|filter results/.test(coreText)) return "layout-filter-results";
    if (/mobile chat layout/.test(coreText)) return "layout-mobile-chat";
    if (/single column|one column/.test(coreText)) return "layout-single";
    if (/two column|two-column/.test(coreText)) return "layout-two";
    if (/three column|three-column/.test(coreText)) return "layout-three";
    if (/masonry/.test(coreText)) return "layout-masonry";
    if (/sticky header/.test(coreText)) return "layout-sticky-header";
    if (/sticky action bar|bottom action bar/.test(coreText)) return "layout-sticky-action-bar";
    if (/bottom sheet layout|mobile bottom sheet/.test(coreText)) return "layout-mobile-bottom-sheet";
    if (/map layout|map page|location layout|spatial layout/.test(coreText)) return "layout-map";
    if (/profile page/.test(coreText)) return "layout-profile";
    if (/search results page|search results layout/.test(coreText)) return "layout-search-results";
    if (/mobile checkout|mobile checkout layout|sticky checkout layout/.test(text)) return "layout-mobile-checkout";
    if (/mobile bottom|bottom navigation layout|bottom nav layout/.test(text)) return "layout-bottom-nav";
    if (/auth layout|login layout|signup layout|认证布局|登录布局|注册布局/.test(text)) return "layout-auth";
    if (/cart page|shopping cart|购物车/.test(text)) return "layout-cart";
    if (/order detail|order detail page|订单详情/.test(text)) return "layout-order-detail";
    if (/payment result|payment result page|支付结果/.test(text)) return "layout-payment-result";
    if (/pricing|pricing page|定价/.test(text)) return "layout-pricing";
    if (/subscription management|subscription.*page|订阅管理/.test(text)) return "layout-subscription";
    if (/billing|billing page|账单/.test(text)) return "layout-billing";
    if (/team settings|permission settings|权限设置|团队设置/.test(text)) return "layout-permission-settings";
    if (/notification settings|settings page|settings|通知设置|设置页/.test(text)) return "layout-settings";
    if (/\bfeed\b|activity feed|information feed/.test(text)) return "layout-feed";
    if (/master detail|master-detail|主从/.test(text)) return "layout-master";
    if (/filter results|search results|results layout|筛选.*结果|搜索.*结果/.test(text)) return "layout-detail";
    if (/mobile tab|tab layout|标签页布局/.test(text)) return "layout-fullscreen-modal";
    if (/dashboard|kanban|board|看板|仪表盘/.test(text)) return "layout-dashboard";
    if (/sidebar|side|rail|drawer|侧边|侧栏/.test(text)) return "layout-sidebar";
    if (/split|panel|resizable|分割|分栏|面板/.test(text)) return "layout-split";
    if (/checkout|结算/.test(text)) return "layout-checkout";
    if (/wizard|step|流程|向导/.test(text)) return "layout-wizard";
    if (/detail|详情|profile|资料/.test(text)) return "layout-detail";
    if (/grid|masonry|card|网格|瀑布/.test(text)) return "layout-grid";
    if (/mobile|移动|bottom|底部/.test(text)) return "layout-fullscreen-modal";
    if (/landing|hero|营销|落地/.test(text)) return "layout-landing";
    return "layout-two";
  }

  if (category === "styles") {
    if (/default style|hover style|pressed style|disabled style|selected style|readonly style|loading style|success style|warning style|error style|active style|visited style|empty state style/.test(coreText)) return "style-state";
    if (/\btokens?\b|variable|design tokens|component token|semantic token|motion token|color token|theme token|typography token|spacing token|size token|radius token|shadow token|z-index token|border token|opacity token/.test(coreText)) return "style-token";
    if (/focus style|focus ring|focus outline/.test(coreText)) return "style-border";
    if (/icon stroke/.test(coreText)) return "style-icons";
    if (/scrollbar style/.test(coreText)) return "style-platform";
    if (/dragging style|drag style/.test(coreText)) return "style-shadow";
    if (/platform|responsive|breakpoint|container query|safe area|print|cursor|pointer|rtl|touch/.test(coreText)) return "style-platform";
    if (/focus ring|focus outline/.test(coreText)) return "style-border";
    if (/brand gradient/.test(coreText)) return "style-gradient";
    if (/color token|theme token|primary color|secondary color|accent color|neutral color|background color|foreground color|surface color|border color|divider color|text color|link color|success color|warning color|error color|info color|disabled color|hover color|pressed color|focus color|selected color|overlay color|palette/.test(coreText)) return "style-color";
    if (/typography token|font|typography|heading|body text|caption|line height|letter spacing|text alignment|text truncation|multi-line clamp|text case|readable width|code font|numeric font|link style/.test(coreText)) return "style-type";
    if (/spacing token|size token|spacing|padding|margin|gap|touch target size|grid gap|content width|min width|max width|min height|max height|^width$|^height$|breakpoint|container query|safe area/.test(coreText)) return "style-spacing";
    if (/radius token|border radius|pill radius|square corner|image radius|decorative shape/.test(coreText)) return "style-radius";
    if (/shadow token|z-index token|shadow|elevation|z-index|z index|stacking order|raised effect|inset effect/.test(coreText)) return "style-shadow";
    if (/border token|\bborder\b|border width|border style|stroke|outline/.test(coreText)) return "style-border";
    if (/icon stroke|line icon|filled icon|duotone icon|icon size|icon style|illustration|logo|aspect ratio|image mask/.test(coreText)) return "style-icons";
    if (/dark mode|dark theme|high contrast/.test(coreText)) return "style-dark";
    if (/theme|light theme|system theme/.test(coreText)) return "style-theme";
    if (/brand feel|brand illustration|brand color|visual language|logo/.test(coreText)) return "style-brand";
    if (/gradient/.test(coreText)) return "style-gradient";
    if (/transparency|opacity|backdrop blur|glassmorphism|reduced transparency/.test(coreText)) return "style-transparency";
    if (/shadow|elevation|z-index|z index|stacking order|raised effect|inset effect/.test(coreText)) return "style-shadow";
    if (/typography|font|text|heading|body|caption|line height|letter spacing|alignment|truncation|clamp|case|readable width|code font|numeric font|link style/.test(coreText)) return "style-type";
    if (/density|comfortable density|compact density|spacious density/.test(coreText)) return "style-density";
    if (/spacing|padding|margin|gap|size|width|height|breakpoint|container query|safe area/.test(coreText)) return "style-spacing";
    if (/border color|divider color|text color|link color|success color|warning color|error color|info color|disabled color|hover color|pressed color|focus color|selected color|overlay color|palette|primary color|secondary color|accent color|neutral color|background color|foreground color|surface color/.test(coreText)) return "style-color";
    if (/divider|stroke|outline|border width|border style|scrollbar/.test(coreText)) return "style-divider";
    if (/border|radius|corner|shape|image radius|image mask|decorative shape/.test(coreText)) return "style-radius";
    if (/icon|illustration|aspect ratio/.test(coreText)) return "style-icons";
    if (/emphasis|highlight/.test(coreText)) return "style-emphasis";
    if (/radius|shape|border|elevation|shadow|圆角|边框|阴影|层级/.test(text)) return "style-radius";
    if (/icon|illustration|图标|插画/.test(text)) return "style-icons";
    if (/color|theme|brand|色|主题|品牌/.test(text)) return "style-color";
    if (/type|font|text|heading|字体|文本|标题/.test(text)) return "style-type";
    if (/space|spacing|size|density|间距|尺寸|密度/.test(text)) return "style-spacing";
    if (/gradient|透明|glass|blur|渐变/.test(text)) return "style-gradient";
    if (/token|variable|semantic|design token|令牌|变量/.test(text)) return "style-token";
    if (/loading|state|feedback|加载|状态|反馈/.test(text)) return "style-color";
    return "style-divider";
  }

  if (category === "motion") {
    if (/selection motion|selection feedback/.test(coreText)) return "motion-press";
    if (/drawer motion|bottom sheet motion|route transition/.test(coreText)) return "motion-slide";
    if (/skeleton shimmer|progress motion|spin motion|infinite scroll loading/.test(coreText)) return "motion-loading";
    if (/haptic feedback/.test(coreText)) return "motion-haptic";
    if (/count up|number transition/.test(coreText)) return "motion-number";
    if (/stagger motion|stagger/.test(coreText)) return "motion-stagger";
    if (/spring motion|bounce motion|spring|bounce/.test(coreText)) return "motion-spring";
    if (/dialog motion|popover motion/.test(coreText)) return "motion-overlay";
    if (/menu open motion|menu motion/.test(coreText)) return "motion-menu";
    if (/tabs motion|tab motion/.test(coreText)) return "motion-tabs";
    if (/pull to refresh/.test(coreText)) return "motion-pull-refresh";
    if (/chart animation/.test(coreText)) return "motion-chart";
    if (/\bfade\b|fade in|fade out/.test(coreText)) return "motion-fade";
    if (/attention|warning feedback|attention motion|warning motion/.test(coreText)) return "motion-attention";
    if (/spatial motion|spatial/.test(coreText)) return "motion-spatial";
    if (/shake|shake feedback/.test(coreText)) return "motion-error";
    if (/confetti|celebration|celebrate/.test(coreText)) return "motion-success";
    if (/hover feedback|hover motion/.test(coreText)) return "motion-hover";
    if (/expand|collapse|accordion|row expand|row collapse/.test(text)) return "motion-expand";
    if (/list|insert|remove|reorder|sort|table row|row/.test(text)) return "motion-list";
    if (/bottom sheet drag|dragging|drag|gesture|swipe|pan/.test(text)) return "motion-drag";
    if (/scale|zoom/.test(text)) return "motion-scale";
    if (/long press|keyboard motion|keyboard|focus motion|hover feedback/.test(text)) return "motion-press";
    if (/reduced|prefers-reduced-motion|performance|screen reader|announced|a11y|accessibility/.test(text)) return "motion-reduced";
    if (/slide|drawer|bottom sheet|\bsheet\b|page transition|page enter|page exit|route transition|spatial transition/.test(text)) return "motion-slide";
    if (/dragging|drag|gesture|swipe|pan/.test(text)) return "motion-drag";
    if (/drag|gesture|swipe|拖|滑|手势/.test(text)) return "motion-drag";
    if (/ripple|tap|press|click|水波纹|按下|点击/.test(text)) return "motion-press";
    if (/load|progress|skeleton|加载|进度/.test(text)) return "motion-loading";
    if (/easing|duration|timing|delay|stagger|缓动|时长|延迟/.test(text)) return "motion-fade";
    if (/reduced|performance|screen reader|announced|可访问|性能|读屏|公告/.test(text)) return "motion-fade";
    if (/slide|drawer|sheet|bottom sheet|page|transition|滑入|页面|转场|底部面板/.test(text)) return "motion-slide";
    if (/scale|缩放/.test(text)) return "motion-press";
    if (/success|complete|成功|完成/.test(text)) return "motion-success";
    if (/error|失败|错误/.test(text)) return "motion-error";
    return "motion-fade";
  }

  if (category === "patterns") {
    if (/leave confirmation|terms acceptance/.test(text)) return "pattern-form";
    if (/delete account/.test(text)) return "pattern-delete";
    if (/device management|api key management/.test(text)) return "pattern-operation";
    if (/edit profile/.test(text)) return "pattern-form";
    if (/view product detail|product detail/.test(text)) return "pattern-checkout";
    if (/column visibility|bulk selection/.test(text)) return "pattern-operation";
    if (/view faq|contact support|view ticket|release notes|faq|support|ticket/.test(text)) return "pattern-feedback";
    if (/order tracking/.test(text)) return "pattern-operation";
    if (/recording|voice input|recorder|audio recorder|video recorder/.test(text)) return "pattern-media";
    if (/scan qr|qr login|qr code/.test(text)) return "pattern-mobile";
    if (/document viewing|pdf reading|file preview|file playback|media preview|media playback|image preview|video playback|audio playback|rename file|move file|file rename|file move|file download|file share|delete file|download invoice/.test(text)) return "pattern-media";
    if (/payment failed|request refund|return item|remove from cart|order confirmation|cancel subscription/.test(text)) return "pattern-checkout";
    if (/permission request/.test(text)) return "pattern-mobile";
    if (/bottom sheet selection|mobile filtering|mobile sorting|sticky bottom action/.test(text)) return "pattern-mobile";
    if (/submit failure/.test(text)) return "pattern-delete";
    if (/submit feedback|submit ticket/.test(text)) return "pattern-form";
    if (/error message|success message|warning message|info message|system announcement|notification|reminder|offline notice|reconnect notice|maintenance notice|update prompt|rate experience|feedback/.test(text)) return "pattern-feedback";
    if (/network error|offline mode|timeout|permission denied|unauthenticated|not found|server error|maintenance|version upgrade|resource expired|rate limited|empty project|partial success|degraded experience|first load|retry failed action/.test(text)) return "pattern-feedback";
    if (/empty state guidance/.test(text)) return "pattern-onboarding";
    if (/role permissions/.test(text)) return "pattern-collaboration";
    if (/location permission|push permission/.test(text)) return "pattern-mobile";
    if (/stop ai generation|continue generation|regenerate|ai tool calling|apply ai suggestion/.test(text)) return "pattern-operation";
    if (/save draft|autosave|submitting|submit success|prevent duplicate submit/.test(text)) return "pattern-operation";
    if (/ai generation|stop ai generation|continue generation|regenerate|ai rewrite|ai translation|ai summary|ai q&a|ai classification|ai extraction|ai recommendation|ai autocomplete|ai code suggestion|ai citation|ai tool calling|ai feedback|apply ai suggestion|low confidence|ai safety|ai context/.test(text)) return "pattern-ai";
    if (/file preview|file playback|media preview|media playback|reading mode|image crop|crop image|rename file|move file|file rename|file move/.test(text)) return "pattern-media";
    if (/upload|file|media|camera upload|image picking/.test(text)) return "pattern-upload";
    if (/retry|undo|redo|conflict|optimistic|status update|data update|refresh|rollback/.test(text)) return "pattern-operation";
    if (/invite|team|share|comment|mention|realtime|presence|activity log|approval|assign|message|report|block user|collaboration/.test(text)) return "pattern-collaboration";
    if (/success message|warning message|info message|announcement|notification|reminder|offline|reconnect|rate experience|feedback/.test(text)) return "pattern-feedback";
    if (/swipe|bottom sheet|sticky bottom|keyboard avoidance|image picking|mobile/.test(text)) return "pattern-mobile";
    if (/view detail|detail|edit|create|duplicate|archive|restore|clone|publish|import|export|download|refresh/.test(text)) return "pattern-operation";
    if (/login|signup|auth|account|登录|注册|认证|账户/.test(text)) return "pattern-login";
    if (/search|filter|sort|browse|搜索|筛选|排序|浏览/.test(text)) return "pattern-search";
    if (/delete|remove|confirm|删除|确认/.test(text)) return "pattern-delete";
    if (/checkout|payment|cart|commerce|支付|结算|购物/.test(text)) return "pattern-checkout";
    if (/upload|file|media|文件|上传|媒体/.test(text)) return "pattern-upload";
    if (/error|not found|network|empty|permission|forbidden|unauthorized|location permission|错误|不存在|权限|授权/.test(text)) return "pattern-form";
    if (/ai|generation|prompt|model|citation|人工智能|生成|模型|引用/.test(text)) return "pattern-form";
    if (/view detail|detail|edit|create|duplicate|archive|restore|详情|编辑|创建|复制|归档|恢复/.test(text)) return "pattern-search";
    if (/form|submit|validation|表单|提交|校验/.test(text)) return "pattern-form";
    return "pattern-onboarding";
  }

  if (category === "mobile") return "mobile-preview";
  if (category === "dictionary") return "term-card";

  if (/form success/.test(text)) return "toast";
  if (/form warning|validation message/.test(text)) return "alert";
  if (/docs navigation|document navigation/.test(text)) return "sidebar";
  if (/product image carousel|image carousel/.test(text)) return "carousel";
  if (/pricing table/.test(text)) return "table";
  if (/tree select|transfer|icon picker|emoji picker/.test(text)) return "select";
  if (/like selection|reaction/.test(text)) return "rating";
  if (/column settings|column picker|column visibility/.test(text)) return "table";
  if (/segmented control/.test(text)) return "switcher";
  if (/split button|bulk action bar|row actions|card actions/.test(text)) return "button";

  if (/external link|skip link/.test(text)) return "link";
  if (/decorative icon|brand icon|expand icon/.test(text)) return "icon-system";
  if (/close button|more button|help button|favorite button/.test(text)) return "icon-button";
  if (/components-tag|\btag\b|\bchip\b/.test(text)) return "tag";
  if (/card header|card footer|stat card|metric card|profile card|detail list|avatar group|result page/.test(text)) return "card";
  if (/countdown/.test(text)) return "status-indicator";
  if (/unauthenticated|empty result|no results/.test(text)) return "empty";
  if (/navigation drawer|detail drawer|bottom sheet|notification center/.test(text)) return "drawer";
  if (/fullscreen modal|full-screen modal|non-modal dialog|form dialog|backdrop|portal|session timeout|permission dialog|share dialog|lightbox/.test(text)) return "modal";
  if (/mobile toast|snackbar|system notification|info alert|success state/.test(text)) return "toast";
  if (/treemap|chart tooltip|chart refresh|chart export/.test(text)) return "chart";
  if (/flowchart editor|text editor|rich text editor|markdown editor|diff viewer|multilingual content editor/.test(text)) return "editor";
  if (/formula editor/.test(text)) return "form";
  if (/editor toolbar|formatting toolbar|floating formatting toolbar/.test(text)) return "toolbar";
  if (/preview toggle|rtl toggle/.test(text)) return "switch";
  if (/file thumbnail|folder|file path|file version|file grid|code file viewer/.test(text)) return "file-preview";
  if (/avatar upload/.test(text)) return "file-upload";
  if (/image grid|image viewer|image preview|responsive image|cover image|thumbnail|image cropper|image compare|\bimage\b/.test(text)) return "file-preview";
  if (/waveform/.test(text)) return "media-player";
  if (/product grid|product price|original price|discount price|coupon input|quantity selector/.test(text)) return "shopping-cart";
  if (/card form|login form|signup form|forgot password|reset password|login panel|signup panel/.test(text)) return "form";
  if (/user menu|account menu/.test(text)) return "menu";
  if (/session management|account deletion|token meter|quota meter|usage meter|backup codes/.test(text)) return "security";
  if (/model selector|tool selector|mode selector|prompt suggestions|prompt template|prompt variables|generated result|ai translation result|ai rewrite suggestion|inline suggestion|token usage|cost estimate|context window/.test(text)) return "command-palette";
  if (/ai feedback form/.test(text)) return "form";
  if (/locale selector|currency selector|timezone selector|country selector|unit switcher|measurement system switcher/.test(text)) return "select";
  if (/address format|phone number/.test(text)) return "form";
  if (/locale-aware search|localized search/.test(text)) return "search";
  if (/locale-aware sort|localized sorting/.test(text)) return "sort-control";
  if (/checkout bar|sticky checkout|cart bar|mobile coupon|mobile order card|mobile voice input|mobile voice recorder|audio recorder|video recorder|mobile navigation drawer|permission prompt/.test(text)) return "mobile-preview";
  if (/waiting upload|upload paused|previewing/.test(text)) return "progress";
  if (/in-stock|low-stock|out-of-stock|preorder|pending payment|payment processing|payment success|payment failed|subscription active|subscription expired/.test(text)) return "shopping-cart";
  if (/column hidden|column visible|row disabled|row expanded|row collapsed|column frozen|column pinned|resizing column|cell editing|row editing/.test(text)) return "data-grid";
  if (/kanban|activity feed|thumbs feedback|qr login|scan qr|download invoice|request refund|return item|remove from cart|order confirmation/.test(text)) return "pattern-operation";

  if (/spreadsheet|spreadsheet editor/.test(text)) return "editor";
  if (/date range picker|date picker|month picker|year picker|time picker|calendar picker/.test(text)) return "date-picker";
  if (/date format|date localization|localized date|timezone format/.test(text)) return "i18n";
  if (/non-modal dialog|lightweight overlay|hover overlay|inline overlay/.test(text)) return "popover";
  if (/loading overlay|progress overlay/.test(text)) return "progress";
  if (/context menu|action menu|overflow menu/.test(coreText)) return "menu";
  if (/toolbar|tool bar|format bar/.test(coreText)) return "toolbar";
  if (/progress stepper/.test(text)) return "stepper";
  if (/quantity stepper/.test(text)) return "quantity-stepper";
  if (/slider|range slider|stepper/.test(coreText)) return "slider";
  if (/spinner|loader/.test(text)) return "spinner";
  if (/skeleton|placeholder|loading placeholder|shimmer/.test(text)) return "skeleton";
  if (/paragraph|caption|body text|helper text|description text|text block/.test(text)) return "text-content";
  if (/table of contents/.test(text)) return "list";
  if (/code editor/.test(text)) return "editor";
  if (/message actions menu|actions menu|action menu/.test(text)) return "menu";
  if (/floating action button/.test(text)) return "floating-action-button";
  if (/feedback buttons/.test(text)) return "button";
  if (/back button/.test(text)) return "back-button";
  if (/otp input|pin input|verification code input|authenticator code input|recovery code input/.test(text)) return "otp-input";
  if (/payment form/.test(text)) return "form";
  if (/components-data-grid|data grid/.test(text)) return "data-grid";
  if (/api reference table|props table|table pagination|tree table|empty table state/.test(text)) return "table";
  if (/filter form|filter menu|clear filters/.test(text)) return "filter-panel";
  if (/sort menu|table sort|locale-aware sort menu/.test(text)) return "sort-control";
  if (/filter chip/.test(text)) return "tag";
  if (/table filter/.test(text)) return "data-grid";
  if (/date display|time display|relative time|reading time/.test(text)) return "text-content";
  if (/chart filter|time range control/.test(text)) return "chart";
  if (/empty cart/.test(text)) return "empty";
  if (/captcha|human verification/.test(text)) return "security";
  if (/document viewer|pdf viewer|file viewer|reading mode/.test(text)) return "file-preview";
  if (/empty help state/.test(text)) return "empty";
  if (/payment status|order status|refund status/.test(text)) return "shopping-cart";
  if (/file picker|image picker|avatar picker|payment method selector/.test(text)) return "select";
  if (/stop generating button|feedback buttons|thumbs feedback|copy result button|social share button|add to cart button|record button/.test(text)) return "button";
  if (/feedback form|ai feedback form|formula editor/.test(text)) return "form";
  if (/feedback entry/.test(text)) return "button";
  if (/document upload|avatar upload|video upload|audio upload/.test(text)) return "file-upload";
  if (/file share|copy file|file download|bulk download/.test(text)) return "file-action";
  if (/file delete confirmation/.test(text)) return "modal";
  if (/virus scan status/.test(text)) return "security";
  if (/session timeout dialog/.test(text)) return "modal";
  if (/background image/.test(text)) return "file-preview";
  if (/pull to refresh/.test(text)) return "progress";
  if (/time range picker|week picker|quarter picker/.test(text)) return "date-picker";
  if (/autocomplete/.test(text)) return "autocomplete";
  if (/rating/.test(text)) return "rating";
  if (/language switcher|unit switcher|measurement system switcher|number format|currency format|time format|date format/.test(text)) return "i18n";
  if (/switcher/.test(text)) return "switcher";
  if (/formatted input/.test(text)) return "text";
  if (/table selection column|selected row/.test(text)) return "table";
  if (/file validation status|read receipt/.test(text)) return "status-indicator";
  if (/order card/.test(text)) return "card";

  if (/empty state|empty result|no results|not found|空状态|无结果|不存在/.test(text)) return "empty";
  if (/popover|hover card|浮层|弹出/.test(text)) return "popover";
  if (/tooltip|提示气泡/.test(text)) return "tooltip";
  if (/command palette|command menu|命令面板|命令菜单/.test(text)) return "command-palette";
  if (/radio|单选/.test(text)) return "radio";
  if (/checkbox|复选/.test(text)) return "checkbox";
  if (/switch|toggle|开关|切换/.test(text)) return "switch";
  if (/date picker|calendar picker|time picker|日期选择|日历选择|时间选择/.test(text)) return "date-picker";
  if (/dropdown|select|selector|picker|combobox|cascader|下拉|选择器|选择|级联/.test(text)) return "select";
  if (/timeline|activity log|changelog|version history|tracking|时间线|历史|日志|追踪/.test(text)) return "timeline";
  if (/carousel|轮播/.test(text)) return "carousel";
  if (/action sheet|操作面板/.test(text)) return "action-sheet";
  if (/drawer|bottom sheet|sheet|抽屉|底部面板/.test(text)) return "drawer";
  if (/button|cta|action|按钮/.test(text)) return text.includes("icon") || title.includes("图标") ? "icon-button" : "button";
  if (/list|tree|feed|列表|树|活动流/.test(text)) return "list";
  if (/\b(accessible|accessibility|a11y|aria)\b|screen reader|announced|skip target|error association|live region|alt text|caption|无障碍|读屏/.test(text)) return "a11y";
  if (/focus trap|focus ring|focus return|keyboard navigation/.test(text)) return "a11y-focus";
  if (/drawer|action sheet|bottom sheet|sheet|抽屉|操作面板|底部面板/.test(text)) return "drawer";
  if (/backdrop|overlay|遮罩|覆盖层/.test(text)) return "modal";
  if (/drag handle|resize handle|resizer|handle/.test(text)) return "divider";
  if (/human verification|captcha|mfa|two-factor|permission|verification/.test(text)) return "security";
  if (/shipping address|billing address|delivery address|配送地址|账单地址|收货地址/.test(text)) return "card";
  if (/recorder|recording|\bvoice\b|audio|video|camera|microphone/.test(text)) return "media-player";
  if (/checkout|cart|stock|saved items|subscription|billing|invoice|receipt|shipment|refund|\border\b|payment|price|commerce/.test(text)) {
    if (/confirmation|confirm|cancel/.test(text)) return "modal";
    if (/tracking|shipment/.test(text)) return "timeline";
    if (/status|stock|refund/.test(text)) return "status-indicator";
    if (/address|invoice|receipt|billing/.test(text)) return "card";
    return "shopping-cart";
  }
  if (/form|validation|fieldset|field set|settings|preferences|configuration|field group|form item|form group/.test(text)) {
    if (/error|invalid|failed/.test(text)) return "alert";
    if (/validation summary/.test(text)) return "alert";
    if (/summary|\bcounter\b|\bcount\b/.test(text)) return "status-indicator";
    return "form";
  }
  if (/loading|progress|skeleton|spinner|加载|进度|骨架/.test(text)) return "progress";
  if (/status|state|result|indicator|quality|health|connection|online|offline|success|error|expired|rate limit|save status|sync status|send status|approval|countdown|counter|delta|trend/.test(text)) {
    if (/error|failed|server error|expired|rate limit/.test(text)) return "alert";
    if (/success|saved|synced|sent|approval/.test(text)) return "toast";
    return "status-indicator";
  }
  if (/audit log|activity log|changelog|version history|history|tracking|timeline/.test(text)) return "timeline";
  if (/metadata|money display|amount|invoice|receipt|summary/.test(text)) return "card";

  if (/skeleton|placeholder|loading placeholder|shimmer|loader|spinner|loading|progress|骨架|占位|加载|进度/.test(text)) {
    if (/spinner|loader|加载器/.test(text)) return "spinner";
    if (/progress|进度/.test(text)) return "progress";
    return "skeleton";
  }
  if (/map legend|map chart|geo heatmap/.test(text)) return "map";
  if (/chart|graph|plot|axis|legend|visualization|heatmap|radar|scatter|sparkline|funnel|gauge|treemap|图表|可视化|坐标轴/.test(text)) return "chart";
  if (/text ?area|textarea|multi-line|multiline|多行/.test(text)) return "textarea";
  if (/password|密码/.test(text)) return "password-field";
  if (/search|搜索/.test(text)) return "search";
  if (/input|field|otp|\bpin\b|email|phone|url|number field|currency field|输入|验证码/.test(text)) return "text";
  if (/\b(date|calendar|time|month|year|week|quarter|timezone)\b|日期|日历|时间|月份|年份|星期|季度|时区/.test(text)) return "date-picker";
  if (/text|heading|subtitle|paragraph|caption|helper|description|label|mark|文本|标题|副标题|段落|说明|辅助|描述|标签文本|标记/.test(text)) return "text-content";
  if (/icon|图标/.test(text)) return "icon-system";
  if (/divider|spacer|separator|分割|间隔/.test(text)) return "divider";
  if (/container|section|panel|surface|legend|容器|区块|面板|表面|图例/.test(text)) return "panel";
  if (/barcode|qr code|\bqr\b/.test(text)) return "barcode";
  if (/keyboard key|shortcut|键盘|按键/.test(text)) return "keyboard-key";
  if (/code|blockquote|代码|引用/.test(text)) return "code-block";
  if (/editor|canvas|toolbar|rich text|markdown|design|编辑器|画布|创作/.test(text)) return "editor";
  if (/security|auth|permission|role|password|mfa|captcha|安全|权限|角色|认证|验证码/.test(text)) return "security";
  if (/map|location|spatial|地图|位置|空间/.test(text)) return "map";
  if (/help|docs|support|faq|帮助|文档|支持/.test(text)) return "help";
  if (/\b(accessibility|a11y|aria)\b|screen reader|focus|无障碍|读屏|焦点/.test(text)) return "a11y";
  if (/international|i18n|locale|language|rtl|国际化|语言|地区/.test(text)) return "i18n";
  if (/button|cta|action|按钮/.test(text)) return text.includes("icon") || title.includes("图标") ? "icon-button" : "button";
  if (/link|链接/.test(text)) return "link";
  if (/checkbox|复选/.test(text)) return "checkbox";
  if (/radio|单选/.test(text)) return "radio";
  if (/switch|toggle|开关|切换/.test(text)) return "switch";
  if (/rating|评分|星级/.test(text)) return "rating";
  if (/slider|range|stepper|滑杆|步进/.test(text)) return "slider";
  if (/select|selector|picker|combobox|autocomplete|dropdown|cascader|下拉|选择|选择器|级联/.test(text)) return "select";
  if (/modal|dialog|alert dialog|弹窗|对话框|确认框/.test(text)) return "modal";
  if (/drawer|sheet|抽屉|底部面板|侧边面板/.test(text)) return "drawer";
  if (/popover|hover card|popup|浮层|弹出/.test(text)) return "popover";
  if (/tooltip|提示气泡/.test(text)) return "tooltip";
  if (/toast|snackbar|轻提示/.test(text)) return "toast";
  if (/alert|banner|notice|callout|警告|提示|横幅/.test(text)) return "alert";
  if (/notification|通知/.test(text)) return "notification";
  if (/skeleton|placeholder|骨架|占位/.test(text)) return "skeleton";
  if (/spinner|loader|加载器/.test(text)) return "spinner";
  if (/progress|进度/.test(text)) return "progress";
  if (/empty|no results|not found|空状态|无结果|404/.test(text)) return "empty";
  if (/\b(table|grid|cell|row|column)\b|表格|网格/.test(text)) return "table";
  if (/card|profile|product|\border\b|卡片|资料/.test(text)) return "card";
  if (/nav|breadcrumb|pagination|tabs|tab|step|sidebar|导航|面包屑|分页|标签页|步骤/.test(text)) {
    if (/breadcrumb|面包屑/.test(text)) return "breadcrumb";
    if (/pagination|分页/.test(text)) return "pagination";
    if (/tabs|tab|标签页/.test(text)) return "tabs";
    if (/sidebar|侧边/.test(text)) return "sidebar";
    if (/bottom|底部/.test(text)) return "bottom-navigation";
    return "top-navigation";
  }
  if (/badge|status dot|tag|chip|徽标|标签|状态点/.test(text)) return "badge";
  if (/avatar|头像/.test(text)) return "avatar";
  if (/menu|command|shortcut|菜单|命令|快捷键/.test(text)) return "menu";
  if (/file preview|pdf viewer|document viewer|file viewer|reading mode/.test(text)) return "file-preview";
  if (/file download|bulk download|rename file|move file|remove file/.test(text)) return "file-action";
  if (/file|upload|dropzone|download|文件|上传|下载/.test(text)) return "file-upload";
  if (/media|video|audio|player|image|camera|媒体|视频|音频|图片|相机/.test(text)) return "media-player";
  if (/chat|message|comment|conversation|聊天|消息|评论|会话/.test(text)) return text.includes("comment") || title.includes("评论") ? "comment-box" : "chat-bubble";
  if (/cart|commerce|payment|\border\b|coupon|price|购物|支付|订单|优惠/.test(text)) return "shopping-cart";
  if (/map|location|地图|位置/.test(text)) return "layout-detail";
  if (/ai|prompt|model|tool|citation|人工智能|生成|模型|引用/.test(text)) return "command-palette";
  return "taxonomy";
}

function generatedVariants(title, english, category, group) {
  const text = `${title} ${english} ${group}`.toLowerCase();
  if (category === "layouts") {
    if (/single column|one column/.test(text)) return ["单列阅读", "固定宽度", "长文内容", "响应式"];
    if (/two column|two-column/.test(text)) return ["双栏", "主次栏", "响应式折叠", "内容优先"];
    if (/three column|three-column/.test(text)) return ["三栏", "左中右", "属性栏", "可调整"];
    if (/masonry/.test(text)) return ["瀑布流", "高低卡片", "图片网格", "响应式"];
    if (/sticky header/.test(text)) return ["吸顶顶部", "滚动内容", "章节导航", "阴影反馈"];
    if (/sticky action bar|bottom action bar/.test(text)) return ["吸底操作", "未保存", "确认操作", "移动适配"];
    if (/bottom sheet layout|mobile bottom sheet/.test(text)) return ["底部面板", "半屏", "拖拽柄", "移动布局"];
    if (/map layout|map page|location layout|spatial layout/.test(text)) return ["地图布局", "图层列表", "点位详情", "路线操作"];
    if (/profile page/.test(text)) return ["资料页", "头像区域", "统计信息", "内容列表"];
    if (/search results/.test(text)) return ["搜索结果", "筛选侧栏", "结果列表", "空结果"];
  }
  if (/button|按钮/.test(text)) return ["主操作", "次操作", "危险操作", "加载中", "禁用"];
  if (/input|field|表单|输入/.test(text)) return ["默认", "聚焦", "已填写", "错误", "只读"];
  if (/modal|dialog|drawer|popover|tooltip|弹|浮层|抽屉/.test(text)) return ["关闭", "打开", "含操作", "加载中", "移动端"];
  if (/table|grid|list|表格|列表/.test(text)) return ["默认", "可筛选", "选中", "空状态", "错误"];
  if (/state|状态/.test(text)) return ["触发前", "进行中", "完成", "失败", "可恢复"];
  return generatedCategoryDetails[category]?.variants || generatedCategoryDetails.components.variants;
}

function generatedRelated(preview, category) {
  const relations = {
    button: ["link", "icon-button", "tooltip"],
    link: ["button", "breadcrumb"],
    text: ["form", "search", "select"],
    textarea: ["text-field", "form"],
    search: ["autocomplete", "filter-panel"],
    select: ["dropdown", "radio", "checkbox"],
    modal: ["drawer", "popover", "toast"],
    drawer: ["modal", "sidebar", "filter-panel"],
    "action-sheet": ["drawer", "menu", "modal"],
    popover: ["tooltip", "menu", "select"],
    toast: ["alert", "notification"],
    table: ["data-grid", "pagination", "filter-panel"],
    card: ["list", "badge"],
    list: ["table", "timeline"],
    "file-upload": ["progress", "toast"],
    "file-preview": ["file-upload", "media-player", "card"],
    "file-action": ["file-upload", "button", "toast"],
    "media-player": ["progress", "toolbar"],
    switcher: ["tabs", "select", "segmented-control"],
    "quantity-stepper": ["button", "text-field", "slider"],
    barcode: ["media-player", "security", "text-content"],
    "shopping-cart": ["checkout-page", "toast"],
    "pattern-operation": ["button", "toast", "table"],
    "pattern-collaboration": ["avatar", "comment-box", "notification"],
    "pattern-feedback": ["toast", "alert", "notification"],
    "pattern-ai": ["command-palette", "editor", "code-block"],
    "pattern-media": ["media-player", "file-upload", "card"],
    "pattern-mobile": ["mobile-preview", "bottom-navigation", "action-sheet"],
    "style-token": ["design-tokens", "theme-token", "semantic-token"],
    "style-color": ["color-token", "theme-token", "contrast"],
    "style-type": ["typography-token", "text-content", "i18n"],
    "style-spacing": ["spacing-token", "layout-grid", "mobile-preview"],
    "style-radius": ["radius-token", "card", "image-radius"],
    "style-border": ["border-token", "a11y-focus", "divider"],
    "style-shadow": ["shadow-token", "modal", "z-index"],
    "style-transparency": ["opacity-token", "overlay", "style-dark"],
    "style-gradient": ["brand-gradient", "style-color", "style-brand"],
    "style-icons": ["icon-button", "icon-system", "a11y"],
    "style-density": ["table", "touch-target-size", "layout-dashboard"],
    "style-dark": ["dark-theme", "style-color", "a11y"],
    "style-theme": ["theme-token", "dark-mode", "style-token"],
    "style-brand": ["brand-color", "logo-style", "style-gradient"],
    "style-platform": ["breakpoint", "safe-area", "layout-grid"],
    "style-state": ["hover-style", "pressed-style", "disabled-style"],
    "style-emphasis": ["highlight-style", "alert", "selected-style"],
    "react-matrix": ["variantmatrix", "statematrix", "proptable"],
    "react-docs": ["docsnav", "docstoc", "keyboardshortcuttable"],
    "react-control": ["themetoggle", "densitytoggle", "languagetoggle"],
    "react-ui": ["colorswatch", "spacingscale", "typographyscale"],
    "layout-docs-help": ["docs-navigation", "faq-list", "support-entry"],
    "layout-error-page": ["error-state", "retry-button", "status-page"],
    "layout-maintenance-page": ["maintenance-state", "status-page", "notification-banner"],
    "layout-inbox": ["notification-list", "message-list", "mail-layout"],
    "layout-chat": ["support-chat", "message-list", "chat-bubble"],
    "layout-ide": ["code-block", "file-tree", "terminal"],
    "layout-whiteboard": ["canvas", "toolbar", "sticky-note"],
    "layout-kanban": ["kanban", "board-card", "dragging-style"],
    "layout-calendar": ["date-picker", "calendar", "time-localization"],
    "layout-timeline": ["timeline", "activity-feed", "status-badge"],
    "layout-filter-results": ["filter-panel", "search-results-list", "pagination"],
    "layout-mobile-chat": ["mobile-keyboard-accessory", "message-list", "safe-area-style"],
    "a11y-name": ["form-association", "screen-reader-text", "a11y-focus"],
    "a11y-structure": ["accessibility-skip-link", "heading-structure", "a11y-focus"],
    "a11y-focus": ["keyboard-key", "focus-order", "focus-trap"],
    "a11y-announcement": ["live-region", "toast", "status-indicator"],
    "a11y-contrast": ["style-color", "high-contrast-mode", "a11y"],
    "a11y-motion": ["motion-reduced", "switch", "style-transparency"],
    "a11y-target": ["touch-target-size", "button", "mobile-preview"],
    "a11y-form": ["text-field", "alert", "a11y-name"],
    "a11y-alt-text": ["media-player", "chart", "text-content"],
    "a11y-testing": ["a11y-focus", "a11y-contrast", "a11y-name"],
    "i18n-locale": ["select", "language-selector", "i18n-format"],
    "i18n-translation": ["code-block", "alert", "text-content"],
    "i18n-plural": ["text-content", "i18n-format", "badge"],
    "i18n-format": ["date-picker", "text-content", "i18n-locale"],
    "i18n-direction": ["layout-two", "text-content", "i18n-text"],
    "i18n-text": ["text-content", "tooltip", "i18n-direction"],
    "i18n-search": ["search", "sort-pattern", "i18n-locale"],
    "i18n-compliance": ["security", "help", "i18n-locale"],
  };
  return relations[preview] || (category === "states" ? ["badge", "toast", "alert"] : ["button", "card"]);
}

const generatedPreviewProfiles = {
  "text-content": {
    noun: "文本层级",
    summary: "呈现可阅读的文字信息和层级关系。",
    variants: ["标题层级", "正文段落", "辅助说明", "必填/可选标记"],
    states: ["默认", "聚焦引用", "截断", "错误提示", "长文本"],
    useCases: ["表单说明", "详情页内容", "帮助文档", "空状态文案"],
    do: ["保持字号、行高和层级清楚。", "长文本要考虑换行、截断和本地化扩展。", "说明文本要贴近相关控件。"],
    dont: ["不要只用颜色区分必填和错误。", "不要让正文承载按钮行为。", "不要把多个层级做成同样重量。"],
  },
  "icon-system": {
    noun: "图标语义",
    summary: "用图形表达动作、状态或品牌含义。",
    variants: ["操作图标", "状态图标", "装饰图标", "品牌图标"],
    states: ["默认", "悬停", "选中", "禁用", "警告"],
    useCases: ["工具栏", "状态提示", "导航入口", "品牌露出"],
    do: ["图标按钮需要可访问名称。", "状态图标要配合文字或颜色以外的线索。", "同一界面保持 stroke 和尺寸一致。"],
    dont: ["不要用装饰图标承载关键操作。", "不要让只有图标的按钮没有 tooltip 或 aria-label。", "不要混用多套风格。"],
  },
  divider: {
    noun: "分隔与空间",
    summary: "通过线条、留白或间隔组织信息关系。",
    variants: ["水平分割", "垂直分割", "留白间隔", "可拖拽分割柄"],
    states: ["默认", "悬停", "拖拽中", "禁用", "响应式折叠"],
    useCases: ["表单分组", "列表分隔", "面板调整", "页面节奏"],
    do: ["分割线要表达真实分组。", "可拖拽柄要有足够触控目标。", "间距应来自统一 spacing scale。"],
    dont: ["不要用过多线条制造噪音。", "不要让拖拽区域不可见。", "不要靠空白隐藏结构关系。"],
  },
  panel: {
    noun: "容器与面板",
    summary: "承载一组相关内容、工具或状态。",
    variants: ["基础容器", "带标题面板", "信息表面", "占位区域"],
    states: ["默认", "选中", "加载", "空内容", "错误"],
    useCases: ["详情区块", "设置分组", "卡片内容", "弹层内容"],
    do: ["容器边界要和内容层级匹配。", "标题、内容、操作区要清楚分离。", "空/加载/错误状态要占位稳定。"],
    dont: ["不要把所有区块都做成厚重卡片。", "不要嵌套过多面板。", "不要省略容器的响应式宽度。"],
  },
  "code-block": {
    noun: "代码与文档",
    summary: "展示可复制的代码、属性或示例说明。",
    variants: ["行内代码", "代码块", "属性表", "复制按钮"],
    states: ["默认", "悬停复制", "复制成功", "错误", "长代码滚动"],
    useCases: ["文档示例", "Prompt 导出", "配置片段", "开发说明"],
    do: ["代码块要保留换行和等宽字体。", "复制反馈要明确。", "长内容要可滚动且不撑破布局。"],
    dont: ["不要把可执行操作藏在纯文本里。", "不要让代码溢出遮挡页面。", "不要省略语言或用途说明。"],
  },
  "keyboard-key": {
    noun: "键盘提示",
    summary: "提示快捷键、焦点路径和键盘替代操作。",
    variants: ["单键", "组合键", "快捷键表", "焦点提示"],
    states: ["默认", "按下", "禁用", "冲突", "已录入"],
    useCases: ["命令面板", "编辑器", "无障碍帮助", "快捷操作"],
    do: ["快捷键要可被键盘用户发现。", "组合键要按平台显示。", "冲突状态要提示替代方案。"],
    dont: ["不要只给鼠标交互。", "不要使用不可聚焦元素模拟按键。", "不要让快捷键和输入框冲突。"],
  },
  "status-indicator": {
    noun: "状态指示",
    summary: "表达系统、数据或任务当前状态。",
    variants: ["状态点", "状态徽章", "进度状态", "连接状态"],
    states: ["正常", "处理中", "警告", "失败", "离线"],
    useCases: ["网络状态", "审批流程", "同步结果", "任务列表"],
    do: ["状态文字要和颜色同时出现。", "异步状态要说明下一步。", "变化需要 aria-live 或可感知反馈。"],
    dont: ["不要只靠红绿颜色表达状态。", "不要用 Toast 替代持久状态。", "不要让状态名和真实数据冲突。"],
  },
  chart: {
    noun: "数据可视化",
    summary: "用图形帮助比较趋势、构成和异常。",
    variants: ["柱状图", "折线图", "饼图", "指标图"],
    states: ["默认", "悬停详情", "筛选后", "空数据", "加载"],
    useCases: ["仪表盘", "指标分析", "报表", "趋势对比"],
    do: ["图表要有标题、单位和图例。", "交互详情不能只依赖 hover。", "空数据和加载状态要可理解。"],
    dont: ["不要用装饰图替代真实比例。", "不要省略轴和单位。", "不要让颜色成为唯一编码。"],
  },
  editor: {
    noun: "编辑器与创作",
    summary: "支持输入、编辑、预览和保存内容。",
    variants: ["文本编辑", "富文本工具栏", "画布编辑", "预览模式"],
    states: ["编辑中", "已保存", "未保存", "冲突", "只读"],
    useCases: ["文档编辑", "设计工具", "邮件编辑", "AI 创作"],
    do: ["编辑区、工具栏和状态栏要分工清楚。", "保存/撤销/冲突状态要可见。", "快捷键要有键盘替代说明。"],
    dont: ["不要只在 hover 时显示关键工具。", "不要让未保存状态不可见。", "不要让编辑器撑破容器。"],
  },
  security: {
    noun: "账户与安全",
    summary: "处理身份、权限、验证和风险反馈。",
    variants: ["登录验证", "权限提示", "角色选择", "安全警告"],
    states: ["未登录", "验证中", "已授权", "被拒绝", "过期"],
    useCases: ["登录流程", "权限管理", "MFA", "隐私设置"],
    do: ["危险和权限变更要明确确认。", "错误说明要可恢复。", "密码/验证码输入要有关联 label。"],
    dont: ["不要模糊错误原因。", "不要用普通弹层处理高风险确认。", "不要把安全状态只放在角落提示。"],
  },
  map: {
    noun: "地图与位置",
    summary: "表达地理位置、路径、区域和定位状态。",
    variants: ["地图视图", "位置选择", "路径", "定位按钮"],
    states: ["定位中", "已定位", "无权限", "无结果", "离线"],
    useCases: ["地址选择", "门店定位", "路线规划", "空间标注"],
    do: ["位置权限要解释用途。", "地图控件要有键盘/列表替代。", "加载失败要保留地址输入路径。"],
    dont: ["不要强制依赖定位权限。", "不要让地图遮住关键表单。", "不要只用地图点表示结果。"],
  },
  help: {
    noun: "帮助与支持",
    summary: "帮助用户理解功能、排错或联系支持。",
    variants: ["FAQ", "帮助入口", "文档导航", "客服卡片"],
    states: ["默认", "搜索中", "无结果", "已解决", "升级支持"],
    useCases: ["帮助中心", "引导说明", "错误恢复", "联系支持"],
    do: ["帮助入口要靠近问题发生处。", "搜索无结果要给替代路径。", "文档内容要能复制或跳转。"],
    dont: ["不要把关键说明只放 tooltip。", "不要用营销文案替代解决步骤。", "不要让帮助弹层挡住原问题。"],
  },
  a11y: {
    noun: "可访问性",
    summary: "确保键盘、读屏、高对比和辅助技术可用。",
    variants: ["可访问名称", "焦点顺序", "读屏公告", "触控目标"],
    states: ["可聚焦", "已公告", "错误公告", "高对比", "减少动效"],
    useCases: ["表单关联", "弹层焦点", "状态变化", "媒体替代文本"],
    do: ["交互元素使用语义化 button/link。", "焦点顺序要符合视觉顺序。", "状态变化要有文本或 live region。"],
    dont: ["不要用 div onClick 模拟控件。", "不要依赖 hover-only 内容。", "不要省略关闭后的 focus return。"],
  },
  "a11y-focus": {
    noun: "焦点与键盘",
    summary: "管理 Tab 顺序、焦点可见性和键盘操作。",
    variants: ["焦点顺序", "焦点陷阱", "焦点返回", "快捷键"],
    states: ["未聚焦", "聚焦", "陷阱内", "返回触发器", "跳过链接"],
    useCases: ["弹层", "菜单", "表单", "命令面板"],
    do: ["焦点必须可见。", "弹层关闭后返回触发器。", "Escape/Enter/Space 行为要明确。"],
    dont: ["不要让键盘用户卡在浮层外。", "不要隐藏当前焦点。", "不要让 Tab 顺序跳来跳去。"],
  },
  i18n: {
    noun: "国际化",
    summary: "适配语言、地区、长文本和双向布局。",
    variants: ["语言切换", "地区格式", "RTL", "长文本扩展"],
    states: ["已翻译", "缺失翻译", "RTL", "LTR", "格式化失败"],
    useCases: ["多语言产品", "日期金额格式", "地址电话格式", "本地化搜索"],
    do: ["文本容器要允许扩展。", "日期、数字、货币要按 locale 格式化。", "RTL 要检查图标方向和布局顺序。"],
    dont: ["不要把文案写死在图片里。", "不要用固定宽度截断长语言。", "不要忽略姓名和地址顺序差异。"],
  },
  "react-component": {
    noun: "React 架构组件",
    summary: "组织页面、Provider、边界和可复用 UI 模块。",
    variants: ["页面组件", "Provider", "Boundary", "列表/详情组件"],
    states: ["挂载", "加载", "错误边界", "空状态", "已更新"],
    useCases: ["应用架构", "页面拆分", "状态提供", "错误兜底"],
    do: ["组件职责要单一。", "边界组件要处理 loading/error/empty。", "Provider 要说明作用域。"],
    dont: ["不要把页面、数据和视觉全塞进一个组件。", "不要省略错误边界。", "不要让 Provider 范围过大。"],
  },
  "react-preview": {
    noun: "预览与检查",
    summary: "展示组件在不同设备、状态和变体下的表现。",
    variants: ["LivePreview", "DeviceFrame", "PreviewCanvas", "PreviewInspector"],
    states: ["桌面端", "移动端", "选中变体", "检查中", "加载失败"],
    useCases: ["组件详情页", "设计验收", "响应式检查", "状态矩阵"],
    do: ["预览要能体现真实状态和尺寸。", "检查器要暴露变体、状态和约束。", "移动端预览不能只是缩小桌面。"],
    dont: ["不要用同一张静态图替代不同状态。", "不要让预览内容和条目名称无关。", "不要省略异常态。"],
  },
  "mobile-preview": {
    noun: "移动端组件",
    summary: "适配触摸目标、窄屏、安全区和手势。",
    variants: ["顶部导航", "底部操作", "手势列表", "设备能力"],
    states: ["默认", "触摸中", "展开", "收起", "权限受限"],
    useCases: ["移动导航", "底部弹层", "滑动操作", "定位/相机/扫码"],
    do: ["触摸目标要足够大。", "关键行为要有点击替代，不依赖 hover。", "底部区域要考虑 safe area。"],
    dont: ["不要把桌面 hover 直接搬到移动端。", "不要让底部面板遮住主操作。", "不要忽略权限拒绝状态。"],
  },
  "pattern-collaboration": {
    noun: "协作流程",
    summary: "组织成员、评论、提及、审批和任务分配之间的多人协作路径。",
    variants: ["成员邀请", "评论线程", "审批流", "实时协作"],
    states: ["待处理", "已提及", "已分配", "冲突", "已完成"],
    useCases: ["团队管理", "任务分派", "评论协作", "审核流程"],
    do: ["协作对象、责任人和下一步要清楚。", "提及和通知要可追踪。", "多人编辑冲突要有恢复路径。"],
    dont: ["不要把协作消息做成一次性 toast。", "不要隐藏审批状态。", "不要让权限和成员身份混在一起。"],
  },
  "pattern-feedback": {
    noun: "通知与反馈流程",
    summary: "处理成功、警告、系统公告、离线重连和提醒中心等反馈路径。",
    variants: ["轻提示", "通知中心", "系统公告", "离线重连"],
    states: ["未读", "已读", "重试中", "已恢复", "需处理"],
    useCases: ["操作反馈", "系统状态", "消息提醒", "异常恢复"],
    do: ["反馈要说明结果和下一步。", "持久状态要有可回看入口。", "离线和重连要保留用户工作。"],
    dont: ["不要让关键错误只短暂闪现。", "不要把所有反馈都做成弹窗。", "不要省略失败后的重试入口。"],
  },
  "pattern-mobile": {
    noun: "移动端任务流",
    summary: "适配手势、底部操作、键盘避让和移动设备能力。",
    variants: ["滑动操作", "底部面板", "底部固定操作", "媒体选择"],
    states: ["默认", "手势中", "展开", "键盘打开", "权限受限"],
    useCases: ["移动列表", "底部选择", "表单输入", "图片选择"],
    do: ["关键操作要适合拇指区域。", "底部面板要考虑 safe area。", "键盘打开时不能遮挡输入和提交。"],
    dont: ["不要依赖 hover。", "不要让滑动手势没有点击替代。", "不要忽略权限拒绝和取消路径。"],
  },
  "style-token": {
    noun: "设计 Token",
    summary: "把跨组件复用的视觉决策整理成可命名、可替换、可审计的变量。",
    variants: ["全局 Token", "语义 Token", "组件 Token", "平台 Token"],
    states: ["默认值", "主题覆盖", "暗色覆盖", "平台覆盖", "废弃迁移"],
    useCases: ["Design System", "主题切换", "跨端同步", "组件资产治理"],
    do: ["Token 名称要表达用途而不是当前数值。", "语义 Token 要能映射到不同品牌和主题。", "废弃 Token 要提供迁移目标。"],
    dont: ["不要让组件直接依赖一次性色值或像素值。", "不要把不同语义的 Token 合并成一个变量。", "不要遗漏暗色、高对比和平台差异。"],
  },
  "style-color": {
    noun: "色彩规则",
    summary: "定义品牌、语义、状态和数据可视化色彩的使用边界。",
    variants: ["品牌色", "语义色", "中性色", "数据色板"],
    states: ["默认", "Hover", "Pressed", "Disabled", "高对比"],
    useCases: ["按钮状态", "反馈提示", "数据图表", "主题系统"],
    do: ["色彩要绑定语义和对比度要求。", "状态色要同时提供文字或图标线索。", "数据色板要检查色盲可辨识性。"],
    dont: ["不要只靠颜色传达错误或成功。", "不要把品牌色无限扩展成整套状态色。", "不要在暗色主题里直接复用亮色值。"],
  },
  "style-type": {
    noun: "字体与文本样式",
    summary: "控制字号、字重、行高、截断和可读宽度，让文本层级稳定可读。",
    variants: ["标题层级", "正文", "辅助说明", "代码/数字字体"],
    states: ["默认", "长文本", "截断", "多语言扩展", "错误提示"],
    useCases: ["详情页", "表单说明", "数据表格", "文档内容"],
    do: ["标题、正文、辅助文本要有明确层级。", "长文本要验证换行、截断和本地化扩展。", "数字和代码可使用专门字体。"],
    dont: ["不要用过小字号承载关键说明。", "不要用负字距压缩文本。", "不要让按钮内长词溢出容器。"],
  },
  "style-spacing": {
    noun: "空间与尺寸",
    summary: "用统一 scale 管理间距、尺寸、断点和触控目标。",
    variants: ["紧凑", "标准", "宽松", "响应式"],
    states: ["桌面", "平板", "移动", "密集数据", "触控模式"],
    useCases: ["页面栅格", "表单布局", "工具栏", "移动端触控"],
    do: ["间距要来自统一 scale。", "固定格式控件要定义稳定宽高。", "触控目标要满足移动端最小尺寸。"],
    dont: ["不要用随机像素修补布局。", "不要让 hover/加载状态改变控件尺寸。", "不要让响应式断点只服务一个页面。"],
  },
  "style-radius": {
    noun: "圆角与形状",
    summary: "定义控件、卡片、图片和装饰形状的几何语言。",
    variants: ["小圆角", "胶囊", "直角", "图片裁切"],
    states: ["默认", "选中", "悬停", "禁用", "品牌化"],
    useCases: ["按钮", "卡片", "头像/图片", "品牌形状"],
    do: ["圆角尺度要和组件尺寸匹配。", "图片裁切要保留主体信息。", "形状变化要服务层级或品牌。"],
    dont: ["不要所有卡片都做成过大的圆角。", "不要用形状替代可见边界。", "不要让裁切破坏内容识别。"],
  },
  "style-border": {
    noun: "边框与描边",
    summary: "通过边框宽度、样式、描边和轮廓表达边界与焦点。",
    variants: ["实线", "虚线", "强调描边", "焦点轮廓"],
    states: ["默认", "Hover", "Focus", "错误", "禁用"],
    useCases: ["输入框", "卡片边界", "焦点环", "可拖拽区域"],
    do: ["边框要和背景有足够对比。", "Focus outline 不应被移除。", "描边宽度要适配图标和组件尺寸。"],
    dont: ["不要只靠浅灰线表达关键边界。", "不要用边框造成布局抖动。", "不要把 icon stroke 和容器边框混用。"],
  },
  "style-shadow": {
    noun: "阴影与层级",
    summary: "表达浮起、覆盖、堆叠顺序和空间关系。",
    variants: ["低层级", "中层级", "高层级", "内阴影"],
    states: ["静止", "悬停", "浮层打开", "拖拽", "暗色主题"],
    useCases: ["弹层", "卡片提升", "拖拽对象", "导航层级"],
    do: ["阴影层级要和 z-index/覆盖关系一致。", "浮层阴影要能区分背景。", "暗色主题要重新校准阴影。"],
    dont: ["不要用阴影替代布局分组。", "不要让 z-index 只靠魔法数字增长。", "不要在密集表格里堆叠重阴影。"],
  },
  "style-transparency": {
    noun: "透明与模糊材质",
    summary: "管理 opacity、backdrop blur、玻璃材质和降透明模式。",
    variants: ["透明层", "遮罩", "玻璃材质", "降透明"],
    states: ["默认", "暗色", "高对比", "降透明", "加载遮罩"],
    useCases: ["Overlay", "导航毛玻璃", "浮层背景", "系统可访问性设置"],
    do: ["透明层下方文字仍要可读。", "支持 reduced transparency 时要有实色替代。", "遮罩要表达阻断程度。"],
    dont: ["不要让玻璃效果降低文本对比度。", "不要把透明度当作禁用状态唯一线索。", "不要在性能敏感区域滥用 blur。"],
  },
  "style-gradient": {
    noun: "渐变",
    summary: "用连续色彩表达品牌、状态过渡或视觉强调。",
    variants: ["品牌渐变", "状态渐变", "背景渐变", "图表渐变"],
    states: ["默认", "暗色", "高对比", "动效中", "禁用"],
    useCases: ["品牌区块", "图表面积", "重点 CTA", "插画背景"],
    do: ["渐变要保留文字对比度。", "关键状态不要只依赖渐变。", "渐变角度和色标要可复用。"],
    dont: ["不要用装饰渐变遮盖真实内容。", "不要让渐变成为唯一品牌识别。", "不要在小控件里塞复杂渐变。"],
  },
  "style-icons": {
    noun: "图标与插画风格",
    summary: "统一图标 stroke、填充、尺寸、插画和品牌图形语言。",
    variants: ["线性图标", "填充图标", "双色图标", "插画"],
    states: ["默认", "选中", "禁用", "危险", "品牌化"],
    useCases: ["工具按钮", "空状态插画", "导航图标", "品牌资产"],
    do: ["图标尺寸和 stroke 要成体系。", "图标按钮要有可访问名称。", "插画要服务真实状态。"],
    dont: ["不要混用多套图标风格。", "不要让装饰图标承载关键操作。", "不要用插画替代错误恢复步骤。"],
  },
  "style-density": {
    noun: "信息密度",
    summary: "控制紧凑、舒适、宽松布局在不同任务下的读取效率。",
    variants: ["紧凑", "标准", "舒适", "宽松"],
    states: ["桌面数据密集", "触控", "移动", "低视力", "批量操作"],
    useCases: ["后台表格", "CRM 列表", "设置页", "移动端表单"],
    do: ["密度切换要保持信息层级。", "紧凑模式仍要保留可点击目标。", "移动端优先考虑触控舒适度。"],
    dont: ["不要只缩小字号来提高密度。", "不要让密集布局破坏焦点状态。", "不要把营销页样式搬到运营工具。"],
  },
  "style-dark": {
    noun: "暗色与高对比",
    summary: "定义暗色模式、高对比模式下的背景、文本和状态层级。",
    variants: ["暗色主题", "高对比", "系统跟随", "夜间降噪"],
    states: ["默认", "Hover", "Focus", "错误", "禁用"],
    useCases: ["系统主题", "夜间使用", "仪表盘", "可访问性模式"],
    do: ["暗色主题要重新计算对比度。", "状态色在暗底上要可读。", "系统主题切换不能闪烁。"],
    dont: ["不要简单反转亮色主题。", "不要让阴影在暗色下消失。", "不要忽略高对比模式。"],
  },
  "style-theme": {
    noun: "主题系统",
    summary: "组织 light/dark/system theme 和品牌覆盖关系。",
    variants: ["亮色", "暗色", "系统", "品牌主题"],
    states: ["初始加载", "切换中", "已保存", "系统变更", "冲突"],
    useCases: ["主题切换", "白标产品", "多品牌后台", "组件库"],
    do: ["主题要基于语义 Token。", "切换过程要避免闪烁。", "用户选择和系统选择要有优先级。"],
    dont: ["不要把主题写死在组件 CSS 里。", "不要只测试亮色主题。", "不要让品牌覆盖破坏可访问性。"],
  },
  "style-brand": {
    noun: "品牌视觉语言",
    summary: "表达品牌气质、标志、图形、插画和视觉节奏。",
    variants: ["品牌色", "Logo", "品牌插画", "视觉语言"],
    states: ["主品牌", "子品牌", "活动态", "暗色", "无障碍替代"],
    useCases: ["品牌页", "产品壳层", "空状态", "营销组件"],
    do: ["品牌元素要和产品任务保持比例。", "Logo 和插画要准备多尺寸版本。", "品牌色要通过语义层进入组件。"],
    dont: ["不要让品牌装饰盖过操作。", "不要用低对比品牌色做正文。", "不要把一次性活动风格写进基础组件。"],
  },
  "style-emphasis": {
    noun: "强调与高亮",
    summary: "用权重、色块、边线和层级突出重点信息。",
    variants: ["弱强调", "强强调", "警示强调", "品牌强调"],
    states: ["默认", "Hover", "选中", "危险", "已读"],
    useCases: ["重点提示", "选中项", "推荐项", "异常状态"],
    do: ["强调要有明确优先级。", "高亮状态要能被键盘和读屏识别。", "危险强调要配合文案确认。"],
    dont: ["不要所有内容都高亮。", "不要只用颜色做强调。", "不要让强调样式和错误样式混淆。"],
  },
  "term-card": {
    noun: "术语卡片",
    summary: "解释 UI 名称、英文术语和易混淆边界。",
    variants: ["中文术语", "英文术语", "别名", "反模式提醒"],
    states: ["标准叫法", "团队俗称", "易混淆", "推荐使用", "不推荐"],
    useCases: ["需求沟通", "术语查询", "交互审查", "AI Prompt"],
    do: ["术语要关联实际组件和反例。", "中英文名称要保持一致。", "易混淆项要给判断边界。"],
    dont: ["不要只翻译名称。", "不要合并不同语境里的同名术语。", "不要省略不推荐用法。"],
  },
  taxonomy: {
    noun: "UI 条目",
    summary: "作为索引条目连接名称、用途、状态和实现提醒。",
    variants: ["基础形态", "状态形态", "移动形态", "文档形态"],
    states: ["默认", "悬停", "选中", "加载", "错误"],
    useCases: ["目录索引", "详情查阅", "规则匹配", "预览生成"],
  },
};

function getGeneratedProfile(preview, category) {
  return generatedPreviewProfiles[preview] || generatedCategoryDetails[category] || generatedPreviewProfiles.taxonomy;
}

function refineGeneratedPreview(entry, preview) {
  const text = `${entry.title} ${entry.english} ${entry.group}`.toLowerCase();
  if (entry.category === "patterns" && /view detail|detail|edit|create|duplicate|archive|restore|详情|编辑|创建|复制|归档|恢复/.test(text)) {
    return "pattern-operation";
  }
  return preview;
}

function buildGeneratedItem(entry, index) {
  const details = generatedCategoryDetails[entry.category] || generatedCategoryDetails.components;
  const preview = refineGeneratedPreview(entry, inferPreview(entry.title, entry.english, entry.category, entry.group));
  const profile = getGeneratedProfile(preview, entry.category);
  const title = entry.title || entry.english;
  const english = entry.english || entry.title;
  const profileSummary = String(profile.summary || `用于${details.purpose}`).replace(/[。.!！]+$/, "");

  return item({
    id: entry.id,
    title,
    english,
    category: entry.category,
    group: entry.group,
    docGroupId: entry.docGroupId,
    docGroup: entry.docGroup,
    docSection: entry.docSection,
    summary: `${title} 是「${entry.group}」里的${profile.noun || details.label}，${profileSummary}。`,
    plain: `${title} 在界面中应明确呈现「${entry.group}」语境：用户能看出它的用途、当前状态、触发方式和异常边界，而不是只看到一个名称。`,
    aliases: [english, entry.group].filter((value, itemIndex, array) => value && array.indexOf(value) === itemIndex && value !== title),
    tags: [details.label, entry.group, "docs 补全", index < 120 ? "高频" : "索引"],
    variants: entry.category === "layouts" ? generatedVariants(title, english, entry.category, entry.group) : (profile.variants || generatedVariants(title, english, entry.category, entry.group)),
    states: profile.states || details.states,
    useCases: profile.useCases || details.useCases,
    do: profile.do || [
      `说明 ${title} 的触发方式、可见状态和结束状态。`,
      "预览中要能看出默认、反馈和异常边界。",
      "移动端和键盘访问不要依赖悬停。",
    ],
    dont: profile.dont || [
      "不要只放一个静态名字而没有状态语义。",
      "不要把不同职责的组件混成一个入口。",
      "不要省略错误、禁用或加载状态。",
    ],
    accessibility: profile.accessibility || [
      "提供可见焦点和语义化控件。",
      "状态变化需要能被辅助技术感知。",
      "动效遵守 reduced motion，并保留触控替代路径。",
    ],
    related: generatedRelated(preview, entry.category),
    preview,
    comparison: {
      left: title,
      right: entry.group,
      note: `${title} 属于「${entry.group}」，详情页应同时说明用途、状态、交互和使用边界。`,
    },
  });
}

function parseExpandedIndex(markdown, curatedItems) {
  const usedIds = new Set(curatedItems.map((entry) => entry.id));
  const parsed = [];
  let section = "";
  let group = "";
  let groupId = "";
  let docSection = "";

  for (const line of markdown.split(/\r?\n/)) {
    const sectionMatch = line.match(/^##\s+(.+)$/);
    const groupMatch = line.match(/^###\s+(.+)$/);
    const itemMatch = line.match(/^\d+\.\s+(.+)$/);

    if (sectionMatch) {
      section = sectionMatch[1].trim();
      docSection = headingLabel(section);
      group = "";
      groupId = "";
      continue;
    }

    if (groupMatch) {
      group = headingLabel(groupMatch[1]);
      groupId = documentCategoryIndex.groupIds.get(`${docSection}\n${group}`) || `${categoryFromHeading(section)}-${slugifyItem(group, `${categoryFromHeading(section)}-${parsed.length + 1}`)}`;
      continue;
    }

    if (!itemMatch || !section || !group) continue;

    const category = categoryFromHeading(section);
    const { title, english } = splitIndexedName(itemMatch[1]);

    const baseId = slugifyItem(english || title, `${category}-${parsed.length + 1}`);
    let id = usedIds.has(baseId) ? `${category}-${baseId}` : baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${category}-${baseId}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    parsed.push({
      id,
      title,
      english,
      category,
      group,
      docGroupId: groupId,
      docGroup: group,
      docSection,
    });
  }

  return parsed.map((entry, index) => buildGeneratedItem(entry, index));
}

const coreItems = [
  item({
    id: "button",
    title: "按钮",
    english: "Button",
    category: "components",
    group: "操作",
    summary: "触发一个操作或提交表单。",
    plain: "按钮让用户执行一个明确动作，比如保存、继续、购买或删除。",
    aliases: ["CTA", "提交按钮", "操作按钮"],
    tags: ["表单", "购买", "后台", "移动端"],
    variants: ["主按钮", "次按钮", "描边按钮", "文字按钮", "图标按钮", "危险按钮"],
    states: ["默认", "悬停", "按下", "聚焦", "禁用", "加载中", "成功"],
    useCases: ["登录", "保存", "提交", "购买", "删除", "继续"],
    do: ["一个区域只突出一个主要按钮", "危险操作要明确提示", "按钮文字写清动作"],
    dont: ["不要把所有按钮都做成主按钮", "不要只放图标却没有说明", "不要让禁用按钮没有原因"],
    related: ["link", "icon-button", "menu", "modal"],
    preview: "button",
    comparison: { left: "按钮", right: "链接", note: "按钮负责执行动作，链接负责跳到位置或资源。" },
  }),
  item({
    id: "text-field",
    title: "输入框",
    english: "Text Field",
    category: "components",
    group: "输入",
    summary: "让用户输入或编辑信息。",
    plain: "输入框通常出现在登录、搜索、表单填写和设置页面里。",
    aliases: ["文本框", "输入栏"],
    tags: ["表单", "登录", "设置"],
    variants: ["单行输入", "带图标输入", "带清除按钮", "错误输入", "只读输入"],
    states: ["默认", "聚焦", "已填写", "错误", "禁用"],
    useCases: ["填写姓名", "输入邮箱", "搜索关键词", "输入验证码"],
    related: ["textarea", "search", "password-field", "select"],
    preview: "text",
    comparison: { left: "输入框", right: "选择器", note: "输入框适合自由填写，选择器适合从固定选项中选。" },
  }),
  item({
    id: "modal",
    title: "弹窗",
    english: "Modal",
    category: "components",
    group: "反馈",
    summary: "盖在页面上的重要提示或任务。",
    plain: "弹窗会打断当前流程，通常用于确认删除、支付、退出登录等关键操作。",
    aliases: ["Dialog", "对话框", "确认框"],
    tags: ["确认", "危险操作", "表单"],
    variants: ["确认弹窗", "表单弹窗", "全屏弹窗", "底部弹窗"],
    states: ["打开", "关闭", "加载", "错误", "成功"],
    useCases: ["删除确认", "支付确认", "编辑资料", "登录提示"],
    dont: ["不要用弹窗展示普通提示", "不要一进入页面就弹出多个弹窗", "不要隐藏关闭入口"],
    related: ["toast", "alert", "drawer", "popover"],
    preview: "modal",
    comparison: { left: "弹窗", right: "Toast", note: "弹窗需要处理，Toast 只是短暂告诉用户结果。" },
  }),
  item({
    id: "toast",
    title: "Toast",
    english: "Toast",
    category: "components",
    group: "反馈",
    summary: "短暂出现的轻量提示。",
    plain: "Toast 通常出现在页面角落，告诉用户刚刚的操作结果，比如保存成功。",
    aliases: ["轻提示", "Snackbar"],
    tags: ["成功", "错误", "保存"],
    variants: ["成功提示", "错误提示", "可撤销提示", "带操作提示"],
    states: ["进入", "显示", "自动消失"],
    useCases: ["保存成功", "复制成功", "网络失败", "删除后撤销"],
    related: ["alert", "modal", "notification"],
    preview: "toast",
    comparison: { left: "Toast", right: "Alert", note: "Toast 短暂，Alert 更显眼也更持久。" },
  }),
  item({
    id: "card",
    title: "卡片",
    english: "Card",
    category: "components",
    group: "展示",
    summary: "把一组相关信息装在一起。",
    plain: "卡片像一个信息小盒子，常用于商品、文章、作品、模板和资料概览。",
    aliases: ["内容卡", "信息卡"],
    tags: ["展示", "电商", "文章"],
    variants: ["图片卡", "数据卡", "操作卡", "列表卡", "紧凑卡"],
    states: ["默认", "悬停", "选中", "加载中"],
    useCases: ["商品列表", "作品集", "文章推荐", "模板入口"],
    related: ["list", "table", "badge"],
    preview: "card",
    comparison: { left: "卡片", right: "列表", note: "卡片适合独立对象，列表适合连续浏览。" },
  }),
  item({
    id: "tabs",
    title: "标签页",
    english: "Tabs",
    category: "components",
    group: "导航",
    summary: "在同一区域切换不同内容。",
    plain: "标签页用于同一页面内的内容切换，比如详情、评论、参数。",
    aliases: ["Tab", "页签"],
    tags: ["导航", "详情页", "设置"],
    variants: ["下划线标签", "胶囊标签", "垂直标签", "可滚动标签"],
    states: ["默认", "选中", "悬停", "禁用"],
    useCases: ["商品详情", "设置分组", "数据视图", "文档切换"],
    related: ["segmented-control", "sidebar", "breadcrumb"],
    preview: "tabs",
    comparison: { left: "标签页", right: "分段控制", note: "标签页切换大内容，分段控制常切换视图模式。" },
  }),
  item({
    id: "icon-button",
    title: "图标按钮",
    english: "Icon Button",
    category: "components",
    group: "操作",
    summary: "用图标表示一个动作。",
    plain: "图标按钮节省空间，但需要让用户能看懂含义。",
    aliases: ["工具按钮"],
    tags: ["工具栏", "移动端", "后台"],
    variants: ["圆形按钮", "方形按钮", "透明按钮", "危险图标按钮"],
    states: ["默认", "悬停", "按下", "聚焦", "禁用"],
    useCases: ["搜索", "关闭", "收藏", "分享", "删除"],
    related: ["button", "toolbar", "tooltip"],
    preview: "icon-button",
  }),
  item({
    id: "link",
    title: "链接",
    english: "Link",
    category: "components",
    group: "操作",
    summary: "跳转到另一个位置或资源。",
    plain: "链接用于导航，不适合承担保存、提交这类动作。",
    tags: ["导航", "文章", "帮助"],
    variants: ["正文链接", "导航链接", "外部链接", "返回链接"],
    states: ["默认", "悬停", "访问过", "聚焦"],
    useCases: ["查看详情", "打开帮助", "跳到页面", "下载资源"],
    related: ["button", "breadcrumb", "menu"],
    preview: "link",
  }),
  item({
    id: "menu",
    title: "菜单",
    english: "Menu",
    category: "components",
    group: "操作",
    summary: "展开一组可选操作。",
    plain: "菜单把不常用或次要动作收起来，避免页面太挤。",
    tags: ["更多", "工具栏", "右键"],
    variants: ["下拉菜单", "右键菜单", "级联菜单", "操作菜单"],
    states: ["关闭", "打开", "选中", "禁用项"],
    useCases: ["更多操作", "排序方式", "账户菜单", "右键操作"],
    related: ["dropdown", "context-menu", "toolbar"],
    preview: "menu",
  }),
  item({
    id: "dropdown",
    title: "下拉菜单",
    english: "Dropdown",
    category: "components",
    group: "操作",
    summary: "从多个选项里选一个。",
    plain: "下拉菜单适合选项较多但不需要一直展示的场景。",
    tags: ["筛选", "表单", "设置"],
    variants: ["单选下拉", "多选下拉", "带搜索下拉", "分组下拉"],
    states: ["关闭", "打开", "已选择", "错误", "禁用"],
    useCases: ["选择城市", "选择排序", "选择状态", "切换语言"],
    related: ["select", "menu", "filter-panel"],
    preview: "dropdown",
  }),
  item({
    id: "checkbox",
    title: "复选框",
    english: "Checkbox",
    category: "components",
    group: "输入",
    summary: "可以多选或独立开关一个条件。",
    plain: "复选框适合同时选择多个条件，比如筛选品牌和价格范围。",
    tags: ["表单", "筛选", "设置"],
    variants: ["未选", "已选", "半选", "禁用"],
    states: ["默认", "选中", "聚焦", "禁用"],
    useCases: ["同意协议", "多选筛选", "批量选择", "开关偏好"],
    related: ["radio", "switch", "filter-panel"],
    preview: "checkbox",
  }),
  item({
    id: "radio",
    title: "单选按钮",
    english: "Radio",
    category: "components",
    group: "输入",
    summary: "多个选项只能选一个。",
    plain: "单选按钮适合选项少且需要全部露出的选择。",
    tags: ["表单", "设置", "问卷"],
    variants: ["横向单选", "纵向单选", "卡片单选"],
    states: ["默认", "选中", "聚焦", "禁用"],
    useCases: ["选择性别", "选择配送方式", "选择支付方式", "问卷题"],
    related: ["checkbox", "segmented-control", "select"],
    preview: "radio",
  }),
  item({
    id: "switch",
    title: "开关",
    english: "Switch",
    category: "components",
    group: "输入",
    summary: "立即开启或关闭某个功能。",
    plain: "开关像灯的开关，适合状态会马上生效的设置。",
    tags: ["设置", "移动端", "偏好"],
    variants: ["开启", "关闭", "禁用", "加载"],
    states: ["默认", "开启", "聚焦", "禁用"],
    useCases: ["开启通知", "减少动效", "深色模式", "自动保存"],
    related: ["checkbox", "settings-page"],
    preview: "switch",
  }),
  item({
    id: "select",
    title: "选择器",
    english: "Select",
    category: "components",
    group: "输入",
    summary: "在表单中选择固定答案。",
    plain: "选择器比自由输入更可控，适合国家、状态、角色这类固定选项。",
    tags: ["表单", "设置"],
    variants: ["单选", "多选", "可搜索", "分组选项"],
    states: ["默认", "打开", "已选择", "错误", "禁用"],
    useCases: ["选择国家", "选择角色", "选择订单状态", "选择分类"],
    related: ["dropdown", "radio", "autocomplete"],
    preview: "select",
  }),
  item({
    id: "table",
    title: "表格",
    english: "Table",
    category: "components",
    group: "展示",
    summary: "用行和列对比数据。",
    plain: "表格适合需要横向比较多个字段的信息，比如订单、成员、账单。",
    tags: ["后台", "数据", "列表"],
    variants: ["基础表格", "可排序表格", "可筛选表格", "可编辑表格"],
    states: ["加载", "空状态", "选中行", "错误"],
    useCases: ["订单列表", "成员管理", "财务明细", "任务清单"],
    related: ["data-grid", "list", "pagination"],
    preview: "table",
  }),
  item({
    id: "badge",
    title: "徽标",
    english: "Badge",
    category: "components",
    group: "展示",
    summary: "小数字或状态标记。",
    plain: "徽标用于提醒数量、状态或类别，比如未读消息数。",
    tags: ["通知", "状态", "分类"],
    variants: ["数字徽标", "状态徽标", "点状徽标", "标签徽标"],
    states: ["默认", "成功", "警告", "错误"],
    useCases: ["未读数", "新功能", "订单状态", "会员等级"],
    related: ["tag", "notification", "avatar"],
    preview: "badge",
  }),
  item({
    id: "tooltip",
    title: "提示气泡",
    english: "Tooltip",
    category: "components",
    group: "展示",
    summary: "悬停时出现的小解释。",
    plain: "提示气泡用于解释图标或短标签，不适合放重要内容。",
    tags: ["帮助", "图标", "说明"],
    variants: ["顶部提示", "底部提示", "带快捷键提示"],
    states: ["隐藏", "显示"],
    useCases: ["解释图标", "显示完整文本", "说明快捷键"],
    related: ["popover", "icon-button", "help-text"],
    preview: "tooltip",
  }),
  item({
    id: "accordion",
    title: "手风琴",
    english: "Accordion",
    category: "components",
    group: "展示",
    summary: "展开或收起一段内容。",
    plain: "手风琴把长内容分段折叠，让用户按需展开。",
    tags: ["FAQ", "设置", "帮助"],
    variants: ["单项展开", "多项展开", "带图标展开"],
    states: ["收起", "展开", "禁用"],
    useCases: ["常见问题", "说明文档", "设置分组", "筛选项"],
    related: ["drawer", "tabs", "popover"],
    preview: "accordion",
  }),
  item({
    id: "skeleton",
    title: "骨架屏",
    english: "Skeleton",
    category: "components",
    group: "反馈",
    summary: "内容加载前的占位形状。",
    plain: "骨架屏让用户知道页面正在加载，也暗示内容即将长什么样。",
    tags: ["加载", "列表", "性能"],
    variants: ["文字骨架", "卡片骨架", "头像骨架", "表格骨架"],
    states: ["加载中", "加载完成"],
    useCases: ["加载文章", "加载卡片", "加载表格", "加载资料"],
    related: ["spinner", "progress", "empty-state"],
    preview: "skeleton",
  }),
  item({
    id: "empty-state",
    title: "空状态",
    english: "Empty State",
    category: "components",
    group: "反馈",
    summary: "没有内容时的说明和下一步。",
    plain: "空状态告诉用户这里为什么没东西，以及接下来可以做什么。",
    tags: ["无数据", "引导", "错误"],
    variants: ["首次使用", "搜索无结果", "权限为空", "加载失败"],
    states: ["空", "可创建", "可重试"],
    useCases: ["没有订单", "没有收藏", "搜索无结果", "网络失败"],
    related: ["skeleton", "alert", "button"],
    preview: "empty",
  }),
  item({
    id: "progress",
    title: "进度条",
    english: "Progress Bar",
    category: "components",
    group: "反馈",
    summary: "显示任务完成到哪一步。",
    plain: "进度条适合上传、下载、安装、分步处理这类需要等待的任务。",
    tags: ["上传", "下载", "加载"],
    variants: ["确定进度", "不确定进度", "步骤进度"],
    states: ["进行中", "完成", "失败"],
    useCases: ["文件上传", "导出文件", "安装更新", "问卷进度"],
    related: ["spinner", "skeleton", "stepper"],
    preview: "progress",
  }),
  item({
    id: "drawer",
    title: "抽屉",
    english: "Drawer",
    category: "components",
    group: "导航",
    summary: "从侧边滑出的面板。",
    plain: "抽屉常用于移动端导航、筛选器和临时详情面板。",
    tags: ["导航", "筛选", "移动端"],
    variants: ["左侧抽屉", "右侧抽屉", "底部抽屉"],
    states: ["关闭", "打开", "加载", "禁用"],
    useCases: ["菜单导航", "筛选商品", "查看详情", "移动端设置"],
    related: ["modal", "sidebar", "filter-panel"],
    preview: "drawer",
  }),

  item({
    id: "single-column",
    title: "单列布局",
    english: "Single Column",
    category: "layouts",
    group: "阅读",
    summary: "内容从上到下排列。",
    plain: "单列布局适合文章、说明页和步骤较少的页面。",
    tags: ["文章", "说明页", "移动端"],
    useCases: ["博客文章", "帮助文档", "公告", "登录页"],
    related: ["two-column", "sticky-header"],
    preview: "layout-single",
  }),
  item({
    id: "two-column",
    title: "双栏布局",
    english: "Two Column",
    category: "layouts",
    group: "详情",
    summary: "左右两侧分别承载主内容和辅助内容。",
    plain: "双栏布局常见于详情页、设置页和文档页。",
    tags: ["详情", "设置", "文档"],
    useCases: ["文章目录", "商品详情", "账户设置", "文档阅读"],
    related: ["single-column", "sidebar-layout"],
    preview: "layout-two",
  }),
  item({
    id: "sidebar-layout",
    title: "侧边栏布局",
    english: "Sidebar Layout",
    category: "layouts",
    group: "导航",
    summary: "一侧固定导航，另一侧显示内容。",
    plain: "侧边栏布局适合内容较多、需要频繁切换栏目的网站。",
    tags: ["后台", "文档", "工具"],
    useCases: ["后台系统", "文档站", "设置中心", "邮箱"],
    related: ["dashboard", "master-detail"],
    preview: "layout-sidebar",
  }),
  item({
    id: "dashboard",
    title: "仪表盘布局",
    english: "Dashboard",
    category: "layouts",
    group: "数据",
    summary: "把关键数据和操作集中展示。",
    plain: "仪表盘适合运营后台、数据分析和管理面板。",
    tags: ["后台", "数据", "运营"],
    useCases: ["销售看板", "项目状态", "运营数据", "监控面板"],
    related: ["table", "card-grid", "data-grid"],
    preview: "layout-dashboard",
  }),
  item({
    id: "card-grid",
    title: "卡片网格",
    english: "Card Grid",
    category: "layouts",
    group: "展示",
    summary: "用网格展示多个对象。",
    plain: "卡片网格适合浏览商品、模板、作品和文章。",
    tags: ["商品", "作品", "模板"],
    useCases: ["商品列表", "模板库", "作品集", "课程列表"],
    related: ["card", "masonry", "list"],
    preview: "layout-grid",
  }),
  item({
    id: "feed",
    title: "信息流布局",
    english: "Feed",
    category: "layouts",
    group: "内容",
    summary: "按时间或推荐顺序连续展示内容。",
    plain: "信息流让用户不断往下浏览，常见于社区、新闻和动态页。",
    tags: ["社交", "新闻", "动态"],
    useCases: ["朋友圈", "新闻流", "推荐内容", "评论流"],
    related: ["list", "infinite-scroll"],
    preview: "layout-feed",
  }),
  item({
    id: "master-detail",
    title: "主从布局",
    english: "Master Detail",
    category: "layouts",
    group: "详情",
    summary: "左边列表，右边详情。",
    plain: "主从布局适合邮件、联系人、订单和文档浏览。",
    tags: ["邮箱", "订单", "文档"],
    useCases: ["邮箱", "订单管理", "联系人", "文件管理"],
    related: ["two-column", "sidebar-layout"],
    preview: "layout-master",
  }),
  item({
    id: "settings-page",
    title: "设置页",
    english: "Settings Page",
    category: "layouts",
    group: "设置",
    summary: "按分组管理偏好和账户信息。",
    plain: "设置页应该让用户快速找到要改的选项。",
    tags: ["账户", "偏好", "安全"],
    useCases: ["账户资料", "通知设置", "隐私设置", "安全设置"],
    related: ["form", "switch", "sidebar-layout"],
    preview: "layout-settings",
  }),
  item({
    id: "checkout-page",
    title: "结算页",
    english: "Checkout Page",
    category: "layouts",
    group: "电商",
    summary: "完成购买前的确认流程。",
    plain: "结算页需要清楚展示商品、地址、价格和付款方式。",
    tags: ["电商", "支付", "表单"],
    useCases: ["购物结算", "订阅购买", "票务支付"],
    related: ["shopping-cart", "form", "stepper"],
    preview: "layout-checkout",
  }),

  item({
    id: "radius",
    title: "圆角",
    english: "Border Radius",
    category: "styles",
    group: "形状",
    summary: "决定界面是锋利、柔和还是胶囊感。",
    plain: "小圆角更克制，大圆角更亲和，胶囊形常用于按钮和标签。",
    tags: ["形状", "按钮", "卡片"],
    variants: ["直角", "小圆角", "大圆角", "胶囊"],
    related: ["shadow", "card", "button"],
    preview: "style-radius",
  }),
  item({
    id: "shadow",
    title: "阴影",
    english: "Shadow",
    category: "styles",
    group: "层级",
    summary: "暗示元素是否浮在页面上。",
    plain: "阴影常用来表达浮层、卡片或弹窗的层级。",
    tags: ["层级", "卡片", "弹窗"],
    variants: ["无阴影", "轻阴影", "浮起", "强阴影"],
    related: ["card", "modal", "popover"],
    preview: "style-shadow",
  }),
  item({
    id: "spacing",
    title: "留白",
    english: "Spacing",
    category: "styles",
    group: "排版",
    summary: "用空白组织信息关系。",
    plain: "留白不是浪费空间，它让用户更快分清哪些内容属于一组。",
    tags: ["阅读", "排版", "密度"],
    variants: ["紧凑", "普通", "宽松"],
    related: ["density", "typography"],
    preview: "style-spacing",
  }),
  item({
    id: "typography",
    title: "字体层级",
    english: "Typography",
    category: "styles",
    group: "排版",
    summary: "用大小、粗细和行高建立阅读顺序。",
    plain: "好的字体层级会告诉用户先看标题，再看说明，再看操作。",
    tags: ["文字", "阅读", "标题"],
    variants: ["标题", "正文", "说明", "标签"],
    related: ["spacing", "color"],
    preview: "style-type",
  }),
  item({
    id: "color",
    title: "色彩",
    english: "Color",
    category: "styles",
    group: "视觉",
    summary: "表达品牌、状态和重点。",
    plain: "色彩可以突出重点，但状态不能只靠颜色表达。",
    tags: ["品牌", "状态", "强调"],
    variants: ["主色", "成功", "警告", "危险", "中性色"],
    related: ["contrast", "badge", "alert"],
    preview: "style-color",
  }),
  item({
    id: "density",
    title: "密度",
    english: "Density",
    category: "styles",
    group: "排版",
    summary: "决定页面信息是紧凑还是舒展。",
    plain: "高密度适合后台工具，低密度适合阅读和普通用户理解。",
    tags: ["后台", "阅读", "移动端"],
    variants: ["紧凑", "标准", "舒展"],
    related: ["spacing", "table", "dashboard"],
    preview: "style-density",
  }),
  item({
    id: "dark-mode",
    title: "暗色模式",
    english: "Dark Mode",
    category: "styles",
    group: "主题",
    summary: "在深色背景上重新组织颜色和层级。",
    plain: "暗色模式不是把颜色反过来，而是重新保证可读性和层级。",
    tags: ["主题", "可访问性"],
    variants: ["深色背景", "暗色浮层", "高对比"],
    related: ["contrast", "color"],
    preview: "style-dark",
  }),

  item({
    id: "hover-motion",
    title: "悬停反馈",
    english: "Hover Feedback",
    category: "motion",
    group: "反馈",
    summary: "提示这里可以操作。",
    plain: "悬停反馈通常用轻微变色、边框或上浮表示可点击。",
    tags: ["鼠标", "按钮", "卡片"],
    useCases: ["按钮悬停", "卡片悬停", "菜单项悬停"],
    related: ["press-motion", "button", "card"],
    preview: "motion-hover",
  }),
  item({
    id: "press-motion",
    title: "点击反馈",
    english: "Press Feedback",
    category: "motion",
    group: "反馈",
    summary: "让用户知道自己点到了。",
    plain: "点击反馈应该很快，通常在 100ms 内出现。",
    tags: ["按钮", "移动端", "触控"],
    useCases: ["按钮按下", "列表选中", "图标点击"],
    related: ["hover-motion", "button"],
    preview: "motion-press",
  }),
  item({
    id: "loading-motion",
    title: "加载动效",
    english: "Loading Motion",
    category: "motion",
    group: "加载",
    summary: "表达系统正在处理。",
    plain: "加载动效要让等待更可理解，但不要遮挡已有内容太久。",
    tags: ["等待", "进度", "骨架屏"],
    useCases: ["提交中", "加载列表", "上传文件"],
    related: ["skeleton", "spinner", "progress"],
    preview: "motion-loading",
  }),
  item({
    id: "success-motion",
    title: "成功反馈",
    english: "Success Feedback",
    category: "motion",
    group: "反馈",
    summary: "确认操作已经完成。",
    plain: "成功反馈可以是按钮文字改变、对勾出现或 Toast 提示。",
    tags: ["保存", "提交", "完成"],
    useCases: ["保存成功", "支付完成", "复制成功"],
    related: ["toast", "button", "progress"],
    preview: "motion-success",
  }),
  item({
    id: "error-motion",
    title: "错误反馈",
    english: "Error Feedback",
    category: "motion",
    group: "反馈",
    summary: "提醒用户需要修正。",
    plain: "错误反馈可以轻微抖动输入框，但必须配合文字说明。",
    tags: ["表单", "错误", "输入"],
    useCases: ["密码错误", "必填项为空", "上传失败"],
    related: ["text-field", "alert", "toast"],
    preview: "motion-error",
  }),
  item({
    id: "expand-motion",
    title: "展开收起",
    english: "Expand Collapse",
    category: "motion",
    group: "空间",
    summary: "表达信息层级变化。",
    plain: "展开收起适合把次要内容先藏起来，用户需要时再打开。",
    tags: ["手风琴", "详情", "筛选"],
    useCases: ["FAQ 展开", "筛选展开", "详情展开"],
    related: ["accordion", "drawer"],
    preview: "motion-expand",
  }),
  item({
    id: "reduced-motion",
    title: "减少动效",
    english: "Reduced Motion",
    category: "motion",
    group: "可访问性",
    summary: "减少非必要动画。",
    plain: "减少动效尊重用户偏好，降低眩晕和干扰。",
    tags: ["可访问性", "偏好", "设置"],
    useCases: ["系统偏好", "阅读模式", "动画较多的产品"],
    related: ["switch", "accessibility"],
    preview: "motion-reduced",
  }),

  item({
    id: "login-pattern",
    title: "登录",
    english: "Login",
    category: "patterns",
    group: "账号",
    summary: "确认用户身份。",
    plain: "登录流程需要清楚展示输入、错误、忘记密码和第三方登录入口。",
    tags: ["账号", "表单", "错误"],
    useCases: ["邮箱登录", "手机号登录", "验证码登录", "SSO"],
    related: ["text-field", "password-field", "button"],
    preview: "pattern-login",
  }),
  item({
    id: "search-pattern",
    title: "搜索",
    english: "Search",
    category: "patterns",
    group: "查找",
    summary: "帮助用户找到内容。",
    plain: "搜索需要处理输入建议、无结果、加载和筛选。",
    tags: ["查找", "结果", "筛选"],
    useCases: ["站内搜索", "商品搜索", "文档搜索", "命令搜索"],
    related: ["text-field", "filter-panel", "empty-state"],
    preview: "pattern-search",
  }),
  item({
    id: "filter-pattern",
    title: "筛选",
    english: "Filter",
    category: "patterns",
    group: "查找",
    summary: "缩小内容范围。",
    plain: "筛选让用户从很多内容中快速缩小范围。",
    tags: ["商品", "后台", "列表"],
    useCases: ["价格筛选", "状态筛选", "时间筛选", "多条件筛选"],
    related: ["checkbox", "dropdown", "filter-panel"],
    preview: "pattern-filter",
  }),
  item({
    id: "upload-pattern",
    title: "上传",
    english: "Upload",
    category: "patterns",
    group: "文件",
    summary: "把本地文件交给系统处理。",
    plain: "上传流程需要展示文件选择、进度、成功、失败和重试。",
    tags: ["文件", "进度", "错误"],
    useCases: ["上传头像", "上传附件", "批量导入", "上传图片"],
    related: ["progress", "toast", "empty-state"],
    preview: "pattern-upload",
  }),
  item({
    id: "checkout-pattern",
    title: "支付结算",
    english: "Checkout",
    category: "patterns",
    group: "电商",
    summary: "完成购买或订阅。",
    plain: "结算流程要减少不确定感，清楚展示价格、地址和付款状态。",
    tags: ["电商", "支付", "表单"],
    useCases: ["购物支付", "订阅购买", "活动报名", "票务购买"],
    related: ["checkout-page", "button", "modal"],
    preview: "pattern-checkout",
  }),
  item({
    id: "delete-confirmation",
    title: "删除确认",
    english: "Delete Confirmation",
    category: "patterns",
    group: "危险操作",
    summary: "防止用户误删。",
    plain: "危险操作应该明确说明后果，并给用户取消机会。",
    tags: ["危险", "确认", "弹窗"],
    useCases: ["删除文件", "注销账号", "移除成员", "清空记录"],
    related: ["modal", "button", "toast"],
    preview: "pattern-delete",
  }),

  item({
    id: "term-modal",
    title: "弹窗",
    english: "Modal",
    category: "dictionary",
    group: "反馈",
    summary: "会盖住当前页面的弹窗。",
    plain: "看到 modal，通常意味着你需要先处理它，才能继续页面上的其他操作。",
    aliases: ["弹窗", "Dialog"],
    tags: ["弹窗", "确认"],
    related: ["modal", "toast", "drawer"],
    preview: "modal",
  }),
  item({
    id: "term-toast",
    title: "轻提示",
    english: "Toast",
    category: "dictionary",
    group: "反馈",
    summary: "短暂显示的轻提示。",
    plain: "Toast 常用来告诉你某件事刚刚成功或失败了。",
    aliases: ["轻提示", "Snackbar"],
    tags: ["提示", "反馈"],
    related: ["toast", "alert", "notification"],
    preview: "toast",
  }),
  item({
    id: "term-tab",
    title: "标签页",
    english: "Tab",
    category: "dictionary",
    group: "导航",
    summary: "同一页面中的内容切换标签。",
    plain: "Tab 帮你在一个区域里切换不同内容，不需要跳到新页面。",
    aliases: ["标签页", "页签"],
    tags: ["导航", "切换"],
    related: ["tabs", "segmented-control"],
    preview: "tabs",
  }),
  item({
    id: "term-drawer",
    title: "抽屉",
    english: "Drawer",
    category: "dictionary",
    group: "导航",
    summary: "从屏幕边缘滑出的抽屉。",
    plain: "Drawer 常用来放菜单、筛选器或临时详情。",
    aliases: ["抽屉", "侧滑面板"],
    tags: ["侧边", "面板"],
    related: ["drawer", "modal"],
    preview: "drawer",
  }),
  item({
    id: "term-skeleton",
    title: "骨架屏",
    english: "Skeleton",
    category: "dictionary",
    group: "加载",
    summary: "加载前的灰色占位。",
    plain: "Skeleton 让你知道内容正在来，并预告页面结构。",
    aliases: ["骨架屏"],
    tags: ["加载", "占位"],
    related: ["skeleton", "progress"],
    preview: "skeleton",
  }),
  item({
    id: "term-badge",
    title: "徽标",
    english: "Badge",
    category: "dictionary",
    group: "状态",
    summary: "小数字或状态标记。",
    plain: "Badge 常用来表示未读数量、新内容或状态。",
    aliases: ["徽标", "角标"],
    tags: ["状态", "数量"],
    related: ["badge", "notification"],
    preview: "badge",
  }),
];

const additionalItems = [
  item({
    id: "floating-action-button",
    title: "悬浮操作按钮",
    english: "Floating Action Button",
    category: "components",
    group: "操作",
    summary: "页面里最重要的快捷操作。",
    plain: "悬浮操作按钮通常固定在角落，用来突出创建、添加、编辑这类高频动作。",
    aliases: ["FAB", "悬浮按钮"],
    tags: ["移动端", "快捷操作", "创建"],
    variants: ["圆形 FAB", "扩展 FAB", "迷你 FAB"],
    states: ["默认", "悬停", "按下", "禁用"],
    useCases: ["新建笔记", "发布内容", "添加商品", "开始聊天"],
    related: ["button", "icon-button"],
    preview: "floating-action-button",
  }),
  item({
    id: "context-menu",
    title: "右键菜单",
    english: "Context Menu",
    category: "components",
    group: "操作",
    summary: "针对当前对象展开更多操作。",
    plain: "右键菜单和当前选中的对象有关，比如文件、图片、文本或表格行。",
    tags: ["桌面端", "更多操作", "菜单"],
    variants: ["文件菜单", "文本菜单", "表格行菜单"],
    states: ["关闭", "打开", "禁用项"],
    useCases: ["复制", "重命名", "移动", "删除"],
    related: ["menu", "dropdown", "toolbar"],
    preview: "menu",
  }),
  item({
    id: "toolbar",
    title: "工具栏",
    english: "Toolbar",
    category: "components",
    group: "操作",
    summary: "一排常用工具。",
    plain: "工具栏把常用操作放在一起，常见于编辑器、表格和绘图工具。",
    tags: ["编辑器", "后台", "工具"],
    variants: ["文字工具栏", "图标工具栏", "浮动工具栏"],
    states: ["默认", "选中", "禁用"],
    useCases: ["加粗", "保存", "筛选", "导出"],
    related: ["icon-button", "command-palette"],
    preview: "toolbar",
  }),
  item({
    id: "command-palette",
    title: "命令面板",
    english: "Command Palette",
    category: "components",
    group: "操作",
    summary: "搜索并执行功能。",
    plain: "命令面板像一个功能搜索框，适合复杂工具里快速找命令。",
    tags: ["效率", "搜索", "快捷键"],
    variants: ["全局命令", "页面命令", "最近命令"],
    states: ["打开", "搜索中", "无结果"],
    useCases: ["打开页面", "执行命令", "查找文件", "切换主题"],
    related: ["search", "modal"],
    preview: "command-palette",
  }),
  item({
    id: "textarea",
    title: "多行输入框",
    english: "Textarea",
    category: "components",
    group: "输入",
    summary: "输入较长文本。",
    plain: "多行输入框适合评论、备注、反馈和长说明。",
    tags: ["表单", "评论", "反馈"],
    variants: ["固定高度", "自动增高", "带字数统计"],
    states: ["默认", "聚焦", "错误", "禁用"],
    useCases: ["写评论", "提交反馈", "填写备注", "写简介"],
    related: ["text-field", "comment-box"],
    preview: "textarea",
  }),
  item({
    id: "search",
    title: "搜索框",
    english: "Search",
    category: "components",
    group: "输入",
    summary: "查找内容。",
    plain: "搜索框让用户输入关键词，并看到结果、建议或无结果提示。",
    tags: ["查找", "导航", "结果"],
    variants: ["普通搜索", "带建议搜索", "全局搜索", "语音搜索"],
    states: ["空", "输入中", "加载", "无结果"],
    useCases: ["搜索商品", "搜索文档", "查找联系人", "搜索命令"],
    related: ["text-field", "command-palette"],
    preview: "search",
  }),
  item({
    id: "password-field",
    title: "密码框",
    english: "Password Field",
    category: "components",
    group: "输入",
    summary: "输入隐藏内容。",
    plain: "密码框会隐藏输入内容，通常还会提供显示/隐藏按钮。",
    tags: ["登录", "安全", "表单"],
    variants: ["隐藏密码", "显示密码", "强度提示", "错误密码"],
    states: ["默认", "聚焦", "错误", "禁用"],
    useCases: ["登录", "注册", "修改密码", "二次确认"],
    related: ["text-field", "login-pattern"],
    preview: "password-field",
  }),
  item({
    id: "slider",
    title: "滑杆",
    english: "Slider",
    category: "components",
    group: "输入",
    summary: "拖动调整数值。",
    plain: "滑杆适合调音量、亮度、价格范围这类连续数值。",
    tags: ["数值", "设置", "筛选"],
    variants: ["单值滑杆", "范围滑杆", "带刻度滑杆"],
    states: ["默认", "拖动中", "禁用"],
    useCases: ["音量", "价格范围", "亮度", "进度"],
    related: ["progress", "filter-panel"],
    preview: "slider",
  }),
  item({
    id: "date-picker",
    title: "日期选择器",
    english: "Date Picker",
    category: "components",
    group: "输入",
    summary: "选择日期或时间范围。",
    plain: "日期选择器通常用于预订、筛选、日程和报表。",
    tags: ["日期", "日历", "筛选"],
    variants: ["单日选择", "日期范围", "月份选择", "时间选择"],
    states: ["打开", "已选择", "禁用", "错误"],
    useCases: ["订酒店", "筛选订单", "安排日程", "选择生日"],
    related: ["calendar", "filter-panel"],
    preview: "date-picker",
  }),
  item({
    id: "file-upload",
    title: "文件上传",
    english: "File Upload",
    category: "components",
    group: "输入",
    summary: "上传本地文件。",
    plain: "文件上传需要显示选择、进度、成功、失败和可重试入口。",
    tags: ["上传", "文件", "进度"],
    variants: ["按钮上传", "拖拽上传", "批量上传", "图片上传"],
    states: ["空", "上传中", "成功", "失败"],
    useCases: ["上传头像", "上传附件", "导入表格", "上传图片"],
    related: ["progress", "upload-pattern"],
    preview: "file-upload",
  }),
  item({
    id: "autocomplete",
    title: "自动补全",
    english: "Autocomplete",
    category: "components",
    group: "输入",
    summary: "边输入边推荐。",
    plain: "自动补全可以减少输入成本，也能避免用户输错固定名称。",
    tags: ["搜索", "表单", "建议"],
    variants: ["文字建议", "分组建议", "远程建议"],
    states: ["输入中", "加载", "无结果", "已选择"],
    useCases: ["选择城市", "搜索联系人", "填写标签", "查找命令"],
    related: ["search", "select"],
    preview: "autocomplete",
  }),
  item({
    id: "top-navigation",
    title: "顶部导航",
    english: "Top Navigation",
    category: "components",
    group: "导航",
    summary: "网站顶部主入口。",
    plain: "顶部导航让用户快速切换主要栏目，通常出现在网页最上方。",
    tags: ["导航", "网站", "桌面端"],
    variants: ["文字导航", "带搜索导航", "固定导航"],
    states: ["默认", "选中", "悬停"],
    useCases: ["官网", "文档站", "后台", "商城"],
    related: ["sidebar", "bottom-navigation"],
    preview: "top-navigation",
  }),
  item({
    id: "sidebar",
    title: "侧边栏",
    english: "Sidebar",
    category: "components",
    group: "导航",
    summary: "左侧或右侧导航。",
    plain: "侧边栏适合栏目较多、需要频繁切换的产品。",
    tags: ["后台", "文档", "设置"],
    variants: ["固定侧边栏", "可折叠侧边栏", "右侧目录"],
    states: ["展开", "收起", "选中"],
    useCases: ["后台菜单", "文档目录", "设置导航", "邮箱文件夹"],
    related: ["sidebar-layout", "drawer"],
    preview: "sidebar",
  }),
  item({
    id: "breadcrumb",
    title: "面包屑",
    english: "Breadcrumb",
    category: "components",
    group: "导航",
    summary: "显示当前位置。",
    plain: "面包屑告诉用户当前页面在网站结构中的位置，也方便回到上一层。",
    tags: ["导航", "层级", "详情页"],
    variants: ["文字面包屑", "可折叠面包屑", "带首页面包屑"],
    states: ["默认", "当前项", "悬停"],
    useCases: ["商品详情", "文档页面", "后台页面", "文件路径"],
    related: ["back-button", "top-navigation"],
    preview: "breadcrumb",
  }),
  item({
    id: "pagination",
    title: "分页",
    english: "Pagination",
    category: "components",
    group: "导航",
    summary: "翻页浏览内容。",
    plain: "分页适合结果很多但不希望一次加载全部的列表。",
    tags: ["列表", "搜索", "表格"],
    variants: ["数字分页", "上一页下一页", "加载更多"],
    states: ["当前页", "禁用", "悬停"],
    useCases: ["搜索结果", "订单列表", "评论列表", "文章列表"],
    related: ["table", "search-results-page"],
    preview: "pagination",
  }),
  item({
    id: "stepper",
    title: "步骤条",
    english: "Stepper",
    category: "components",
    group: "导航",
    summary: "分步骤完成任务。",
    plain: "步骤条让用户知道流程到了哪一步，还剩几步。",
    tags: ["流程", "注册", "支付"],
    variants: ["横向步骤", "纵向步骤", "带状态步骤"],
    states: ["未完成", "当前", "完成", "错误"],
    useCases: ["注册", "支付", "问卷", "导入数据"],
    related: ["wizard", "checkout-page"],
    preview: "stepper",
  }),
  item({
    id: "bottom-navigation",
    title: "底部导航",
    english: "Bottom Navigation",
    category: "components",
    group: "导航",
    summary: "移动端底部主导航。",
    plain: "底部导航适合移动端 3 到 5 个高频主入口。",
    tags: ["移动端", "导航", "App"],
    variants: ["图标底栏", "图文底栏", "带徽标底栏"],
    states: ["默认", "选中", "禁用"],
    useCases: ["首页", "搜索", "消息", "我的"],
    related: ["top-navigation", "badge"],
    preview: "bottom-navigation",
  }),
  item({
    id: "back-button",
    title: "返回按钮",
    english: "Back Button",
    category: "components",
    group: "导航",
    summary: "回到上一层。",
    plain: "返回按钮应该让用户明确知道可以离开当前详情或流程。",
    tags: ["导航", "移动端", "详情"],
    variants: ["文字返回", "图标返回", "浏览器返回"],
    states: ["默认", "悬停", "禁用"],
    useCases: ["详情页", "表单页", "二级页面", "移动端流程"],
    related: ["breadcrumb", "drawer"],
    preview: "back-button",
  }),
  item({
    id: "list",
    title: "列表",
    english: "List",
    category: "components",
    group: "展示",
    summary: "一条一条展示内容。",
    plain: "列表适合连续浏览类似内容，比如消息、订单和搜索结果。",
    tags: ["展示", "搜索", "后台"],
    variants: ["普通列表", "带头像列表", "可选列表", "分组列表"],
    states: ["默认", "选中", "加载", "空"],
    useCases: ["消息列表", "订单列表", "联系人", "搜索结果"],
    related: ["card", "table"],
    preview: "list",
  }),
  item({
    id: "avatar",
    title: "头像",
    english: "Avatar",
    category: "components",
    group: "展示",
    summary: "表示用户或对象。",
    plain: "头像帮助用户快速识别人、团队或空间。",
    tags: ["用户", "社交", "账号"],
    variants: ["图片头像", "文字头像", "头像组", "带状态头像"],
    states: ["在线", "离线", "加载", "缺省"],
    useCases: ["个人资料", "评论", "成员列表", "聊天"],
    related: ["badge", "chat-bubble"],
    preview: "avatar",
  }),
  item({
    id: "tag",
    title: "标签",
    english: "Tag",
    category: "components",
    group: "展示",
    summary: "给内容分类。",
    plain: "标签用于标记主题、状态、分类或可筛选条件。",
    tags: ["分类", "筛选", "状态"],
    variants: ["普通标签", "可关闭标签", "可选标签", "状态标签"],
    states: ["默认", "选中", "禁用"],
    useCases: ["文章分类", "商品属性", "任务状态", "筛选条件"],
    related: ["badge", "filter-panel"],
    preview: "tag",
  }),
  item({
    id: "popover",
    title: "浮层",
    english: "Popover",
    category: "components",
    group: "展示",
    summary: "临时显示更多内容。",
    plain: "浮层比 Tooltip 内容更多，但通常不打断整个页面。",
    tags: ["更多信息", "浮层", "临时"],
    variants: ["信息浮层", "操作浮层", "选择浮层"],
    states: ["隐藏", "显示", "关闭"],
    useCases: ["用户卡片", "小设置", "选择日期", "查看说明"],
    related: ["tooltip", "modal"],
    preview: "popover",
  }),
  item({
    id: "carousel",
    title: "轮播",
    english: "Carousel",
    category: "components",
    group: "展示",
    summary: "横向切换多张内容。",
    plain: "轮播适合少量视觉内容切换，不适合隐藏重要信息。",
    tags: ["图片", "营销", "内容"],
    variants: ["自动轮播", "手动轮播", "卡片轮播"],
    states: ["当前项", "上一项", "下一项"],
    useCases: ["活动 Banner", "作品展示", "图片浏览", "推荐内容"],
    related: ["card", "pagination"],
    preview: "carousel",
  }),
  item({
    id: "timeline",
    title: "时间线",
    english: "Timeline",
    category: "components",
    group: "展示",
    summary: "按时间展示事件。",
    plain: "时间线适合展示进度、历史记录、物流和版本变化。",
    tags: ["时间", "记录", "进度"],
    variants: ["纵向时间线", "横向时间线", "状态时间线"],
    states: ["已完成", "当前", "未来"],
    useCases: ["物流", "审批", "版本记录", "活动日程"],
    related: ["stepper", "progress"],
    preview: "timeline",
  }),
  item({
    id: "calendar",
    title: "日历",
    english: "Calendar",
    category: "components",
    group: "展示",
    summary: "日期视图。",
    plain: "日历帮助用户按天、周、月查看事件或选择日期。",
    tags: ["日期", "日程", "预订"],
    variants: ["月视图", "周视图", "日程视图", "范围选择"],
    states: ["今天", "选中", "禁用", "有事件"],
    useCases: ["排班", "预订", "活动", "日程管理"],
    related: ["date-picker", "timeline"],
    preview: "calendar",
  }),
  item({
    id: "alert",
    title: "警告",
    english: "Alert",
    category: "components",
    group: "反馈",
    summary: "显眼的重要提示。",
    plain: "Alert 适合显示需要被认真看到的信息，比如错误、风险或系统通知。",
    tags: ["警告", "错误", "提示"],
    variants: ["信息", "成功", "警告", "危险"],
    states: ["显示", "关闭", "带操作"],
    useCases: ["表单错误", "系统维护", "权限不足", "支付失败"],
    related: ["toast", "modal"],
    preview: "alert",
  }),
  item({
    id: "confirmation",
    title: "确认框",
    english: "Confirmation",
    category: "components",
    group: "反馈",
    summary: "防止误操作。",
    plain: "确认框用于删除、退出、付款等有明显后果的操作。",
    tags: ["危险", "确认", "弹窗"],
    variants: ["删除确认", "退出确认", "付款确认"],
    states: ["等待确认", "处理中", "取消"],
    useCases: ["删除文件", "退出登录", "清空记录", "取消订单"],
    related: ["modal", "button"],
    preview: "confirmation",
  }),
  item({
    id: "spinner",
    title: "加载圈",
    english: "Spinner",
    category: "components",
    group: "反馈",
    summary: "表示正在加载。",
    plain: "加载圈适合短时间等待，长时间加载更适合进度条或骨架屏。",
    tags: ["加载", "等待", "反馈"],
    variants: ["小加载圈", "按钮加载圈", "页面加载圈"],
    states: ["旋转", "停止"],
    useCases: ["提交中", "切换中", "加载更多", "刷新"],
    related: ["progress", "skeleton"],
    preview: "spinner",
  }),
  item({
    id: "success-state",
    title: "成功状态",
    english: "Success State",
    category: "components",
    group: "反馈",
    summary: "操作完成反馈。",
    plain: "成功状态让用户确信任务已经完成，可以继续下一步。",
    tags: ["成功", "完成", "反馈"],
    variants: ["成功页", "成功提示", "按钮成功"],
    states: ["完成", "可继续", "可返回"],
    useCases: ["支付成功", "保存成功", "发布成功", "提交成功"],
    related: ["toast", "button"],
    preview: "success-state",
  }),
  item({
    id: "error-state",
    title: "错误状态",
    english: "Error State",
    category: "components",
    group: "反馈",
    summary: "操作失败说明。",
    plain: "错误状态要说明哪里错了，以及用户怎么恢复。",
    tags: ["错误", "失败", "重试"],
    variants: ["表单错误", "页面错误", "网络错误", "权限错误"],
    states: ["失败", "可重试", "可返回"],
    useCases: ["上传失败", "付款失败", "网络失败", "权限不足"],
    related: ["alert", "toast"],
    preview: "error-state",
  }),
  item({
    id: "notification",
    title: "通知",
    english: "Notification",
    category: "components",
    group: "反馈",
    summary: "告诉用户有新消息。",
    plain: "通知通常比 Toast 更持久，可能进入通知中心或消息列表。",
    tags: ["消息", "提醒", "状态"],
    variants: ["站内通知", "系统通知", "未读通知"],
    states: ["未读", "已读", "关闭"],
    useCases: ["新消息", "审批提醒", "系统公告", "任务提醒"],
    related: ["badge", "toast"],
    preview: "notification",
  }),
  item({
    id: "form",
    title: "表单",
    english: "Form",
    category: "components",
    group: "复合",
    summary: "一组输入项。",
    plain: "表单把多个输入、选择和提交动作组合成一个任务。",
    tags: ["输入", "提交", "错误"],
    variants: ["单列表单", "分组表单", "分步表单"],
    states: ["填写中", "错误", "提交中", "成功"],
    useCases: ["注册", "资料编辑", "反馈提交", "地址填写"],
    related: ["text-field", "button"],
    preview: "form",
  }),
  item({
    id: "data-grid",
    title: "数据表格",
    english: "Data Grid",
    category: "components",
    group: "复合",
    summary: "可排序、筛选、编辑的数据表。",
    plain: "数据表格比普通表格更像工具，适合大量数据管理。",
    tags: ["后台", "数据", "编辑"],
    variants: ["可排序", "可筛选", "可编辑", "可选择"],
    states: ["加载", "空", "选中", "错误"],
    useCases: ["订单管理", "成员管理", "库存管理", "报表"],
    related: ["table", "filter-panel"],
    preview: "data-grid",
  }),
  item({
    id: "filter-panel",
    title: "筛选面板",
    english: "Filter Panel",
    category: "components",
    group: "复合",
    summary: "缩小内容范围。",
    plain: "筛选面板把多个筛选条件集中放在一起。",
    tags: ["筛选", "列表", "商品"],
    variants: ["侧边筛选", "顶部筛选", "抽屉筛选"],
    states: ["未筛选", "已筛选", "清空"],
    useCases: ["商品筛选", "订单筛选", "任务筛选", "搜索结果"],
    related: ["checkbox", "dropdown"],
    preview: "filter-panel",
  }),
  item({
    id: "sort-control",
    title: "排序控件",
    english: "Sort Control",
    category: "components",
    group: "复合",
    summary: "改变内容顺序。",
    plain: "排序控件让用户按时间、价格、热度或名称重新排列结果。",
    tags: ["排序", "列表", "搜索"],
    variants: ["下拉排序", "表头排序", "分段排序"],
    states: ["升序", "降序", "默认"],
    useCases: ["按价格", "按时间", "按热度", "按评分"],
    related: ["dropdown", "table"],
    preview: "sort-control",
  }),
  item({
    id: "media-player",
    title: "媒体播放器",
    english: "Media Player",
    category: "components",
    group: "复合",
    summary: "播放音视频。",
    plain: "播放器需要包含播放、暂停、进度、音量和全屏等基础控制。",
    tags: ["视频", "音频", "控制"],
    variants: ["音频播放器", "视频播放器", "迷你播放器"],
    states: ["播放", "暂停", "缓冲", "结束"],
    useCases: ["课程视频", "音乐", "直播回放", "产品演示"],
    related: ["slider", "progress"],
    preview: "media-player",
  }),
  item({
    id: "chat-bubble",
    title: "聊天气泡",
    english: "Chat Bubble",
    category: "components",
    group: "复合",
    summary: "展示对话内容。",
    plain: "聊天气泡区分自己和对方的消息，也显示状态和时间。",
    tags: ["聊天", "消息", "AI"],
    variants: ["用户气泡", "助手气泡", "系统消息"],
    states: ["发送中", "已发送", "失败"],
    useCases: ["客服", "AI Chatbot", "私信", "评论回复"],
    related: ["avatar", "notification"],
    preview: "chat-bubble",
  }),
  item({
    id: "comment-box",
    title: "评论框",
    english: "Comment Box",
    category: "components",
    group: "复合",
    summary: "输入并发布评论。",
    plain: "评论框通常由头像、输入区、发布按钮和回复状态组成。",
    tags: ["评论", "社交", "输入"],
    variants: ["基础评论框", "回复评论框", "带附件评论框"],
    states: ["输入中", "提交中", "成功", "失败"],
    useCases: ["文章评论", "商品评价", "任务讨论", "社交回复"],
    related: ["textarea", "button"],
    preview: "comment-box",
  }),
  item({
    id: "rating",
    title: "评分",
    english: "Rating",
    category: "components",
    group: "复合",
    summary: "星级或数值评价。",
    plain: "评分让用户快速表达满意程度，常见于商品、服务和内容评价。",
    tags: ["评价", "电商", "反馈"],
    variants: ["星级评分", "数字评分", "表情评分"],
    states: ["未评分", "悬停", "已评分", "只读"],
    useCases: ["商品评价", "课程评价", "服务满意度", "内容反馈"],
    related: ["comment-box", "badge"],
    preview: "rating",
  }),
  item({
    id: "shopping-cart",
    title: "购物车",
    english: "Shopping Cart",
    category: "components",
    group: "复合",
    summary: "商品选择与结算。",
    plain: "购物车需要展示商品、数量、价格、优惠和结算入口。",
    tags: ["电商", "结算", "支付"],
    variants: ["页面购物车", "迷你购物车", "抽屉购物车"],
    states: ["空", "有商品", "加载", "错误"],
    useCases: ["电商购买", "订阅套餐", "活动票务", "课程购买"],
    related: ["checkout-page", "button"],
    preview: "shopping-cart",
  }),
  item({
    id: "three-column",
    title: "三栏布局",
    english: "Three Column",
    category: "layouts",
    group: "复杂工具",
    summary: "三块区域并列承载不同任务。",
    plain: "三栏布局适合邮箱、后台和复杂工具，一般包含导航、列表和详情。",
    tags: ["邮箱", "后台", "工具"],
    useCases: ["邮箱", "项目管理", "开发工具", "客服系统"],
    related: ["sidebar-layout", "master-detail"],
    preview: "layout-three",
  }),
  item({
    id: "sticky-header",
    title: "吸顶顶部",
    english: "Sticky Header",
    category: "layouts",
    group: "滚动",
    summary: "滚动时顶部固定。",
    plain: "吸顶顶部让主要导航或操作在滚动中保持可见。",
    tags: ["滚动", "导航", "网页"],
    useCases: ["文档站", "电商", "后台", "长页面"],
    related: ["top-navigation", "sticky-sidebar"],
    preview: "layout-sticky-header",
  }),
  item({
    id: "sticky-sidebar",
    title: "吸附侧栏",
    english: "Sticky Sidebar",
    category: "layouts",
    group: "滚动",
    summary: "滚动时侧栏保持可见。",
    plain: "吸附侧栏常用于文档目录、筛选器和页面导航。",
    tags: ["目录", "筛选", "滚动"],
    useCases: ["文档目录", "商品筛选", "文章目录", "帮助中心"],
    related: ["sidebar", "filter-panel"],
    preview: "layout-sticky-sidebar",
  }),
  item({
    id: "masonry",
    title: "瀑布流",
    english: "Masonry",
    category: "layouts",
    group: "图片",
    summary: "高低不同的内容错落排列。",
    plain: "瀑布流适合图片、灵感和作品集，但不适合需要严格比较的数据。",
    tags: ["图片", "灵感", "作品"],
    useCases: ["图片社区", "灵感库", "作品集", "商品图集"],
    related: ["card-grid", "carousel"],
    preview: "layout-masonry",
  }),
  item({
    id: "split-pane",
    title: "分割面板",
    english: "Split Pane",
    category: "layouts",
    group: "工具",
    summary: "可调整大小的并列区域。",
    plain: "分割面板常用于编辑器和开发工具，一边编辑一边预览。",
    tags: ["编辑器", "开发工具", "预览"],
    useCases: ["代码编辑器", "邮件编辑", "设计工具", "文档预览"],
    related: ["three-column", "toolbar"],
    preview: "layout-split",
  }),
  item({
    id: "wizard",
    title: "向导式布局",
    english: "Wizard",
    category: "layouts",
    group: "流程",
    summary: "分步骤完成复杂任务。",
    plain: "向导式布局把复杂任务拆成几步，让用户一步一步完成。",
    tags: ["注册", "支付", "问卷"],
    useCases: ["注册", "支付", "导入数据", "问卷"],
    related: ["stepper", "form"],
    preview: "layout-wizard",
  }),
  item({
    id: "fullscreen-modal",
    title: "全屏弹窗",
    english: "Fullscreen Modal",
    category: "layouts",
    group: "流程",
    summary: "用完整屏幕承载临时任务。",
    plain: "全屏弹窗适合移动端复杂编辑或需要沉浸处理的任务。",
    tags: ["移动端", "编辑", "弹窗"],
    useCases: ["复杂编辑", "移动端发布", "资料填写", "图片编辑"],
    related: ["modal", "drawer"],
    preview: "layout-fullscreen-modal",
  }),
  item({
    id: "landing-page",
    title: "落地页",
    english: "Landing Page",
    category: "layouts",
    group: "营销",
    summary: "介绍产品或活动并促成行动。",
    plain: "落地页通常包含主标题、卖点、证明、行动按钮和常见问题。",
    tags: ["营销", "官网", "转化"],
    useCases: ["产品官网", "活动页", "下载页", "报名页"],
    related: ["button", "card-grid"],
    preview: "layout-landing",
  }),
  item({
    id: "profile-page",
    title: "资料页",
    english: "Profile Page",
    category: "layouts",
    group: "用户",
    summary: "展示用户或对象资料。",
    plain: "资料页用于展示头像、简介、数据、作品和操作入口。",
    tags: ["用户", "社交", "账号"],
    useCases: ["个人主页", "团队主页", "作者资料", "商家资料"],
    related: ["avatar", "card"],
    preview: "layout-profile",
  }),
  item({
    id: "search-results-page",
    title: "搜索结果页",
    english: "Search Results Page",
    category: "layouts",
    group: "查找",
    summary: "展示搜索后的结果。",
    plain: "搜索结果页需要有搜索框、结果列表、筛选和无结果状态。",
    tags: ["搜索", "筛选", "结果"],
    useCases: ["站内搜索", "商品搜索", "文档搜索", "帮助搜索"],
    related: ["search", "filter-panel"],
    preview: "layout-search-results",
  }),
  item({
    id: "detail-page",
    title: "详情页",
    english: "Detail Page",
    category: "layouts",
    group: "详情",
    summary: "展示一个对象的完整信息。",
    plain: "详情页适合商品、文章、用户、订单和任务。",
    tags: ["详情", "商品", "文章"],
    useCases: ["商品详情", "文章详情", "订单详情", "用户详情"],
    related: ["two-column", "tabs"],
    preview: "layout-detail",
  }),
  item({
    id: "border",
    title: "边框",
    english: "Border",
    category: "styles",
    group: "分隔",
    summary: "用线条建立边界。",
    plain: "边框适合轻量分隔，比阴影更克制。",
    tags: ["分隔", "卡片", "输入"],
    variants: ["细边框", "虚线边框", "强调边框"],
    related: ["shadow", "divider"],
    preview: "style-border",
  }),
  item({
    id: "gradient",
    title: "渐变",
    english: "Gradient",
    category: "styles",
    group: "视觉",
    summary: "颜色之间平滑过渡。",
    plain: "渐变可以制造层次和品牌感，但用多了会显得吵。",
    tags: ["品牌", "背景", "按钮"],
    variants: ["按钮渐变", "背景渐变", "卡片渐变"],
    related: ["color", "emphasis"],
    preview: "style-gradient",
  }),
  item({
    id: "transparency",
    title: "透明感",
    english: "Transparency",
    category: "styles",
    group: "材质",
    summary: "半透明或毛玻璃效果。",
    plain: "透明感适合浮层和系统界面，但必须保证文字可读。",
    tags: ["毛玻璃", "浮层", "模糊"],
    variants: ["半透明", "毛玻璃", "模糊背景"],
    related: ["popover", "modal"],
    preview: "style-transparency",
  }),
  item({
    id: "icon-style",
    title: "图标风格",
    english: "Icon Style",
    category: "styles",
    group: "图标",
    summary: "线性、实心或双色图标。",
    plain: "同一个界面里的图标风格应该一致，不要混用太多样式。",
    tags: ["图标", "导航", "按钮"],
    variants: ["线性", "实心", "双色", "圆角"],
    related: ["icon-button", "toolbar"],
    preview: "style-icons",
  }),
  item({
    id: "divider",
    title: "分割方式",
    english: "Divider",
    category: "styles",
    group: "分隔",
    summary: "用线、留白、卡片或色块分组。",
    plain: "好的分割方式让用户知道哪些信息属于一组。",
    tags: ["分组", "排版", "列表"],
    variants: ["分割线", "留白", "卡片", "色块"],
    related: ["spacing", "border"],
    preview: "style-divider",
  }),
  item({
    id: "emphasis",
    title: "强调方式",
    english: "Emphasis",
    category: "styles",
    group: "重点",
    summary: "突出最重要的信息。",
    plain: "强调可以用粗体、背景、徽标或颜色，但一屏重点不要太多。",
    tags: ["重点", "高亮", "状态"],
    variants: ["高亮", "徽标", "加粗", "背景色"],
    related: ["badge", "color"],
    preview: "style-emphasis",
  }),
  item({
    id: "theme",
    title: "主题",
    english: "Theme",
    category: "styles",
    group: "主题",
    summary: "明亮、暗黑或高对比模式。",
    plain: "主题不是换背景色这么简单，还要重新检查文字、边框和状态。",
    tags: ["明亮", "暗黑", "高对比"],
    variants: ["明亮模式", "暗黑模式", "高对比模式"],
    related: ["dark-mode", "color"],
    preview: "style-theme",
  }),
  item({
    id: "brand-feel",
    title: "品牌感",
    english: "Brand Feel",
    category: "styles",
    group: "气质",
    summary: "界面给人的第一印象。",
    plain: "品牌感可以是企业、科技、可爱、复古、游戏化或极简。",
    tags: ["品牌", "气质", "视觉"],
    variants: ["企业", "科技", "可爱", "复古", "游戏化"],
    related: ["color", "typography"],
    preview: "style-brand",
  }),
  item({
    id: "fade-motion",
    title: "淡入淡出",
    english: "Fade",
    category: "motion",
    group: "切换",
    summary: "内容轻轻出现或消失。",
    plain: "淡入淡出适合同一区域内容替换，感觉安静不打扰。",
    tags: ["进入", "离开", "切换"],
    useCases: ["Toast 消失", "内容切换", "弹窗出现"],
    related: ["toast", "modal"],
    preview: "motion-fade",
  }),
  item({
    id: "slide-motion",
    title: "滑入滑出",
    english: "Slide",
    category: "motion",
    group: "空间",
    summary: "从某个方向进入或离开。",
    plain: "滑动动效能暗示内容来自哪里，比如抽屉从侧边滑出。",
    tags: ["抽屉", "页面", "空间"],
    useCases: ["抽屉", "页面切换", "通知进入"],
    related: ["drawer", "page-transition"],
    preview: "motion-slide",
  }),
  item({
    id: "scale-motion",
    title: "缩放动效",
    english: "Scale",
    category: "motion",
    group: "反馈",
    summary: "轻微变大或变小。",
    plain: "缩放常用于点击反馈、弹窗出现和卡片选中。",
    tags: ["点击", "弹窗", "卡片"],
    useCases: ["按钮按下", "弹窗打开", "卡片选中"],
    related: ["press-motion", "modal"],
    preview: "motion-scale",
  }),
  item({
    id: "page-transition",
    title: "页面切换",
    english: "Page Transition",
    category: "motion",
    group: "导航",
    summary: "页面之间的过渡。",
    plain: "页面切换要帮助用户理解前进、返回和层级关系。",
    tags: ["页面", "导航", "层级"],
    useCases: ["进入详情", "返回列表", "切换栏目"],
    related: ["slide-motion", "breadcrumb"],
    preview: "motion-page",
  }),
  item({
    id: "attention-motion",
    title: "注意力动效",
    english: "Attention Motion",
    category: "motion",
    group: "提醒",
    summary: "提醒用户注意。",
    plain: "注意力动效应该少用，只提醒真正重要的变化。",
    tags: ["提醒", "徽标", "通知"],
    useCases: ["新消息", "未读徽标", "重要按钮"],
    related: ["badge", "notification"],
    preview: "motion-attention",
  }),
  item({
    id: "spatial-motion",
    title: "空间动效",
    english: "Spatial Motion",
    category: "motion",
    group: "空间",
    summary: "表达位置关系。",
    plain: "空间动效让用户知道一个面板、卡片或详情从哪里来。",
    tags: ["位置", "层级", "详情"],
    useCases: ["卡片展开", "抽屉滑出", "详情进入"],
    related: ["drawer", "master-detail"],
    preview: "motion-spatial",
  }),
  item({
    id: "list-motion",
    title: "列表动效",
    english: "List Motion",
    category: "motion",
    group: "数据",
    summary: "表达数据变化。",
    plain: "列表新增、删除或排序时，轻微动效能减少突兀感。",
    tags: ["列表", "数据", "排序"],
    useCases: ["插入新项", "删除条目", "排序变化"],
    related: ["list", "sort-control"],
    preview: "motion-list",
  }),
  item({
    id: "drag-motion",
    title: "拖拽动效",
    english: "Drag Motion",
    category: "motion",
    group: "手势",
    summary: "对象跟随手指或鼠标移动。",
    plain: "拖拽动效应该实时反馈，并在释放后清楚地落到目标位置。",
    tags: ["拖拽", "排序", "移动"],
    useCases: ["拖拽排序", "移动文件", "拖拽上传"],
    related: ["file-upload", "list-motion"],
    preview: "motion-drag",
  }),
  item({
    id: "signup-pattern",
    title: "注册",
    english: "Signup",
    category: "patterns",
    group: "账号",
    summary: "创建新账号。",
    plain: "注册流程需要解释要填什么、为什么填，以及如何处理错误。",
    tags: ["账号", "表单", "引导"],
    useCases: ["邮箱注册", "手机号注册", "邀请注册"],
    related: ["form", "stepper"],
    preview: "pattern-signup",
  }),
  item({
    id: "sort-pattern",
    title: "排序",
    english: "Sort",
    category: "patterns",
    group: "查找",
    summary: "改变结果顺序。",
    plain: "排序让用户按自己关心的维度看内容，比如最新、最热、价格。",
    tags: ["搜索", "列表", "商品"],
    useCases: ["按最新", "按价格", "按评分", "按热度"],
    related: ["sort-control", "dropdown"],
    preview: "pattern-sort",
  }),
  item({
    id: "onboarding-pattern",
    title: "新手引导",
    english: "Onboarding",
    category: "patterns",
    group: "引导",
    summary: "帮助新用户开始使用。",
    plain: "新手引导应该尽快让用户完成第一件有价值的事。",
    tags: ["引导", "注册", "首次使用"],
    useCases: ["欢迎页", "权限说明", "功能介绍", "首个任务"],
    related: ["wizard", "stepper"],
    preview: "pattern-onboarding",
  }),
  item({
    id: "settings-pattern",
    title: "设置",
    english: "Settings",
    category: "patterns",
    group: "账户",
    summary: "管理账户和偏好。",
    plain: "设置场景要让用户快速找到选项，并理解开启或关闭的影响。",
    tags: ["账户", "偏好", "开关"],
    useCases: ["通知设置", "隐私设置", "安全设置", "主题设置"],
    related: ["settings-page", "switch"],
    preview: "pattern-settings",
  }),
  item({
    id: "form-fill-pattern",
    title: "表单填写",
    english: "Form Filling",
    category: "patterns",
    group: "输入",
    summary: "完成一组信息填写。",
    plain: "表单填写要有清楚标签、帮助文字、错误提示和提交反馈。",
    tags: ["表单", "错误", "提交"],
    useCases: ["收货地址", "资料编辑", "问卷", "申请表"],
    related: ["form", "text-field"],
    preview: "pattern-form",
  }),
  item({
    id: "error-message-pattern",
    title: "错误提示",
    english: "Error Message",
    category: "patterns",
    group: "反馈",
    summary: "告诉用户哪里出了问题。",
    plain: "错误提示要说明原因和恢复方式，不要只写“失败”。",
    tags: ["错误", "表单", "恢复"],
    useCases: ["密码错误", "网络失败", "权限不足", "上传失败"],
    related: ["alert", "error-state"],
    preview: "pattern-error",
  }),
  item({
    id: "term-tooltip",
    title: "提示气泡",
    english: "Tooltip",
    category: "dictionary",
    group: "说明",
    summary: "悬停时出现的小说明。",
    plain: "Tooltip 常用于解释图标、短标签和快捷键。",
    aliases: ["提示气泡"],
    related: ["tooltip", "popover"],
    preview: "tooltip",
  }),
  item({
    id: "term-popover",
    title: "浮层",
    english: "Popover",
    category: "dictionary",
    group: "浮层",
    summary: "临时显示更多内容的浮层。",
    plain: "Popover 比 Tooltip 内容更多，通常可以放小操作或小表单。",
    aliases: ["浮层"],
    related: ["popover", "tooltip"],
    preview: "popover",
  }),
  item({
    id: "term-accordion",
    title: "手风琴",
    english: "Accordion",
    category: "dictionary",
    group: "展示",
    summary: "展开和收起内容的组件。",
    plain: "Accordion 常用于 FAQ、设置分组和长说明。",
    aliases: ["手风琴"],
    related: ["accordion"],
    preview: "accordion",
  }),
  item({
    id: "term-carousel",
    title: "轮播",
    english: "Carousel",
    category: "dictionary",
    group: "展示",
    summary: "横向轮流展示内容。",
    plain: "Carousel 常见于 Banner、图片和推荐内容。",
    aliases: ["轮播"],
    related: ["carousel"],
    preview: "carousel",
  }),
  item({
    id: "term-pagination",
    title: "分页",
    english: "Pagination",
    category: "dictionary",
    group: "导航",
    summary: "分页浏览内容。",
    plain: "Pagination 让用户在很多页结果之间切换。",
    aliases: ["分页"],
    related: ["pagination"],
    preview: "pagination",
  }),
  item({
    id: "term-breadcrumb",
    title: "面包屑",
    english: "Breadcrumb",
    category: "dictionary",
    group: "导航",
    summary: "显示当前位置的路径。",
    plain: "Breadcrumb 像面包屑路径，帮助用户回到上一级。",
    aliases: ["面包屑"],
    related: ["breadcrumb"],
    preview: "breadcrumb",
  }),
  item({
    id: "term-cta",
    title: "行动号召",
    english: "CTA",
    category: "dictionary",
    group: "操作",
    summary: "希望用户点击的主要行动。",
    plain: "CTA 通常是页面最重要的按钮，比如立即购买、开始使用。",
    aliases: ["行动号召", "主按钮"],
    related: ["button"],
    preview: "button",
  }),
  item({
    id: "term-fab",
    title: "悬浮操作按钮",
    english: "FAB",
    category: "dictionary",
    group: "操作",
    summary: "悬浮操作按钮。",
    plain: "FAB 是 Floating Action Button 的缩写，常见于移动端主操作。",
    aliases: ["悬浮按钮"],
    related: ["floating-action-button"],
    preview: "floating-action-button",
  }),
];

function applyDocumentCategory(entry) {
  const override = documentGroupByLabel(manualDocumentGroupById[entry.id]);
  if (override) return { ...entry, ...override };
  const match =
    documentCategoryIndex.itemGroups.get(normalizeForKey(entry.english)) ||
    documentCategoryIndex.itemGroups.get(normalizeForKey(entry.title));
  if (!match) return entry;
  return { ...entry, ...match };
}

const curatedItems = [...coreItems, ...additionalItems].map(applyDocumentCategory);
const generatedIndexItems = parseExpandedIndex(expandedUiIndex, curatedItems);

export const uiItems = [...curatedItems, ...generatedIndexItems];

export const uiDocumentSections = documentCategoryIndex.sections;
export const uiDocumentTabs = documentCategoryIndex.categories;

export const quickQuestions = [
  "按钮和链接有什么区别？",
  "什么是弹窗？",
  "什么时候使用 Toast？",
  "为什么加载时会有骨架屏？",
  "什么是面包屑导航？",
];

export const categoryDescriptions = {
  components: "按钮、输入框、弹窗、标签页、Toast 等界面零件。",
  layouts: "单列、双栏、侧边栏、仪表盘、结算页等页面骨架。",
  styles: "圆角、阴影、留白、字体层级、颜色和密度。",
  motion: "点击、悬停、加载、成功、错误、展开和减少动效。",
  patterns: "登录、搜索、筛选、上传、支付、删除确认等常见流程。",
  dictionary: "弹窗 Modal、轻提示 Toast、标签页 Tab、抽屉 Drawer 等术语。",
  states: "默认、悬停、加载、错误、网络、媒体、AI 等状态字段。",
  mobile: "移动导航、底部面板、手势列表、设备能力等移动端组件。",
  react: "页面、Provider、预览、Playground、工具控件等 React 组件。",
  accessibility: "可访问性、国际化、RTL、焦点、读屏与本地化条目。",
};

export function findItem(id) {
  return uiItems.find((entry) => entry.id === id) || uiItems[0];
}
