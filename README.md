# gh-heatmap

GitHub-style contribution heatmap — SVG generation, DOM component, and React wrapper.

[![npm](https://img.shields.io/npm/v/gh-heatmap)](https://www.npmjs.com/package/gh-heatmap)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- **SVG generation** — server-side, zero DOM dependency, embeddable in READMEs
- **DOM component** — vanilla JS heatmap with tooltips and click events
- **React wrapper** — drop-in `<ActivityHeatmap>` component
- **Built-in themes** — `dark`, `light`, `github`, `minimal` (or bring your own)
- **GitHub fetcher** — pull public commit data with no API token
- **Tree-shakeable** — subpath exports, `sideEffects: false`

## Install

```bash
npm install gh-heatmap
```

## Quick Start

### SVG (Server / Node.js)

```ts
import { generateHeatmapSVG, fetchPublicCommits } from 'gh-heatmap';

const { data } = await fetchPublicCommits('owner/repo', '2024-01-01', '2024-12-31');

const svg = generateHeatmapSVG(data, {
  theme: 'dark',
  showHeader: true,
  headerText: '{{count}} contributions in the last year',
});

// Serve as image/svg+xml, embed in <img>, or use in a README
```

### DOM (Vanilla JS)

```ts
import { Heatmap } from 'gh-heatmap/dom';

const heatmap = new Heatmap(document.getElementById('app')!, {
  endpoint: '/api/activity?repository=owner/repo',
});

heatmap.load();
```

### React

```tsx
import { ActivityHeatmap } from 'gh-heatmap/react';

function App() {
  return <ActivityHeatmap endpoint="/api/activity?repository=owner/repo" />;
}
```

## Subpath Exports

| Import                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `gh-heatmap`              | Core: SVG gen, themes, utils, fetcher, cache |
| `gh-heatmap/dom`          | DOM heatmap, calendar, tooltip           |
| `gh-heatmap/react`        | React `<ActivityHeatmap>` component      |

## SVG Options

```ts
generateHeatmapSVG(data, {
  theme: 'dark',           // 'dark' | 'light' | 'github' | 'minimal' | Theme
  cellSize: 10,            // pixels
  cellGap: 3,              // pixels
  borderRadius: 2,         // pixels
  weekStart: 0,            // 0 = Sunday, 1 = Monday
  showMonthLabels: true,
  showDayLabels: true,
  showLegend: true,
  showHeader: true,
  headerText: '{{count}} contributions in the last year',
  backgroundColor: 'transparent',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});
```

## Themes

Four built-in themes matching GitHub's palettes:

| Theme     | Empty     | Level 1   | Level 4   |
| --------- | --------- | --------- | --------- |
| `dark`    | `#161b22` | `#0e4429` | `#39d353` |
| `light`   | `#ebedf0` | `#9be9a8` | `#216e39` |
| `github`  | `#ebedf0` | `#9be9a8` | `#216e39` |
| `minimal` | `#f6f8fa` | `#d0d7de` | `#6e7781` |

Custom themes:

```ts
import { generateHeatmapSVG } from 'gh-heatmap';
import type { Theme } from 'gh-heatmap';

const custom: Theme = {
  colors: { empty: '#1a1a2e', level1: '#16213e', level2: '#0f3460', level3: '#533483', level4: '#e94560' },
  grid: { gap: 3, cellSize: 10, borderRadius: 2 },
  tooltip: { background: '#1a1a2e', text: '#fff', border: '#333' },
};

generateHeatmapSVG(data, { theme: custom });
```

## GitHub Fetcher

```ts
import { fetchPublicCommits } from 'gh-heatmap';

const result = await fetchPublicCommits(
  'facebook/react',      // owner/repo
  '2024-01-01',          // startDate
  '2024-12-31',          // endDate
  'gaearon',             // optional author filter
);

// result.data    → ActivityData[] (date + count)
// result.authors → { login, commits }[]
```

No API token required for public repositories. Rate-limited to ~60 req/hr (unauthenticated).

## Cache

```ts
import { MemoryCache } from 'gh-heatmap';

const cache = new MemoryCache<string>(60_000); // 60s TTL
cache.set('key', 'value');
cache.get('key'); // 'value' | null
```

## Development

```bash
npm install
npm run build      # tsup → dist/
npm test           # vitest
npm run typecheck  # tsc --noEmit
```

## License

MIT
