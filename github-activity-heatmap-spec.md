# GitHub Activity Heatmap Library
## Technical Specification & Architecture Document

**Version:** 1.0.0  
**Status:** Implementation Reference  
**License:** MIT (Open Source)  
**Language:** TypeScript  

---

## 🎯 Document Purpose

This document serves as a **complete implementation reference** for building the GitHub Activity Heatmap library. It contains:

- ✅ **Complete architecture specification**
- ✅ **Detailed API contracts and interfaces**
- ✅ **TypeScript type definitions**
- ✅ **Implementation patterns and examples**
- ✅ **Test specifications**
- ✅ **Deployment guidelines**

**For AI Implementation (Claude Code):**
This specification is designed to be used as context for AI-assisted development. Each section contains:
- Clear implementation requirements
- Expected behavior and edge cases
- Code examples showing the desired API
- Type definitions for type safety

**Implementation Order:**
1. Start with `packages/core` (types and utilities)
2. Then `packages/backend` (aggregation service)
3. Then `packages/frontend` (visualization)
4. Finally `packages/cli` (tooling)

---

## 📋 Implementation Checklist

### Phase 1: Core Foundation
- [ ] Setup monorepo structure with pnpm workspaces
- [ ] Create `packages/core` with type definitions
- [ ] Implement date utilities and validation
- [ ] Setup TypeScript configurations
- [ ] Setup ESLint and Prettier

### Phase 2: Backend Service
- [ ] Implement `GitHubAggregator` class
- [ ] Create cache strategies (Memory/File/Redis)
- [ ] Implement rate limiter
- [ ] Create Express adapter
- [ ] Create Fastify adapter
- [ ] Add comprehensive error handling
- [ ] Write unit tests for aggregation logic

### Phase 3: Frontend Component
- [ ] Create base `Heatmap` class (vanilla JS)
- [ ] Implement calendar grid rendering
- [ ] Add tooltip functionality
- [ ] Create theme system
- [ ] Implement React wrapper
- [ ] Implement Vue wrapper
- [ ] Write component tests

### Phase 4: Integration & Polish
- [ ] Create example projects (Express, Next.js, Vanilla)
- [ ] Write comprehensive documentation
- [ ] Setup CI/CD pipeline
- [ ] Create deployment examples
- [ ] Performance optimization
- [ ] Accessibility audit

---

## 📝 Implementation Notes for AI Developers

### Key Implementation Requirements

1. **Type Safety First**
   - All code must use TypeScript with strict mode enabled
   - No `any` types without explicit justification
   - Export all interfaces and types from `@gh-heatmap/core`

2. **Error Handling Pattern**
   ```typescript
   // Always use custom error classes
   class RateLimitError extends Error {
     constructor(message: string, public resetAt: Date) {
       super(message);
       this.name = 'RateLimitError';
     }
   }
   ```

3. **Async/Await Convention**
   - Use async/await, not callbacks or `.then()`
   - Always wrap in try-catch for user-facing functions
   - Propagate errors with context

4. **Cache Key Generation**
   ```typescript
   // Must be deterministic and unique per query
   function generateCacheKey(options: QueryOptions): string {
     // Implementation in cache/CacheStrategy.ts
   }
   ```

5. **GitHub API Pagination**
   - Always paginate (max 100 per page)
   - Update rate limiter after each request
   - Handle 304 Not Modified for conditional requests

6. **Frontend Rendering**
   - Use native DOM APIs (no jQuery or heavy frameworks)
   - Support SSR (no `window` access in constructor)
   - Implement virtual scrolling for long date ranges

7. **Testing Requirements**
   - Unit tests: 80%+ coverage
   - Integration tests for API endpoints
   - E2E tests for frontend components
   - Mock GitHub API responses

8. **Documentation Standards**
   - JSDoc for all public APIs
   - README in each package
   - Code examples in documentation
   - API reference generated from types

### Critical Security Notes

⚠️ **Never expose these in frontend:**
- GitHub tokens
- Repository internal structure
- Commit messages or hashes
- Author emails (only usernames if filtered)

✅ **Safe to expose:**
- Date (YYYY-MM-DD)
- Count (integer)
- Public usernames (if explicitly filtered)

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Architecture](#architecture)
4. [Backend Module](#backend-module)
5. [Frontend Module](#frontend-module)
6. [API Specification](#api-specification)
7. [Data Models](#data-models)
8. [Security Considerations](#security-considerations)
9. [Installation & Usage](#installation--usage)
10. [Configuration](#configuration)
11. [Performance & Optimization](#performance--optimization)
12. [Testing Strategy](#testing-strategy)
13. [Roadmap](#roadmap)

---

## 1. Overview

### 1.1 Purpose & Implementation Summary

**What This Library Does:**
A TypeScript library for generating GitHub-style contribution heatmaps from private repositories without exposing sensitive code or repository details. The library provides both backend aggregation services and frontend rendering components, enabling developers to showcase project activity on institutional websites while maintaining complete privacy.

**Implementation Priority for Claude Code:**

```
Priority 1 (Core Foundation):
├── packages/core/src/types/          # Type definitions
├── packages/core/src/utils/          # Shared utilities
└── packages/backend/src/aggregator/  # GitHub API integration

Priority 2 (Backend Services):
├── packages/backend/src/cache/       # Caching layer
├── packages/backend/src/rate-limiter/# Rate limiting
└── packages/backend/src/api/         # Framework adapters

Priority 3 (Frontend):
├── packages/frontend/src/components/ # Core Heatmap
├── packages/frontend/src/styles/     # Theming
└── packages/frontend/src/renderers/  # Framework wrappers

Priority 4 (Developer Tools):
└── packages/cli/                     # CLI tooling
```

**Quick Implementation Guide:**

1. **Start Here:** Create `packages/core/src/types/activity.ts`
2. **Then:** Implement `packages/backend/src/aggregator/GitHubAggregator.ts`
3. **Test It:** Create basic Express endpoint to verify GitHub API integration
4. **Frontend:** Build `packages/frontend/src/components/Heatmap.ts`
5. **Polish:** Add caching, error handling, and tests

**Key Files to Implement (in order):**

```typescript
// 1. Core types (foundation)
packages/core/src/types/activity.ts
packages/core/src/types/config.ts
packages/core/src/utils/date.ts
packages/core/src/utils/validation.ts

// 2. Backend aggregation (MVP)
packages/backend/src/aggregator/GitHubAggregator.ts
packages/backend/src/cache/CacheStrategy.ts
packages/backend/src/cache/MemoryCache.ts
packages/backend/src/api/express.ts

// 3. Frontend rendering (MVP)
packages/frontend/src/components/Heatmap.ts
packages/frontend/src/styles/themes.ts
packages/frontend/src/components/Calendar.ts

// 4. Examples (verification)
examples/express-api/server.ts
examples/vanilla-js/index.html
```

---

### 1.2 Key Features

- ✅ **Privacy-First**: Exposes only aggregated commit counts by date
- ✅ **Flexible Queries**: Filter by repository, author, branch, path, or custom criteria
- ✅ **Multi-Mode Aggregation**: Repository-wide, per-author, per-branch, or combined views
- ✅ **GitHub-Style Visualization**: Familiar heatmap interface
- ✅ **Framework Agnostic**: Works with React, Vue, Svelte, vanilla JS
- ✅ **Caching Layer**: Intelligent rate limit management with query-specific cache keys
- ✅ **TypeScript Native**: Full type safety
- ✅ **Zero Dependencies**: Minimal frontend footprint
- ✅ **Customizable**: Theming, date ranges, intensity scales, query modes

### 1.3 Use Cases

- Institutional websites showcasing project evolution
- SaaS product pages demonstrating active development
- Portfolio projects highlighting consistency
- Internal dashboards for team activity tracking
- Developer portfolios showing personal contribution patterns
- Multi-repository organization dashboards
- Team performance analytics (aggregated by author)
- Release cycle visualization (filtered by branch)

---

---

## 🚀 Quick Start: Package Configurations

### Root package.json (Monorepo)

```json
{
  "name": "github-activity-heatmap",
  "version": "1.0.0",
  "private": true,
  "description": "GitHub-style activity heatmap library",
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "packageManager": "pnpm@8.0.0"
}
```

### packages/core/package.json

```json
{
  "name": "@gh-heatmap/core",
  "version": "1.0.0",
  "description": "Core types and utilities for GitHub Activity Heatmap",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest",
    "clean": "rm -rf dist"
  },
  "keywords": ["github", "heatmap", "activity", "types"],
  "license": "MIT"
}
```

### packages/backend/package.json

```json
{
  "name": "@gh-heatmap/backend",
  "version": "1.0.0",
  "description": "Backend aggregation service for GitHub Activity Heatmap",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@gh-heatmap/core": "workspace:*",
    "@octokit/rest": "^20.0.0"
  },
  "peerDependencies": {
    "express": "^4.18.0",
    "fastify": "^4.0.0",
    "ioredis": "^5.3.0"
  },
  "peerDependenciesMeta": {
    "express": { "optional": true },
    "fastify": { "optional": true },
    "ioredis": { "optional": true }
  },
  "keywords": ["github", "api", "aggregation"],
  "license": "MIT"
}
```

### packages/frontend/package.json

```json
{
  "name": "@gh-heatmap/frontend",
  "version": "1.0.0",
  "description": "Frontend components for GitHub Activity Heatmap",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "require": "./dist/react.js",
      "import": "./dist/react.mjs",
      "types": "./dist/react.d.ts"
    },
    "./vue": {
      "require": "./dist/vue.js",
      "import": "./dist/vue.mjs",
      "types": "./dist/vue.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "scripts": {
    "build": "tsup src/index.ts src/renderers/react.tsx src/renderers/vue.ts --format cjs,esm --dts && npm run build:css",
    "build:css": "postcss src/styles/default.css -o dist/styles.css",
    "test": "vitest",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@gh-heatmap/core": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "vue": "^3.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "vue": { "optional": true }
  },
  "keywords": ["github", "heatmap", "visualization", "component"],
  "license": "MIT"
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'examples/*'
```

### tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "exclude": ["node_modules", "dist"]
}
```

---

## 2. Core Principles

### 2.1 Privacy

**Absolute Privacy**: The library NEVER exposes:
- Commit messages
- Commit hashes
- Author information
- Branch names
- File paths or contents
- Repository structure

**Only Exposed Data**: Date + count aggregation per day.

### 2.2 Separation of Concerns

```
┌─────────────────────────────────────────────────────────────┐
│                         Your Application                     │
├─────────────────────────────────────────────────────────────┤
│  Backend Service          │         Frontend Component       │
│  (Private, Server-Side)   │         (Public, Browser)        │
├───────────────────────────┼──────────────────────────────────┤
│  - GitHub API Access      │  - Renders Heatmap               │
│  - Token Management       │  - Consumes JSON endpoint        │
│  - Data Aggregation       │  - No GitHub dependency          │
│  - Caching Layer          │  - Framework agnostic            │
└───────────────────────────┴──────────────────────────────────┘
```

### 2.3 Performance

- **Aggressive Caching**: Default 6-hour cache for aggregated data
- **Lazy Loading**: Fetch only visible date ranges
- **Pagination Support**: Handle large repositories efficiently
- **Rate Limit Awareness**: Built-in GitHub API quota management

---

## 3. Architecture

### 3.1 Package Structure

```
github-activity-heatmap/
├── packages/
│   ├── core/                    # Shared types & utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── activity.ts
│   │   │   │   ├── config.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── date.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/                 # Backend aggregation service
│   │   ├── src/
│   │   │   ├── aggregator/
│   │   │   │   ├── GitHubAggregator.ts
│   │   │   │   └── index.ts
│   │   │   ├── cache/
│   │   │   │   ├── CacheStrategy.ts
│   │   │   │   ├── MemoryCache.ts
│   │   │   │   ├── FileCache.ts
│   │   │   │   ├── RedisCache.ts
│   │   │   │   └── index.ts
│   │   │   ├── api/
│   │   │   │   ├── express.ts
│   │   │   │   ├── fastify.ts
│   │   │   │   └── index.ts
│   │   │   ├── rate-limiter/
│   │   │   │   ├── RateLimiter.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── frontend/                # Frontend rendering components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Heatmap.ts
│   │   │   │   ├── Calendar.ts
│   │   │   │   ├── Tooltip.ts
│   │   │   │   └── index.ts
│   │   │   ├── renderers/
│   │   │   │   ├── VanillaRenderer.ts
│   │   │   │   ├── ReactRenderer.tsx
│   │   │   │   ├── VueRenderer.vue
│   │   │   │   └── index.ts
│   │   │   ├── styles/
│   │   │   │   ├── themes.ts
│   │   │   │   ├── default.css
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                     # CLI tool for quick setup
│       ├── src/
│       │   ├── commands/
│       │   │   ├── init.ts
│       │   │   ├── generate.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── examples/
│   ├── express-api/
│   ├── next-js/
│   ├── vanilla-js/
│   └── README.md
│
├── docs/
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── examples.md
│   └── contributing.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── publish.yml
│
├── package.json              # Monorepo root
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
├── LICENSE
└── README.md
```

### 3.2 Technology Stack

**Backend:**
- TypeScript 5.x
- Octokit (GitHub API client)
- Optional framework adapters (Express, Fastify, etc.)

**Frontend:**
- Pure TypeScript/JavaScript (no framework required)
- Optional React/Vue wrappers
- CSS modules for styling

**Build Tools:**
- pnpm (workspace management)
- tsup (bundling)
- vitest (testing)

**Infrastructure:**
- Optional Redis for production caching
- File system cache for simple deployments
- Memory cache for development

---

## 4. Backend Module

### 4.1 GitHubAggregator Core

```typescript
// packages/backend/src/aggregator/GitHubAggregator.ts

import { Octokit } from '@octokit/rest';
import type { ActivityData, AggregatorConfig, QueryOptions } from '@gh-heatmap/core';

export class GitHubAggregator {
  private octokit: Octokit;
  private config: AggregatorConfig;

  constructor(config: AggregatorConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.githubToken,
    });
  }

  /**
   * Aggregates commit activity from repository with flexible filtering
   * @param options - Query options for filtering commits
   * @returns Array of daily activity counts
   */
  async aggregateActivity(options: QueryOptions): Promise<ActivityData[]> {
    const commits = await this.fetchCommits(options);
    return this.aggregateByDate(commits);
  }

  /**
   * Fetches commits with advanced filtering
   */
  private async fetchCommits(options: QueryOptions) {
    const {
      startDate,
      endDate,
      repository = this.config.repository,
      author,
      branch,
      path,
    } = options;

    const [owner, repo] = repository.split('/');
    
    const params: any = {
      owner,
      repo,
      since: startDate,
      until: endDate,
      per_page: 100,
    };

    // Apply filters
    if (author) params.author = author;
    if (branch) params.sha = branch;
    if (path) params.path = path;

    return this.paginateCommits(params);
  }

  /**
   * Handles pagination for large commit histories
   */
  private async paginateCommits(params: any): Promise<any[]> {
    const commits: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.octokit.repos.listCommits({
        ...params,
        page,
      });

      commits.push(...response.data);
      hasMore = response.data.length === 100;
      page++;

      // Update rate limiter
      this.rateLimiter.updateFromHeaders(response.headers);
    }

    return commits;
  }

  /**
   * Aggregates commits by date
   */
  private aggregateByDate(commits: any[]): ActivityData[] {
    const activityMap = new Map<string, number>();

    for (const commit of commits) {
      const date = commit.commit.author.date.split('T')[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    }

    return Array.from(activityMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Gets activity summary statistics
   */
  async getActivitySummary(options: QueryOptions): Promise<ActivitySummary> {
    const data = await this.aggregateActivity(options);
    
    return {
      totalCommits: data.reduce((sum, d) => sum + d.count, 0),
      activeDays: data.filter(d => d.count > 0).length,
      longestStreak: this.calculateLongestStreak(data),
      currentStreak: this.calculateCurrentStreak(data),
      averageCommitsPerDay: this.calculateAverage(data),
      mostActiveDay: this.findMostActiveDay(data),
    };
  }

  /**
   * Aggregates activity across multiple authors
   */
  async aggregateByAuthors(
    authors: string[],
    options: Omit<QueryOptions, 'author'>
  ): Promise<Map<string, ActivityData[]>> {
    const results = new Map<string, ActivityData[]>();

    for (const author of authors) {
      const data = await this.aggregateActivity({
        ...options,
        author,
      });
      results.set(author, data);
    }

    return results;
  }

  /**
   * Aggregates activity across multiple repositories
   */
  async aggregateByRepositories(
    repositories: string[],
    options: Omit<QueryOptions, 'repository'>
  ): Promise<Map<string, ActivityData[]>> {
    const results = new Map<string, ActivityData[]>();

    for (const repository of repositories) {
      const data = await this.aggregateActivity({
        ...options,
        repository,
      });
      results.set(repository, data);
    }

    return results;
  }

  /**
   * Combines activity from multiple sources into unified view
   */
  async aggregateCombined(
    queries: QueryOptions[]
  ): Promise<ActivityData[]> {
    const allData = await Promise.all(
      queries.map(query => this.aggregateActivity(query))
    );

    // Merge all activities by date
    const merged = new Map<string, number>();
    
    for (const dataset of allData) {
      for (const { date, count } of dataset) {
        merged.set(date, (merged.get(date) || 0) + count);
      }
    }

    return Array.from(merged.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
```

### 4.2 Cache Strategies

```typescript
// packages/backend/src/cache/CacheStrategy.ts

export interface CacheStrategy {
  get(key: string): Promise<ActivityData[] | null>;
  set(key: string, value: ActivityData[], ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Generates cache key from query options
 */
export function generateCacheKey(options: QueryOptions): string {
  const parts = [
    options.repository || 'default',
    options.startDate,
    options.endDate,
  ];

  if (options.author) parts.push(`author:${options.author}`);
  if (options.branch) parts.push(`branch:${options.branch}`);
  if (options.path) parts.push(`path:${options.path}`);

  return parts.join('::');
}

// Memory cache (default, simple deployments)
export class MemoryCache implements CacheStrategy {
  private cache = new Map<string, { data: ActivityData[]; expires: number }>();
  
  async get(key: string): Promise<ActivityData[] | null> {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  async set(key: string, value: ActivityData[], ttl: number = 21600): Promise<void> {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + ttl * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// File cache (persistent, no external dependencies)
export class FileCache implements CacheStrategy {
  constructor(private cacheDir: string) {}
  
  async get(key: string): Promise<ActivityData[] | null> {
    const filePath = this.getFilePath(key);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, expires } = JSON.parse(content);
      
      if (Date.now() > expires) {
        await this.delete(key);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }

  async set(key: string, value: ActivityData[], ttl: number = 21600): Promise<void> {
    const filePath = this.getFilePath(key);
    const content = JSON.stringify({
      data: value,
      expires: Date.now() + ttl * 1000,
    });
    
    await fs.mkdir(this.cacheDir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getFilePath(key);
    try {
      await fs.unlink(filePath);
    } catch {
      // File doesn't exist
    }
  }

  async clear(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      await Promise.all(
        files.map(file => fs.unlink(path.join(this.cacheDir, file)))
      );
    } catch {
      // Directory doesn't exist
    }
  }

  private getFilePath(key: string): string {
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    return path.join(this.cacheDir, `${hash}.json`);
  }
}

// Redis cache (production, distributed systems)
export class RedisCache implements CacheStrategy {
  constructor(private redisClient: RedisClient) {}
  
  async get(key: string): Promise<ActivityData[] | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: ActivityData[], ttl: number = 21600): Promise<void> {
    await this.redisClient.setex(key, ttl, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async clear(): Promise<void> {
    await this.redisClient.flushdb();
  }
}
```

### 4.3 Rate Limiter

```typescript
// packages/backend/src/rate-limiter/RateLimiter.ts

export class RateLimiter {
  private remaining: number = 5000;
  private resetAt: Date = new Date();

  /**
   * Checks if request can proceed based on GitHub rate limits
   */
  async checkLimit(): Promise<boolean> {
    if (this.remaining <= 100) {
      const now = new Date();
      if (now < this.resetAt) {
        throw new RateLimitError(
          `Rate limit near exhaustion. Resets at ${this.resetAt.toISOString()}`
        );
      }
    }
    return true;
  }

  updateFromHeaders(headers: Record<string, string>): void {
    this.remaining = parseInt(headers['x-ratelimit-remaining'] || '5000', 10);
    this.resetAt = new Date(
      parseInt(headers['x-ratelimit-reset'] || '0', 10) * 1000
    );
  }
}
```

### 4.4 Framework Adapters

#### Express Adapter

```typescript
// packages/backend/src/api/express.ts

import express from 'express';
import { GitHubAggregator } from '../aggregator';
import { generateCacheKey } from '../cache';

export function createExpressHandler(aggregator: GitHubAggregator) {
  const router = express.Router();

  router.get('/activity', async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        repository,
        author,
        branch,
        path,
      } = req.query;
      
      const data = await aggregator.aggregateActivity({
        startDate: startDate as string,
        endDate: endDate as string,
        repository: repository as string | undefined,
        author: author as string | undefined,
        branch: branch as string | undefined,
        path: path as string | undefined,
      });

      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Multi-author aggregation
  router.post('/activity/by-authors', async (req, res) => {
    try {
      const { authors, ...options } = req.body;
      
      const data = await aggregator.aggregateByAuthors(authors, options);
      
      res.json({
        data: Object.fromEntries(data),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Multi-repository aggregation
  router.post('/activity/by-repositories', async (req, res) => {
    try {
      const { repositories, ...options } = req.body;
      
      const data = await aggregator.aggregateByRepositories(repositories, options);
      
      res.json({
        data: Object.fromEntries(data),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Combined query aggregation
  router.post('/activity/combined', async (req, res) => {
    try {
      const { queries } = req.body;
      
      const data = await aggregator.aggregateCombined(queries);
      
      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Activity summary
  router.get('/activity/summary', async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        repository,
        author,
        branch,
        path,
      } = req.query;
      
      const summary = await aggregator.getActivitySummary({
        startDate: startDate as string,
        endDate: endDate as string,
        repository: repository as string | undefined,
        author: author as string | undefined,
        branch: branch as string | undefined,
        path: path as string | undefined,
      });

      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
```

#### Fastify Adapter

```typescript
// packages/backend/src/api/fastify.ts

import type { FastifyInstance } from 'fastify';
import { GitHubAggregator } from '../aggregator';
import type { QueryOptions } from '@gh-heatmap/core';

export async function registerFastifyRoutes(
  fastify: FastifyInstance,
  aggregator: GitHubAggregator
) {
  // Single query endpoint
  fastify.get<{
    Querystring: QueryOptions;
  }>('/activity', async (request, reply) => {
    const data = await aggregator.aggregateActivity(request.query);
    return { data };
  });

  // Multi-author endpoint
  fastify.post<{
    Body: { authors: string[] } & Omit<QueryOptions, 'author'>;
  }>('/activity/by-authors', async (request, reply) => {
    const { authors, ...options } = request.body;
    const data = await aggregator.aggregateByAuthors(authors, options);
    return { data: Object.fromEntries(data) };
  });

  // Multi-repository endpoint
  fastify.post<{
    Body: { repositories: string[] } & Omit<QueryOptions, 'repository'>;
  }>('/activity/by-repositories', async (request, reply) => {
    const { repositories, ...options } = request.body;
    const data = await aggregator.aggregateByRepositories(repositories, options);
    return { data: Object.fromEntries(data) };
  });

  // Combined queries endpoint
  fastify.post<{
    Body: { queries: QueryOptions[] };
  }>('/activity/combined', async (request, reply) => {
    const { queries } = request.body;
    const data = await aggregator.aggregateCombined(queries);
    return { data };
  });

  // Summary endpoint
  fastify.get<{
    Querystring: QueryOptions;
  }>('/activity/summary', async (request, reply) => {
    const summary = await aggregator.getActivitySummary(request.query);
    return { summary };
  });
}
```

---

## 5. Frontend Module

### 5.1 Core Heatmap Component

```typescript
// packages/frontend/src/components/Heatmap.ts

import type { ActivityData, HeatmapConfig } from '@gh-heatmap/core';

export class Heatmap {
  private container: HTMLElement;
  private config: HeatmapConfig;
  private data: ActivityData[] = [];

  constructor(container: HTMLElement, config: HeatmapConfig) {
    this.container = container;
    this.config = config;
  }

  /**
   * Loads activity data from endpoint
   */
  async load(endpoint: string): Promise<void> {
    const response = await fetch(endpoint);
    const json = await response.json();
    this.data = json.data;
    this.render();
  }

  /**
   * Renders the heatmap visualization
   */
  private render(): void {
    const calendar = this.generateCalendar();
    this.container.innerHTML = '';
    this.container.appendChild(calendar);
  }

  private generateCalendar(): HTMLElement {
    // Implementation creates the grid structure
  }

  private getIntensityColor(count: number): string {
    // Returns color based on activity intensity
  }
}
```

### 5.2 React Wrapper

```typescript
// packages/frontend/src/renderers/ReactRenderer.tsx

import React, { useEffect, useRef } from 'react';
import { Heatmap } from '../components/Heatmap';
import type { HeatmapConfig } from '@gh-heatmap/core';

export interface ActivityHeatmapProps {
  endpoint: string;
  config?: Partial<HeatmapConfig>;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  endpoint,
  config = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<Heatmap | null>(null);

  useEffect(() => {
    if (containerRef.current && !heatmapRef.current) {
      heatmapRef.current = new Heatmap(containerRef.current, {
        ...defaultConfig,
        ...config,
      });
      heatmapRef.current.load(endpoint);
    }
  }, [endpoint, config]);

  return <div ref={containerRef} className="gh-activity-heatmap" />;
};
```

### 5.3 Vue Wrapper

```vue
<!-- packages/frontend/src/renderers/VueRenderer.vue -->

<template>
  <div ref="containerRef" class="gh-activity-heatmap"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Heatmap } from '../components/Heatmap';
import type { HeatmapConfig } from '@gh-heatmap/core';

interface Props {
  endpoint: string;
  config?: Partial<HeatmapConfig>;
}

const props = defineProps<Props>();
const containerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (containerRef.value) {
    const heatmap = new Heatmap(containerRef.value, {
      ...defaultConfig,
      ...props.config,
    });
    heatmap.load(props.endpoint);
  }
});
</script>
```

### 5.4 Theming System

```typescript
// packages/frontend/src/styles/themes.ts

export interface Theme {
  colors: {
    empty: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  grid: {
    gap: number;
    cellSize: number;
    borderRadius: number;
  };
  tooltip: {
    background: string;
    text: string;
    border: string;
  };
}

export const themes: Record<string, Theme> = {
  github: {
    colors: {
      empty: '#ebedf0',
      level1: '#9be9a8',
      level2: '#40c463',
      level3: '#30a14e',
      level4: '#216e39',
    },
    grid: {
      gap: 3,
      cellSize: 11,
      borderRadius: 2,
    },
    tooltip: {
      background: '#24292e',
      text: '#ffffff',
      border: '#1b1f23',
    },
  },
  
  dark: {
    colors: {
      empty: '#161b22',
      level1: '#0e4429',
      level2: '#006d32',
      level3: '#26a641',
      level4: '#39d353',
    },
    grid: {
      gap: 3,
      cellSize: 11,
      borderRadius: 2,
    },
    tooltip: {
      background: '#0d1117',
      text: '#c9d1d9',
      border: '#30363d',
    },
  },

  minimal: {
    colors: {
      empty: '#f6f8fa',
      level1: '#d0d7de',
      level2: '#afb8c1',
      level3: '#8c959f',
      level4: '#6e7781',
    },
    grid: {
      gap: 2,
      cellSize: 10,
      borderRadius: 1,
    },
    tooltip: {
      background: '#ffffff',
      text: '#24292e',
      border: '#d0d7de',
    },
  },
};
```

---

## 6. API Specification

### 6.1 Backend API Endpoints

#### GET `/api/activity`

**Description**: Retrieves aggregated commit activity for a date range with flexible filtering.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startDate` | `string` | No | 365 days ago | ISO 8601 date (YYYY-MM-DD) |
| `endDate` | `string` | No | Today | ISO 8601 date (YYYY-MM-DD) |
| `repository` | `string` | No* | From config | Format: `owner/repo` |
| `author` | `string` | No | All authors | GitHub username or email |
| `branch` | `string` | No | Default branch | Branch name (e.g., `main`, `develop`) |
| `path` | `string` | No | All paths | File or directory path to filter commits |

\* Required if multi-repository support is enabled

**Examples:**

```bash
# Repository-wide activity
GET /api/activity?startDate=2024-01-01&endDate=2024-12-31

# Specific author's activity
GET /api/activity?author=john.doe&startDate=2024-01-01

# Activity on specific branch
GET /api/activity?branch=develop&startDate=2024-01-01

# Activity for specific path
GET /api/activity?path=src/components&startDate=2024-01-01

# Combined filters
GET /api/activity?author=john.doe&branch=main&path=src/
```

**Response Format:**

```json
{
  "data": [
    {
      "date": "2025-01-15",
      "count": 5
    },
    {
      "date": "2025-01-16",
      "count": 3
    }
  ],
  "meta": {
    "startDate": "2024-02-23",
    "endDate": "2025-02-23",
    "totalCommits": 847,
    "cachedAt": "2025-02-23T10:30:00Z",
    "filters": {
      "repository": "myorg/myrepo",
      "author": "john.doe",
      "branch": "main"
    }
  }
}
```

**Error Responses:**

```json
// 400 Bad Request
{
  "error": "InvalidDateRange",
  "message": "startDate must be before endDate"
}

// 404 Not Found
{
  "error": "AuthorNotFound",
  "message": "No commits found for author 'john.doe'"
}

// 429 Too Many Requests
{
  "error": "RateLimitExceeded",
  "message": "GitHub API rate limit exceeded. Resets at 2025-02-23T11:00:00Z"
}

// 500 Internal Server Error
{
  "error": "AggregationFailed",
  "message": "Failed to fetch commits from GitHub API"
}
```

#### POST `/api/activity/by-authors`

**Description**: Aggregates activity for multiple authors separately.

**Request Body:**

```json
{
  "authors": ["john.doe", "jane.smith", "bob.jones"],
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "repository": "myorg/myrepo",
  "branch": "main"
}
```

**Response Format:**

```json
{
  "data": {
    "john.doe": [
      { "date": "2024-01-15", "count": 5 },
      { "date": "2024-01-16", "count": 3 }
    ],
    "jane.smith": [
      { "date": "2024-01-15", "count": 2 },
      { "date": "2024-01-17", "count": 4 }
    ],
    "bob.jones": [
      { "date": "2024-01-16", "count": 1 }
    ]
  },
  "meta": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "authors": 3
  }
}
```

#### POST `/api/activity/by-repositories`

**Description**: Aggregates activity across multiple repositories.

**Request Body:**

```json
{
  "repositories": ["myorg/repo1", "myorg/repo2", "myorg/repo3"],
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "author": "john.doe"
}
```

**Response Format:**

```json
{
  "data": {
    "myorg/repo1": [
      { "date": "2024-01-15", "count": 5 }
    ],
    "myorg/repo2": [
      { "date": "2024-01-15", "count": 3 }
    ],
    "myorg/repo3": [
      { "date": "2024-01-16", "count": 2 }
    ]
  },
  "meta": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "repositories": 3
  }
}
```

#### POST `/api/activity/combined`

**Description**: Combines activity from multiple queries into a single unified view.

**Request Body:**

```json
{
  "queries": [
    {
      "repository": "myorg/repo1",
      "author": "john.doe",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    },
    {
      "repository": "myorg/repo2",
      "author": "john.doe",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  ]
}
```

**Response Format:**

```json
{
  "data": [
    { "date": "2024-01-15", "count": 8 },
    { "date": "2024-01-16", "count": 5 }
  ],
  "meta": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "totalQueries": 2,
    "totalCommits": 847
  }
}
```

#### GET `/api/activity/summary`

**Description**: Returns high-level statistics about repository activity with filtering support.

**Query Parameters:** Same as `/api/activity`

**Response Format:**

```json
{
  "summary": {
    "totalCommits": 847,
    "activeDays": 234,
    "longestStreak": 42,
    "currentStreak": 7,
    "averageCommitsPerDay": 2.3,
    "mostActiveDay": {
      "date": "2025-01-20",
      "count": 15
    }
  },
  "filters": {
    "author": "john.doe",
    "branch": "main"
  }
}
```

### 6.2 Frontend Component API

#### Constructor Options

```typescript
interface HeatmapConfig {
  // Data source
  endpoint: string;
  
  // Query filters
  queryOptions?: {
    startDate?: string;
    endDate?: string;
    repository?: string;
    author?: string;
    branch?: string;
    path?: string;
  };
  
  // Date range (deprecated in favor of queryOptions)
  startDate?: string;
  endDate?: string;
  
  // Visual customization
  theme?: 'github' | 'dark' | 'minimal' | Theme;
  cellSize?: number;
  cellGap?: number;
  
  // Interaction
  showTooltip?: boolean;
  tooltipFormatter?: (data: ActivityData) => string;
  onClick?: (data: ActivityData) => void;
  
  // Labels
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  weekStart?: 0 | 1; // 0 = Sunday, 1 = Monday
  
  // Loading & Error
  loadingText?: string;
  errorText?: string;
  onError?: (error: Error) => void;
  
  // Advanced: Multi-mode support
  mode?: 'single' | 'multi-author' | 'multi-repository' | 'combined';
  multiConfig?: {
    authors?: string[];
    repositories?: string[];
    queries?: QueryOptions[];
  };
}
```

#### Methods

```typescript
class Heatmap {
  // Initialization
  constructor(container: HTMLElement, config: HeatmapConfig)
  
  // Data management
  load(endpoint?: string): Promise<void>
  refresh(): Promise<void>
  setData(data: ActivityData[]): void
  
  // Query management
  updateQuery(options: Partial<QueryOptions>): Promise<void>
  setAuthor(author: string | null): Promise<void>
  setBranch(branch: string | null): Promise<void>
  setPath(path: string | null): Promise<void>
  clearFilters(): Promise<void>
  
  // Visual updates
  setTheme(theme: string | Theme): void
  setDateRange(startDate: string, endDate: string): void
  
  // Multi-mode methods
  loadMultiAuthor(authors: string[]): Promise<void>
  loadMultiRepository(repositories: string[]): Promise<void>
  loadCombined(queries: QueryOptions[]): Promise<void>
  
  // Lifecycle
  destroy(): void
}
```

#### Usage Examples

```typescript
// Single query with filters
const heatmap = new Heatmap(container, {
  endpoint: '/api/activity',
  queryOptions: {
    author: 'john.doe',
    branch: 'main',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
});

// Dynamic filter updates
heatmap.setAuthor('jane.smith');
heatmap.setBranch('develop');

// Multi-author view
const multiAuthorHeatmap = new Heatmap(container, {
  endpoint: '/api/activity/by-authors',
  mode: 'multi-author',
  multiConfig: {
    authors: ['john.doe', 'jane.smith', 'bob.jones'],
  },
});

// Combined repositories view
const combinedHeatmap = new Heatmap(container, {
  endpoint: '/api/activity/combined',
  mode: 'combined',
  multiConfig: {
    queries: [
      { repository: 'myorg/repo1', startDate: '2024-01-01', endDate: '2024-12-31' },
      { repository: 'myorg/repo2', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
  },
});
```

---

## 7. Data Models

### 7.1 Core Types

```typescript
// packages/core/src/types/activity.ts

/**
 * Represents aggregated activity for a single day
 */
export interface ActivityData {
  /** Date in ISO 8601 format (YYYY-MM-DD) */
  date: string;
  
  /** Number of commits on this date */
  count: number;
}

/**
 * Query options for filtering commits
 */
export interface QueryOptions {
  /** Start date in ISO 8601 format (YYYY-MM-DD) */
  startDate: string;
  
  /** End date in ISO 8601 format (YYYY-MM-DD) */
  endDate: string;
  
  /** Repository in format "owner/repo" */
  repository?: string;
  
  /** GitHub username or email to filter by author */
  author?: string;
  
  /** Branch name to filter commits (e.g., "main", "develop") */
  branch?: string;
  
  /** File or directory path to filter commits */
  path?: string;
}

/**
 * Metadata about the activity dataset
 */
export interface ActivityMetadata {
  startDate: string;
  endDate: string;
  totalCommits: number;
  cachedAt: string;
  repository?: string;
  filters?: {
    author?: string;
    branch?: string;
    path?: string;
  };
}

/**
 * Complete API response structure
 */
export interface ActivityResponse {
  data: ActivityData[];
  meta: ActivityMetadata;
}

/**
 * Summary statistics
 */
export interface ActivitySummary {
  totalCommits: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  averageCommitsPerDay: number;
  mostActiveDay: {
    date: string;
    count: number;
  };
}

/**
 * Multi-author response structure
 */
export interface MultiAuthorResponse {
  data: Record<string, ActivityData[]>;
  meta: {
    startDate: string;
    endDate: string;
    authors: number;
  };
}

/**
 * Multi-repository response structure
 */
export interface MultiRepositoryResponse {
  data: Record<string, ActivityData[]>;
  meta: {
    startDate: string;
    endDate: string;
    repositories: number;
  };
}

/**
 * Combined query response structure
 */
export interface CombinedQueryResponse {
  data: ActivityData[];
  meta: {
    startDate: string;
    endDate: string;
    totalQueries: number;
    totalCommits: number;
  };
}
```

### 7.2 Configuration Types

```typescript
// packages/core/src/types/config.ts

/**
 * Backend aggregator configuration
 */
export interface AggregatorConfig {
  /** GitHub Personal Access Token */
  githubToken: string;
  
  /** Repository in format "owner/repo" */
  repository: string;
  
  /** Cache strategy */
  cache?: {
    strategy: 'memory' | 'file' | 'redis';
    ttl?: number; // Time-to-live in seconds
    options?: Record<string, any>;
  };
  
  /** Rate limiting configuration */
  rateLimit?: {
    maxRetries?: number;
    retryDelay?: number;
  };
}

/**
 * Frontend heatmap configuration
 */
export interface HeatmapConfig {
  endpoint: string;
  startDate?: string;
  endDate?: string;
  theme?: string | Theme;
  cellSize?: number;
  cellGap?: number;
  showTooltip?: boolean;
  tooltipFormatter?: (data: ActivityData) => string;
  onClick?: (data: ActivityData) => void;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  weekStart?: 0 | 1;
  loadingText?: string;
  errorText?: string;
  onError?: (error: Error) => void;
}
```

---

## 8. Security Considerations

### 8.1 Token Management

**Critical Security Rules:**

1. **NEVER expose GitHub token in frontend code**
   - Token must only exist in backend environment
   - Use environment variables (`process.env.GITHUB_TOKEN`)
   - Never commit tokens to version control

2. **Token Scopes**
   ```
   Minimum required scopes:
   - repo (for private repositories)
   - read:org (if using organization repositories)
   ```

3. **Token Rotation**
   - Implement token rotation strategy
   - Support for multiple tokens (load balancing)
   - Automatic failover on token expiration

### 8.2 Rate Limiting

**GitHub API Limits:**
- Authenticated: 5,000 requests/hour
- Per-repository: Additional limits may apply

**Mitigation Strategies:**
1. Aggressive caching (6-hour default TTL)
2. Conditional requests using ETag
3. Pagination optimization
4. Request queuing for high-traffic scenarios

### 8.3 CORS Configuration

```typescript
// Recommended CORS setup for API endpoints
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 86400, // 24 hours
};
```

### 8.4 Data Privacy

**What is NOT exposed:**
- Commit messages
- Commit hashes
- Author names/emails
- Branch information
- File paths
- Code content
- Repository structure

**Only exposed:**
- Date (YYYY-MM-DD)
- Count (integer)

---

## 9. Installation & Usage

### 9.1 Installation

```bash
# Install backend (Node.js server)
npm install @gh-heatmap/backend

# Install frontend (browser)
npm install @gh-heatmap/frontend

# Install both (full-stack)
npm install @gh-heatmap/backend @gh-heatmap/frontend

# CLI tool (optional)
npm install -g @gh-heatmap/cli
```

### 9.2 Backend Setup

#### Express.js Example

```typescript
import express from 'express';
import { GitHubAggregator, MemoryCache } from '@gh-heatmap/backend';
import { createExpressHandler } from '@gh-heatmap/backend/adapters/express';

const app = express();

// Initialize aggregator
const aggregator = new GitHubAggregator({
  githubToken: process.env.GITHUB_TOKEN!,
  repository: 'myorg/myrepo',
  cache: {
    strategy: 'memory',
    ttl: 21600, // 6 hours
  },
});

// Mount routes
app.use('/api', createExpressHandler(aggregator));

app.listen(3000, () => {
  console.log('Activity API running on http://localhost:3000');
});
```

#### Next.js API Route

```typescript
// pages/api/activity.ts
import { GitHubAggregator } from '@gh-heatmap/backend';
import type { NextApiRequest, NextApiResponse } from 'next';

const aggregator = new GitHubAggregator({
  githubToken: process.env.GITHUB_TOKEN!,
  repository: process.env.GITHUB_REPOSITORY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { startDate, endDate } = req.query;

  try {
    const data = await aggregator.aggregateActivity(
      startDate as string,
      endDate as string
    );
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 9.3 Frontend Setup

#### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@gh-heatmap/frontend/dist/styles.css">
</head>
<body>
  <div id="activity-heatmap"></div>

  <script type="module">
    import { Heatmap } from 'https://unpkg.com/@gh-heatmap/frontend';

    // Simple repository-wide view
    const heatmap = new Heatmap(
      document.getElementById('activity-heatmap'),
      {
        endpoint: '/api/activity',
        theme: 'github',
        showTooltip: true,
      }
    );

    heatmap.load();

    // With author filter
    const authorHeatmap = new Heatmap(
      document.getElementById('activity-heatmap'),
      {
        endpoint: '/api/activity',
        queryOptions: {
          author: 'john.doe',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
        theme: 'dark',
      }
    );

    // Dynamic filter updates
    document.getElementById('author-select').addEventListener('change', (e) => {
      authorHeatmap.setAuthor(e.target.value);
    });

    document.getElementById('branch-select').addEventListener('change', (e) => {
      authorHeatmap.setBranch(e.target.value);
    });
  </script>
</body>
</html>
```

#### React

```tsx
import { ActivityHeatmap } from '@gh-heatmap/frontend/react';
import { useState } from 'react';

function App() {
  const [author, setAuthor] = useState<string>('');
  const [branch, setBranch] = useState<string>('main');

  return (
    <div className="container">
      <h2>Project Activity</h2>
      
      {/* Filters */}
      <div className="filters">
        <select value={author} onChange={(e) => setAuthor(e.target.value)}>
          <option value="">All Authors</option>
          <option value="john.doe">John Doe</option>
          <option value="jane.smith">Jane Smith</option>
        </select>
        
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="main">Main</option>
          <option value="develop">Develop</option>
        </select>
      </div>

      {/* Single repository heatmap */}
      <ActivityHeatmap
        endpoint="/api/activity"
        config={{
          queryOptions: {
            author,
            branch,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
          },
          theme: 'dark',
          showMonthLabels: true,
          tooltipFormatter: (data) => 
            `${data.count} commits on ${data.date}`
        }}
      />

      {/* Multi-author comparison */}
      <h3>Team Activity</h3>
      <ActivityHeatmap
        endpoint="/api/activity/by-authors"
        config={{
          mode: 'multi-author',
          multiConfig: {
            authors: ['john.doe', 'jane.smith', 'bob.jones'],
          },
          queryOptions: {
            startDate: '2024-01-01',
            endDate: '2024-12-31',
          },
        }}
      />
    </div>
  );
}
```

#### Vue

```vue
<template>
  <div class="container">
    <h2>Project Activity</h2>
    
    <!-- Filters -->
    <div class="filters">
      <select v-model="author">
        <option value="">All Authors</option>
        <option value="john.doe">John Doe</option>
        <option value="jane.smith">Jane Smith</option>
      </select>
      
      <select v-model="branch">
        <option value="main">Main</option>
        <option value="develop">Develop</option>
      </select>
    </div>

    <!-- Single repository heatmap -->
    <ActivityHeatmap
      endpoint="/api/activity"
      :config="{
        queryOptions: {
          author,
          branch,
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        },
        theme: 'minimal',
        showMonthLabels: true
      }"
    />

    <!-- Path-filtered view -->
    <h3>Frontend Activity</h3>
    <ActivityHeatmap
      endpoint="/api/activity"
      :config="{
        queryOptions: {
          path: 'src/frontend',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        },
        theme: 'github'
      }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ActivityHeatmap } from '@gh-heatmap/frontend/vue';

const author = ref('');
const branch = ref('main');
</script>
```

#### Advanced: Multi-Repository Dashboard

```tsx
import { ActivityHeatmap } from '@gh-heatmap/frontend/react';

function OrganizationDashboard() {
  return (
    <div className="dashboard">
      <h1>Organization Activity</h1>
      
      {/* Combined view across all repos */}
      <section>
        <h2>Total Activity</h2>
        <ActivityHeatmap
          endpoint="/api/activity/combined"
          config={{
            mode: 'combined',
            multiConfig: {
              queries: [
                { repository: 'myorg/frontend' },
                { repository: 'myorg/backend' },
                { repository: 'myorg/mobile' },
              ],
            },
            theme: 'dark',
          }}
        />
      </section>

      {/* Per-repository views */}
      <section className="grid">
        <div>
          <h3>Frontend</h3>
          <ActivityHeatmap
            endpoint="/api/activity"
            config={{
              queryOptions: { repository: 'myorg/frontend' },
              cellSize: 8,
            }}
          />
        </div>
        
        <div>
          <h3>Backend</h3>
          <ActivityHeatmap
            endpoint="/api/activity"
            config={{
              queryOptions: { repository: 'myorg/backend' },
              cellSize: 8,
            }}
          />
        </div>
        
        <div>
          <h3>Mobile</h3>
          <ActivityHeatmap
            endpoint="/api/activity"
            config={{
              queryOptions: { repository: 'myorg/mobile' },
              cellSize: 8,
            }}
          />
        </div>
      </section>
    </div>
  );
}
```

---

## 10. Configuration

### 10.1 Environment Variables

```bash
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY=owner/repo

# Optional
CACHE_STRATEGY=redis  # memory | file | redis
CACHE_TTL=21600       # 6 hours in seconds
REDIS_URL=redis://localhost:6379
CACHE_DIR=./cache     # for file cache

# Rate limiting
MAX_RETRIES=3
RETRY_DELAY=1000      # milliseconds

# CORS
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

### 10.2 Configuration File

```typescript
// gh-heatmap.config.ts

import type { AggregatorConfig } from '@gh-heatmap/backend';

export default {
  backend: {
    githubToken: process.env.GITHUB_TOKEN,
    repository: 'myorg/myrepo',
    cache: {
      strategy: 'redis',
      ttl: 21600,
      options: {
        url: process.env.REDIS_URL,
      },
    },
    rateLimit: {
      maxRetries: 3,
      retryDelay: 1000,
    },
  },
  frontend: {
    defaultTheme: 'dark',
    cellSize: 12,
    cellGap: 3,
    showTooltip: true,
    weekStart: 1, // Monday
  },
} satisfies {
  backend: AggregatorConfig;
  frontend: Partial<HeatmapConfig>;
};
```

---

## 11. Performance & Optimization

### 11.1 Caching Strategy

```
Request Flow:
┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌─────────────┐
│ Browser │────▶│ Backend │────▶│ Cache Layer │────▶│ GitHub API  │
└─────────┘     └─────────┘     └─────────────┘     └─────────────┘
                     │                 │
                     │  Cache Hit      │
                     │◀────────────────┘
                     │
                     │  Return cached data
                     │
```

**Cache Levels:**

1. **Memory Cache** (Development/Small Scale)
   - In-process storage
   - Fastest access
   - Lost on restart
   - Suitable for single-instance deployments

2. **File Cache** (Medium Scale)
   - Persistent storage
   - Survives restarts
   - No external dependencies
   - Suitable for single-server deployments

3. **Redis Cache** (Production/Large Scale)
   - Distributed caching
   - Shared across instances
   - High performance
   - Suitable for load-balanced deployments

### 11.2 Query Optimization

**Pagination Strategy:**

```typescript
async function fetchAllCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  since: string
): Promise<Commit[]> {
  const commits: Commit[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await octokit.repos.listCommits({
      owner,
      repo,
      since,
      per_page: 100, // Maximum allowed
      page,
    });

    commits.push(...response.data);
    hasMore = response.data.length === 100;
    page++;
  }

  return commits;
}
```

**Conditional Requests:**

```typescript
// Use ETags to avoid unnecessary data transfer
const response = await octokit.repos.listCommits({
  owner,
  repo,
  headers: {
    'If-None-Match': cachedETag,
  },
});

if (response.status === 304) {
  // Not modified - use cached data
  return cachedData;
}
```

### 11.3 Frontend Optimization

**Lazy Rendering:**

```typescript
// Only render visible date range
function renderVisibleRange(
  startDate: Date,
  endDate: Date,
  viewportWidth: number
) {
  const daysVisible = Math.floor(viewportWidth / (cellSize + cellGap));
  const visibleStart = new Date(endDate);
  visibleStart.setDate(visibleStart.getDate() - daysVisible);
  
  return {
    start: visibleStart > startDate ? visibleStart : startDate,
    end: endDate,
  };
}
```

**Virtualization:**

```typescript
// For very long date ranges (multi-year views)
class VirtualizedHeatmap extends Heatmap {
  private renderWindow = 365; // Only render 1 year at a time
  
  private updateVisibleRange(scrollPosition: number): void {
    // Calculate which dates are in viewport
    // Only render those cells
  }
}
```

---

## 12. Testing Strategy

### 12.1 Backend Tests

```typescript
// packages/backend/tests/aggregator.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { GitHubAggregator } from '../src/aggregator';

describe('GitHubAggregator', () => {
  let aggregator: GitHubAggregator;

  beforeEach(() => {
    aggregator = new GitHubAggregator({
      githubToken: 'test-token',
      repository: 'test/repo',
    });
  });

  it('aggregates commits by date', async () => {
    const data = await aggregator.aggregateActivity(
      '2025-01-01',
      '2025-01-31'
    );

    expect(data).toBeInstanceOf(Array);
    expect(data[0]).toHaveProperty('date');
    expect(data[0]).toHaveProperty('count');
  });

  it('handles empty date ranges', async () => {
    const data = await aggregator.aggregateActivity(
      '2025-01-01',
      '2025-01-01'
    );

    expect(data).toHaveLength(0);
  });

  it('respects cache TTL', async () => {
    // Test cache behavior
  });
});
```

### 12.2 Frontend Tests

```typescript
// packages/frontend/tests/heatmap.test.ts

import { describe, it, expect } from 'vitest';
import { Heatmap } from '../src/components/Heatmap';

describe('Heatmap', () => {
  it('renders activity grid', () => {
    const container = document.createElement('div');
    const heatmap = new Heatmap(container, {
      endpoint: '/api/activity',
    });

    heatmap.setData([
      { date: '2025-02-23', count: 5 },
    ]);

    expect(container.children.length).toBeGreaterThan(0);
  });

  it('applies custom theme', () => {
    const container = document.createElement('div');
    const heatmap = new Heatmap(container, {
      endpoint: '/api/activity',
      theme: 'dark',
    });

    // Verify theme application
  });
});
```

### 12.3 Integration Tests

```typescript
// tests/integration/api.test.ts

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Activity API', () => {
  it('returns aggregated data', async () => {
    const response = await request(app)
      .get('/api/activity')
      .query({ startDate: '2025-01-01', endDate: '2025-01-31' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('handles invalid date ranges', async () => {
    const response = await request(app)
      .get('/api/activity')
      .query({ startDate: '2025-01-31', endDate: '2025-01-01' });

    expect(response.status).toBe(400);
  });
});
```

---

## 13. Roadmap

### Phase 1: Core Implementation (v1.0.0) ✅
- [x] Backend aggregation service
- [x] Flexible query system (repository, author, branch, path filters)
- [x] Multi-mode aggregation (by-authors, by-repositories, combined)
- [x] Memory/File/Redis cache strategies with query-specific keys
- [x] Express/Fastify adapters
- [x] Vanilla JS frontend component
- [x] Basic theming system
- [x] TypeScript types

### Phase 2: Framework Support (v1.1.0)
- [ ] React wrapper component with query hooks
- [ ] Vue 3 wrapper component with composables
- [ ] Svelte wrapper component with stores
- [ ] Angular integration guide
- [ ] CDN distribution
- [ ] Interactive filter components (author selector, branch selector)

### Phase 3: Advanced Features (v1.2.0)
- [ ] Real-time activity updates via webhooks
- [ ] Custom date ranges in UI with calendar picker
- [ ] Activity statistics dashboard widgets
- [ ] Export to PNG/SVG/PDF
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Comparative views (side-by-side heatmaps)
- [ ] Advanced filters: commit message search, file type filters
- [ ] Heat intensity customization (logarithmic scale, percentile-based)

### Phase 4: Developer Experience (v1.3.0)
- [ ] CLI tool for quick setup
- [ ] Interactive configuration wizard
- [ ] VS Code extension
- [ ] Storybook documentation
- [ ] Playwright E2E tests
- [ ] Query builder UI for complex filters
- [ ] Performance profiling tools

### Phase 5: Enterprise Features (v2.0.0)
- [ ] GitHub Enterprise Server support
- [ ] GitLab integration
- [ ] Bitbucket integration
- [ ] Azure DevOps integration
- [ ] Self-hosted analytics with PostgreSQL
- [ ] Team activity aggregation with role-based access
- [ ] Custom webhooks for real-time updates
- [ ] SSO/SAML authentication
- [ ] Audit logs and compliance reports
- [ ] Advanced caching with Redis Cluster
- [ ] Horizontal scaling support

### Phase 6: Analytics & Insights (v2.1.0)
- [ ] Predictive analytics (commit patterns, velocity trends)
- [ ] Anomaly detection (unusual activity spikes/drops)
- [ ] Team productivity metrics
- [ ] Code review correlation
- [ ] Sprint/milestone alignment visualization
- [ ] Custom metric definitions
- [ ] Data export to BI tools (Tableau, PowerBI)

---

## Appendix

### A. Query Examples & Use Cases

#### 1. Personal Portfolio - Show Your Contributions

```typescript
// Display only your commits across a specific project
const config = {
  endpoint: '/api/activity',
  queryOptions: {
    author: 'your-github-username',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
};
```

#### 2. Team Dashboard - Compare Contributors

```typescript
// Show activity heatmap for each team member
const teamDashboard = {
  endpoint: '/api/activity/by-authors',
  mode: 'multi-author',
  multiConfig: {
    authors: ['john.doe', 'jane.smith', 'bob.jones', 'alice.wilson'],
  },
  queryOptions: {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
};
```

#### 3. Release Tracking - Monitor Feature Branch

```typescript
// Track activity on a specific release branch
const releaseBranch = {
  endpoint: '/api/activity',
  queryOptions: {
    branch: 'release/v2.0',
    startDate: '2024-06-01',
    endDate: '2024-09-30',
  },
};
```

#### 4. Code Area Focus - Frontend vs Backend

```typescript
// Compare activity in different parts of codebase
const frontendActivity = {
  endpoint: '/api/activity',
  queryOptions: {
    path: 'src/frontend',
  },
};

const backendActivity = {
  endpoint: '/api/activity',
  queryOptions: {
    path: 'src/backend',
  },
};
```

#### 5. Multi-Repo Organization View

```typescript
// Aggregate activity across organization repositories
const orgActivity = {
  endpoint: '/api/activity/by-repositories',
  mode: 'multi-repository',
  multiConfig: {
    repositories: [
      'myorg/web-app',
      'myorg/mobile-app',
      'myorg/api-server',
      'myorg/admin-panel',
    ],
  },
};
```

#### 6. Personal Multi-Repo Contributions

```typescript
// Show your personal activity across multiple projects
const personalActivity = {
  endpoint: '/api/activity/combined',
  mode: 'combined',
  multiConfig: {
    queries: [
      { repository: 'myorg/project-a', author: 'your-username' },
      { repository: 'myorg/project-b', author: 'your-username' },
      { repository: 'myorg/project-c', author: 'your-username' },
    ],
  },
};
```

#### 7. Sprint Retrospective - Time-Boxed Analysis

```typescript
// Analyze team activity during a 2-week sprint
const sprintActivity = {
  endpoint: '/api/activity/by-authors',
  mode: 'multi-author',
  multiConfig: {
    authors: ['dev1', 'dev2', 'dev3'],
  },
  queryOptions: {
    branch: 'sprint/2024-02',
    startDate: '2024-02-05',
    endDate: '2024-02-18',
  },
};
```

#### 8. Onboarding Progress - New Team Member

```typescript
// Track new developer's first 90 days
const onboardingActivity = {
  endpoint: '/api/activity',
  queryOptions: {
    author: 'new-developer',
    startDate: '2024-01-15', // Start date
    endDate: '2024-04-15',   // 90 days later
  },
};
```

#### 9. Hot Path Analysis - Most Active Files

```typescript
// Monitor activity on critical system components
const criticalPathActivity = {
  endpoint: '/api/activity',
  queryOptions: {
    path: 'src/core/payment-processor',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
};
```

#### 10. Cross-Functional Team View

```typescript
// Combine frontend and backend team activities
const crossFunctionalView = {
  endpoint: '/api/activity/combined',
  mode: 'combined',
  multiConfig: {
    queries: [
      {
        repository: 'myorg/app',
        path: 'frontend',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
      {
        repository: 'myorg/app',
        path: 'backend',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
    ],
  },
};
```

### B. GitHub API Reference

**Endpoints Used:**
- `GET /repos/{owner}/{repo}/commits` - List commits with filtering

**Request Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `since` | ISO 8601 | Only commits after this date |
| `until` | ISO 8601 | Only commits before this date |
| `sha` | string | SHA or branch to start listing from |
| `path` | string | Only commits containing this file path |
| `author` | string | GitHub username |
| `per_page` | integer | Results per page (max: 100) |
| `page` | integer | Page number for pagination |

**Request Headers:**
- `Authorization: token {token}` - Required for private repos

**Response Headers:**
- `X-RateLimit-Limit` - Maximum requests per hour
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Unix timestamp when limit resets
- `Link` - Pagination links (rel="next", rel="last")

**Rate Limits:**
- 5,000 requests/hour (authenticated)
- 60 requests/hour (unauthenticated)

**Example Request:**
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  "https://api.github.com/repos/owner/repo/commits?since=2024-01-01T00:00:00Z&author=john.doe&per_page=100"
```

**Example Response:**
```json
[
  {
    "sha": "abc123...",
    "commit": {
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "date": "2024-01-15T10:30:00Z"
      },
      "message": "Add feature X"
    }
  }
]
```

### C. Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

**Required APIs:**
- Fetch API
- ES2020 features
- CSS Grid
- URLSearchParams (for query building)

**Optional APIs (for advanced features):**
- Web Storage API (localStorage for client-side caching)
- Intersection Observer (for lazy rendering)

### D. Deployment Examples

**Vercel:**
```json
{
  "env": {
    "GITHUB_TOKEN": "@github-token",
    "GITHUB_REPOSITORY": "owner/repo"
  }
}
```

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**Railway/Render:**
```yaml
services:
  - type: web
    name: activity-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: GITHUB_TOKEN
        sync: false
      - key: GITHUB_REPOSITORY
        value: owner/repo
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🔨 Step-by-Step Implementation Guide

### Step 1: Initialize Monorepo

```bash
# Create project structure
mkdir github-activity-heatmap
cd github-activity-heatmap

# Initialize pnpm workspace
pnpm init

# Create package directories
mkdir -p packages/{core,backend,frontend,cli}/{src,tests}
mkdir -p examples/{express-api,next-js,vanilla-js}

# Setup workspace configuration
echo "packages:\n  - 'packages/*'\n  - 'examples/*'" > pnpm-workspace.yaml
```

### Step 2: Core Types Implementation

**File: `packages/core/src/types/activity.ts`**

Implement all interfaces from Section 7.1:
- `ActivityData`
- `QueryOptions`
- `ActivityMetadata`
- `ActivityResponse`
- `ActivitySummary`

**File: `packages/core/src/utils/date.ts`**

```typescript
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`);
  }
  return date;
}

export function isValidDateRange(start: string, end: string): boolean {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  return startDate <= endDate;
}

export function getDaysBetween(start: string, end: string): number {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

**File: `packages/core/src/utils/validation.ts`**

```typescript
import type { QueryOptions } from '../types/activity';

export function validateQueryOptions(options: QueryOptions): void {
  if (!options.startDate || !options.endDate) {
    throw new Error('startDate and endDate are required');
  }

  if (!isValidDateRange(options.startDate, options.endDate)) {
    throw new Error('startDate must be before endDate');
  }

  if (options.repository && !isValidRepositoryFormat(options.repository)) {
    throw new Error('Repository must be in format "owner/repo"');
  }
}

function isValidRepositoryFormat(repo: string): boolean {
  return /^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/.test(repo);
}
```

### Step 3: Backend Aggregator

**File: `packages/backend/src/aggregator/GitHubAggregator.ts`**

Follow the complete implementation from Section 4.1. Key methods to implement:
1. `constructor(config: AggregatorConfig)` - Initialize Octokit
2. `aggregateActivity(options: QueryOptions)` - Main aggregation
3. `fetchCommits(options: QueryOptions)` - Pagination handler
4. `aggregateByDate(commits: any[])` - Group by date
5. `getActivitySummary(options: QueryOptions)` - Calculate stats

**Testing approach:**
```typescript
// Test with mock Octokit responses
describe('GitHubAggregator', () => {
  it('aggregates commits by date', async () => {
    const mockCommits = [
      { commit: { author: { date: '2024-01-15T10:00:00Z' } } },
      { commit: { author: { date: '2024-01-15T14:00:00Z' } } },
      { commit: { author: { date: '2024-01-16T09:00:00Z' } } },
    ];
    
    // Mock Octokit.repos.listCommits
    // Assert aggregation produces correct date counts
  });
});
```

### Step 4: Cache Implementation

**File: `packages/backend/src/cache/MemoryCache.ts`**

Start with MemoryCache (simplest):
- Implement `CacheStrategy` interface
- Use `Map<string, CacheEntry>` for storage
- Handle TTL expiration
- Add cleanup for expired entries

**File: `packages/backend/src/cache/CacheStrategy.ts`**

```typescript
export function generateCacheKey(options: QueryOptions): string {
  const parts = [
    options.repository || 'default',
    options.startDate,
    options.endDate,
  ];

  if (options.author) parts.push(`author:${options.author}`);
  if (options.branch) parts.push(`branch:${options.branch}`);
  if (options.path) parts.push(`path:${options.path}`);

  return parts.join('::');
}
```

### Step 5: Express Adapter

**File: `packages/backend/src/api/express.ts`**

Implement all endpoints from Section 6.1:
- `GET /activity` with query params
- `POST /activity/by-authors`
- `POST /activity/by-repositories`
- `POST /activity/combined`
- `GET /activity/summary`

**Test with:**
```bash
curl "http://localhost:3000/api/activity?startDate=2024-01-01&endDate=2024-12-31&author=john.doe"
```

### Step 6: Frontend Heatmap Component

**File: `packages/frontend/src/components/Heatmap.ts`**

Core rendering logic:
1. `constructor` - Setup container and config
2. `load(endpoint)` - Fetch data
3. `render()` - Create DOM structure
4. `generateCalendar()` - Build grid
5. `getIntensityColor(count)` - Color mapping

**DOM Structure:**
```html
<div class="gh-activity-heatmap">
  <div class="gh-calendar">
    <div class="gh-week" data-week="0">
      <div class="gh-day" data-date="2024-01-01" data-count="5"></div>
      <!-- ... -->
    </div>
  </div>
</div>
```

### Step 7: React Wrapper

**File: `packages/frontend/src/renderers/ReactRenderer.tsx`**

```typescript
import React, { useEffect, useRef } from 'react';
import { Heatmap } from '../components/Heatmap';

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<Heatmap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    heatmapRef.current = new Heatmap(containerRef.current, props.config);
    heatmapRef.current.load(props.endpoint);

    return () => heatmapRef.current?.destroy();
  }, [props.endpoint, props.config]);

  return <div ref={containerRef} />;
};
```

### Step 8: Create Examples

**File: `examples/express-api/server.ts`**

```typescript
import express from 'express';
import { GitHubAggregator, MemoryCache } from '@gh-heatmap/backend';
import { createExpressHandler } from '@gh-heatmap/backend/adapters/express';

const app = express();

const aggregator = new GitHubAggregator({
  githubToken: process.env.GITHUB_TOKEN!,
  repository: process.env.GITHUB_REPOSITORY!,
  cache: {
    strategy: 'memory',
    ttl: 21600,
  },
});

app.use('/api', createExpressHandler(aggregator));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**File: `examples/vanilla-js/index.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="../../packages/frontend/dist/styles.css">
</head>
<body>
  <h1>GitHub Activity</h1>
  <div id="heatmap"></div>

  <script type="module">
    import { Heatmap } from '../../packages/frontend/dist/index.mjs';

    const heatmap = new Heatmap(
      document.getElementById('heatmap'),
      {
        endpoint: 'http://localhost:3000/api/activity',
        theme: 'github',
      }
    );

    heatmap.load();
  </script>
</body>
</html>
```

### Step 9: Testing

**Setup Vitest:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' for frontend tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

**Run tests:**
```bash
pnpm test
```

### Step 10: Documentation

Create README files:
- Root `README.md` - Overview and quick start
- `packages/core/README.md` - Type reference
- `packages/backend/README.md` - Backend setup
- `packages/frontend/README.md` - Component usage

### Step 11: CI/CD

**File: `.github/workflows/ci.yml`**

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

### Step 12: Publish

```bash
# Build all packages
pnpm build

# Publish to npm (when ready)
pnpm -r publish --access public
```

---

## 📚 Additional Resources for Implementation

### Recommended Libraries

**Backend:**
- `@octokit/rest` - GitHub API client
- `ioredis` - Redis client (optional)
- `express` or `fastify` - HTTP framework

**Frontend:**
- No required dependencies for core
- `react` ^18.0.0 (optional, for React wrapper)
- `vue` ^3.0.0 (optional, for Vue wrapper)

**Development:**
- `tsup` - TypeScript bundler
- `vitest` - Testing framework
- `eslint` + `@typescript-eslint/*` - Linting
- `prettier` - Code formatting

### GitHub API Documentation

- Commits API: https://docs.github.com/en/rest/commits/commits
- Rate Limiting: https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api
- Authentication: https://docs.github.com/en/rest/overview/authenticating-to-the-rest-api

### Testing Strategies

1. **Unit Tests**: Test each function in isolation
2. **Integration Tests**: Test API endpoints with mock GitHub responses
3. **E2E Tests**: Test full flow from request to rendered heatmap
4. **Visual Tests**: Screenshot testing for frontend components

### Performance Targets

- Backend response time: < 200ms (cached), < 2s (uncached)
- Frontend render time: < 100ms for 365 days
- Bundle size: < 50KB (frontend, minified + gzipped)
- Memory usage: < 50MB (backend, per instance)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-02-23  
**Maintained By:** [Your Organization]

---

## ✅ Implementation Completion Checklist

Use this checklist to track implementation progress:

### Core Package
- [ ] ActivityData interface
- [ ] QueryOptions interface
- [ ] All metadata interfaces
- [ ] Date utility functions
- [ ] Validation functions
- [ ] Unit tests (80%+ coverage)

### Backend Package
- [ ] GitHubAggregator class
- [ ] MemoryCache implementation
- [ ] FileCache implementation
- [ ] RedisCache implementation
- [ ] RateLimiter class
- [ ] Express adapter
- [ ] Fastify adapter
- [ ] Error handling
- [ ] Unit + integration tests

### Frontend Package
- [ ] Base Heatmap class
- [ ] Calendar rendering
- [ ] Tooltip component
- [ ] Theme system
- [ ] React wrapper
- [ ] Vue wrapper
- [ ] CSS styling
- [ ] Component tests

### Examples
- [ ] Express API example
- [ ] Next.js example
- [ ] Vanilla JS example
- [ ] Working demos

### Documentation
- [ ] Root README
- [ ] API documentation
- [ ] Usage examples
- [ ] Configuration guide
- [ ] Deployment guide

### Tooling
- [ ] ESLint configuration
- [ ] Prettier configuration
- [ ] TypeScript strict mode
- [ ] CI/CD pipeline
- [ ] npm publish setup

**Ready to implement?** Start with `packages/core/src/types/activity.ts` and work through the checklist! 🚀
