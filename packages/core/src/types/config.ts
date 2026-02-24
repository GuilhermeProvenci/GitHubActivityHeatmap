import type { ActivityData } from './activity';

/**
 * Theme definition for heatmap visualization
 */
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
        ttl?: number;
        options?: Record<string, unknown>;
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
    /** API endpoint URL */
    endpoint: string;

    /** Start date in ISO 8601 format */
    startDate?: string;

    /** End date in ISO 8601 format */
    endDate?: string;

    /** Theme name or custom theme object */
    theme?: string | Theme;

    /** Cell size in pixels */
    cellSize?: number;

    /** Gap between cells in pixels */
    cellGap?: number;

    /** Show tooltip on hover */
    showTooltip?: boolean;

    /** Custom tooltip formatter */
    tooltipFormatter?: (data: ActivityData) => string;

    /** Click handler for cells */
    onClick?: (data: ActivityData) => void;

    /** Show month labels above the grid */
    showMonthLabels?: boolean;

    /** Show day labels on the left */
    showDayLabels?: boolean;

    /** Week start: 0 = Sunday, 1 = Monday */
    weekStart?: 0 | 1;

    /** Text shown while loading */
    loadingText?: string;

    /** Text shown on error */
    errorText?: string;

    /** Error handler callback */
    onError?: (error: Error) => void;

    /** Multi-mode support */
    mode?: 'single' | 'multi-author' | 'multi-repository' | 'combined';

    /** Configuration for multi-mode queries */
    multiConfig?: {
        authors?: string[];
        repositories?: string[];
        queries?: import('./activity').QueryOptions[];
    };

    /** Query filters */
    queryOptions?: {
        startDate?: string;
        endDate?: string;
        repository?: string;
        author?: string;
        branch?: string;
        path?: string;
    };
}
