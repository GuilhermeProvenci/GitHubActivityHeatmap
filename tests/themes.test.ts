import { describe, it, expect } from 'vitest';
import { themes, resolveTheme } from '../src/themes';
import type { Theme } from '../src/types';

describe('themes', () => {
  it('has dark, light, github, and minimal themes', () => {
    expect(Object.keys(themes)).toEqual(['dark', 'light', 'github', 'minimal']);
  });

  it('each theme has required color levels', () => {
    for (const [name, theme] of Object.entries(themes)) {
      expect(theme.colors.empty, `${name}.colors.empty`).toBeDefined();
      expect(theme.colors.level1, `${name}.colors.level1`).toBeDefined();
      expect(theme.colors.level2, `${name}.colors.level2`).toBeDefined();
      expect(theme.colors.level3, `${name}.colors.level3`).toBeDefined();
      expect(theme.colors.level4, `${name}.colors.level4`).toBeDefined();
    }
  });

  it('each theme has grid settings', () => {
    for (const theme of Object.values(themes)) {
      expect(theme.grid.cellSize).toBeGreaterThan(0);
      expect(theme.grid.gap).toBeGreaterThanOrEqual(0);
      expect(theme.grid.borderRadius).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('resolveTheme', () => {
  it('returns dark theme by default', () => {
    expect(resolveTheme(undefined)).toBe(themes.dark);
  });

  it('resolves named theme', () => {
    expect(resolveTheme('light')).toBe(themes.light);
    expect(resolveTheme('github')).toBe(themes.github);
  });

  it('falls back to dark for unknown name', () => {
    expect(resolveTheme('nonexistent')).toBe(themes.dark);
  });

  it('returns custom theme object as-is', () => {
    const custom: Theme = {
      colors: { empty: '#000', level1: '#111', level2: '#222', level3: '#333', level4: '#444' },
      grid: { gap: 2, cellSize: 12, borderRadius: 3 },
      tooltip: { background: '#000', text: '#fff', border: '#333' },
    };
    expect(resolveTheme(custom)).toBe(custom);
  });
});
