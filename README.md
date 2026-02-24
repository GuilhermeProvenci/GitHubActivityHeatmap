# GitHub Activity Heatmap

A TypeScript library for generating GitHub-style contribution heatmaps from private repositories without exposing sensitive code or repository details.

## ✨ Features

- **Privacy-First** — Exposes only aggregated commit counts by date
- **Flexible Queries** — Filter by repository, author, branch, path
- **Multi-Mode** — Single repo, multi-author, multi-repository, or combined views
- **GitHub-Style UI** — Familiar heatmap visualization with themes
- **Framework Agnostic** — Vanilla JS core + React wrapper
- **Caching Layer** — Memory, File, or Redis strategies
- **TypeScript Native** — Full type safety across all packages

## 📦 Packages

| Package | Description |
|---------|-------------|
| `@gh-heatmap/core` | Shared types and utilities |
| `@gh-heatmap/backend` | GitHub API aggregation service |
| `@gh-heatmap/frontend` | Heatmap visualization components |

## 🚀 Quick Start

### Backend (Express)

```typescript
import express from 'express';
import { GitHubAggregator, createExpressHandler } from '@gh-heatmap/backend';

const app = express();

const aggregator = new GitHubAggregator({
  githubToken: process.env.GITHUB_TOKEN!,
  repository: 'myorg/myrepo',
  cache: { strategy: 'memory', ttl: 21600 },
});

app.use('/api', createExpressHandler(aggregator));
app.listen(3000);
```

### Frontend (Vanilla JS)

```typescript
import { Heatmap } from '@gh-heatmap/frontend';

const heatmap = new Heatmap(document.getElementById('heatmap'), {
  endpoint: '/api/activity',
  theme: 'github',
  showTooltip: true,
});

heatmap.load();
```

### Frontend (React)

```tsx
import { ActivityHeatmap } from '@gh-heatmap/frontend/react';

<ActivityHeatmap
  endpoint="/api/activity"
  config={{ theme: 'dark', showMonthLabels: true }}
/>
```

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

## 📁 Project Structure

```
packages/
  core/       — Types & utilities
  backend/    — GitHub API aggregation
  frontend/   — Heatmap components
examples/
  express-api/ — Express server example
  vanilla-js/  — Browser demo
```

## 🎨 Themes

Three built-in themes: `github` (light), `dark`, and `minimal`.

Custom themes are also supported via the `Theme` interface.

## 📄 License

MIT
