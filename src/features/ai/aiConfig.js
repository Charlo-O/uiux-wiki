export const aiConfigDefaults = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  apiKey: "",
  model: "gpt-4.1-mini",
  techStack: "React + Vite + CSS + lucide-react",
  temperature: 0.25,
};

export const aiModes = {
  translate: "交互翻译",
  choose_component: "组件选择",
  generate_spec: "生成规范",
  review: "交互审查",
  coding_prompt: "Prompt 优化",
};

export const aiDetailLevels = {
  brief: "简洁",
  standard: "标准",
  detailed: "详细",
};

export const aiExamples = [
  "我想让按钮点一下弹出一个可以选东西的小框",
  "卡片 hover 显示详情，点击可以跳转",
  "用户列表里点一行打开右侧详情，删除前要确认",
  "下拉框可以输入搜索并选择用户",
  "左侧面板可以左右拖动调整宽度",
];

export const aiSpecLabels = [
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

export const workspaceProjectDefaults = {
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

export const workspaceExamples = [
  "表格行点击打开详情，右侧有更多操作，删除前需要确认",
  "点按钮弹出可以搜索并选择成员的小面板",
  "卡片 hover 显示操作，点击卡片跳转详情页",
  "移动端底部弹出筛选面板，提交后显示结果数量",
];

export const workspaceStructuredFields = [
  ["trigger", "用户触发什么？", "点击表格行 / hover 卡片 / 拖拽分隔条"],
  ["change", "出现什么变化？", "右侧打开详情面板 / 底部弹出筛选面板"],
  ["nextStep", "用户下一步要做什么？", "查看详情 / 选择成员 / 确认删除"],
  ["navigation", "是否会跳转？", "不跳转，保留当前列表上下文"],
  ["form", "是否包含表单？", "包含搜索和多选 / 不包含表单"],
  ["blocking", "是否必须完成？", "不必须完成，可关闭返回"],
  ["mobile", "是否支持移动端？", "小屏使用 Bottom Sheet"],
  ["componentLibrary", "目标组件库是什么？", "shadcn/ui + Radix primitives"],
];

export const structuredInputDefaults = Object.fromEntries(workspaceStructuredFields.map(([key]) => [key, ""]));

export const patternComparisonNotes = {
  "Popover": "贴近触发器，适合轻量可交互内容。",
  "Modal": "强阻塞，适合必须完成或确认的关键任务。",
  "Dialog": "适合短流程确认，不适合承载大量内容。",
  "Drawer": "适合保留页面上下文的详情、筛选和编辑。",
  "Toast": "适合非阻塞反馈，不适合承载决策。",
  "Tooltip": "只适合解释说明，不承载按钮或表单。",
  "Bottom Sheet": "移动端更自然，适合筛选、分享和选择。",
};

