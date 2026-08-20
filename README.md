# Center for Science and Technology Studies

Site for the Center for Science and Technology Studies (CSTS) at Yonsei
University — [sci.yonsei.ac.kr](https://sci.yonsei.ac.kr).

Next.js 16 (App Router), static export, deployed to GitHub Pages via
[`.github/workflows/deploy-next.yml`](.github/workflows/deploy-next.yml) on
every push to `main`.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build     # static export to out/
```

## Content

- `content/people/`, `content/events/`, `content/scisquare/` — markdown pages
- `data/people.json`, `data/publications.json`, `data/history.json` — structured data
- `data/publications.json` is periodically synced from the
  [Yonsei DataLab site](https://datalab.yonsei.ac.kr) via that repo's
  `scripts/sync-center.mjs`.
