import React, { useEffect, useMemo, useRef, useState } from "react";
import { createUiuxComponentSpec } from "./UiuxComponentSpec.js";
import { UiuxComponentPreview } from "./UiuxPreviewRenderer.jsx";

export function UiuxPreviewThumbnail({ item, className = "", eager = false, aspect = "16 / 10", onPreviewReady }) {
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(eager);
  const [errored, setErrored] = useState(false);
  const spec = useMemo(() => createUiuxComponentSpec(item), [item]);

  useEffect(() => {
    if (eager || !hostRef.current || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (visible && !errored) onPreviewReady?.(item, spec);
  }, [visible, errored, item, spec, onPreviewReady]);

  return (
    <div
      ref={hostRef}
      className={`uiux-preview-thumbnail ${className}`}
      data-preview-id={item?.id}
      data-preview-family={spec.family}
      style={{ aspectRatio: aspect, contentVisibility: "auto" }}
    >
      {visible && !errored ? (
        <ErrorBoundary onError={() => setErrored(true)}>
          <UiuxComponentPreview item={item} spec={spec} compact />
        </ErrorBoundary>
      ) : errored ? (
        <div className="uiux-preview-error" role="img" aria-label={`${spec.title} preview unavailable`}>
          <strong>{spec.english}</strong>
          <span>Preview fallback</span>
        </div>
      ) : (
        <div className="uiux-preview-skeleton" aria-hidden="true">
          <i /><i /><i />
        </div>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export default UiuxPreviewThumbnail;
