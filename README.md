# provenci-heatmap-activity

GitHub-style contribution heatmap — SVG generation, DOM component, and React wrapper.

[![npm](https://img.shields.io/npm/v/provenci-heatmap-activity)](https://www.npmjs.com/package/provenci-heatmap-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- **SVG generation** — server-side, zero DOM dependency, embeddable in READMEs
- **DOM component** — vanilla JS heatmap with tooltips and click events
- **React wrapper** — drop-in `<ActivityHeatmap>` component
- **Built-in themes** — `dark`, `light`, `github`, `minimal` (or bring your own)
- **GitHub fetcher** — pull public commit data with no API token (or private data with a token)
- **Tree-shakeable** — subpath exports, `sideEffects: false`

## Install

```bash
npm install provenci-heatmap-activity
```

## Quick Start

### SVG (Server / Node.js)

```ts
import { generateHeatmapSVG, fetchPublicCommits } from 'provenci-heatmap-activity';

// Fetches last 365 days by default
const { data } = await fetchPublicCommits('owner/repo');

const svg = generateHeatmapSVG(data, {
  theme: 'dark',
  showHeader: true,
  headerText: '{{count}} contributions in the last year',
});

// Serve as image/svg+xml, embed in <img>, or use in a README
```

### DOM (Vanilla JS)

```ts
import { Heatmap } from 'provenci-heatmap-activity/dom';

const heatmap = new Heatmap(document.getElementById('app')!, {
  endpoint: '/api/activity?repository=owner/repo',
});

heatmap.load();
```

### React

```tsx
import { ActivityHeatmap } from 'provenci-heatmap-activity/react';

function App() {
  return <ActivityHeatmap endpoint="/api/activity?repository=owner/repo" />;
}
```

## Subpath Exports

| Import                             | Description                              |
| ---------------------------------- | ---------------------------------------- |
| `provenci-heatmap-activity`        | Core: SVG gen, themes, utils, fetcher, cache |
| `provenci-heatmap-activity/dom`    | DOM heatmap, calendar, tooltip           |
| `provenci-heatmap-activity/react`  | React `<ActivityHeatmap>` component      |

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
  startDate: '2024-01-01', // Optional
  endDate: '2024-12-31',   // Optional
});
```

## Private Repositories & Rate Limits

By default, the library uses the unauthenticated GitHub API (limited to 60 requests/hour/IP, public repos only).

To access **private repositories** or increase your limit to **5,000 requests/hour**, set a `GITHUB_TOKEN` environment variable in your server environment:

```bash
# Example .env or Vercel Environment Variable
GITHUB_TOKEN=your_personal_access_token
```

The library will automatically detect this variable and use it in the `Authorization` header.

## GitHub Fetcher

```ts
import { fetchPublicCommits } from 'provenci-heatmap-activity';

const result = await fetchPublicCommits(
  'facebook/react',      // owner/repo
  '2024-01-01',          // optional startDate
  '2024-12-31',          // optional endDate
  'gaearon',             // optional author filter
);

// result.data    → ActivityData[] (date + count)
// result.authors → { login, commits }[]
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
import { generateHeatmapSVG } from 'provenci-heatmap-activity';
import type { Theme } from 'provenci-heatmap-activity';

const custom: Theme = {
  colors: { empty: '#1a1a2e', level1: '#16213e', level2: '#0f3460', level3: '#533483', level4: '#e94560' },
  grid: { gap: 3, cellSize: 10, borderRadius: 2 },
  tooltip: { background: '#1a1a2e', text: '#fff', border: '#333' },
};

generateHeatmapSVG(data, { theme: custom });
```

## Cache

```ts
import { MemoryCache } from 'provenci-heatmap-activity';

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
