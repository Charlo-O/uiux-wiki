import { normalize } from "../glossary/glossarySearch.js";
import { aiSpecLabels } from "./aiConfig.js";
import { buildProjectTechStack } from "./aiWorkspace.js";

export function formatMarkdownSpec(result) {
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

export function formatTicketExport(result, spec = result?.interactionSpec || {}, inputText = "", projectConfig = {}) {
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

export function buildRuleDebugData({ inputText, result, interactionPoints, patternComparisons, workspaceWarnings, qualityScore }) {
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
