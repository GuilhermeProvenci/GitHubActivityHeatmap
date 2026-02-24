import type { Theme } from './types';

/**
 * Built-in themes matching GitHub's actual contribution graph palettes.
 */
export const themes: Record<string, Theme> = {
  dark: {
    colors: {
      empty: '#161b22',
      level1: '#0e4429',
      level2: '#006d32',
      level3: '#26a641',
      level4: '#39d353',
    },
    grid: { gap: 3, cellSize: 10, borderRadius: 2 },
    tooltip: { background: '#24292f', text: '#ffffff', border: 'transparent' },
  },
  light: {
    colors: {
      empty: '#ebedf0',
      level1: '#9be9a8',
      level2: '#40c463',
      level3: '#30a14e',
      level4: '#216e39',
    },
    grid: { gap: 3, cellSize: 10, borderRadius: 2 },
    tooltip: { background: '#24292f', text: '#ffffff', border: 'transparent' },
  },
  github: {
    colors: {
      empty: '#ebedf0',
      level1: '#9be9a8',
      level2: '#40c463',
      level3: '#30a14e',
      level4: '#216e39',
    },
    grid: { gap: 3, cellSize: 10, borderRadius: 2 },
    tooltip: { background: '#24292f', text: '#ffffff', border: 'transparent' },
  },
  minimal: {
    colors: {
      empty: '#f6f8fa',
      level1: '#d0d7de',
      level2: '#afb8c1',
      level3: '#8c959f',
      level4: '#6e7781',
    },
    grid: { gap: 3, cellSize: 10, borderRadius: 2 },
    tooltip: { background: '#24292f', text: '#ffffff', border: 'transparent' },
  },
};

/**
 * Resolves a theme by name or returns the custom theme object.
 */
export function resolveTheme(theme: string | Theme | undefined): Theme {
  if (!theme) return themes.dark;
  if (typeof theme === 'string') return themes[theme] || themes.dark;
  return theme;
}
