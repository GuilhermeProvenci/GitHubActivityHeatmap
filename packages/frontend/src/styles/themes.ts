import type { Theme } from '@gh-heatmap/core';

/**
 * Built-in theme definitions
 */
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

/**
 * Resolves a theme by name or returns the custom theme object
 */
export function resolveTheme(theme: string | Theme | undefined): Theme {
    if (!theme) return themes.github;
    if (typeof theme === 'string') return themes[theme] || themes.github;
    return theme;
}
