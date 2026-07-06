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

export function parseAiResult(content, userText) {
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

