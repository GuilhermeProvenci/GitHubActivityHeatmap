import type { ActivityData, HeatmapConfig, QueryOptions, Theme } from '@gh-heatmap/core';
import { getDefaultStartDate, getDefaultEndDate } from '@gh-heatmap/core';
import { Calendar } from './Calendar';
import { Tooltip } from './Tooltip';
import { resolveTheme } from '../styles/themes';

/**
 * Default configuration values
 */
const defaults: Partial<HeatmapConfig> = {
    cellSize: 11,
    cellGap: 3,
    showTooltip: true,
    showMonthLabels: true,
    showDayLabels: true,
    weekStart: 0,
    loadingText: 'Loading activity data...',
    errorText: 'Failed to load activity data.',
    mode: 'single',
};

/**
 * Core Heatmap component for rendering GitHub-style activity visualizations.
 * Framework-agnostic: uses native DOM APIs.
 */
export class Heatmap {
    private container: HTMLElement;
    private config: HeatmapConfig;
    private data: ActivityData[] = [];
    private theme: Theme;
    private tooltip: Tooltip;
    private currentQuery: Partial<QueryOptions> = {};

    constructor(container: HTMLElement, config: HeatmapConfig) {
        this.container = container;
        this.config = { ...defaults, ...config };
        this.theme = resolveTheme(this.config.theme);
        this.tooltip = new Tooltip(this.theme);

        if (this.config.queryOptions) {
            this.currentQuery = { ...this.config.queryOptions };
        }
    }

    /**
     * Loads activity data from the configured endpoint
     */
    async load(endpoint?: string): Promise<void> {
        const url = endpoint || this.config.endpoint;

        this.showLoading();

        try {
            const queryUrl = this.buildUrl(url);
            const response = await fetch(queryUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            this.data = json.data;
            this.render();
        } catch (error) {
            this.showError(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    /**
     * Refreshes the data from the endpoint
     */
    async refresh(): Promise<void> {
        await this.load();
    }

    /**
     * Sets data directly without fetching from endpoint
     */
    setData(data: ActivityData[]): void {
        this.data = data;
        this.render();
    }

    /**
     * Updates query options and reloads data
     */
    async updateQuery(options: Partial<QueryOptions>): Promise<void> {
        this.currentQuery = { ...this.currentQuery, ...options };
        await this.load();
    }

    /**
     * Sets author filter and reloads
     */
    async setAuthor(author: string | null): Promise<void> {
        if (author) {
            this.currentQuery.author = author;
        } else {
            delete this.currentQuery.author;
        }
        await this.load();
    }

    /**
     * Sets branch filter and reloads
     */
    async setBranch(branch: string | null): Promise<void> {
        if (branch) {
            this.currentQuery.branch = branch;
        } else {
            delete this.currentQuery.branch;
        }
        await this.load();
    }

    /**
     * Sets path filter and reloads
     */
    async setPath(path: string | null): Promise<void> {
        if (path) {
            this.currentQuery.path = path;
        } else {
            delete this.currentQuery.path;
        }
        await this.load();
    }

    /**
     * Clears all filters and reloads
     */
    async clearFilters(): Promise<void> {
        this.currentQuery = {};
        await this.load();
    }

    /**
     * Changes the theme and re-renders
     */
    setTheme(theme: string | Theme): void {
        this.theme = resolveTheme(theme);
        this.tooltip.setTheme(this.theme);
        if (this.data.length > 0) {
            this.render();
        }
    }

    /**
     * Sets a new date range and re-renders
     */
    setDateRange(startDate: string, endDate: string): void {
        this.config.startDate = startDate;
        this.config.endDate = endDate;
        if (this.data.length > 0) {
            this.render();
        }
    }

    /**
     * Loads multi-author data
     */
    async loadMultiAuthor(authors: string[]): Promise<void> {
        const url = this.config.endpoint;

        this.showLoading();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    authors,
                    ...this.currentQuery,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            // For multi-author, merge all data for display
            const allData: ActivityData[] = [];
            for (const authorData of Object.values(json.data) as ActivityData[][]) {
                allData.push(...authorData);
            }
            this.data = this.mergeActivityData(allData);
            this.render();
        } catch (error) {
            this.showError(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    /**
     * Loads multi-repository data
     */
    async loadMultiRepository(repositories: string[]): Promise<void> {
        const url = this.config.endpoint;

        this.showLoading();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repositories,
                    ...this.currentQuery,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            const allData: ActivityData[] = [];
            for (const repoData of Object.values(json.data) as ActivityData[][]) {
                allData.push(...repoData);
            }
            this.data = this.mergeActivityData(allData);
            this.render();
        } catch (error) {
            this.showError(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    /**
     * Loads combined query data
     */
    async loadCombined(queries: QueryOptions[]): Promise<void> {
        const url = this.config.endpoint;

        this.showLoading();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queries }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            this.data = json.data;
            this.render();
        } catch (error) {
            this.showError(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    /**
     * Destroys the heatmap and cleans up event listeners
     */
    destroy(): void {
        this.tooltip.destroy();
        this.container.innerHTML = '';
    }

    // --- Private methods ---

    /**
     * Renders the heatmap visualization
     */
    private render(): void {
        this.container.innerHTML = '';

        const startDate = this.config.startDate || this.currentQuery.startDate || getDefaultStartDate();
        const endDate = this.config.endDate || this.currentQuery.endDate || getDefaultEndDate();

        const calendar = new Calendar(this.data, {
            startDate,
            endDate,
            weekStart: this.config.weekStart || 0,
            showMonthLabels: this.config.showMonthLabels ?? true,
            showDayLabels: this.config.showDayLabels ?? true,
            theme: this.theme,
        });

        const element = calendar.build();
        this.container.appendChild(element);

        // Attach event listeners
        this.attachEventListeners();
    }

    /**
     * Attaches tooltip and click event listeners to day cells
     */
    private attachEventListeners(): void {
        const cells = this.container.querySelectorAll('.gh-day[data-date]');

        cells.forEach((cell) => {
            const element = cell as HTMLElement;
            const date = element.dataset.date || '';
            const count = parseInt(element.dataset.count || '0', 10);
            const activityData: ActivityData = { date, count };

            // Tooltip
            if (this.config.showTooltip) {
                element.addEventListener('mouseenter', () => {
                    const content = this.config.tooltipFormatter
                        ? this.config.tooltipFormatter(activityData)
                        : this.defaultTooltipFormat(activityData);
                    this.tooltip.show(element, content);
                });

                element.addEventListener('mouseleave', () => {
                    this.tooltip.hide();
                });
            }

            // Click handler
            if (this.config.onClick) {
                element.addEventListener('click', () => {
                    this.config.onClick?.(activityData);
                });
            }
        });
    }

    /**
     * Default tooltip text format
     */
    private defaultTooltipFormat(data: ActivityData): string {
        if (data.count === 0) {
            return `No contributions on ${data.date}`;
        }
        const plural = data.count === 1 ? 'contribution' : 'contributions';
        return `${data.count} ${plural} on ${data.date}`;
    }

    /**
     * Shows loading state
     */
    private showLoading(): void {
        this.container.innerHTML = `<div class="gh-heatmap-loading">${this.config.loadingText || 'Loading...'}</div>`;
    }

    /**
     * Shows error state
     */
    private showError(error: Error): void {
        this.container.innerHTML = `<div class="gh-heatmap-error">${this.config.errorText || 'Error loading data.'}</div>`;
        this.config.onError?.(error);
    }

    /**
     * Builds URL with query parameters
     */
    private buildUrl(baseUrl: string): string {
        const params = new URLSearchParams();

        const query = this.currentQuery;
        if (query.startDate) params.set('startDate', query.startDate);
        if (query.endDate) params.set('endDate', query.endDate);
        if (query.repository) params.set('repository', query.repository);
        if (query.author) params.set('author', query.author);
        if (query.branch) params.set('branch', query.branch);
        if (query.path) params.set('path', query.path);

        const queryString = params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }

    /**
     * Merges multiple activity data arrays by summing counts per date
     */
    private mergeActivityData(data: ActivityData[]): ActivityData[] {
        const merged = new Map<string, number>();

        for (const { date, count } of data) {
            merged.set(date, (merged.get(date) || 0) + count);
        }

        return Array.from(merged.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
}
