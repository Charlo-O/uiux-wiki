import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  logLevel: "error",
});

const issues = [];

function fail(item, reason, expected = "") {
  issues.push({
    id: item?.id || "(missing)",
    category: item?.category || "(unknown)",
    english: item?.english || "",
    previewBase: item?.previewBase || "",
    expected,
    reason,
  });
}

function searchText(item) {
  return `${item.title || ""} ${item.english || ""} ${item.group || ""}`.toLowerCase();
}

function expectBase(item, expected, reason) {
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (!allowed.includes(item.previewBase)) {
    fail(item, reason, allowed.join(" | "));
  }
}

function expectPattern(item, pattern, reason) {
  if (!pattern.test(item.previewBase || "")) {
    fail(item, reason, String(pattern));
  }
}

function auditHighRiskNameFamilies(item) {
  const text = searchText(item);
  const core = `${item.title || ""} ${item.english || ""}`.toLowerCase();

  if (item.category === "components") {
    if (/time range picker|date range picker|date time picker|date picker|time picker|calendar picker|month picker|year picker|week picker|quarter picker/.test(core)) {
      expectBase(item, "date-picker", "date/time picker entries must render as date picker previews");
    }
    if (/password strength meter/.test(core)) {
      expectBase(item, "progress", "password strength meters must render as meters, not password fields");
    }
    if (/autosave indicator|save status/.test(core)) {
      expectBase(item, "status-indicator", "save/autosave status entries must render as status previews");
    }
    if (/reset password form/.test(core)) {
      expectBase(item, "form", "reset password form entries must render as forms");
    }
    if (/saved view settings/.test(core)) {
      expectBase(item, "form", "saved view settings must render as settings forms");
    }
    if (/saved view$/.test(core.trim())) {
      expectBase(item, "data-grid", "saved view entries belong to data-grid/table view configuration");
    }
    if (/activity feed/.test(core)) {
      expectBase(item, "timeline", "activity feed entries must render as timeline/feed previews");
    }
    if (/kanban board/.test(core)) {
      expectBase(item, "layout-kanban", "kanban boards must render as kanban layouts");
    }
    if (/cancel subscription confirmation|account deletion confirmation/.test(core)) {
      expectBase(item, "modal", "confirmation entries must render as confirmation dialogs");
    }
    if (/feedback buttons|thumbs feedback/.test(core)) {
      expectBase(item, "button", "feedback button groups must render as button previews");
    }
    if (/inline cell editor|cell editor|spreadsheet editor/.test(core)) {
      expectBase(item, "data-grid", "cell and spreadsheet editors must render as editable grids");
    }
    if (/editor toolbar|formatting toolbar|floating formatting toolbar/.test(core)) {
      expectBase(item, "toolbar", "editor toolbar entries must render as toolbars");
    }
    if (/edit preview split/.test(core)) {
      expectBase(item, "layout-split", "edit/preview split entries must render as split layouts");
    }
    if (/inline edit|editable text/.test(core)) {
      expectBase(item, "editor", "inline edit entries must render as editor/text editing previews");
    }
    if (/text editor|rich text editor|markdown editor|code editor|json editor|formula editor|block editor|wysiwyg editor|document editor|diagram editor|flowchart editor|link editor|multilingual content editor/.test(core)) {
      expectBase(item, "editor", "editor-family entries must not fall back to button previews");
    }
    if (/profile edit form|saved view settings/.test(core)) {
      expectBase(item, "form", "forms and settings forms must render as form previews");
    }
    if (/tree view|directory tree|file tree|organization tree|permission tree|checkable tree|draggable tree|\btree$/.test(core.trim())) {
      expectBase(item, "list", "tree entries use the list preview base so SpecificPreview can render tree details");
    }
    if (/accordion|disclosure/.test(core)) {
      expectBase(item, "accordion", "accordion/disclosure entries must render as expandable panels");
    }
    if (/map marker|marker cluster|location pin|polygon selection|street view entry/.test(core)) {
      expectBase(item, "map", "map marker/location entries must render as map previews");
    }
    if (/role badge/.test(core)) {
      expectBase(item, "badge", "role badges must render as badges, not security panels");
    }
    if (/context attachment|context panel|file context card|web context card/.test(core)) {
      expectBase(item, "command-palette", "AI context entries must render as AI command/context previews");
    }
    if (/\bbutton\b|\bcta\b|call to action/.test(core)) {
      expectBase(item, ["button", "icon-button", "floating-action-button", "back-button"], "button-family entries must render as button previews");
    }
  }

  if (item.category === "states") {
    if (/timeout|version outdated|update required/.test(core)) {
      expectBase(item, "alert", "timeout/outdated/update-required states must render as alerts");
    }
    if (/upload paused/.test(core)) {
      expectBase(item, "progress", "upload paused is an upload/progress state");
    }
    if (/媒体状态/.test(text) && /stopped/.test(core)) {
      expectBase(item, "media-player", "media stopped state must render as media controls");
    }
    if (/通知、消息与社交状态/.test(text) && /delivered|muted|unmuted/.test(core)) {
      expectBase(item, "status-indicator", "notification delivered/muted states must render as status indicators");
    }
    if (/电商与交易状态/.test(text) && /delivered/.test(core)) {
      expectBase(item, "shopping-cart", "commerce delivered state must render as commerce status");
    }
    if (/in stock|low stock|out of stock|preorder|pending payment|payment processing|payment success|payment failed|subscription active|subscription expired/.test(core)) {
      expectBase(item, "shopping-cart", "commerce state entries must render as commerce previews");
    }
    if (/current date|current time|today|tomorrow/.test(core)) {
      expectBase(item, "date-picker", "date/time state entries must render as date previews");
    }
    if (/citations available|citations missing|content filtered|context too long|continuable|grounded|ungrounded|high confidence|low confidence|model unavailable|needs human confirmation|quota exceeded|retrieving|tool calling|truncated/.test(core) || (/ai 状态|ai 狀態/.test(text) && /stopped/.test(core))) {
      expectBase(item, "command-palette", "AI state entries must render as AI command/status previews");
    }
  }

  if (item.category === "patterns") {
    if (/delete file/.test(core)) {
      expectBase(item, "pattern-delete", "delete-file is a destructive/delete pattern");
    }
    if (/download invoice/.test(core)) {
      expectBase(item, "pattern-operation", "download invoice is an operation/download pattern");
    }
    if (/pull to refresh/.test(core)) {
      expectBase(item, "pattern-mobile", "pull-to-refresh is a mobile gesture pattern");
    }
    if (/ai generation|stop ai generation|continue generation|regenerate|ai rewrite|ai translation|ai summary|ai q&a|ai classification|ai extraction|ai recommendation|ai autocomplete|ai code suggestion|ai citation|ai tool calling|ai feedback|apply ai suggestion|low confidence|ai safety|ai context/.test(text)) {
      expectBase(item, "pattern-ai", "AI pattern entries must render as AI workflow previews");
    }
    if (/submit failure/.test(core)) {
      expectBase(item, "pattern-form", "submit failure is a form/submission pattern");
    }
    if (/empty project|first load/.test(core)) {
      expectBase(item, "pattern-onboarding", "empty project and first load are onboarding/empty-start patterns");
    }
  }

  if (item.category === "styles" && /logo style|brand logo|logo system|brand illustration|logo/.test(core)) {
    expectBase(item, "style-brand", "logo style entries must render as brand style previews");
  }

  if (item.category === "motion" && /fullscreen overlay motion|overlay motion|modal overlay motion/.test(core)) {
    expectBase(item, "motion-overlay", "overlay motion entries must render as overlay motion previews");
  }

}

try {
  const { uiItems } = await server.ssrLoadModule("/src/data.js");
  const generated = uiItems.filter((item) => item.isGenerated);
  const previewIds = new Set();

  for (const item of generated) {
    if (!item.previewBase) fail(item, "generated entries must include previewBase");
    if (String(item.previewBase || "").includes(":")) fail(item, "generated previewBase must be the canonical base, not a previewId");
    if (!item.previewId) fail(item, "generated entries must include previewId");
    if (!item.preview) fail(item, "generated entries must include preview");
    if (item.preview === item.previewBase) fail(item, "generated preview must use a unique previewId, not the shared previewBase");
    if (item.previewBase === "generic" || item.previewBase === "taxonomy") fail(item, "generated entries must not fall back to generic/taxonomy previews");
    if (previewIds.has(item.previewId)) fail(item, "generated previewId must be unique");
    previewIds.add(item.previewId);

    if (item.previewId && item.previewBase && !String(item.previewId).endsWith(`:${item.previewBase}`)) {
      fail(item, "previewId must encode the previewBase suffix");
    }

    if (item.category === "layouts") expectPattern(item, /^layout-/, "layout generated entries must stay in layout previews");
    if (item.category === "styles") expectPattern(item, /^style-/, "style generated entries must stay in style previews");
    if (item.category === "motion") expectPattern(item, /^motion-/, "motion generated entries must stay in motion previews");
    if (item.category === "patterns") expectPattern(item, /^pattern-/, "pattern generated entries must stay in pattern previews");
    if (item.category === "mobile") expectBase(item, "mobile-preview", "mobile generated entries must use the mobile preview");
    if (item.category === "react") expectBase(item, ["react-component", "react-preview"], "React generated entries must use React preview families");
    if (item.category === "accessibility") expectPattern(item, /^(a11y|i18n)(-|$)/, "accessibility generated entries must use a11y/i18n preview families");
    if (item.category === "dictionary") expectBase(item, "term-card", "dictionary generated entries must use term cards");

    auditHighRiskNameFamilies(item);
  }

  const summary = {
    generated: generated.length,
    duplicatePreviewIds: generated.length - previewIds.size,
    issues: issues.length,
  };

  if (issues.length) {
    console.error(JSON.stringify({ summary, issues: issues.slice(0, 80) }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify(summary, null, 2));
  }
} finally {
  await server.close();
}
