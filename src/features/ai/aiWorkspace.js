import { aiSpecLabels, patternComparisonNotes, workspaceStructuredFields } from "./aiConfig.js";

export function buildProjectTechStack(aiConfig, projectConfig) {
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

export function buildStructuredInputText(values = {}) {
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

export function getSpecCoverage(spec = {}) {
  return aiSpecLabels.filter(([key]) => {
    const value = spec[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length / aiSpecLabels.length;
}

export function getQualityBreakdown(result, spec = result?.interactionSpec || {}) {
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

export function getQualityScore(result, spec = result?.interactionSpec || {}) {
  const breakdown = getQualityBreakdown(result, spec);
  if (!Array.isArray(breakdown)) return 0;
  return Math.round(breakdown.reduce((sum, item) => sum + item.score, 0) / breakdown.length);
}

export function mergeResultSpec(result, spec) {
  if (!result) return null;
  return { ...result, interactionSpec: spec };
}

export function inferPatternFromText(text) {
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

export function detectInteractionPoints(input, result) {
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

export function buildPatternComparisons(result) {
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

export function stringifySpecValue(value) {
  if (Array.isArray(value)) return value.join("；");
  return value || "";
}

export function getSpecDiffRows(leftVersion, rightVersion) {
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

export function getVersionSummary(version) {
  return {
    title: version?.title || "交互规范",
    pattern: version?.result?.recommendedPattern?.name || "待判断",
    score: version?.qualityScore || getQualityScore(version?.result, version?.spec),
    point: version?.activePoint?.title || "整体分析",
  };
}

export function getWorkspaceWarnings(points, analyses) {
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
