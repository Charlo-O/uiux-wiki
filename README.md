# uiux.wiki

uiux.wiki is a visual UI/UX glossary and interaction-pattern assistant for naming, comparing, and implementing interface patterns.

## Production

- Production site: https://www.uiux.wiki/
- GitHub repository: https://github.com/Charlo-O/uiux-wiki
- Production branch: `codex/expand-ui-item-index`
- Build entry: `src/main.jsx`
- Build output: `dist`
- Deployment: GitHub Actions workflow at `.github/workflows/deploy.yml`

GitHub Pages is deployed from the workflow artifact, not from a legacy branch/folder source. A push to `codex/expand-ui-item-index` runs `npm ci`, `npm run build`, `npm run smoke:dist`, then uploads `dist` to Pages.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
