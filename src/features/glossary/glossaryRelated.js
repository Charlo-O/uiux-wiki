import { findItem, uiItems } from "../../data.js";
import { normalize } from "./glossarySearch.js";

export const homePriorityIds = [
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
export function findRelatedItemsForAi(input) {
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
