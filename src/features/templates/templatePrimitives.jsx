import { useState } from "react";

export const templateTheme = {
  ink: "#18212f",
  muted: "#657184",
  soft: "#f4f6f8",
  line: "#dfe4ea",
  panel: "#ffffff",
  accent: "#315efb",
  success: "#1f9d67",
  warning: "#b97815",
  danger: "#c94e54",
  shadow: "0 16px 40px rgba(25, 38, 58, 0.08)",
  radius: 16,
};

export const css = {
  app: {
    width: "100%",
    minHeight: "100%",
    boxSizing: "border-box",
    padding: 24,
    color: templateTheme.ink,
    background: "#fff",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    lineHeight: 1.45,
  },
  row: { display: "flex", alignItems: "center", gap: 12 },
  spread: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  stack: { display: "flex", flexDirection: "column", gap: 14 },
  title: { margin: 0, fontSize: 24, lineHeight: 1.15, letterSpacing: -0.5 },
  subtitle: { margin: 0, color: templateTheme.muted },
  sectionTitle: { margin: 0, fontSize: 16, lineHeight: 1.25 },
  panel: {
    background: templateTheme.panel,
    border: `1px solid ${templateTheme.line}`,
    borderRadius: templateTheme.radius,
    boxShadow: templateTheme.shadow,
  },
  softPanel: {
    background: templateTheme.soft,
    border: `1px solid ${templateTheme.line}`,
    borderRadius: templateTheme.radius,
  },
  divider: { height: 1, background: templateTheme.line, width: "100%" },
};

export function TemplateApp({ children, style, dark = false }) {
  const palette = dark
    ? {
        background: "#111827",
        panel: "#1b2433",
        ink: "#f6f7fb",
        muted: "#a8b1c2",
        line: "#334155",
      }
    : {};
  return (
    <div
      data-template-root
      style={{
        ...css.app,
        ...palette,
        background: palette.background ?? css.app.background,
        color: palette.ink ?? css.app.color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  style,
}) {
  const variants = {
    primary: { background: templateTheme.ink, color: "#fff", borderColor: templateTheme.ink },
    secondary: {
      background: "#fff",
      color: templateTheme.ink,
      borderColor: templateTheme.line,
    },
    ghost: { background: "transparent", color: templateTheme.muted, borderColor: "transparent" },
    danger: { background: "#fff1f1", color: templateTheme.danger, borderColor: "#ffd4d4" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid",
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        font: "inherit",
        fontWeight: 650,
        minHeight: size === "sm" ? 30 : 36,
        padding: size === "sm" ? "5px 10px" : "8px 14px",
        opacity: disabled ? 0.5 : 1,
        transition: "background 160ms ease, transform 160ms ease",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: { color: templateTheme.muted, background: templateTheme.soft },
    blue: { color: templateTheme.accent, background: "#e9efff" },
    green: { color: templateTheme.success, background: "#e7f8ef" },
    orange: { color: templateTheme.warning, background: "#fff3dc" },
    red: { color: templateTheme.danger, background: "#fff0f0" },
  };
  return (
    <span
      style={{
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        minHeight: 24,
        padding: "2px 9px",
        fontSize: 12,
        fontWeight: 700,
        ...tones[tone],
      }}
    >
      {children}
    </span>
  );
}

export function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ ...css.stack, gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: templateTheme.muted }}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type={type}
        style={{
          minHeight: 38,
          boxSizing: "border-box",
          border: `1px solid ${templateTheme.line}`,
          borderRadius: 10,
          padding: "8px 11px",
          outline: "none",
          font: "inherit",
          color: templateTheme.ink,
          background: "#fff",
        }}
      />
    </label>
  );
}

export function NavRail({ items, active, onChange, footer }) {
  return (
    <aside
      style={{
        width: 170,
        flex: "0 0 170px",
        borderRight: `1px solid ${templateTheme.line}`,
        paddingRight: 18,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <strong style={{ fontSize: 17 }}>Studio</strong>
      <nav style={{ ...css.stack, gap: 4 }}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            style={{
              border: 0,
              textAlign: "left",
              font: "inherit",
              borderRadius: 9,
              padding: "9px 10px",
              cursor: "pointer",
              color: active === item.id ? templateTheme.ink : templateTheme.muted,
              background: active === item.id ? templateTheme.soft : "transparent",
              fontWeight: active === item.id ? 700 : 550,
            }}
          >
            <span style={{ display: "inline-flex", width: 22, color: templateTheme.accent }}>
              {item.icon ?? "•"}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
      {footer ? <div style={{ marginTop: "auto" }}>{footer}</div> : null}
    </aside>
  );
}

export function Metric({ label, value, trend, tone = "blue" }) {
  return (
    <div style={{ ...css.panel, padding: 16, minWidth: 0 }}>
      <div style={{ ...css.spread, marginBottom: 18 }}>
        <span style={{ color: templateTheme.muted, fontSize: 12 }}>{label}</span>
        <Pill tone={tone}>{trend}</Pill>
      </div>
      <strong style={{ fontSize: 26, letterSpacing: -0.8 }}>{value}</strong>
    </div>
  );
}

export function Bars({ values = [36, 54, 44, 68, 58, 78, 64], color = templateTheme.accent }) {
  return (
    <div style={{ display: "flex", alignItems: "end", gap: 8, height: 110 }}>
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          style={{
            flex: 1,
            height: `${value}%`,
            minHeight: 8,
            borderRadius: "7px 7px 2px 2px",
            background: index === values.length - 1 ? color : "#dce5ff",
          }}
        />
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange?.(!checked)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: 0,
        background: "transparent",
        font: "inherit",
        color: templateTheme.ink,
        cursor: "pointer",
        padding: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 38,
          height: 22,
          borderRadius: 999,
          padding: 2,
          boxSizing: "border-box",
          background: checked ? templateTheme.accent : "#cbd3de",
          display: "flex",
          justifyContent: checked ? "flex-end" : "flex-start",
          transition: "background 160ms ease",
        }}
      >
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}

export function Toast({ children, tone = "success" }) {
  return (
    <div
      role="status"
      style={{
        ...css.softPanel,
        borderColor: tone === "success" ? "#b8e8cc" : "#ffd7a8",
        color: tone === "success" ? templateTheme.success : templateTheme.warning,
        padding: "8px 11px",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

export function useControllableString(initial = "") {
  const [value, setValue] = useState(initial);
  return [value, setValue];
}
