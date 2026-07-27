# Website Handoff — July 27, 2026

This document is written for a new Codex chat with no prior context. Read it before changing the website.

## 1. Project at a glance

The project is a public-facing research hub for the **U.S. 2020 Facebook and Instagram Election Study**. It currently has two substantive areas:

1. **Study Publications** — six study-paper records with authors, journal/year, abstracts, publication links, and citation dialogs.
2. **Variable Operationalization** — 24 research tables and 90 paper-level records organized into Polarization, Participation, Trust, and Knowledge.

The site is implemented locally and configured for a future static GitHub Pages deployment. Do not deploy or push unless the user explicitly asks.

Current local URL:

- `http://127.0.0.1:3000/`

The development server may stop when the Codex session ends. If the URL refuses to connect, restart it using the instructions below.

## 2. Where everything is stored

### Project and Git repository

- Project root: `/Users/aphra/Documents/demo_website 2`
- Current branch: `main`
- Current HEAD when this handoff was written: `433c3f5` (`Search bar logic updated 2.0`)
- Existing remote: `origin = https://github.com/AphraChen-NYU/us-2020-election-study-website.git`

The latest work is **not committed**. Do not reset, discard, or overwrite the dirty worktree.

At handoff time, the important modified/untracked source files were:

- Modified:
  - `src/app/page.tsx`
  - `src/components/site-header.tsx`
  - `src/components/site-footer.tsx`
  - `src/data/outcome-measures.json`
  - `src/data/outcome-measures.test.ts`
  - `src/data/record-summaries.ts`
- New/untracked:
  - `src/app/related-papers/page.tsx`
  - `src/components/citation-dialog.tsx`
  - `src/components/related-papers-list.tsx`
  - `src/components/related-papers-list.test.tsx`
  - `src/components/site-footer.test.tsx`
  - `src/components/site-publication-links.test.tsx`
  - `src/data/peer-reviewed-papers.ts`
  - `src/data/peer-reviewed-papers.test.ts`
  - this handoff document

Always run `git status --short` before editing because the list may have changed.

### Original source documents

- Variable-operationalization source PDF:
  - `/Users/aphra/Desktop/Research Projects/Summer RA/2026/Aphra RA Tasks - 60 Hours Summer 2025.pdf`
- Study-publication source PDF:
  - `/Users/aphra/Downloads/Peer-reviewed Paper Info.pdf`

The PDFs live outside the repository. The website data has already been extracted, proofread, and heavily corrected. Do not blindly re-extract a PDF over the current data.

### Main source directories

- `src/app/` — Next.js routes, global metadata, fonts, and styling.
- `src/components/` — site navigation/footer, filtering, tables, modals, cards, and UI primitives.
- `src/data/` — the 90 operationalization records, curated summaries, and the six publication records.
- `src/lib/` — filtering, parsing, method-color logic, accordion state, and shared helpers.
- `public/` — `.nojekyll`, `robots.txt`, and `og.png`.
- `.github/workflows/` — GitHub Pages workflow.
- `out/` — generated static export; ignored by Git.
- `.next/` — generated Next.js cache/types; ignored by Git.

### Important active files

- `src/app/page.tsx` — active home page.
- `src/app/globals.css` — active global stylesheet.
- `src/app/layout.tsx` — local fonts and global/social metadata.
- `src/app/related-papers/page.tsx` — Study Publications page.
- `src/app/variable-operationalization/page.tsx` — overview route.
- `src/app/variable-operationalization/[category]/page.tsx` — four statically generated theme routes.
- `src/data/outcome-measures.json` — full persisted operationalization dataset.
- `src/data/record-summaries.ts` — authoritative curated summary labels and method overrides.
- `src/data/peer-reviewed-papers.ts` — six publication records.

There are two old tracked snapshot files:

- `src/app/page 2.tsx`
- `src/app/globals 2.css`

They are not used by Next.js and contain early placeholder versions. Do not edit them when changing the live site. The active files are `page.tsx` and `globals.css`. These snapshots can be removed in a separate cleanup only after checking with the user.

## 3. Technology and configuration

- Next.js `16.2.10`, App Router.
- React `19.2.7`.
- TypeScript `6.0.2`.
- Tailwind CSS `4.3.2`.
- pnpm `11.7.0`.
- Node.js `24` in the GitHub workflow.
- Vitest + Testing Library.
- Radix Accordion.
- Lucide icons.
- Locally bundled variable fonts:
  - `@fontsource-variable/inter`
  - `@fontsource-variable/newsreader`

There are no Google Font downloads, no database, no backend API, no server actions, and no Docker.

`next.config.ts` is intentionally GitHub Pages compatible:

- `output: "export"`
- `trailingSlash: true`
- `images.unoptimized: true`
- repository-aware `basePath` and `assetPrefix` during GitHub Actions project-site builds

The workflow is `.github/workflows/deploy-pages.yml`. It validates the project, builds `out/`, uploads it, and deploys with GitHub Pages Actions. The workflow exists, but do not run or push it without explicit authorization.

## 4. Routes and current navigation

Current routes:

- `/` — Home.
- `/related-papers/` — Study Publications.
- `/variable-operationalization/` — theme overview and cross-theme filters.
- `/variable-operationalization/polarization/`
- `/variable-operationalization/participation/`
- `/variable-operationalization/trust/`
- `/variable-operationalization/knowledge/`
- `/placeholder-1/`
- `/placeholder-2/`

Desktop and mobile header order:

1. Home
2. Study Publications
3. Variable Operationalization
4. Placeholder 1
5. Placeholder 2

The shared footer intentionally contains only:

1. Browse study publications
2. Explore variable operationalization

The footer no longer includes placeholder links or an “ICPSR study overview” link.

## 5. Page structures

### Home

Current section order:

1. Hero.
2. About the Study.
3. Research Themes.
4. Final Variable Operationalization callout.

Important home behavior:

- Primary hero action: `About the study` → `#about`.
- Secondary hero action: `Explore variable operationalization`.
- `#about` uses a sticky-header scroll offset.
- About cards:
  - `ICPSR-SOMAR replication data` — external ICPSR link.
  - `Study Publications` — internal `/related-papers/` link.
- Theme cards link directly to the four theme routes.

### Study Publications

The `/related-papers/` route displays six papers in this order:

1. Ad Experimental.
2. Chronological Feed.
3. Deactivation.
4. Likeminded.
5. Reshares.
6. Untrustworthy.

The first five have verified publisher links. Untrustworthy is marked `Forthcoming` in its publication metadata and has no external publication link.

Each paper card shows:

- Study-paper label.
- Title.
- Complete author list.
- Journal/year or forthcoming status.
- Independently expandable native `<details>` abstract.
- `View publication` when a link exists.
- `Cite this paper` for every paper.

`Cite this paper` opens an accessible modal implemented in `citation-dialog.tsx`. It traps focus, locks body scrolling, closes via Escape/overlay/close button, restores focus, and becomes full-screen on small mobile displays.

### Variable Operationalization

The overview starts with the four-theme grid. When a filter is selected, the grid is replaced with filtered table accordions.

Theme pages show the same table system but lock the outer research theme.

All table accordions are collapsed by default. Opening another table does not cause unrelated tables to open. If filtering removes the currently open table, all remaining tables stay collapsed.

Desktop uses compact summary tables. Mobile uses record cards. Selecting a row/card opens an accessible detail modal with complete source wording.

## 6. Operationalization data model and invariants

`src/data/outcome-measures.ts` defines:

```ts
interface OutcomeRow {
  paper: string;
  questionsUsed: string;
  waves: string;
  method: string;
  pages: string;
}

interface OutcomeTable {
  id: string;
  number: string;
  title: string;
  category: "polarization" | "participation" | "trust" | "knowledge";
  rows: OutcomeRow[];
}
```

Do not add the PDF’s separate internal `Questions` notes field. Every public row must keep exactly the five fields above.

Dataset invariants:

- 24 tables.
- 90 records.
- Polarization: 3 tables, 17 records.
- Participation: 6 tables, 26 records.
- Trust: 8 tables, 23 records.
- Knowledge: 7 tables, 24 records.

Exact paper labels used for summary keys and filters include:

- `Chronological Feed (Guess et al., 2023)`
- `Ad Experimental (Allcott et al., 2026)`
- `Deactivation (Allcott et al., 2024)`
- `Likeminded (Nyhan et al., 2023)`
- `Reshares (Guess et al., 2023)`
- `Untrustworthy (Bergeron-Boutin et al., forthcoming)`

Ad Experimental occurs in 16 records. Untrustworthy occurs in 16 records. Changing a paper label in the JSON also requires changing its key constant in `record-summaries.ts`; otherwise curated summaries silently stop matching.

## 7. Summary and detail logic

The persisted JSON preserves complete Questions Used, Waves, Method, and Pages wording. Summary-table text is derived separately.

### Curated summary authority

`src/data/record-summaries.ts` is the authoritative source for:

- Numbered Survey Questions Used summaries.
- Paper-specific component labels.
- Component provenance (`sourceField` and `sourceItem`).
- Authoritative Construction Method tags.
- Record-specific method exclusions and replacements.

Do not replace these curated arrays with automatic parsing. They were audited against the extracted text and PDF, and all 90 records have expected component-count coverage.

The UI intentionally does not display a numeric component-count badge, but it does retain numbered component lists. Do not cap the number of component or method labels.

### Derived helpers

`src/lib/outcome-summary.ts`:

- Splits numbered items.
- Derives method tags when no authoritative override exists.
- Applies exclusions and exact replacements.
- Parses source references into `SourceEntry[]`.
- Keeps unusual source text as a fallback.
- Never mutates persisted records.

`src/lib/method-tag-palette.ts` provides a global nine-family semantic palette:

- Analysis.
- Rotation.
- Aggregation.
- Transformation.
- Coding.
- Validation.
- Restriction.
- Self-report.
- General.

Identical method labels should always map to the same logical family and style. Color is supplementary; every chip retains a visible label and colored dot.

`src/lib/detail-outline.ts` supports structured nested lists. The detail modal currently applies structured rendering specifically to:

- A4.4 Complete Questions Used.
- A4.7 Complete Method.

`record-detail-modal.tsx` renders complete data, parsed source groups, focus trapping, Escape/overlay close, body-scroll locking, and focus restoration.

## 8. Filter logic

There is no free-text search box and no search-scope selector.

Overview controls:

- Theme.
- Paper.
- Measure.
- Clear all filters.

Theme-page controls:

- Paper.
- Measure.
- Clear all filters.

Rules:

- Multiple values can be selected within each filter.
- Values within one filter group use OR.
- Different filter groups use AND.
- Only one option sublist can be visually open at a time.
- Closing one sublist or opening another never clears selections.
- Checkbox selection keeps the current sublist open.
- Theme and Paper selections narrow later options.
- Measure choices are the 24 table titles only; there are no Key Variable or Method choices.
- Visible Measure labels remove table codes and generic `outcome measures`/`measures` suffixes.
- Theme pages omit Theme because the route already fixes it.
- Clear all closes the open menu and resets selections.
- Active filter chips can be removed independently.

Key files:

- `src/components/variable-filter-bar.tsx`
- `src/lib/filter-outcomes.ts`
- `src/components/variable-overview.tsx`
- `src/components/outcome-browser.tsx`

## 9. Content corrections already completed

Do not undo these.

- All “Outcome Measures” site/page naming was changed to **Variable Operationalization**.
- Summary column heading is **Survey Questions Used**.
- All 24 tables and 90 records were proofread conservatively against source content.
- Large correction passes were completed for Polarization, Participation, Trust, and Knowledge, including:
  - extraction-damaged spacing;
  - broken words;
  - numbered methods/questions;
  - nested A4.4 and A4.7 structures;
  - Waves formatting;
  - source-page and figure formatting;
  - paper-specific component summaries;
  - authoritative method-summary tags.
- Affective Polarization / Reshares has exactly three distinct components.
- Participation A2.1 intentionally has no Survey Questions Used summary labels.
- Every source `pages` raw value remains in JSON and is parsed only for display.
- All accordions start collapsed.
- The filter system is selection-only and multi-select.
- The publications page contains six records, five publication links, one forthcoming record, independent abstract disclosures, and citation dialogs.
- “Related Papers” was renamed **Study Publications** in navigation/page labeling.
- Home was reordered so About precedes Research Themes.
- Footer was made public-facing and reduced to two current links.

The detailed correction manifest is encoded in `src/lib/outcome-summary.test.ts`. Treat those tests as content regressions, not optional formatting tests.

## 10. Local development and validation

Expected environment:

- Node 24.
- pnpm 11.7.

Normal commands:

```bash
pnpm install
pnpm dev -- --hostname 127.0.0.1 --port 3000
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Static output is written to `out/`.

Simulated GitHub project-site build:

```bash
GITHUB_ACTIONS=true \
GITHUB_REPOSITORY=example/research-site \
pnpm build
```

When this handoff was written:

- ESLint passed.
- TypeScript passed.
- 11 test files / 63 tests passed.
- Normal static export passed.
- Simulated GitHub Pages project-subpath export passed.
- Desktop/mobile browser QA showed no console errors.

## 11. Codex runtime workarounds and past errors

These problems occurred repeatedly. Do not repeat them.

### A. Do not invoke a package-manager shim that tries to reinstall dependencies

In the Codex environment, calling the fallback `pnpm` sometimes triggered a registry metadata fetch and attempted to replace `node_modules`, failing because the network/TTY was unavailable.

The reliable approach was to use the already-installed project binaries with the bundled Node runtime:

```bash
PATH='/Users/aphra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/usr/bin:/bin:/usr/sbin:/sbin' \
./node_modules/.bin/vitest run
```

Replace `vitest run` with:

- `eslint .`
- `tsc --noEmit -p tsconfig.typecheck.json`
- `next build`
- `next dev -H 127.0.0.1 -p 3000`

Do not run `pnpm install` unless dependencies are genuinely missing and the user approves network access.

### B. Next.js builds may need sandbox escalation

Turbopack’s CSS/PostCSS worker attempted to bind an internal port and failed with:

> creating new process / binding to a port / Operation not permitted

Run `next build` with the appropriate elevated local-process permission when this happens. It is a build-worker restriction, not a source-code failure.

### C. Build and dev processes can create duplicate generated type files

When `next dev` and repeated `next build` operations touched `.next` concurrently, duplicate generated files appeared:

- `.next/types/cache-life.d 2.ts`
- `.next/types/routes.d 2.ts`
- `.next/types/validator 2.ts`

They caused duplicate TypeScript identifier errors. These are ignored generated artifacts, not source files. Delete only the `* 2.ts` copies from `.next/types`, then rerun TypeScript. Do not edit `tsconfig` to hide the error.

### D. `next build` rewrites `next-env.d.ts`

The build may change:

```ts
import "./.next/dev/types/routes.d.ts";
```

to:

```ts
import "./.next/types/routes.d.ts";
```

The tracked repository state currently expects the dev-types path. After verification builds, inspect `git diff -- next-env.d.ts` and restore only that generated line if needed. Do not leave an unrelated generated diff.

### E. “Site refused to connect” usually means the dev server stopped

Check port 3000:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

If nothing is listening, restart `next dev`. If startup reports `EADDRINUSE`, do not start another server; the existing process owns the port. A sandboxed `curl` can fail against localhost even while the in-app browser can reach it, so use the browser and `lsof` as the authoritative checks.

### F. Avoid inactive duplicate source snapshots

Do not edit:

- `src/app/page 2.tsx`
- `src/app/globals 2.css`

They are old placeholder snapshots. Editing them has no effect on the site.

### G. Do not regenerate or simplify research content casually

- Accuracy is the user’s top priority.
- Do not shorten labels if it changes meaning.
- Do not cap component lists.
- Do not overwrite complete raw text with summary text.
- Do not alter substantive research wording without checking the PDF or a specific user correction.
- Keep curated summaries and complete modal wording separate.
- Preserve all page/figure reference numbers.

### H. Do not reintroduce removed search behavior

The user explicitly removed:

- free-text search;
- search scopes;
- method filters;
- internal facet-menu search boxes;
- the mobile Filters disclosure.

The current selection-only Theme/Paper/Measure design is intentional.

### I. Do not break static GitHub Pages routing

- Preserve `trailingSlash`.
- Preserve repository-aware `basePath` and `assetPrefix`.
- Use Next.js `Link` for internal destinations.
- Avoid server-only runtime APIs.
- Keep fonts local.
- Do not add Docker.

### J. Do not deploy or discard work without permission

The remote already exists, but the latest changes are uncommitted. The user previously instructed the work to remain local. Before any commit/push:

1. Recheck the dirty worktree.
2. Review every modified and untracked file.
3. Ask for or confirm explicit authorization.
4. Stage intentionally.
5. Never use `git reset --hard` or destructive checkout commands.

## 12. Known housekeeping and likely next steps

There is no unfinished user-requested feature at handoff time. The latest footer change is complete.

Useful housekeeping for a future chat:

- Update `README.md`. It is stale:
  - calls the site local;
  - omits `/related-papers/`;
  - describes an older search/filter system.
- Decide with the user whether to remove the inactive tracked `page 2.tsx` and `globals 2.css` snapshots.
- Review and commit the current dirty worktree only when the user requests it.
- Before public launch, confirm the final GitHub repository name, Pages settings, and optional `NEXT_PUBLIC_SITE_URL`.
- Replace Placeholder 1 and Placeholder 2 only when the user supplies their content.

## 13. Fast start for the next chat

1. Read this file.
2. Run:

   ```bash
   cd "/Users/aphra/Documents/demo_website 2"
   git status --short
   ```

3. Inspect the exact active file related to the new request.
4. Preserve the data invariants and curated-summary architecture.
5. Implement with `apply_patch`.
6. Run lint, TypeScript, all tests, normal static build, and simulated GitHub Pages build.
7. Browser-test desktop and mobile.
8. Leave the requested local route open.
9. Do not commit, push, or deploy unless explicitly requested.
