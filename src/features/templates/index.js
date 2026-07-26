export {
  TEMPLATE_GROUP_ORDER,
  OTHER_TEMPLATE_GROUP,
  templateRegistry,
  groupOf,
  groupRank,
  compareTemplates,
  sortTemplates,
  getVisibleTemplates,
  getTemplateBySlug,
  getTemplateCategories,
  filterTemplates,
  getTemplatePreviewItems,
  buildTemplatePreviewHref,
  buildTemplateRoute,
  buildTemplatePathHref,
  parseTemplatePath,
  parseTemplateQuery,
} from "./templateRegistry.js";

export {
  TEMPLATE_COMPONENTS,
  getTemplateComponent,
  renderTemplate,
} from "./templateComponents.jsx";

export { TemplateThumbnail } from "./TemplateThumbnail.jsx";
export { TemplatePreviewSurface } from "./TemplatePreviewSurface.jsx";
export {
  TemplatePreviewDialog,
  openTemplatePreviewFromUrl,
} from "./TemplatePreviewDialog.jsx";
export { TemplatesGallery, TemplatesPage } from "./TemplatesGallery.jsx";
export {
  buildTemplatePlaygroundHref,
  buildTemplateUseText,
  copyTextToClipboard,
  copyTemplateUse,
  updateTemplatePreviewUrl,
} from "./templateLinks.js";
