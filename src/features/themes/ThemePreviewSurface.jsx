import React from "react";
import { getThemeById, themeToCssVars } from "./themeRegistry.js";

const ui = {
  card: {
    background: "var(--uiux-theme-surface)",
    border: "1px solid var(--uiux-theme-border)",
    borderRadius: "var(--uiux-theme-radius-md)",
    boxShadow: "var(--uiux-theme-shadow-sm)",
  },
  muted: { color: "var(--uiux-theme-muted-text)" },
  button: {
    border: "1px solid var(--uiux-theme-border)",
    borderRadius: 999,
    padding: "8px 12px",
    font: "inherit",
    fontSize: 11,
    cursor: "pointer",
  },
};

function Button({ children, tone = "secondary", icon = false }) {
  const primary = tone === "primary";
  const ghost = tone === "ghost";
  return (
    <button
      type="button"
      aria-label={icon ? String(children) : undefined}
      style={{
        ...ui.button,
        padding: icon ? 8 : ui.button.padding,
        background: primary ? "var(--uiux-theme-accent)" : ghost ? "transparent" : "var(--uiux-theme-surface)",
        color: primary ? "var(--uiux-theme-accent-contrast)" : "var(--uiux-theme-text)",
        borderColor: primary ? "var(--uiux-theme-accent)" : ghost ? "transparent" : "var(--uiux-theme-border)",
        fontWeight: primary ? 700 : 600,
      }}
    >
      {children}
    </button>
  );
}

function Pill({ children, tone = "neutral" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 22,
        padding: "0 8px",
        borderRadius: 999,
        background:
          tone === "accent" ? "var(--uiux-theme-accent)" : tone === "success" ? "#bde6ce" : "var(--uiux-theme-surface-muted)",
        color: tone === "accent" ? "var(--uiux-theme-accent-contrast)" : "var(--uiux-theme-text)",
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function ShowcaseCard({ title, description, children, className = "" }) {
  return (
    <article className={className} style={{ ...ui.card, minHeight: 196, padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <strong style={{ display: "block", fontSize: 14 }}>{title}</strong>
        <span style={{ display: "block", marginTop: 4, fontSize: 11, ...ui.muted }}>{description}</span>
      </div>
      <div
        style={{
          minHeight: 125,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 12,
          padding: 14,
          borderRadius: "var(--uiux-theme-radius-sm)",
          background: "var(--uiux-theme-surface-muted)",
        }}
      >
        {children}
      </div>
    </article>
  );
}

function ActionsPreview() {
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        <Button tone="primary">Primary</Button>
        <Button>Secondary</Button>
        <Button tone="ghost">Ghost</Button>
        <Button icon>＋</Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11 }}>
        <a href="#uiux-actions" style={{ color: "var(--uiux-theme-accent)", fontWeight: 700 }}>
          View documentation →
        </a>
        <span style={ui.muted}>press / focus / disabled</span>
      </div>
    </>
  );
}

function FormsPreview() {
  return (
    <>
      <label style={{ display: "grid", gap: 5, fontSize: 10, fontWeight: 700 }}>
        Component name
        <input
          aria-label="Component name"
          readOnly
          value="Button"
          style={{
            width: "100%",
            boxSizing: "border-box",
            minHeight: 32,
            padding: "0 10px",
            border: "1px solid var(--uiux-theme-border-strong)",
            borderRadius: "var(--uiux-theme-radius-sm)",
            background: "var(--uiux-theme-surface)",
            color: "inherit",
            font: "inherit",
            fontSize: 11,
          }}
        />
      </label>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" style={{ ...ui.button, background: "var(--uiux-theme-surface)", color: "inherit" }}>
          Select: Default⌄
        </button>
        <label style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 11 }}>
          <input type="checkbox" defaultChecked readOnly /> Required
        </label>
        <button
          type="button"
          role="switch"
          aria-checked="true"
          style={{ width: 30, height: 17, padding: 2, border: 0, borderRadius: 99, background: "var(--uiux-theme-accent)" }}
        >
          <i style={{ display: "block", width: 13, height: 13, marginLeft: "auto", borderRadius: "50%", background: "var(--uiux-theme-accent-contrast)" }} />
        </button>
      </div>
    </>
  );
}

function FeedbackPreview() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Pill tone="success">● Ready</Pill>
        <Pill tone="accent">New</Pill>
        <Pill>Draft</Pill>
      </div>
      <div
        role="status"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 9,
          alignItems: "center",
          padding: "9px 10px",
          border: "1px solid var(--uiux-theme-border)",
          borderRadius: "var(--uiux-theme-radius-sm)",
          background: "var(--uiux-theme-surface)",
          fontSize: 11,
        }}
      >
        <span aria-hidden="true" style={{ color: "var(--uiux-theme-accent)" }}>
          ✓
        </span>
        <span>
          <strong style={{ display: "block" }}>Saved successfully</strong>
          <small style={ui.muted}>Your changes are now live.</small>
        </span>
        <button type="button" aria-label="Dismiss toast" style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer" }}>
          ×
        </button>
      </div>
      <div role="alert" style={{ fontSize: 10, color: "var(--uiux-theme-danger)" }}>
        Alert: Check the required fields.
      </div>
    </>
  );
}

function NavigationPreview() {
  return (
    <>
      <div role="tablist" aria-label="Preview tabs" style={{ display: "flex", gap: 5 }}>
        {["Overview", "Variants", "Usage"].map((tab, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={index === 0}
            key={tab}
            style={{
              ...ui.button,
              borderRadius: 9,
              background: index === 0 ? "var(--uiux-theme-accent)" : "var(--uiux-theme-surface)",
              color: index === 0 ? "var(--uiux-theme-accent-contrast)" : "inherit",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 10 }}>
        <a href="#uiux" style={{ color: "var(--uiux-theme-accent)" }}>
          UIUX
        </a>
        <span style={ui.muted}>›</span>
        <a href="#components" style={{ color: "var(--uiux-theme-accent)" }}>
          Components
        </a>
        <span style={ui.muted}>›</span>
        <strong>Button</strong>
        <span style={{ flex: 1 }} />
        <Button>‹</Button>
        <Pill>1 / 12</Pill>
        <Button>›</Button>
      </div>
    </>
  );
}

function OverlayPreview() {
  return (
    <div style={{ position: "relative", minHeight: 120, overflow: "hidden", borderRadius: "var(--uiux-theme-radius-sm)", background: "rgba(0,0,0,.12)" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.18)" }} />
      <div
        role="dialog"
        aria-label="Delete item"
        style={{
          position: "relative",
          width: "min(57%, 220px)",
          margin: "16px 0 16px 12px",
          padding: 14,
          ...ui.card,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <strong>Delete component?</strong>
          <button type="button" aria-label="Close dialog" style={{ border: 0, background: "transparent", color: "inherit" }}>
            ×
          </button>
        </div>
        <p style={{ margin: "8px 0", fontSize: 10, ...ui.muted }}>This action cannot be undone.</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
          <Button>Cancel</Button>
          <Button tone="primary">Delete</Button>
        </div>
      </div>
      <aside
        aria-label="Filters drawer"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "32%",
          minWidth: 105,
          padding: 11,
          borderLeft: "1px solid var(--uiux-theme-border)",
          background: "var(--uiux-theme-surface)",
          fontSize: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Filters</span>
          <button type="button" aria-label="Close drawer" style={{ border: 0, background: "transparent", color: "inherit" }}>
            ×
          </button>
        </div>
        <div style={{ display: "grid", gap: 5, marginTop: 14, ...ui.muted }}>
          <span>Category</span>
          <span>State</span>
          <span>Platform</span>
        </div>
      </aside>
    </div>
  );
}

function DataPreview() {
  const rows = [
    ["Button", "Ready", "Today"],
    ["Card", "Draft", "Yesterday"],
    ["Tabs", "Ready", "Monday"],
  ];
  return (
    <div style={{ overflow: "hidden", ...ui.card, fontSize: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr .8fr", padding: "8px 10px", fontWeight: 700, background: "var(--uiux-theme-surface-muted)" }}>
        <span>Component</span>
        <span>Status</span>
        <span>Updated</span>
      </div>
      {rows.map(([name, status, updated]) => (
        <div key={name} style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr .8fr", padding: "8px 10px", borderTop: "1px solid var(--uiux-theme-border)" }}>
          <strong>{name}</strong>
          <span style={{ color: status === "Ready" ? "var(--uiux-theme-accent)" : "var(--uiux-theme-muted-text)" }}>{status}</span>
          <span style={ui.muted}>{updated}</span>
        </div>
      ))}
    </div>
  );
}

function ContentPreview() {
  return (
    <>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {["JL", "AS", "+4"].map((label, index) => (
          <span
            key={label}
            style={{
              width: 30,
              height: 30,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              border: "2px solid var(--uiux-theme-surface)",
              marginLeft: index ? -10 : 0,
              background: index === 2 ? "var(--uiux-theme-surface-muted)" : "var(--uiux-theme-accent)",
              color: index === 2 ? "inherit" : "var(--uiux-theme-accent-contrast)",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {label}
          </span>
        ))}
        <span style={{ marginLeft: 4, fontSize: 11 }}>Design team</span>
      </div>
      <div
        style={{
          display: "grid",
          gap: 3,
          placeItems: "center",
          minHeight: 62,
          border: "1px dashed var(--uiux-theme-border-strong)",
          borderRadius: "var(--uiux-theme-radius-sm)",
          fontSize: 10,
        }}
      >
        <strong>Drop files here</strong>
        <span style={ui.muted}>or choose from your device</span>
        <Button>Browse files</Button>
      </div>
    </>
  );
}

function LoadingPreview() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <i style={{ width: 42, height: 42, borderRadius: "var(--uiux-theme-radius-sm)", background: "var(--uiux-theme-border)" }} />
        <div style={{ flex: 1, display: "grid", gap: 7 }}>
          <i style={{ width: "68%", height: 8, borderRadius: 99, background: "var(--uiux-theme-border-strong)" }} />
          <i style={{ width: "100%", height: 8, borderRadius: 99, background: "var(--uiux-theme-border)" }} />
          <i style={{ width: "44%", height: 8, borderRadius: 99, background: "var(--uiux-theme-border)" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: 1, height: 8, borderRadius: 99, background: "var(--uiux-theme-border)" }}>
          <i style={{ display: "block", width: "64%", height: "100%", borderRadius: 99, background: "var(--uiux-theme-accent)" }} />
        </span>
        <span style={{ fontSize: 10 }}>64%</span>
      </div>
      <div style={{ fontSize: 10, ...ui.muted }}>
        Empty state: <strong style={{ color: "var(--uiux-theme-text)" }}>No components yet</strong> · Create or retry
      </div>
    </>
  );
}

export function ThemePreviewSurface({ theme = "neutral", compact = false, children }) {
  const selectedTheme = typeof theme === "string" ? getThemeById(theme) : theme;
  const style = {
    ...themeToCssVars(selectedTheme),
    fontFamily: "var(--uiux-theme-font, inherit)",
    color: "var(--uiux-theme-text)",
    background: "var(--uiux-theme-bg)",
  };

  return (
    <section
      aria-label={`${selectedTheme.label} 主题预览`}
      className="uiux-theme-preview-surface"
      data-uiux-theme={selectedTheme.id}
      style={{
        ...style,
        minHeight: compact ? 380 : 700,
        border: "1px solid var(--uiux-theme-border)",
        borderRadius: "var(--uiux-theme-radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--uiux-theme-shadow-md)",
        transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          minHeight: 58,
          padding: "0 20px",
          borderBottom: "1px solid var(--uiux-theme-border)",
          background: "var(--uiux-theme-surface)",
        }}
      >
        <strong style={{ fontSize: 18, letterSpacing: "-0.02em" }}>Studio</strong>
        <nav aria-label="主题预览导航" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["Shop", "New In", "Stories", "Help"].map((item, index) => (
            <button
              type="button"
              key={item}
              style={{
                padding: "8px 11px",
                border: 0,
                borderRadius: 10,
                background: index === 0 ? "var(--uiux-theme-surface-muted)" : "transparent",
                color: "inherit",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span aria-hidden="true">⌕</span>
          <span aria-hidden="true">♙</span>
          <Button tone="primary">Sign in</Button>
        </div>
      </div>

      {children || (
        <div style={{ padding: compact ? 22 : 42 }}>
          <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, ...ui.muted }}>UIUX component library</p>
            <h3 style={{ margin: "10px 0 0", fontSize: compact ? 30 : 42, lineHeight: 1.1 }}>
              Browse the library
            </h3>
            <p style={{ margin: "14px auto 0", maxWidth: 520, ...ui.muted, fontSize: 13, lineHeight: 1.6 }}>
              真实语义预览会随主题 token 改变：动作、表单、反馈、导航、覆盖层、数据、内容与加载状态都在同一套画布中保持一致。
            </p>
          </div>

          <div
            className="uiux-theme-preview-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "var(--uiux-theme-preview-gap)",
              maxWidth: 980,
              margin: "32px auto 0",
            }}
          >
            <ShowcaseCard title="Actions" description="Button · Link · Icon button">
              <ActionsPreview />
            </ShowcaseCard>
            <ShowcaseCard title="Forms" description="Input · Select · Checkbox · Switch">
              <FormsPreview />
            </ShowcaseCard>
            <ShowcaseCard title="Feedback" description="Badge · Status · Toast · Alert">
              <FeedbackPreview />
            </ShowcaseCard>
            <ShowcaseCard title="Navigation" description="Tabs · Breadcrumb · Pagination">
              <NavigationPreview />
            </ShowcaseCard>
            <ShowcaseCard title="Overlay" description="Modal · Drawer · Focus boundary">
              <OverlayPreview />
            </ShowcaseCard>
            <ShowcaseCard title="Data" description="Table · List · Sortable rows">
              <DataPreview />
            </ShowcaseCard>
            <ShowcaseCard title="Content" description="Avatar · Upload · Empty recovery">
              <ContentPreview />
            </ShowcaseCard>
            <ShowcaseCard title="Loading" description="Skeleton · Progress · Empty">
              <LoadingPreview />
            </ShowcaseCard>
          </div>
        </div>
      )}
    </section>
  );
}
