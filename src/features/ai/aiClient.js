import { findRelatedItemsForAi } from "../glossary/glossaryRelated.js";
import { parseAiResult } from "./aiParser.js";
import { buildAiSystemPrompt, buildAiUserPrompt } from "./aiPrompt.js";

function normalizeAiEndpoint(endpoint) {
  const value = endpoint.trim().replace(/\/+$/, "");
  if (!value) return "";
  if (value.endsWith("/chat/completions")) return value;
  if (value.endsWith("/v1")) return `${value}/chat/completions`;
  return `${value}/v1/chat/completions`;
}
export async function requestAiCompletion(config, body, includeResponseFormat = true) {
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

export async function generateAiAnalysis({ config, input, mode, detailLevel }) {
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
