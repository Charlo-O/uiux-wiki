import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { getTemplateComponent } from "./templateComponents.jsx";
import styles from "./templates.module.css";

class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.empty} role="img" aria-label="Preview unavailable">
          Preview unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

export function TemplateThumbnail({
  slug,
  aspectRatio = "16 / 10",
  renderWidth,
  className = "",
  onVisible,
}) {
  const containerRef = useRef(null);
  const [tileWidth, setTileWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const Component = getTemplateComponent(slug);

  const measure = useCallback(() => {
    if (containerRef.current) {
      setTileWidth(containerRef.current.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }
    measure();
    if (typeof ResizeObserver === "undefined") {
      setTileWidth(element.getBoundingClientRect().width || 1);
      return undefined;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      onVisible?.();
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [onVisible]);

  if (!Component) {
    return (
      <div ref={containerRef} className={`${styles.thumbnail} ${className}`} style={{ aspectRatio }}>
        <div className={styles.empty}>Preview unavailable</div>
      </div>
    );
  }

  const width = renderWidth ?? Math.max(tileWidth * 2, 640);
  const scale = tileWidth > 0 ? tileWidth / width : 0.5;
  const scaledHeight = scale > 0 ? `${100 / scale}%` : "200%";

  return (
    <div
      ref={containerRef}
      className={`${styles.thumbnail} ${className}`}
      style={{ aspectRatio }}
      aria-label={`${slug} live preview`}
      inert=""
    >
      {tileWidth > 0 && isVisible ? (
        <div
          className={styles.thumbnailScaler}
          style={{
            width,
            height: scaledHeight,
            transform: `scale(${scale})`,
          }}
        >
          <PreviewErrorBoundary>
            <Suspense fallback={<div className={styles.thumbnailSkeleton} />}>
              <Component />
            </Suspense>
          </PreviewErrorBoundary>
        </div>
      ) : (
        <div className={styles.thumbnailSkeleton} aria-hidden="true" />
      )}
    </div>
  );
}
