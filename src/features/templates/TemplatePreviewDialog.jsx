import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { getTemplateBySlug } from "./templateRegistry.js";
import { TemplatePreviewSurface } from "./TemplatePreviewSurface.jsx";
import {
  buildTemplatePlaygroundHref,
  buildTemplateUseText,
  copyTextToClipboard,
  updateTemplatePreviewUrl,
} from "./templateLinks.js";
import styles from "./templates.module.css";

function getIndex(items, index) {
  if (!items.length) {
    return -1;
  }
  return Math.min(Math.max(index, 0), items.length - 1);
}

export function TemplatePreviewDialog({
  items = [],
  index = 0,
  isOpen = false,
  onOpenChange,
  onIndexChange,
  onCopy,
  onOpenPlayground,
  onUrlChange,
  variant,
}) {
  const closeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const currentIndex = getIndex(items, index);
  const current = currentIndex >= 0 ? items[currentIndex] : null;
  const isFullscreen = variant === "fullscreen";

  const setIndex = useCallback(
    (nextIndex) => {
      if (!items.length) {
        return;
      }
      const normalized = (nextIndex + items.length) % items.length;
      startTransition(() => {
        onIndexChange?.(normalized);
        onUrlChange?.(items[normalized]);
      });
    },
    [items, onIndexChange, onUrlChange, startTransition],
  );

  const close = useCallback(() => {
    onOpenChange?.(false);
    onUrlChange?.(null);
  }, [onOpenChange, onUrlChange]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex(currentIndex + 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, setIndex, currentIndex]);

  useEffect(() => {
    setCopied(false);
  }, [current?.slug]);

  if (!isOpen || !current) {
    return null;
  }

  const template = getTemplateBySlug(current.slug) ?? current;
  const copy = async () => {
    const text = buildTemplateUseText(template);
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopied(true);
      onCopy?.({ template, text });
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      className={styles.dialogBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <section
        className={`${styles.dialog} ${isFullscreen ? styles.dialogFullscreen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-preview-title"
      >
        <header className={styles.dialogHeader}>
          <div className={styles.dialogMeta}>
            <h2 id="template-preview-title">
              {current.name}
              {current.nameEn ? <span style={{ color: "#8792a2", fontWeight: 500, marginLeft: 8 }}>{current.nameEn}</span> : null}
            </h2>
            {current.description ? <p>{current.description}</p> : null}
          </div>
          <div className={styles.dialogActions}>
            <button type="button" className={styles.actionButton} onClick={copy}>
              {copied ? "Copied" : "Copy local use"}
            </button>
            {current.source ? (
              <button
                type="button"
                className={styles.actionButton}
                data-primary="true"
                onClick={() => {
                  const href = buildTemplatePlaygroundHref(current.source);
                  onOpenPlayground?.({ template, href });
                  if (!onOpenPlayground && typeof window !== "undefined") {
                    window.history.pushState({}, "", href);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }
                }}
              >
                Open in Playground
              </button>
            ) : null}
            <button ref={closeRef} type="button" className={styles.closeButton} onClick={close} aria-label="Close preview">
              Close
            </button>
          </div>
        </header>
        <div className={styles.dialogBody} style={{ position: "relative" }}>
          {items.length > 1 ? (
            <>
              <button type="button" className={styles.dialogNavButton} data-direction="prev" onClick={() => setIndex(currentIndex - 1)} aria-label="Previous template">‹</button>
              <button type="button" className={styles.dialogNavButton} data-direction="next" onClick={() => setIndex(currentIndex + 1)} aria-label="Next template">›</button>
            </>
          ) : null}
          <div className={styles.dialogSurface}>
            <TemplatePreviewSurface slug={current.slug} />
          </div>
          {isPending ? (
            <div
              style={{
                position: "absolute",
                inset: 16,
                borderRadius: 16,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 2,
              }}
              aria-live="polite"
              aria-label="Loading template preview"
            >
              <div className={styles.thumbnailSkeleton} />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function openTemplatePreviewFromUrl({
  slug,
  category,
  onOpen,
} = {}) {
  if (!slug) {
    return null;
  }
  const href = updateTemplatePreviewUrl(slug, { category });
  onOpen?.(slug);
  return href;
}
