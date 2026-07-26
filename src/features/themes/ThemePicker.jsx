import React from "react";
import { UIUX_THEMES, getThemeById } from "./themeRegistry.js";

const iconStyle = {
  width: 16,
  height: 16,
  borderRadius: "50%",
  border: "1px solid currentColor",
  display: "inline-grid",
  placeItems: "center",
  fontSize: 11,
  lineHeight: 1,
};

export function ThemePicker({
  themes = UIUX_THEMES,
  activeThemeId = UIUX_THEMES[0].id,
  onSelect,
  onUseTheme,
  onTryPlayground,
}) {
  const activeTheme = getThemeById(activeThemeId);

  return (
    <aside
      aria-label="主题选择"
      className="uiux-theme-picker"
      style={{
        position: "sticky",
        top: 24,
        alignSelf: "start",
        minWidth: 228,
        maxWidth: 280,
        color: "var(--uiux-theme-text, #171717)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.58 }}>
            UI/UX
          </div>
          <h2 style={{ margin: "6px 0 0", fontSize: 28, lineHeight: 1.05 }}>Themes</h2>
        </div>
        <span title="主题仅作用于 UIUX 区域" style={iconStyle} aria-hidden="true">
          ◐
        </span>
      </div>
      <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.65, color: "var(--uiux-theme-muted-text, #64748b)" }}>
        为 UIUX 组件图鉴选择一套可复用的视觉 token。主题不会覆盖工作台、全部或特效页面。
      </p>
      <a
        href="#uiux-theme-tokens"
        style={{
          display: "inline-block",
          marginTop: 8,
          color: "var(--uiux-theme-accent, #111)",
          fontSize: 13,
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        查看 token 说明
      </a>

      <div style={{ height: 1, background: "var(--uiux-theme-border, #dfe2e6)", margin: "20px 0 16px" }} />
      <div style={{ display: "grid", gap: 8 }}>
        {themes.map((theme) => {
          const selected = theme.id === activeTheme.id;
          return (
            <button
              type="button"
              key={theme.id}
              aria-pressed={selected}
              onClick={() => onSelect?.(theme)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                alignItems: "center",
                minHeight: 58,
                padding: "12px 14px",
                borderRadius: "var(--uiux-theme-radius-md, 14px)",
                border: `1px solid ${selected ? "var(--uiux-theme-accent, #111)" : "var(--uiux-theme-border, #dfe2e6)"}`,
                background: selected ? "var(--uiux-theme-surface, #fff)" : "transparent",
                color: "inherit",
                textAlign: "left",
                boxShadow: selected ? "var(--uiux-theme-shadow-sm, none)" : "none",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "grid", gap: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{theme.label}</span>
                <span style={{ fontSize: 12, color: "var(--uiux-theme-muted-text, #64748b)" }}>{theme.labelZh}</span>
              </span>
              <span style={{ display: "flex", gap: 3 }} aria-hidden="true">
                {theme.swatch.map((color) => (
                  <i
                    key={color}
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: color,
                      border: "1px solid rgba(0,0,0,.14)",
                    }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: 8, marginTop: 18 }}>
        <button
          type="button"
          onClick={() => onUseTheme?.(activeTheme)}
          style={{
            minHeight: 42,
            border: 0,
            borderRadius: 999,
            background: "var(--uiux-theme-accent, #111)",
            color: "var(--uiux-theme-accent-contrast, #fff)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          使用此主题
        </button>
        <button
          type="button"
          onClick={() => onTryPlayground?.(activeTheme)}
          style={{
            minHeight: 42,
            border: 0,
            borderRadius: 999,
            background: "var(--uiux-theme-surface-muted, #f1f2f4)",
            color: "var(--uiux-theme-text, #171717)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          在 Playground 试用
        </button>
      </div>
    </aside>
  );
}
