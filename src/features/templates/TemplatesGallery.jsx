import { useCallback, useEffect, useMemo, useState } from "react";
import {
  filterTemplates,
  getTemplateCategories,
  getTemplatePreviewItems,
  getVisibleTemplates,
  groupOf,
} from "./templateRegistry.js";
import {
  buildTemplatePlaygroundHref,
  buildTemplateUseText,
  copyTextToClipboard,
  updateTemplatePreviewUrl,
} from "./templateLinks.js";
import { TemplatePreviewDialog } from "./TemplatePreviewDialog.jsx";
import { TemplateThumbnail } from "./TemplateThumbnail.jsx";
import styles from "./templates.module.css";

function getUrlState() {
  if (typeof window === "undefined") {
    return { category: "All", preview: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category") ?? "All",
    preview: params.get("preview"),
  };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }
    const media = window.matchMedia("(max-width: 620px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return isMobile;
}

export function TemplatesGallery({
  items: itemInput,
  initialCategory,
  onCategoryChange,
  onPreviewOpen,
  onOpenPlayground,
  onCopy,
  useUrl = true,
  title = "Templates",
  subtitle = "Ready-to-use page patterns, with real local previews for every template.",
}) {
  const items = useMemo(() => getVisibleTemplates(itemInput ?? undefined), [itemInput]);
  const categories = useMemo(() => getTemplateCategories(items), [items]);
  const urlState = getUrlState();
  const [activeCategory, setActiveCategory] = useState(
    initialCategory ?? urlState.category ?? "All",
  );
  const [previewSlug, setPreviewSlug] = useState(useUrl ? urlState.preview : null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (activeCategory && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    if (!useUrl || typeof window === "undefined") {
      return undefined;
    }
    const sync = () => {
      const next = getUrlState();
      if (next.category && categories.includes(next.category)) {
        setActiveCategory(next.category);
      }
      setPreviewSlug(next.preview);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [useUrl, categories]);

  const filteredItems = useMemo(
    () => filterTemplates(items, categories.includes(activeCategory) ? activeCategory : "All"),
    [items, activeCategory, categories],
  );
  const previewItems = useMemo(() => getTemplatePreviewItems(filteredItems), [filteredItems]);
  const indexBySlug = useMemo(() => new Map(previewItems.map((item, index) => [item.slug, index])), [previewItems]);
  const openIndex = previewSlug ? indexBySlug.get(previewSlug) ?? null : null;
  const groupedItems = useMemo(() => {
    const groups = new Map();
    filteredItems.forEach((item) => {
      const group = groupOf(item.category);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(item);
    });
    return [...groups.entries()];
  }, [filteredItems]);

  const selectCategory = useCallback(
    (category) => {
      setActiveCategory(category);
      onCategoryChange?.(category);
      if (useUrl && typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.set("view", "templates");
        if (category === "All") params.delete("category");
        else params.set("category", category);
        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    },
    [onCategoryChange, useUrl],
  );

  const openPreview = useCallback(
    (slug) => {
      const template = filteredItems.find((item) => item.slug === slug);
      if (!template) return;
      const index = indexBySlug.get(slug);
      setPreviewSlug(slug);
      onPreviewOpen?.({ template, index });
      if (useUrl) updateTemplatePreviewUrl(slug, { category: activeCategory });
    },
    [filteredItems, indexBySlug, onPreviewOpen, useUrl, activeCategory],
  );

  const closePreview = useCallback(() => {
    setPreviewSlug(null);
    if (useUrl) updateTemplatePreviewUrl(null, { category: activeCategory });
  }, [useUrl, activeCategory]);

  const setOpenIndex = useCallback(
    (nextIndex) => {
      const item = previewItems[nextIndex];
      if (!item) return;
      setPreviewSlug(item.slug);
    },
    [previewItems],
  );

  const copy = useCallback(
    async ({ template, text } = {}) => {
      const source = template ?? items.find((item) => item.slug === previewSlug);
      const payload = text ?? buildTemplateUseText(source);
      if (text) {
        onCopy?.({ template: source, text: payload });
        return true;
      }
      const success = await copyTextToClipboard(payload);
      if (success) onCopy?.({ template: source, text: payload });
      return success;
    },
    [items, previewSlug, onCopy],
  );

  const openPlayground = useCallback(
    ({ template, href } = {}) => {
      const source = template ?? items.find((item) => item.slug === previewSlug);
      const destination = href ?? buildTemplatePlaygroundHref(source);
      onOpenPlayground?.({ template: source, href: destination });
      if (!onOpenPlayground && typeof window !== "undefined") {
        window.history.pushState({}, "", destination);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    },
    [items, previewSlug, onOpenPlayground],
  );

  return (
    <section className={styles.gallery} aria-label="Templates gallery">
      <div className={styles.galleryInner}>
        <header className={styles.hero}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {items[0]?.source ? (
            <button
              type="button"
              className={styles.actionButton}
              data-primary="true"
              onClick={() => openPlayground({ template: items[0] })}
            >
              Open the playground
            </button>
          ) : null}
        </header>

        <div className={styles.filterBar} role="toolbar" aria-label="Filter templates by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={styles.filterButton}
              data-active={category === activeCategory}
              aria-pressed={category === activeCategory}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {groupedItems.map(([group, groupItems]) => (
          <section className={styles.group} key={group} aria-labelledby={`templates-group-${group}`}>
            <div className={styles.groupHeading}>
              <h2 id={`templates-group-${group}`}>{group}</h2>
              <span>{groupItems.length} templates</span>
            </div>
            <div className={styles.grid}>
              {groupItems.map((template) => (
                <article
                  key={template.slug}
                  className={styles.card}
                  tabIndex={0}
                  role="button"
                  aria-label={`Preview ${template.name}`}
                  onClick={() => openPreview(template.slug)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openPreview(template.slug);
                    }
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <TemplateThumbnail slug={template.slug} />
                    <div className={styles.cardOverlay}>
                      <h3>{template.name}</h3>
                      <p>{template.description}</p>
                      <div style={{ display: "flex", gap: 7, marginTop: 12 }}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          data-primary="true"
                          onClick={(event) => {
                            event.stopPropagation();
                            openPreview(template.slug);
                          }}
                        >
                          Preview
                        </button>
                        {template.source ? (
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={(event) => {
                              event.stopPropagation();
                              openPlayground({ template });
                            }}
                          >
                            Playground
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTitle}>{template.name}</span>
                    <span className={styles.cardDescription}>{template.description}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {!filteredItems.length ? <div className={styles.empty}>No templates are available in this category.</div> : null}
        {previewSlug && openIndex === null && filteredItems.length ? (
          <div className={styles.empty} role="status">
            This template is not available in the current gallery.
          </div>
        ) : null}
      </div>

      <TemplatePreviewDialog
        items={previewItems}
        index={openIndex ?? 0}
        isOpen={openIndex !== null}
        onOpenChange={(open) => {
          if (!open) closePreview();
        }}
        onIndexChange={setOpenIndex}
        onCopy={copy}
        onOpenPlayground={openPlayground}
        onUrlChange={(item) => {
          if (item) {
            setPreviewSlug(item.slug);
            if (useUrl) updateTemplatePreviewUrl(item.slug, { category: activeCategory });
          } else {
            closePreview();
          }
        }}
        variant={isMobile ? "fullscreen" : undefined}
      />
    </section>
  );
}

export const TemplatesPage = TemplatesGallery;
