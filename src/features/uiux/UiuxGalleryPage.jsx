import React, { useMemo } from "react";
import { uiItems, sections } from "../../data.js";
import { createUiuxComponentSpec } from "./UiuxComponentSpec.js";
import { UiuxGalleryCard } from "./UiuxGalleryCard.jsx";
import "./uiuxGallery.css";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesQuery(item, query) {
  const needle = normalize(query);
  if (!needle) return true;
  return [
    item.id,
    item.title,
    item.english,
    item.group,
    item.docGroup,
    item.summary,
    item.plain,
    ...(item.tags || []),
    ...(item.aliases || []),
  ]
    .map(normalize)
    .some((value) => value.includes(needle));
}

export function UiuxGalleryPage({
  items = uiItems,
  category = "",
  query = "",
  onOpenItem,
  title = "Browse the library",
  description = "Every UI/UX entry with a semantic, copy-ready preview.",
  showCategoryHeadings = true,
  eagerCount = 6,
  className = "",
}) {
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (!category || item.category === category || item.docGroupId === category) &&
          matchesQuery(item, query),
      ),
    [items, category, query],
  );

  const groups = useMemo(() => {
    if (!showCategoryHeadings) return [{ id: category || "all", label: "", items: filtered }];
    const sectionLabel = new Map(sections.map((section) => [section.id, section.label]));
    const grouped = new Map();
    filtered.forEach((item) => {
      const id = item.category || "components";
      if (!grouped.has(id)) grouped.set(id, { id, label: sectionLabel.get(id) || item.docSection || id, items: [] });
      grouped.get(id).items.push(item);
    });
    return [...grouped.values()];
  }, [filtered, category, showCategoryHeadings]);

  let cardIndex = 0;
  return (
    <main className={`uiux-gallery-page ${className}`} data-uiux-gallery data-count={filtered.length}>
      <header className="uiux-gallery-hero">
        <p className="uiux-gallery-kicker">UI/UX library</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="uiux-gallery-hero-meta">
          <span>{filtered.length.toLocaleString()} entries</span>
          {query && <span>Filtered by “{query}”</span>}
        </div>
      </header>

      {groups.map((group) => (
        <section className="uiux-gallery-section" key={group.id} data-category={group.id}>
          {showCategoryHeadings && (
            <div className="uiux-gallery-section-heading">
              <h2>{group.label}</h2>
              <span>{group.items.length}</span>
            </div>
          )}
          <div className="uiux-gallery-grid">
            {group.items.map((item) => {
              const eager = cardIndex < eagerCount;
              cardIndex += 1;
              return <UiuxGalleryCard key={item.id} item={item} index={cardIndex - 1} eager={eager} onOpen={onOpenItem} />;
            })}
          </div>
        </section>
      ))}

      {!filtered.length && (
        <div className="uiux-gallery-empty">
          <strong>No matching entries</strong>
          <span>Try a component name, English alias, or category.</span>
        </div>
      )}
    </main>
  );
}

export { matchesQuery };
export default UiuxGalleryPage;
