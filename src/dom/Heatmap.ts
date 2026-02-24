import type { ActivityData, HeatmapConfig, QueryOptions, Theme } from '../types';
import { getDefaultStartDate, getDefaultEndDate } from '../utils';
import { resolveTheme } from '../themes';
import { Calendar } from './Calendar';
import { Tooltip } from './Tooltip';

const defaults: Partial<HeatmapConfig> = {
  cellSize: 10,
  cellGap: 3,
  showTooltip: true,
  showMonthLabels: true,
  showDayLabels: true,
  weekStart: 0,
  loadingText: 'Loading activity data...',
  errorText: 'Failed to load activity data.',
};

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
    if (this.config.queryOptions) this.currentQuery = { ...this.config.queryOptions };
  }

  async load(endpoint?: string): Promise<void> {
    const url = endpoint || this.config.endpoint;
    this.showLoading();
    try {
      const queryUrl = this.buildUrl(url);
      const response = await fetch(queryUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      this.data = json.data;
      this.render();
    } catch (error) {
      this.showError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async refresh(): Promise<void> {
    await this.load();
  }

  setData(data: ActivityData[]): void {
    this.data = data;
    this.render();
  }

  async updateQuery(options: Partial<QueryOptions>): Promise<void> {
    this.currentQuery = { ...this.currentQuery, ...options };
    await this.load();
  }

  async setAuthor(author: string | null): Promise<void> {
    if (author) this.currentQuery.author = author;
    else delete this.currentQuery.author;
    await this.load();
  }

  setTheme(theme: string | Theme): void {
    this.theme = resolveTheme(theme);
    this.tooltip.setTheme(this.theme);
    if (this.data.length > 0) this.render();
  }

  setDateRange(startDate: string, endDate: string): void {
    this.config.startDate = startDate;
    this.config.endDate = endDate;
    if (this.data.length > 0) this.render();
  }

  destroy(): void {
    this.tooltip.destroy();
    this.container.innerHTML = '';
  }

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
    this.container.appendChild(calendar.build());
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const cells = this.container.querySelectorAll('.gh-day[data-date]');
    cells.forEach((cell) => {
      const el = cell as HTMLElement;
      const date = el.dataset.date || '';
      const count = parseInt(el.dataset.count || '0', 10);
      const activityData: ActivityData = { date, count };

      if (this.config.showTooltip) {
        el.addEventListener('mouseenter', () => {
          const content = this.config.tooltipFormatter
            ? this.config.tooltipFormatter(activityData)
            : this.defaultTooltipFormat(activityData);
          this.tooltip.show(el, content);
        });
        el.addEventListener('mouseleave', () => this.tooltip.hide());
      }
      if (this.config.onClick) {
        el.addEventListener('click', () => this.config.onClick?.(activityData));
      }
    });
  }

  private defaultTooltipFormat(data: ActivityData): string {
    if (data.count === 0) return `No contributions on ${data.date}`;
    const plural = data.count === 1 ? 'contribution' : 'contributions';
    return `${data.count} ${plural} on ${data.date}`;
  }

  private showLoading(): void {
    this.container.innerHTML = `<div class="gh-heatmap-loading">${this.config.loadingText || 'Loading...'}</div>`;
  }

  private showError(error: Error): void {
    this.container.innerHTML = `<div class="gh-heatmap-error">${this.config.errorText || 'Error loading data.'}</div>`;
    this.config.onError?.(error);
  }

  private buildUrl(baseUrl: string): string {
    const params = new URLSearchParams();
    const q = this.currentQuery;
    if (q.startDate) params.set('startDate', q.startDate);
    if (q.endDate) params.set('endDate', q.endDate);
    if (q.repository) params.set('repository', q.repository);
    if (q.author) params.set('author', q.author);
    if (q.branch) params.set('branch', q.branch);
    if (q.path) params.set('path', q.path);
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }
}
