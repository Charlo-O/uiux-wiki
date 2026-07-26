export function buildTemplatePlaygroundHref(source, {
  pathname = typeof window !== "undefined" ? window.location.pathname : "/",
} = {}) {
  const slug = typeof source === "string" ? source : source?.slug ?? source?.source;
  if (!slug) {
    return `${pathname}?view=playground`;
  }
  const params = new URLSearchParams();
  params.set("view", "playground");
  params.set("template", slug);
  return `${pathname}?${params.toString()}`;
}

export function buildTemplateUseText(template) {
  const slug = typeof template === "string" ? template : template?.slug ?? template?.source;
  return [
    `// uiux.wiki local template: ${slug}`,
    `// Open in Playground: ${buildTemplatePlaygroundHref(slug)}`,
    `// This preview is a local React renderer; no Astryx runtime is required.`,
  ].join("\n");
}

export async function copyTextToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

export async function copyTemplateUse(template) {
  return copyTextToClipboard(buildTemplateUseText(template));
}

export function updateTemplatePreviewUrl(slug, {
  pathname = typeof window !== "undefined" ? window.location.pathname : "/",
  category,
  replace = false,
} = {}) {
  if (typeof window === "undefined") {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  params.set("view", "templates");
  if (slug) {
    params.set("preview", slug);
  } else {
    params.delete("preview");
  }
  if (category && category !== "All") {
    params.set("category", category);
  } else {
    params.delete("category");
  }
  const href = `${pathname}?${params.toString()}`;
  window.history[replace ? "replaceState" : "pushState"]({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
  return href;
}
