# U.S. 2020 Election Study Research Website

A local research website for exploring how outcomes were operationalized across papers in the U.S. 2020 Facebook and Instagram Election Study.

## Run locally

With Node 24 and pnpm 11.7 installed:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` - Home
- `/variable-operationalization` - Clickable research-theme overview
- `/variable-operationalization/polarization` - Polarization tables
- `/variable-operationalization/participation` - Participation tables
- `/variable-operationalization/trust` - Trust tables
- `/variable-operationalization/knowledge` - Knowledge tables
- `/placeholder-1` - Future content section
- `/placeholder-2` - Future content section

The variable operationalization library contains 24 tables and 90 paper-level records. It retains the PDF's `Paper`, `Questions used`, `Waves`, `Method`, and `Pages` columns while omitting the separate internal `Questions` notes column. Paper-specific components are presented as audited numbered summaries, and the complete source wording remains available in each record modal. Search can be scoped and combined with Theme, Paper, Measure, and Method filters.

## Validate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The static production export is written to `out/`.

## Future GitHub Pages publishing

The project is configured as a static Next.js export and includes a GitHub Pages workflow. When publishing is requested later, enable GitHub Pages with **GitHub Actions** as the source. The workflow handles repository subpaths automatically for project Pages sites.

No GitHub repository or deployment is required for local use.
