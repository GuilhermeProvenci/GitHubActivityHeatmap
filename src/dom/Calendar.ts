import type { ActivityData, Theme } from '../types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export interface CalendarOptions {
  startDate: string;
  endDate: string;
  weekStart: 0 | 1;
  showMonthLabels: boolean;
  showDayLabels: boolean;
  theme: Theme;
}

export class Calendar {
  private dataMap: Map<string, number>;

  constructor(
    private data: ActivityData[],
    private options: CalendarOptions,
  ) {
    this.dataMap = new Map(data.map((d) => [d.date, d.count]));
  }

  build(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'gh-activity-heatmap';
    if (this.options.showMonthLabels) wrapper.appendChild(this.buildMonthLabels());
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'flex';
    if (this.options.showDayLabels) gridContainer.appendChild(this.buildDayLabels());
    gridContainer.appendChild(this.buildGrid());
    wrapper.appendChild(gridContainer);
    wrapper.appendChild(this.buildLegend());
    return wrapper;
  }

  private buildMonthLabels(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'gh-month-labels';
    const startDate = new Date(this.options.startDate + 'T00:00:00Z');
    const endDate = new Date(this.options.endDate + 'T00:00:00Z');
    const weekWidth = this.options.theme.grid.cellSize + this.options.theme.grid.gap;
    let lastMonth = -1;
    let lastLabelX = -Infinity;
    const minLabelSpacing = Math.max(weekWidth * 3, 40); // need at least ~40px space
    const current = new Date(startDate);
    while (current.getUTCDay() !== this.options.weekStart) current.setUTCDate(current.getUTCDate() - 1);
    let weekIndex = 0;
    while (current <= endDate) {
      const month = current.getUTCMonth();
      if (month !== lastMonth) {
        const x = weekIndex * weekWidth;
        if (x - lastLabelX >= minLabelSpacing) {
          const label = document.createElement('span');
          label.className = 'gh-month-label';
          label.textContent = MONTH_LABELS[month];
          label.style.position = 'absolute';
          label.style.left = `${x}px`;
          container.appendChild(label);
          lastLabelX = x;
          lastMonth = month;
        }
      }
      current.setUTCDate(current.getUTCDate() + 7);
      weekIndex++;
    }
    container.style.position = 'relative';
    container.style.height = '16px';
    container.style.width = `${weekIndex * weekWidth}px`;
    if (this.options.showDayLabels) container.style.marginLeft = '32px';
    return container;
  }

  private buildDayLabels(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'gh-calendar-labels';
    container.style.width = '32px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.paddingRight = '4px';
    container.style.boxSizing = 'border-box';
    container.style.textAlign = 'right';
    container.style.gap = `${this.options.theme.grid.gap}px`;
    const orderedDays = this.options.weekStart === 1 ? [...DAY_LABELS.slice(1), DAY_LABELS[0]] : DAY_LABELS;
    for (let i = 0; i < 7; i++) {
      const label = document.createElement('span');
      label.className = 'gh-calendar-label';
      label.style.height = `${this.options.theme.grid.cellSize}px`;
      label.style.lineHeight = `${this.options.theme.grid.cellSize}px`;
      label.textContent = i % 2 === 1 ? orderedDays[i] : '';
      label.style.fontSize = '10px';
      container.appendChild(label);
    }
    return container;
  }

  buildGrid(): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'gh-calendar';
    grid.style.gap = `${this.options.theme.grid.gap}px`;
    const startDate = new Date(this.options.startDate + 'T00:00:00Z');
    const endDate = new Date(this.options.endDate + 'T00:00:00Z');
    const current = new Date(startDate);
    while (current.getUTCDay() !== this.options.weekStart) current.setUTCDate(current.getUTCDate() - 1);

    while (current <= endDate) {
      const week = document.createElement('div');
      week.className = 'gh-week';
      week.style.gap = `${this.options.theme.grid.gap}px`;
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().split('T')[0];
        const count = this.dataMap.get(dateStr) || 0;
        const isInRange = current >= startDate && current <= endDate;
        const cell = document.createElement('div');
        cell.className = 'gh-day';
        cell.style.width = `${this.options.theme.grid.cellSize}px`;
        cell.style.height = `${this.options.theme.grid.cellSize}px`;
        cell.style.borderRadius = `${this.options.theme.grid.borderRadius}px`;
        if (isInRange) {
          cell.style.backgroundColor = this.getIntensityColor(count);
          cell.dataset.date = dateStr;
          cell.dataset.count = String(count);
        } else {
          cell.style.backgroundColor = 'transparent';
          cell.style.outline = 'none';
        }
        week.appendChild(cell);
        current.setUTCDate(current.getUTCDate() + 1);
      }
      grid.appendChild(week);
    }
    return grid;
  }

  private buildLegend(): HTMLElement {
    const legend = document.createElement('div');
    legend.className = 'gh-legend';
    const less = document.createElement('span');
    less.textContent = 'Less';
    legend.appendChild(less);
    const levels = [
      this.options.theme.colors.empty,
      this.options.theme.colors.level1,
      this.options.theme.colors.level2,
      this.options.theme.colors.level3,
      this.options.theme.colors.level4,
    ];
    for (const color of levels) {
      const cell = document.createElement('span');
      cell.className = 'gh-legend-cell';
      cell.style.backgroundColor = color;
      cell.style.width = `${this.options.theme.grid.cellSize}px`;
      cell.style.height = `${this.options.theme.grid.cellSize}px`;
      cell.style.borderRadius = `${this.options.theme.grid.borderRadius}px`;
      cell.style.display = 'inline-block';
      legend.appendChild(cell);
    }
    const more = document.createElement('span');
    more.textContent = 'More';
    legend.appendChild(more);
    return legend;
  }

  getIntensityColor(count: number): string {
    const { colors } = this.options.theme;
    if (count === 0) return colors.empty;
    const maxCount = Math.max(...this.data.map((d) => d.count), 1);
    const ratio = count / maxCount;
    if (ratio <= 0.25) return colors.level1;
    if (ratio <= 0.5) return colors.level2;
    if (ratio <= 0.75) return colors.level3;
    return colors.level4;
  }
}
