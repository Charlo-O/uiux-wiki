import React, { Suspense } from "react";
import { getTemplateComponent } from "./templateComponents.jsx";
import styles from "./templates.module.css";

class SurfaceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.empty} role="alert">
          <div>
            <strong>Live preview could not render.</strong>
            <p style={{ margin: "8px 0 0" }}>This template is kept in the registry, but its local renderer needs attention.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export function TemplatePreviewSurface({
  slug,
  className = "",
  onRendered,
}) {
  const Component = getTemplateComponent(slug);
  if (!Component) {
    return (
      <div className={`${styles.surface} ${className}`}>
        <div className={styles.empty}>A live preview is not available yet.</div>
      </div>
    );
  }
  return (
    <div className={`${styles.surface} ${className}`} data-template-surface={slug}>
      <SurfaceErrorBoundary>
        <Suspense fallback={<div className={styles.thumbnailSkeleton} />}>
          <Component />
        </Suspense>
      </SurfaceErrorBoundary>
      {onRendered ? <span style={{ display: "none" }} ref={onRendered} /> : null}
    </div>
  );
}
