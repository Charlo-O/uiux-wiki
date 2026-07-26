import React from "react";
import { createUiuxComponentSpec } from "./UiuxComponentSpec.js";

function cx(...values) {
  return values.filter(Boolean).join(" ");
}

function PreviewFrame({ children, className = "", compact = false }) {
  return (
    <div className={cx("uiux-preview-frame", compact && "is-compact", className)}>
      {children}
    </div>
  );
}

function PreviewLabel({ children, className = "" }) {
  return <span className={cx("uiux-preview-label", className)}>{children}</span>;
}

function ButtonPreview({ spec }) {
  const label = spec.raw?.previewLabel || (spec.title === "按钮" ? "继续" : "Primary action");
  return (
    <div className="uiux-preview-stack">
      <div className="uiux-preview-actions">
        <button type="button" className="uiux-control uiux-control-primary">{label}</button>
        <button type="button" className="uiux-control uiux-control-secondary">Secondary</button>
        <button type="button" className="uiux-control uiux-control-ghost">Ghost</button>
      </div>
      <div className="uiux-preview-state-row">
        <PreviewLabel>default</PreviewLabel>
        <PreviewLabel>hover</PreviewLabel>
        <PreviewLabel>disabled</PreviewLabel>
      </div>
    </div>
  );
}

function IconButtonPreview() {
  return (
    <div className="uiux-preview-actions">
      <button type="button" className="uiux-icon-control" aria-label="Add">+</button>
      <button type="button" className="uiux-icon-control is-active" aria-label="Save">♡</button>
      <button type="button" className="uiux-icon-control" aria-label="More">•••</button>
    </div>
  );
}

function LinkPreview({ spec }) {
  const label = spec.raw?.previewLabel || spec.title || "View documentation";
  const slug = String(spec.id || "entry").replace(/[^a-z0-9-]+/gi, "-");
  return (
    <div className="uiux-link-demo">
      <div className="uiux-link-demo-surface">
        <a href="#uiux-link" className="uiux-link-demo-primary">
          {label}
          <span aria-hidden="true">→</span>
        </a>
        <span className="uiux-link-demo-destination">/components/{slug}</span>
      </div>
      <div className="uiux-preview-state-row">
        <PreviewLabel>default</PreviewLabel>
        <PreviewLabel>visited</PreviewLabel>
        <PreviewLabel>focus</PreviewLabel>
      </div>
    </div>
  );
}

function InputPreview({ spec, multiline = false, search = false }) {
  return (
    <div className="uiux-preview-form">
      <label className="uiux-field">
        <span>{search ? "Search components" : spec.title}</span>
        <div className="uiux-input-shell">
          {search && <span className="uiux-input-leading">⌕</span>}
          {multiline ? (
            <textarea readOnly value="Write a clear value" aria-label={spec.title} />
          ) : (
            <input readOnly value={search ? "Button" : ""} placeholder={search ? "" : "Enter a value"} aria-label={spec.title} />
          )}
          {!multiline && <span className="uiux-input-trailing">{search ? "×" : "⌘K"}</span>}
        </div>
      </label>
      <span className="uiux-helper-text">{search ? "Filter by component name or pattern." : "Helper text explains what belongs here."}</span>
    </div>
  );
}

function CardPreview({ spec }) {
  const title = spec.raw?.english || spec.english || "Card title";
  return (
    <div className="uiux-card-surface">
      <div className="uiux-card-media"><span>Preview</span></div>
      <div className="uiux-card-body">
        <div className="uiux-card-eyebrow">COMPONENT</div>
        <strong>{title}</strong>
        <p>{spec.summary || "A compact surface that groups related content and an action."}</p>
        <div className="uiux-card-footer">
          <span className="uiux-pill">New</span>
          <button type="button" className="uiux-control uiux-control-secondary">View</button>
        </div>
      </div>
    </div>
  );
}

function TabsPreview() {
  return (
    <div className="uiux-tabs-demo">
      <div className="uiux-tabs-list" role="tablist" aria-label="Preview tabs">
        <button type="button" className="uiux-tab is-active" role="tab" aria-selected="true">Overview</button>
        <button type="button" className="uiux-tab" role="tab" aria-selected="false">Variants</button>
        <button type="button" className="uiux-tab" role="tab" aria-selected="false">Usage</button>
      </div>
      <div className="uiux-tab-panel" role="tabpanel">
        <strong>Overview</strong>
        <span>Tabs separate sibling content without losing context.</span>
      </div>
    </div>
  );
}

function ModalPreview() {
  return (
    <div className="uiux-modal-demo">
      <div className="uiux-modal-scrim" />
      <div className="uiux-dialog" role="dialog" aria-label="Delete item">
        <div className="uiux-dialog-header"><strong>Delete item?</strong><button type="button" aria-label="Close">×</button></div>
        <p>This action cannot be undone. Check the boundary before confirming.</p>
        <div className="uiux-dialog-actions">
          <button type="button" className="uiux-control uiux-control-secondary">Cancel</button>
          <button type="button" className="uiux-control uiux-control-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

function SelectPreview({ combo = false }) {
  return (
    <div className="uiux-select-demo">
      <span className="uiux-field-title">{combo ? "Search and choose" : "Choose a value"}</span>
      <div className="uiux-select-trigger"><span>{combo ? "Design system" : "Option one"}</span><span>⌄</span></div>
      <div className="uiux-option-list">
        <span className="is-selected">Design system <b>✓</b></span>
        <span>Interaction patterns</span>
        <span>Accessibility</span>
      </div>
    </div>
  );
}

function ChoicePreview({ type }) {
  return (
    <div className="uiux-choice-demo">
      {[["Default", true], ["Optional", false], ["Disabled", false]].map(([label, selected], index) => (
        <label key={label} className={cx("uiux-choice-row", index === 2 && "is-disabled")}>
          <input type={type} checked={selected} readOnly />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

function SwitchPreview() {
  return (
    <div className="uiux-switch-demo">
      <div><strong>Notifications</strong><span>Receive status updates</span></div>
      <button type="button" className="uiux-switch is-on" aria-pressed="true"><i /></button>
    </div>
  );
}

function FeedbackPreview({ kind }) {
  const content = kind === "toast" ? "Saved successfully" : kind === "alert" ? "Check the required fields" : "New activity";
  return (
    <div className={cx("uiux-feedback-demo", `is-${kind}`)}>
      <span className="uiux-feedback-icon">{kind === "alert" ? "!" : "✓"}</span>
      <div><strong>{content}</strong><span>{kind === "toast" ? "Your changes are now live." : "A concise message gives the next step."}</span></div>
      <button type="button" aria-label="Dismiss">×</button>
    </div>
  );
}

function DisclosurePreview() {
  return (
    <div className="uiux-disclosure-demo">
      <div className="uiux-disclosure-row"><strong>What is this pattern?</strong><span>⌃</span></div>
      <p>Reveal secondary information without moving the reader to another page.</p>
      <div className="uiux-disclosure-row is-closed"><strong>Implementation notes</strong><span>⌄</span></div>
    </div>
  );
}

function DataPreview({ family }) {
  if (family === "table") {
    return (
      <div className="uiux-table-demo">
        <div className="uiux-table-row is-head"><span>Component</span><span>Status</span><span>Updated</span></div>
        {["Button", "Card", "Tabs"].map((name, index) => (
          <div className="uiux-table-row" key={name}><span>{name}</span><span className={index === 1 ? "uiux-status success" : "uiux-status"}>{index === 1 ? "Ready" : "Draft"}</span><span>Today</span></div>
        ))}
      </div>
    );
  }
  if (family === "pagination") {
    return <div className="uiux-pagination-demo"><button type="button">‹</button><button type="button" className="is-active">1</button><button type="button">2</button><button type="button">3</button><span>…</span><button type="button">12</button><button type="button">›</button></div>;
  }
  if (family === "breadcrumb") {
    return <div className="uiux-breadcrumb-demo"><a href="#uiux">Library</a><span>›</span><a href="#components">Components</a><span>›</span><strong>Button</strong></div>;
  }
  if (family === "steps") {
    return <div className="uiux-steps-demo">{["Choose", "Configure", "Publish"].map((step, index) => <div className={cx("uiux-step", index === 1 && "is-active")} key={step}><b>{index + 1}</b><span>{step}</span></div>)}</div>;
  }
  if (family === "list") {
    return <div className="uiux-list-demo">{["Button", "Card", "Modal"].map((name, index) => <div className={cx("uiux-list-row", index === 1 && "is-active")} key={name}><i /><span><strong>{name}</strong><small>Component pattern</small></span><b>›</b></div>)}</div>;
  }
  return <div className="uiux-data-grid-demo"><span /><span /><span /><span /><span /><span /><span /><span /></div>;
}

function MapPreview() {
  return (
    <div className="uiux-map-demo">
      <div className="uiux-map-toolbar"><span>⌕</span><strong>Search location</strong><button type="button">◎</button></div>
      <div className="uiux-map-surface">
        <i className="map-road road-a" /><i className="map-road road-b" /><i className="map-road road-c" />
        <span className="uiux-map-pin pin-a">●</span><span className="uiux-map-pin pin-b">●</span>
        <div className="uiux-map-zoom"><button type="button">+</button><button type="button">−</button></div>
      </div>
      <div className="uiux-map-footer"><span>2 places in view</span><button type="button" className="uiux-control uiux-control-secondary">Use current</button></div>
    </div>
  );
}

function LanguagePreview() {
  return (
    <div className="uiux-language-demo">
      <div className="uiux-language-trigger"><span>文</span><strong>简体中文</strong><span>⌄</span></div>
      <div className="uiux-language-list">
        <span className="is-selected"><b>中文</b><small>简体中文</small><em>✓</em></span>
        <span><b>English</b><small>English (US)</small></span>
        <span><b>日本語</b><small>日本語</small></span>
      </div>
      <div className="uiux-language-footer"><span>Direction</span><strong>LTR</strong></div>
    </div>
  );
}

function MediaPreview() {
  return (
    <div className="uiux-media-demo">
      <div className="uiux-media-stage"><span className="uiux-media-play">▶</span><small>Preview · 03:42</small></div>
      <div className="uiux-media-timeline"><i /></div>
      <div className="uiux-media-controls"><button type="button">▶</button><span>01:18 / 03:42</span><span>▮▮</span><span>⛶</span></div>
      <div className="uiux-media-caption"><strong>Component walkthrough</strong><span>Playback, seek, volume, and caption states.</span></div>
    </div>
  );
}

function SecurityPreview() {
  return (
    <div className="uiux-security-demo">
      <div className="uiux-security-heading"><span className="uiux-security-shield">✓</span><div><strong>Verify your identity</strong><small>Protected workspace</small></div></div>
      <label className="uiux-security-field"><span>Passcode</span><div>•••••• <b>Show</b></div></label>
      <div className="uiux-security-actions"><button type="button" className="uiux-control uiux-control-primary">Continue</button><button type="button" className="uiux-control uiux-control-ghost">Use passkey</button></div>
      <small className="uiux-security-recovery">Need help? Use a recovery method.</small>
    </div>
  );
}

function ChartPreview() {
  return (
    <div className="uiux-chart-demo">
      <header><div><strong>Weekly activity</strong><small>Last 7 days</small></div><span>+24%</span></header>
      <div className="uiux-chart-plot">
        <div className="uiux-chart-grid"><i /><i /><i /><i /></div>
        <svg viewBox="0 0 320 120" role="img" aria-label="Activity trend">
          <polyline points="8,95 54,76 94,84 140,48 185,62 232,26 312,40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="232" cy="26" r="6" fill="currentColor" />
        </svg>
      </div>
      <footer><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></footer>
    </div>
  );
}

function MotionPreview() {
  return (
    <div className="uiux-motion-demo">
      <div className="uiux-motion-stage"><span className="uiux-motion-object">UI</span><span className="uiux-motion-ghost">UI</span></div>
      <div className="uiux-motion-timeline"><span>0ms</span><i /><i className="is-active" /><i /><span>240ms</span></div>
      <div className="uiux-motion-meta"><strong>Ease out</strong><span>enter → settle → reduced fallback</span></div>
    </div>
  );
}

function DerivedFamilyPreview({ family, spec }) {
  const title = spec?.english || spec?.title || "UI/UX entry";
  if (family === "toolbar") {
    return <div className="uiux-derived-preview uiux-derived-toolbar"><header><button type="button" className="is-active">B</button><button type="button">I</button><button type="button">↗</button><i /><button type="button">⋯</button></header><strong>{title}</strong><small>Grouped actions stay discoverable and ordered.</small></div>;
  }
  if (family === "navigation") {
    return <div className="uiux-derived-preview uiux-derived-navigation"><header><b>UI</b><nav><span className="is-active">Overview</span><span>Library</span><span>Settings</span></nav><button type="button">☰</button></header><div className="uiux-derived-content-line" /><div className="uiux-derived-content-line short" /></div>;
  }
  if (family === "form") {
    return <div className="uiux-derived-preview uiux-derived-form"><label><span>{title} name</span><i /></label><label><span>Required field</span><i /></label><footer><small>Validate before submit</small><button type="button" className="uiux-control uiux-control-primary">Continue</button></footer></div>;
  }
  if (family === "chat") {
    return <div className="uiux-derived-preview uiux-derived-chat"><div className="uiux-chat-bubble incoming">How should this work?</div><div className="uiux-chat-bubble outgoing">Keep the next action clear.</div><footer><span>Write a reply…</span><button type="button">↑</button></footer></div>;
  }
  if (family === "rating") {
    return <div className="uiux-derived-preview uiux-derived-rating"><strong>{title}</strong><div className="uiux-rating-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span className="is-muted">★</span></div><small>4 of 5 · clear selected value</small></div>;
  }
  if (family === "commerce") {
    return <div className="uiux-derived-preview uiux-derived-commerce"><div><span className="uiux-commerce-thumb" /><span><strong>{title}</strong><small>1 × $24.00</small></span><b>$24</b></div><footer><span>Total</span><strong>$24.00</strong><button type="button" className="uiux-control uiux-control-primary">Checkout</button></footer></div>;
  }
  if (family === "text") {
    return <div className="uiux-derived-preview uiux-derived-text"><span className="uiux-text-kicker">CONTENT HIERARCHY</span><strong>{title}</strong><i /><i className="wide" /><i /><small>Readable measure and clear emphasis.</small></div>;
  }
  if (family === "primitive") {
    return <div className="uiux-derived-preview uiux-derived-primitive"><div><span /><span /><span /></div><i /><strong>{title}</strong><small>Alignment and semantic structure stay visible.</small></div>;
  }
  if (family === "react") {
    return <div className="uiux-derived-preview uiux-derived-react"><header><span>React boundary</span><b>● mounted</b></header><div><code>&lt;{title.replace(/\s+/g, "")} /&gt;</code><i /><i className="short" /></div><footer><span>loading</span><span>error boundary</span><span>children</span></footer></div>;
  }
  if (family === "mobile") {
    return <div className="uiux-derived-preview uiux-derived-mobile"><div className="uiux-mobile-frame"><header><span>9:41</span><i /></header><main><b>{title}</b><i /><i className="short" /><button type="button">Continue</button></main><footer /></div><small>Touch target · safe area · system feedback</small></div>;
  }
  if (family === "dictionary") {
    return <div className="uiux-derived-preview uiux-derived-dictionary"><header><strong>{title}</strong><span>term</span></header><p>Plain-language definition explains the UI meaning and boundary.</p><footer><span>Alias</span><b>{spec?.group || "Related term"}</b></footer></div>;
  }
  if (family === "editor") {
    return <div className="uiux-derived-preview uiux-derived-editor"><header><button type="button" className="is-active">Edit</button><button type="button">Preview</button><span>Saved</span></header><div><b># {title}</b><i /><i className="wide" /><i /></div><footer><span>Selection</span><button type="button">Copy</button></footer></div>;
  }
  if (family === "help") {
    return <div className="uiux-derived-preview uiux-derived-help"><div className="uiux-help-search">⌕ <span>What do you need?</span></div><strong>{title}</strong><small>Find guidance, examples, and a recovery path.</small><button type="button" className="uiux-control uiux-control-secondary">Open help</button></div>;
  }
  if (family === "accessibility") {
    return <div className="uiux-derived-preview uiux-derived-accessibility"><strong>{title}</strong>{["Keyboard", "Screen reader", "Contrast"].map((label) => <span key={label}><b>✓</b>{label}<small>checked</small></span>)}</div>;
  }
  if (family === "file") {
    return <div className="uiux-derived-preview uiux-derived-file"><div className="uiux-file-icon">PDF</div><div><strong>{title}</strong><small>2.4 MB · ready</small></div><button type="button">•••</button><footer><i /><span>Available actions</span><b>Download</b></footer></div>;
  }
  if (family === "scan") {
    return <div className="uiux-derived-preview uiux-derived-scan"><div className="uiux-scan-frame"><i /><i /><span>Align code inside frame</span></div><footer><span>Camera permission</span><button type="button" className="uiux-control uiux-control-secondary">Use camera</button></footer></div>;
  }
  return <div className="uiux-derived-preview uiux-derived-pattern"><header><span>FLOW</span><strong>{title}</strong></header><div className="uiux-pattern-flow"><span className="is-done">1</span><i /><span className="is-active">2</span><i /><span>3</span></div><small>Context → current state → next action</small><button type="button" className="uiux-control uiux-control-secondary">Inspect pattern</button></div>;
}

function UtilityPreview({ family, spec }) {
  if (family === "avatar") return <div className="uiux-avatar-demo"><span>JL</span><span>AS</span><span>+4</span></div>;
  if (family === "badge" || family === "tag") return <div className="uiux-badge-demo"><span className="uiux-pill">New</span><span className="uiux-pill is-green">Stable</span><span className="uiux-pill is-outline">Draft ×</span></div>;
  if (family === "progress") return <div className="uiux-progress-demo"><div><strong>Uploading preview</strong><span>64%</span></div><div className="uiux-progress-track"><i /></div></div>;
  if (family === "skeleton") return <div className="uiux-skeleton-demo"><i /><div><b /><b /><b className="short" /></div></div>;
  if (family === "empty") return <div className="uiux-empty-demo"><span>∅</span><strong>No components yet</strong><small>Create a component to see it here.</small><button type="button" className="uiux-control uiux-control-secondary">Create</button></div>;
  if (family === "slider") return <div className="uiux-slider-demo"><div className="uiux-slider-track"><i /></div><span>64</span></div>;
  if (family === "calendar") return <div className="uiux-calendar-demo"><header><strong>September 2026</strong><span>‹ ›</span></header><div className="uiux-calendar-grid">{["M","T","W","T","F","S","S", "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"].map((day, index) => <span className={cx(index > 6 && index === 16 && "is-active")} key={`${day}-${index}`}>{day}</span>)}</div></div>;
  if (family === "upload") return <div className="uiux-upload-demo"><strong>Drop files here</strong><span>or choose from your device</span><button type="button" className="uiux-control uiux-control-secondary">Browse files</button></div>;
  if (family === "carousel") return <div className="uiux-carousel-demo"><button type="button">‹</button><div><strong>Slide 02</strong><span>One coherent preview per item.</span></div><button type="button">›</button><footer><i /><i className="is-active" /><i /></footer></div>;
  if (family === "command") return <div className="uiux-command-demo"><div className="uiux-command-input">⌕ <span>Search commands...</span><kbd>⌘K</kbd></div><div className="uiux-command-results"><span>Open component</span><span>Copy usage</span><span>View accessibility</span></div></div>;
  if (family === "code") return <div className="uiux-code-demo"><header><span>Button.jsx</span><button type="button">Copy</button></header><pre>{`<Button variant="primary">Save</Button>`}</pre></div>;
  if (family === "map") return <MapPreview />;
  if (family === "language") return <LanguagePreview />;
  if (family === "media") return <MediaPreview />;
  if (family === "security") return <SecurityPreview />;
  if (family === "chart") return <ChartPreview />;
  if (family === "motion") return <MotionPreview />;
  if (["toolbar", "navigation", "form", "chat", "rating", "commerce", "text", "primitive", "react", "mobile", "dictionary", "editor", "help", "accessibility", "file", "scan", "pattern"].includes(family)) {
    return <DerivedFamilyPreview family={family} spec={spec} />;
  }
  if (family === "layout") return <div className="uiux-layout-demo"><aside><i /><i /><i /><i /></aside><main><b /><span /><span /><div /></main></div>;
  if (family === "tooltip") return <div className="uiux-tooltip-demo"><button type="button" className="uiux-control uiux-control-secondary">Hover target</button><span>Helpful context</span></div>;
  if (family === "menu") return <div className="uiux-menu-demo"><button type="button" className="uiux-control uiux-control-secondary">Actions ⌄</button><div><span>Edit</span><span>Duplicate</span><span>Delete</span></div></div>;
  if (family === "drawer") return <div className="uiux-drawer-demo"><div className="uiux-drawer-scrim" /><aside><header><strong>Filters</strong><button type="button">×</button></header><span>Category</span><span>State</span><button type="button" className="uiux-control uiux-control-primary">Apply</button></aside></div>;
  return <div className="uiux-generic-demo"><span className="uiux-generic-mark">UI</span><div><strong>Semantic preview</strong><small>Interactive anatomy for this entry</small></div><button type="button" className="uiux-control uiux-control-secondary">Inspect</button></div>;
}

export function UiuxComponentPreview({ item, spec: providedSpec, className = "", compact = false }) {
  const spec = providedSpec || createUiuxComponentSpec(item);
  const family = spec.family;
  let content;

  if (family === "button") content = <ButtonPreview spec={spec} />;
  else if (family === "icon-button") content = <IconButtonPreview />;
  else if (family === "link") content = <LinkPreview spec={spec} />;
  else if (family === "input") content = <InputPreview spec={spec} />;
  else if (family === "textarea") content = <InputPreview spec={spec} multiline />;
  else if (family === "search") content = <InputPreview spec={spec} search />;
  else if (family === "card") content = <CardPreview spec={spec} />;
  else if (family === "tabs") content = <TabsPreview />;
  else if (family === "modal") content = <ModalPreview />;
  else if (family === "select") content = <SelectPreview />;
  else if (family === "combobox") content = <SelectPreview combo />;
  else if (family === "checkbox") content = <ChoicePreview type="checkbox" />;
  else if (family === "radio") content = <ChoicePreview type="radio" />;
  else if (family === "switch") content = <SwitchPreview />;
  else if (family === "toast" || family === "alert" || family === "notification") content = <FeedbackPreview kind={family} />;
  else if (family === "accordion") content = <DisclosurePreview />;
  else if (["table", "pagination", "breadcrumb", "steps", "list", "grid"].includes(family)) content = <DataPreview family={family} />;
  else content = <UtilityPreview family={family} spec={spec} />;

  return (
    <PreviewFrame compact={compact} className={cx(`is-family-${family}`, className)}>
      <div className="uiux-preview-canvas">{content}</div>
      {!compact && (
        <div className="uiux-preview-caption">
          <span>{spec.anatomy.slice(0, 3).join(" · ")}</span>
          <span>{spec.interactionModel}</span>
        </div>
      )}
    </PreviewFrame>
  );
}

export default UiuxComponentPreview;
