// Compatibility entrypoint for the PRD/API path. The implementation lives in
// the JSX module so renderer files can keep their JSX colocated.
export {
  TEMPLATE_COMPONENTS,
  getTemplateComponent,
  renderTemplate,
} from "./templateComponents.jsx";
