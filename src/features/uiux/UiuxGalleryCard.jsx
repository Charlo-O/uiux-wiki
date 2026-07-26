import React from "react";
import { createUiuxComponentSpec } from "./UiuxComponentSpec.js";
import { UiuxPreviewThumbnail } from "./UiuxPreviewThumbnail.jsx";

export function UiuxGalleryCard({ item, index = 0, onOpen, eager = false }) {
  const spec = createUiuxComponentSpec(item);
  const label = spec.english || spec.title;
  const handleOpen = () => onOpen?.(item, spec);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <article
      className="uiux-gallery-card"
      data-item-id={spec.id}
      data-family={spec.family}
      tabIndex={0}
      role="button"
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${label}`}
    >
      <UiuxPreviewThumbnail item={item} eager={eager} />
      <div className="uiux-gallery-card-meta">
        <div className="uiux-gallery-card-index">{String(index + 1).padStart(2, "0")}</div>
        <div className="uiux-gallery-card-copy">
          <div className="uiux-gallery-card-title">
            <strong>{spec.title}</strong>
            <span>{label}</span>
          </div>
          <p>{spec.summary || spec.interactionModel}</p>
          <div className="uiux-gallery-card-tags">
            <span>{spec.family}</span>
            {spec.group && <span>{spec.group}</span>}
          </div>
        </div>
        <span className="uiux-gallery-card-arrow" aria-hidden="true">↗</span>
      </div>
    </article>
  );
}

export default UiuxGalleryCard;
