import { uiItems } from "../../data.js";
import { createUiuxComponentSpec, UIUX_RENDERER_FAMILIES } from "./UiuxComponentSpec.js";

/**
 * The migration manifest is intentionally generated from the authoritative
 * 2,612-entry data set. It gives the integration layer an auditable, stable
 * record for every preview rather than silently falling back to screenshots.
 */
export function createUiuxMigrationManifest(items = uiItems) {
  return items.map((item) => {
    const spec = createUiuxComponentSpec(item);
    const explicitFamily = String(item.previewBase || item.preview || "").split(":")[0].trim();
    const isDerived = spec.family === "generic" || (!UIUX_RENDERER_FAMILIES.includes(spec.family) && !explicitFamily);
    return {
      id: spec.id,
      title: spec.title,
      english: spec.english,
      category: spec.category,
      group: spec.group,
      family: spec.family,
      anatomy: spec.anatomy,
      states: spec.states,
      interactionModel: spec.interactionModel,
      sourcePreview: explicitFamily || null,
      status: isDerived ? "derived-semantic" : "rewritten",
      renderer: `uiux:${spec.family}`,
      noScreenshot: true,
      qualityGates: {
        hasTitle: Boolean(spec.title),
        hasFamily: Boolean(spec.family),
        hasAnatomy: spec.anatomy.length >= 2,
        hasInteractionModel: Boolean(spec.interactionModel),
      },
    };
  });
}

export const uiuxMigrationManifest = createUiuxMigrationManifest();
export const uiuxMigrationSummary = {
  total: uiuxMigrationManifest.length,
  rewritten: uiuxMigrationManifest.filter((entry) => entry.status === "rewritten").length,
  derivedSemantic: uiuxMigrationManifest.filter((entry) => entry.status === "derived-semantic").length,
  rendererFamilies: [...new Set(uiuxMigrationManifest.map((entry) => entry.family))],
};

export default uiuxMigrationManifest;
