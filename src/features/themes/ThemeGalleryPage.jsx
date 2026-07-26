import React, { useMemo, useState } from "react";
import { ThemePicker } from "./ThemePicker.jsx";
import { ThemePreviewSurface } from "./ThemePreviewSurface.jsx";
import { UIUX_THEMES, getThemeById, readStoredTheme, applyTheme, themeToCssVars } from "./themeRegistry.js";

export function ThemeGalleryPage({
  themes = UIUX_THEMES,
  activeThemeId,
  onThemeSelect,
  onUseTheme,
  onTryPlayground,
  scope,
}) {
  const initialTheme = useMemo(() => getThemeById(activeThemeId || readStoredTheme().id), [activeThemeId]);
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const activeTheme = activeThemeId ? getThemeById(activeThemeId) : selectedTheme;

  const selectTheme = (theme) => {
    const nextTheme = getThemeById(theme?.id || theme);
    setSelectedTheme(nextTheme);
    // A scope is optional. App integration can pass the UIUX shell element;
    // omitting it keeps this page preview-only and avoids global mutation.
    if (scope) applyTheme(scope, nextTheme, { persist: false });
    onThemeSelect?.(nextTheme);
  };

  return (
    <main
      className="uiux-theme-gallery"
      data-uiux-scope
      data-uiux-theme={activeTheme.id}
      style={{
        ...themeToCssVars(activeTheme),
        display: "grid",
        gridTemplateColumns: "minmax(220px, 280px) minmax(0, 1fr)",
        gap: 34,
        maxWidth: 1240,
        margin: "0 auto",
        padding: "34px 26px 60px",
        color: "var(--uiux-theme-text)",
        background: "var(--uiux-theme-bg)",
      }}
    >
      <style>{`
        .uiux-theme-gallery { --uiux-theme-font: ${activeTheme.tokens.fontFamily}; }
        @media (max-width: 760px) {
          .uiux-theme-gallery { grid-template-columns: 1fr !important; gap: 22px !important; padding: 22px 16px 42px !important; }
          .uiux-theme-picker { position: static !important; max-width: none !important; min-width: 0 !important; }
          .uiux-theme-preview-surface { min-height: 560px !important; }
          .uiux-theme-preview-surface nav { display: none !important; }
          .uiux-theme-preview-surface .uiux-theme-preview-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <ThemePicker
        themes={themes}
        activeThemeId={activeTheme.id}
        onSelect={selectTheme}
        onUseTheme={() => onUseTheme?.(activeTheme)}
        onTryPlayground={() => onTryPlayground?.(activeTheme)}
      />
      <div style={{ minWidth: 0 }}>
        <ThemePreviewSurface theme={activeTheme} />
        <section id="uiux-theme-tokens" style={{ marginTop: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>主题 token</h3>
          <p style={{ margin: "8px 0 0", color: "var(--uiux-theme-muted-text)", fontSize: 13 }}>
            组件预览读取这些变量，切换主题时不会改变条目语义或状态定义。
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 8,
              marginTop: 14,
            }}
          >
            {Object.entries(activeTheme.tokens)
              .filter(([key]) => ["background", "surface", "text", "mutedText", "border", "accent", "radius"].includes(key))
              .map(([key, value]) => (
                <code
                  key={key}
                  style={{
                    padding: "10px 11px",
                    border: "1px solid var(--uiux-theme-border)",
                    borderRadius: "var(--uiux-theme-radius-sm, 8px)",
                    background: "var(--uiux-theme-surface)",
                    fontSize: 11,
                    color: "var(--uiux-theme-muted-text)",
                  }}
                >
                  {key}: {value}
                </code>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
