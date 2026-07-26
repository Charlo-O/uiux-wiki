import React, { useEffect, useMemo, useState } from "react";
import { uiItems } from "../../data.js";
import { createUiuxComponentSpec } from "./UiuxComponentSpec.js";
import { UiuxComponentPreview } from "./UiuxPreviewRenderer.jsx";
import "./uiuxGallery.css";

const DETAIL_TABS = [
  { id: "overview", label: "概览" },
  { id: "states", label: "变体与状态" },
  { id: "implementation", label: "实现提示" },
];

function clean(value) {
  return String(value || "").trim();
}

function valuesOf(value, fallback = []) {
  if (Array.isArray(value) && value.length) return value.filter(Boolean);
  if (value) return [value];
  return fallback;
}

function findRelatedItems(item) {
  const relatedIds = valuesOf(item?.related).map((value) => clean(value).toLowerCase());
  if (!relatedIds.length) return [];
  return relatedIds
    .map((relatedId) =>
      uiItems.find((candidate) => {
        const aliases = [...(candidate.aliases || []), candidate.english, candidate.title]
          .map((value) => clean(value).toLowerCase());
        return candidate.id?.toLowerCase() === relatedId || aliases.includes(relatedId);
      }),
    )
    .filter(Boolean)
    .filter((candidate, index, array) => array.findIndex((entry) => entry.id === candidate.id) === index)
    .slice(0, 6);
}

function itemUrl(item) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.searchParams.set("view", "uiux");
  if (item?.id) url.searchParams.set("item", item.id);
  return url.toString();
}

export function UiuxDetailPage({
  item,
  onBack,
  onOpenItem,
  onTheme,
  className = "",
}) {
  const spec = useMemo(() => createUiuxComponentSpec(item || {}), [item]);
  const relatedItems = useMemo(() => findRelatedItems(item || {}), [item]);
  const [activeTab, setActiveTab] = useState("overview");
  const [shareState, setShareState] = useState("idle");

  useEffect(() => {
    setActiveTab("overview");
    setShareState("idle");
  }, [spec.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onBack?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack]);

  const handleShare = async () => {
    const url = itemUrl(item);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: `${spec.title} · ${spec.english}`, text: spec.summary, url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error("Clipboard unavailable");
      }
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch (error) {
      if (error?.name !== "AbortError") setShareState("unavailable");
    }
  };

  const variants = valuesOf(item?.variants, spec.variants);
  const states = valuesOf(item?.states, spec.states);
  const useCases = valuesOf(item?.useCases, ["Product surfaces", "Forms and workflows", "Responsive interfaces"]);
  const doNotes = valuesOf(item?.do, ["Use a clear label", "Expose the current state", "Keep surrounding content consistent"]);
  const dontNotes = valuesOf(item?.dont, ["Hide the action behind an icon only", "Use competing emphasis", "Remove the recovery path"]);
  const accessibilityNotes = valuesOf(item?.accessibility, ["Keyboard access is visible", "Focus state remains readable", "Status is not communicated by color alone"]);

  return (
    <main className={`uiux-detail-page ${className}`} data-uiux-detail data-item-id={spec.id}>
      <div className="uiux-detail-topbar">
        <button type="button" className="uiux-detail-back" onClick={() => onBack?.()} aria-label="Back to UI/UX gallery">
          <span aria-hidden="true">←</span>
          <span>返回组件库</span>
        </button>
        <div className="uiux-detail-actions">
          {typeof onTheme === "function" && (
            <button type="button" className="uiux-detail-action" onClick={() => onTheme(item)}>
              主题
            </button>
          )}
          <button type="button" className="uiux-detail-action" onClick={handleShare}>
            {shareState === "copied" ? "已复制链接" : shareState === "unavailable" ? "复制失败" : "分享"}
          </button>
        </div>
      </div>

      <nav className="uiux-detail-breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={() => onBack?.()}>UI/UX</button>
        <span aria-hidden="true">›</span>
        <span>{spec.category}</span>
        {spec.group && (
          <>
            <span aria-hidden="true">›</span>
            <span>{spec.group}</span>
          </>
        )}
        <span aria-hidden="true">›</span>
        <strong>{spec.title}</strong>
      </nav>

      <div className="uiux-detail-layout">
        <article className="uiux-detail-content">
          <header className="uiux-detail-hero">
            <div className="uiux-detail-eyebrow">
              <span className="uiux-detail-family">{spec.family}</span>
              <span>{spec.category}</span>
            </div>
            <h1>{spec.title}</h1>
            <p className="uiux-detail-english">{spec.english}</p>
            <p className="uiux-detail-summary">{spec.summary || "一个可复用的 UI/UX 交互模式。"}</p>
          </header>

          <div className="uiux-detail-tabs" role="tablist" aria-label="Component explanation">
            {DETAIL_TABS.map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? "is-active" : ""}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="uiux-detail-tab-content">
              <section className="uiux-detail-section">
                <h2>它解决什么问题</h2>
                <p>{item?.plain || item?.description || spec.summary || `${spec.title} 用于组织清晰的界面操作和信息层级。`}</p>
                <div className="uiux-detail-metadata">
                  <div><span>交互模型</span><strong>{spec.interactionModel}</strong></div>
                  <div><span>组件解剖</span><strong>{spec.anatomy.join(" · ")}</strong></div>
                </div>
              </section>
              <section className="uiux-detail-section">
                <h2>适用场景</h2>
                <div className="uiux-detail-chip-list">
                  {useCases.map((useCase) => <span key={useCase}>{useCase}</span>)}
                </div>
              </section>
              <NotesSection title="建议" items={doNotes} tone="positive" />
              <NotesSection title="避免" items={dontNotes} tone="negative" />
            </div>
          )}

          {activeTab === "states" && (
            <div className="uiux-detail-tab-content">
              <section className="uiux-detail-section">
                <h2>变体</h2>
                <div className="uiux-detail-variant-grid">
                  {variants.map((variant, index) => (
                    <div key={variant} className="uiux-detail-variant-card">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{variant}</strong>
                      <small>{spec.english} variant</small>
                    </div>
                  ))}
                </div>
              </section>
              <section className="uiux-detail-section">
                <h2>状态</h2>
                <div className="uiux-detail-state-list">
                  {states.map((state) => <span key={state}>{state}</span>)}
                </div>
              </section>
              <section className="uiux-detail-section">
                <h2>状态设计原则</h2>
                <p>默认、悬停、聚焦、禁用和异常状态应该保持相同的结构，让用户能够在变化中识别同一个组件。</p>
              </section>
            </div>
          )}

          {activeTab === "implementation" && (
            <div className="uiux-detail-tab-content">
              <section className="uiux-detail-section">
                <h2>实现提示</h2>
                <div className="uiux-detail-checklist">
                  <ChecklistItem label="语义结构" value={`${spec.anatomy.join("、")} 需要有明确的 DOM 角色。`} />
                  <ChecklistItem label="交互反馈" value={spec.interactionModel} />
                  <ChecklistItem label="数据契约" value="变体与状态来自条目数据，不通过静态截图表达。" />
                </div>
              </section>
              <NotesSection title="可访问性" items={accessibilityNotes} tone="accessibility" />
              <section className="uiux-detail-section">
                <h2>相关条目</h2>
                {relatedItems.length ? (
                  <div className="uiux-detail-related-list">
                    {relatedItems.map((relatedItem) => (
                      <button type="button" key={relatedItem.id} onClick={() => onOpenItem?.(relatedItem)}>
                        <span>{relatedItem.title}</span>
                        <small>{relatedItem.english || relatedItem.id}</small>
                        <b aria-hidden="true">↗</b>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="uiux-detail-muted">暂无关联条目。</p>
                )}
              </section>
            </div>
          )}
        </article>

        <aside className="uiux-detail-preview-column">
          <div className="uiux-detail-preview-sticky">
            <div className="uiux-detail-preview-heading">
              <span>Live preview</span>
              <span>{spec.family}</span>
            </div>
            <UiuxComponentPreview item={item} spec={spec} />
            <div className="uiux-detail-preview-note">
              <strong>交互结构</strong>
              <span>{spec.anatomy.slice(0, 4).join(" · ")}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function NotesSection({ title, items, tone = "" }) {
  return (
    <section className={`uiux-detail-section uiux-detail-notes is-${tone}`}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => <li key={item}><span aria-hidden="true">•</span>{item}</li>)}
      </ul>
    </section>
  );
}

function ChecklistItem({ label, value }) {
  return (
    <div className="uiux-detail-checklist-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default UiuxDetailPage;
