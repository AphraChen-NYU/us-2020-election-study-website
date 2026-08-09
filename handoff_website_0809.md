# Website Handoff — August 9, 2026

This document is for a new Codex chat with no prior context. Read it completely before changing the website.

## 1. Project summary

This repository contains a public research hub for the **U.S. 2020 Facebook and Instagram Election Study**. The website brings together three connected resources:

1. **Study Publications** — paper metadata, authors, abstracts, publication links, and formatted citations.
2. **Study Datasets** — verified Social Media Archive (SOMAR/ICPSR) datasets associated with each paper, including summaries, source links, and citations.
3. **Variable Operationalization** — 24 tables and 90 paper-level records documenting how variables were measured across four research themes.

The site is a statically exported Next.js application. It runs locally and deploys to GitHub Pages under the repository subpath.

Do not commit, push, deploy, delete files, or discard local work unless the user explicitly asks.

## 2. Where the website and source documents are stored

### Active project repository

- Project root: `/Users/aphra/Documents/demo_website 2`
- Git branch: `main`
- Git remote: `https://github.com/AphraChen-NYU/us-2020-election-study-website.git`
- Current local HEAD when this handoff was written: `3db83b1` (`update`)
- GitHub Pages site: `https://aphrachen-nyu.github.io/us-2020-election-study-website/`
- GitHub Actions workflow: `.github/workflows/deploy-pages.yml`

The working tree is intentionally dirty. At handoff time, the modified application files were:

- `src/app/page.tsx`
- `src/components/site-publication-links.test.tsx`

These two uncommitted changes implement the newest homepage redesign. They have already been validated. Preserve them.

This newly created `handoff_website_0809.md` file is also untracked until the user chooses to commit it. The older `handoff_website_0727.md` remains available as historical context but is superseded by this document.

Always start a new task with:

```bash
cd "/Users/aphra/Documents/demo_website 2"
git status --short
git diff --check
```

### Source documents outside the repository

- Latest publication source PDF:
  - `/Users/aphra/Downloads/Peer-reviewed Paper Info (1).pdf`
- Dataset source PDF:
  - `/Users/aphra/Downloads/Dataset Info (Task2).pdf`
- Earlier variable-operationalization source PDF:
  - `/Users/aphra/Desktop/Research Projects/Summer RA/2026/Aphra RA Tasks - 60 Hours Summer 2025.pdf`

These PDFs are research references, not deployed website assets. Current website data includes extensive corrections and online verification. Do not overwrite it with a fresh PDF extraction.

Temporary clipboard screenshots under `/var/folders/...` are not durable sources and should not be required by future work.

### Active source directories

- `src/app/` — App Router pages, layout, metadata, and global styling.
- `src/components/` — headers, footers, browsers, filters, tables, accordions, dialogs, and shared UI.
- `src/data/` — publication records, dataset records and associations, variable tables, and curated summaries.
- `src/lib/` — filtering, preview, citation, parsing, palette, and accordion helpers.
- `public/` — static public assets, including `.nojekyll`, `robots.txt`, and `og.png`.
- `.github/workflows/` — GitHub Pages deployment workflow.
- `out/` — generated static export; ignored by Git.
- `.next/` — generated Next.js state and types; ignored by Git.

### Important active files

- `src/app/page.tsx` — active homepage.
- `src/app/globals.css` — active global stylesheet.
- `src/app/layout.tsx` — site metadata and locally bundled fonts.
- `src/app/related-papers/page.tsx` — Study Publications route.
- `src/app/datasets/page.tsx` — Study Datasets route.
- `src/app/variable-operationalization/page.tsx` — Variable Operationalization overview.
- `src/app/variable-operationalization/[category]/page.tsx` — four statically generated theme routes.
- `src/data/peer-reviewed-papers.ts` — publication metadata and publication sorting.
- `src/data/study-datasets.ts` — 54 unique datasets and 67 paper–dataset associations.
- `src/data/outcome-measures.json` — 24 operationalization tables and 90 records.
- `src/data/record-summaries.ts` — curated operationalization summaries and method overrides.
- `src/components/related-papers-list.tsx` — publication-card behavior.
- `src/components/study-datasets-browser.tsx` — paper filters, accordions, summary previews, and dataset actions.
- `src/components/variable-overview.tsx` — overview filters/results.
- `src/components/outcome-browser.tsx` — theme-page table browser.
- `src/components/variable-filter-bar.tsx` — shared Theme/Paper/Measure filtering UI.
- `src/components/site-header.tsx` and `src/components/site-footer.tsx` — shared navigation.

Two tracked files are inactive historical snapshots:

- `src/app/page 2.tsx`
- `src/app/globals 2.css`

Next.js does not use them. Do not edit them when changing the live site. Remove them only in a separate, user-approved cleanup.

The placeholder routes also still exist but are no longer listed in the header or footer:

- `src/app/placeholder-1/page.tsx`
- `src/app/placeholder-2/page.tsx`

## 3. Technology and local entry

- Next.js `16.2.10`, App Router.
- React `19.2.7`.
- TypeScript `6.0.2`.
- Tailwind CSS `4.3.2`.
- pnpm `11.7.0`.
- Node.js `24` in GitHub Actions.
- Vitest `4.1.10` and Testing Library.
- Radix Accordion.
- Lucide icons.
- Local Inter and Newsreader variable fonts through `@fontsource-variable` packages.

There is no database, backend API, server action, Google Fonts request, or Docker setup.

### Run locally

The local server was **not running** when this handoff was written. Start it from the project root:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Then open:

- Home: `http://localhost:3000/`
- Study Publications: `http://localhost:3000/related-papers/`
- Study Datasets: `http://localhost:3000/datasets/`
- Variable Operationalization: `http://localhost:3000/variable-operationalization/`

If the normal development command has a local Turbopack/process problem, use the production-compatible bundler explicitly:

```bash
./node_modules/.bin/next dev --webpack -H 127.0.0.1 -p 3000
```

Check whether port 3000 is already occupied before starting a second server:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

## 4. Routes and shared navigation

Public routes:

- `/` — Home.
- `/related-papers/` — Study Publications.
- `/datasets/` — Study Datasets.
- `/variable-operationalization/` — overview and cross-theme filters.
- `/variable-operationalization/polarization/`
- `/variable-operationalization/participation/`
- `/variable-operationalization/trust/`
- `/variable-operationalization/knowledge/`
- `/placeholder-1/` and `/placeholder-2/` — existing but deliberately unlisted.

Desktop and mobile header order:

1. Home
2. Study Publications
3. Study Datasets
4. Variable Operationalization

Footer order:

1. View study publications
2. Browse study datasets
3. Explore variable operationalization

The footer description links the words **project page** to `https://medium.com/`. This is a temporary project-page destination until the user supplies a final URL.

Internal navigation uses Next.js `Link`. Keep it that way so `basePath` works on GitHub Pages.

## 5. Current homepage structure

The newest homepage restructuring is complete locally but uncommitted. The page order is:

1. Hero.
2. About the Study.
3. Study Publications editorial section.
4. Study Datasets editorial section.
5. Variable Operationalization editorial section.
6. One combined research-resource navigation panel.
7. Shared footer.

### Hero and About

- Hero copy now names publications, datasets, and variable documentation together.
- `About the study` scrolls to `#about`.
- `Explore variable operationalization` links to the variable library.
- The About section has two cards:
  - `ICPSR-SOMAR replication data` → the specified SOMAR search URL.
  - `Project overview` → `https://medium.com/`, opened in a new tab.
- The old About-section Study Publications card was removed because publications now have a dedicated section.

The SOMAR search URL is:

```text
https://www.icpsr.umich.edu/sites/somar/search/studies?start=0&fq=PRINCIPAL_INVESTIGATORS_FACET%3AMeta+%28United+States%29&q=
```

### Editorial resource sections

- The Study Publications section derives its paper/status counts from `peerReviewedPapers`.
- The Study Datasets section derives 54 unique datasets, 67 associations, and 11 groups from the shared dataset source.
- The Variable Operationalization section preserves the exact heading:
  - `Four lenses on the Study - Variable Operationalization`
- Each section contains a four-item editorial preview grid and a link to its full resource.

### Combined resource panel

The previous three oversized CTA panels were replaced with one navy outer panel. It contains exactly three compact destination tiles in this order:

1. Study Publications.
2. Study Datasets.
3. Variable Operationalization.

The tiles are three columns on desktop and stack without horizontal overflow on mobile.

## 6. Study Publications logic

### Data and ordering

`src/data/peer-reviewed-papers.ts` is the sole publication-data source.

Published papers sort by exact `publicationDate` ascending. If two published papers have the same date, the comparator uses the complete `title`, case-insensitively with English collation. Forthcoming papers come last and also use the full title for deterministic ordering.

Current rendered order:

1. Segregation.
2. Chronological Feed.
3. Likeminded.
4. Reshares.
5. Deactivation.
6. Misinformation.
7. Ad Experimental.
8. Deceptive.
9. Untrustworthy.
10. Emotion.

Current status count: nine journal articles and one forthcoming paper. Emotion is the sole forthcoming paper.

The four papers published online on July 27, 2023 are ordered by their full titles:

1. `Asymmetric ideological segregation in exposure to political news on Facebook`
2. `How do social media feed algorithms affect attitudes and behavior in an election campaign?`
3. `Like-minded sources on Facebook are prevalent but not polarizing`
4. `Reshares on social media amplify political news but do not detectably affect beliefs or opinions`

Do not change this tie-breaker back to the short study labels.

### Card behavior

- Paper numbers are derived dynamically from the sorted array.
- The status tag sits below the two-digit number.
- `Journal Article` uses teal; `Forthcoming` uses terracotta.
- Collapsed authors show the first three exact array entries, followed by a small `+`.
- Expanding authors renders the complete comma-separated list inline; the control becomes `−` after the final author.
- Collapsed abstracts use an exact whole-word prefix capped at 240 characters.
- An ellipsis is visual only and appears only when text is omitted.
- `Read full abstract` appends only the omitted source text inside the same paragraph.
- Expanded abstracts end with an inline `−` control that restores preview mode.
- Author and abstract expansion states are independent for every paper.
- Never rewrite, shorten, duplicate, or separately store author or abstract previews.

### Publication and citation dialogs

- One publication link renders a direct external `View publication` link.
- Multiple links render a `View publication` button and an accessible chooser dialog.
- Emotion has two destinations: the AEA article page and NBER working-paper PDF.
- Emotion's chooser does not show the full paper title and labels the AEA option `Forthcoming (AEA)`.
- A missing link renders an unavailable state.
- `Cite this paper` opens an accessible citation dialog.
- The citation dialog visibly contains the `Cite this paper` heading, close control, and formatted citation only. It does not repeat the study label or paper title above the citation.
- Journal titles and volume numbers are italicized by the citation renderer. Preserve the stored citation content and renderer tests.
- Dialogs trap focus, lock body scrolling, close via Escape/overlay/close button, and restore focus to the trigger.

## 7. Study Datasets logic

### Data model and invariants

`src/data/study-datasets.ts` contains:

- `studyDatasets` — 54 unique verified dataset records keyed by dataset ID.
- `studyDatasetGroups` — paper-level dataset associations.
- `studyDatasetAssociationCount` — derived total of 67 associations.

Each unique dataset stores:

- ID.
- Current dataset name.
- Table summary.
- Stable ICPSR/SOMAR record URL.
- Recommended citation.
- DOI/version URL.

Repeated dataset IDs reuse the same object. Do not duplicate or fork their metadata by paper.

Group order and counts:

1. Segregation — 14 datasets.
2. Chronological Feed — 4.
3. Likeminded — 7.
4. Reshares — 4.
5. Deactivation — 3.
6. Misinformation — 3.
7. Ad Experimental — 5.
8. Deceptive — 22.
9. Untrustworthy — 0, intentionally retained as a placeholder.
10. Emotion — 3.
11. Vote Choice — 2.

The first ten groups are derived in publication order from `peerReviewedPapers`. Vote Choice is appended because it is in the dataset PDF but not yet on the Study Publications page. Its displayed label and title are both `Vote Choice`; its status remains forthcoming.

### Browser behavior

- The top filter matches the Variable Operationalization visual system.
- It shows `SEARCH BY`, a Paper multi-select dropdown, active removable chips, `Clear all filters`, and an accessible count.
- The dropdown contains all 11 paper labels.
- No selection means all paper accordions are shown.
- Multiple selections show the union of selected paper groups while preserving original order.
- Untrustworthy and Vote Choice remain filterable.
- Paper accordions are independently expandable and initially collapsed.
- Expanded Untrustworthy shows `Dataset information forthcoming` rather than invented rows.

Desktop table columns:

1. `Dataset` — approximately 32%.
2. `Summary` — approximately 50%.
3. `Dataset link and citation` — approximately 18%.

`View dataset` and `Cite dataset` are vertically arranged in the third cell. Mobile retains the same semantic field order in a stacked layout without horizontal overflow.

Summary previews use the same source-preserving logic as publication abstracts:

- Exact whole-word prefix capped at 240 characters.
- Ellipsis only if truncated.
- `Read full summary` appends the untouched remainder inline.
- An inline `−` returns to preview mode.
- Expansion state is keyed by paper–dataset association, so a shared dataset can expand independently under different papers.

`Cite dataset` opens an accessible dialog containing the complete verified citation and linked DOI. Dataset links open in a new tab with safe `rel` attributes.

## 8. Variable Operationalization logic

### Data invariants

`src/data/outcome-measures.json` is the persisted data source. It contains:

- 24 tables.
- 90 paper-level records.
- Polarization: 3 tables, 17 records.
- Participation: 6 tables, 26 records.
- Trust: 8 tables, 23 records.
- Knowledge: 7 tables, 24 records.

Each row keeps exactly these complete source fields:

- `paper`
- `questionsUsed`
- `waves`
- `method`
- `pages`

Do not add the PDF's separate internal `Questions` notes field.

`src/data/record-summaries.ts` is authoritative for curated question/component summaries, provenance, method tags, exclusions, and replacements. Do not replace these curated structures with automatic parsing or shorten complete source wording.

Changing a paper label in the JSON also requires updating matching keys/constants in `record-summaries.ts`, or curated summaries can silently stop matching.

`src/lib/outcome-summary.test.ts` is a substantive content-regression suite, not optional formatting coverage.

### Overview and theme pages

- Overview heading: `Variables by theme, paper, or measure`.
- Themes: Polarization, Participation, Trust, and Knowledge.
- Theme routes are statically generated.
- All table accordions start collapsed and open independently.
- Desktop renders compact summary tables; mobile renders record cards.
- Selecting a row/card opens an accessible modal with complete source wording.
- A2.1 `Platform usage outcome measures` intentionally expands to five records.

Two guidance notes appear throughout the Variable Operationalization section:

- The scope note appears near the top before filters and links `individual papers` internally to `/related-papers`.
- The variable-name note appears after results and begins with a separate `Note:` label.
- The bottom wording begins: `When variable names are included in the variable details on this website...`
- The notes are intentionally separated and use light editorial accents rather than a rigid tinted box.

The instruction `Use the drop down menus to search for FIES variables` appears exactly once directly above `SEARCH BY` on the overview and every theme page.

### Filter rules

Overview filters:

- Theme.
- Paper.
- Measure.
- Clear all filters.

Theme-page filters:

- Paper.
- Measure.
- Clear all filters.

Rules:

- Multiple selections within a facet use OR.
- Different facets use AND.
- Only one dropdown is visually open at a time.
- Opening/closing a dropdown never clears selections.
- Active selections appear as removable chips.
- Measure choices are the 24 table titles only.
- The Measure menu is intentionally wider and taller than Theme/Paper.
- Measure options use two columns on larger screens and one column on mobile.
- The final Measure option is sentence-cased as `Pro-attitudinal knowledge of events and belief in false claims.`
- Only the dropdown label was recased; the underlying A4.7 table title remains unchanged.

Do not reintroduce free-text search, search scopes, method filters, internal facet-menu search boxes, or the old mobile Filters disclosure unless the user explicitly requests them.

## 9. Static export and GitHub Pages deployment

`next.config.ts` intentionally contains:

- `output: "export"`
- `trailingSlash: true`
- `images.unoptimized: true`
- `basePath` from `PAGES_BASE_PATH`
- matching `assetPrefix`

The production build script is deliberately:

```json
"build": "next build --webpack"
```

The Pages workflow follows the official Next.js GitHub Pages pattern:

1. Check out the repository.
2. Install pnpm 11.7 and Node 24.
3. Run `actions/configure-pages@v5` without `static_site_generator: next`.
4. Install frozen dependencies.
5. Run lint, generated-type TypeScript checks, and all tests.
6. Pass `steps.setup_pages.outputs.base_path` to the build as `PAGES_BASE_PATH`.
7. Verify expected trailing-slash export files and known content.
8. Upload and deploy `out/`.
9. Request deployed pages with trailing slashes and a commit-specific query string, then verify the header, A2.1 content, and datasets page.

Normal validation:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Simulated repository-subpath build:

```bash
PAGES_BASE_PATH=/us-2020-election-study-website pnpm build
```

`typecheck` intentionally runs `next typegen` before `tsc`. `next-env.d.ts` is ignored because Next.js regenerates it and it should not continually dirty the worktree.

At this handoff, the newest homepage changes passed:

- ESLint.
- Next generated-type TypeScript checks.
- All 16 test files / 101 tests.
- Normal Webpack static export.
- Simulated GitHub Pages subpath export.
- Desktop browser inspection.
- 375px-wide mobile inspection with no horizontal overflow.
- `git diff --check`.

## 10. Completed work since the July handoff

Major completed work includes:

- Expanded Study Publications from six to ten papers.
- Verified new publication metadata against publisher pages and standardized citations.
- Added exact publication dates and full-title date tie-breaking.
- Updated Untrustworthy from forthcoming to its published Science Advances record.
- Added compact inline author and abstract previews without altering source content.
- Added status tags and compact publication-page typography.
- Simplified citation dialogs and improved citation italics.
- Added Emotion's two-link publication chooser.
- Added the entire Study Datasets route from the supplied PDF and verified SOMAR/ICPSR metadata.
- Added 54 unique datasets, 67 associations, 11 paper groups, dataset filtering, summary previews, and citation dialogs.
- Added Study Datasets to the shared header and footer.
- Reworked variable guidance so both notes appear on the overview and all four theme pages.
- Improved Measure filtering size, responsiveness, and option capitalization.
- Removed Placeholder 1 and Placeholder 2 from visible navigation while retaining their routes.
- Added the linked project-page sentence to the shared footer.
- Repaired the GitHub Pages workflow, base-path handling, trailing-slash export, and post-deploy verification.
- Hardened production builds against stale Chrome asset caching by retaining Webpack and content-hashed assets.
- Added homepage publication and dataset sections and consolidated three oversized resource panels into one navigation panel.
- Replaced the homepage About publication card with an external Project overview card.

## 11. Past errors and rules that must not be repeated

### A. Do not let `actions/configure-pages` replace `next.config.ts`

A failed deployment used `actions/configure-pages` with `static_site_generator: next`. That generated a default configuration and overrode the project's TypeScript Next configuration. The export produced files such as `participation.html` while verification expected `participation/index.html`.

Keep the current workflow: configure Pages without that option, give the step an ID, and pass its `base_path` output through `PAGES_BASE_PATH`.

### B. Preserve trailing-slash routing

GitHub Pages serves static files, so direct navigation and refreshes depend on the deliberate `route/index.html` structure. Do not remove `trailingSlash: true`, change workflow checks to noncanonical paths, or test only client-side navigation.

### C. Do not break repository-subpath assets

The deployed site lives under `/us-2020-election-study-website`. Hard-coded root-relative asset behavior can make the header or JavaScript-driven tables disappear on Pages even while localhost works. Preserve `basePath`, `assetPrefix`, Next.js `Link`, and the simulated subpath build.

### D. Do not reintroduce stale Chrome assets

The GitHub Pages site once looked correct in another browser but lacked the header and tables in Chrome. Stale cached asset URLs were a major factor. Keep the production Webpack build, content-hashed assets, trailing-slash routes, and commit-specific post-deployment query checks. When diagnosing, compare the deployed HTML's asset filenames with the actual uploaded files and test in a clean Chrome profile/incognito window before changing application content.

### E. Do not assume a working localhost URL means a server exists

`Site can't be reached` usually means the development server stopped. Check port 3000 and restart it. If `EADDRINUSE` appears, use the existing process instead of starting another one.

### F. Do not edit inactive duplicate snapshots

Changes to `page 2.tsx` or `globals 2.css` do nothing to the live site. Edit `page.tsx` and `globals.css` only.

### G. Do not overwrite research wording with previews or regenerated text

- Author previews must be derived from `authors.slice(0, 3)`.
- Abstract and dataset-summary previews must be derived from exact whole-word prefixes.
- Expanded text must reconstruct the complete original content character-for-character.
- Publication metadata comes from `peer-reviewed-papers.ts` only.
- Dataset metadata comes from `study-datasets.ts` only.
- Operationalization raw content and curated summaries must remain separate.
- Do not silently change names, accents, punctuation, dates, DOIs, page references, or component lists.

### H. Do not sort same-date publications by nickname

The user explicitly chose alphabetical order by full paper title, not `studyLabel`.

### I. Do not invent missing records

Untrustworthy's dataset group is intentionally empty. Preserve its placeholder until a verified source is provided.

### J. Do not run destructive Git commands

Existing changes belong to the user. Never use `git reset --hard`, destructive checkout/restore commands, or broad deletion. Review and stage files intentionally only after explicit authorization.

### K. Keep deployment configuration separate from application content

When Pages differs from localhost, first inspect the workflow, base path, exported filenames, browser caching, and deployed assets. Do not rewrite working components or research data to compensate for a deployment/configuration problem.

## 12. Work still to be done

There is no unfinished requested feature in the local application. The known remaining work is operational and editorial:

1. **Review and commit the newest homepage redesign.** The changes are complete and tested but remain uncommitted in `src/app/page.tsx` and `src/components/site-publication-links.test.tsx`.
2. **Push and verify GitHub Pages only when the user requests it.** After deployment, check the home, publications, datasets, overview, and all four theme routes in Chrome as well as a clean/incognito session.
3. **Replace the temporary Medium URL.** Both the Project overview card and footer project-page link currently point to `https://medium.com/`; update them when the final project URL is supplied.
4. **Update `README.md`.** It is stale: it omits Study Publications and Study Datasets, describes an older filter system, still lists placeholder routes as primary routes, and says no repository/deployment is required.
5. **Optional cleanup after approval.** Decide whether to delete the inactive `page 2.tsx`, `globals 2.css`, and hidden placeholder routes. Do not remove them without asking.
6. **Maintain verified metadata over time.** Publication statuses, dates, citations, and SOMAR dataset versions can change. Verify authoritative publisher/ICPSR pages before future metadata edits.

## 13. Safe continuation checklist for a new chat

1. Read this entire handoff.
2. Run `git status --short` and preserve the two current homepage changes.
3. Read the active files and their tests before editing.
4. Use `apply_patch` for source changes.
5. Keep data-derived counts and ordering logic rather than hard-coding duplicated statistics.
6. Run lint, generated-type TypeScript checks, all tests, normal export, and simulated Pages export.
7. Browser-check desktop and mobile, including keyboard behavior and horizontal overflow.
8. For deployment issues, inspect base paths, generated files, and caches before changing application code.
9. Do not commit, push, deploy, or delete anything unless the user explicitly authorizes it.
