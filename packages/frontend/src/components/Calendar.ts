import type { ActivityData, Theme } from '@gh-heatmap/core';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface CalendarOptions {
    startDate: string;
    endDate: string;
    weekStart: 0 | 1;
    showMonthLabels: boolean;
    showDayLabels: boolean;
    theme: Theme;
}

/**
 * Generates the calendar grid structure from activity data.
 */
export class Calendar {
    private dataMap: Map<string, number>;

    constructor(
        private data: ActivityData[],
        private options: CalendarOptions,
    ) {
        this.dataMap = new Map(data.map((d) => [d.date, d.count]));
    }

    /**
     * Builds the complete calendar DOM element
     */
    build(): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-activity-heatmap';

        // Month labels
        if (this.options.showMonthLabels) {
            wrapper.appendChild(this.buildMonthLabels());
        }

        // Main grid container
        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'flex';

        // Day labels
        if (this.options.showDayLabels) {
            gridContainer.appendChild(this.buildDayLabels());
        }

        // Calendar grid
        gridContainer.appendChild(this.buildGrid());

        wrapper.appendChild(gridContainer);

        // Legend
        wrapper.appendChild(this.buildLegend());

        return wrapper;
    }

    /**
     * Builds the month label row
     */
    private buildMonthLabels(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'gh-month-labels';

        const startDate = new Date(this.options.startDate + 'T00:00:00Z');
        const endDate = new Date(this.options.endDate + 'T00:00:00Z');

        const { theme } = this.options;
        const weekWidth = theme.grid.cellSize + theme.grid.gap;

        // Track which months we've already labeled
        let lastMonth = -1;
        const current = new Date(startDate);

        // Align to week start
        while (current.getUTCDay() !== this.options.weekStart) {
            current.setUTCDate(current.getUTCDate() - 1);
        }

        let weekIndex = 0;
        while (current <= endDate) {
            const month = current.getUTCMonth();
            if (month !== lastMonth) {
                const label = document.createElement('span');
                label.className = 'gh-month-label';
                label.textContent = MONTH_LABELS[month];
                label.style.position = 'absolute';
                label.style.left = `${weekIndex * weekWidth}px`;
                container.appendChild(label);
                lastMonth = month;
            }

            current.setUTCDate(current.getUTCDate() + 7);
            weekIndex++;
        }

        container.style.position = 'relative';
        container.style.height = '16px';
        container.style.width = `${weekIndex * weekWidth}px`;

        // Offset for day labels
        if (this.options.showDayLabels) {
            container.style.marginLeft = '28px';
        }

        return container;
    }

    /**
     * Builds the day-of-week labels column
     */
    private buildDayLabels(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'gh-calendar-labels';
        container.style.gap = `${this.options.theme.grid.gap}px`;

        const orderedDays = this.options.weekStart === 1
            ? [...DAY_LABELS.slice(1), DAY_LABELS[0]]
            : DAY_LABELS;

        for (let i = 0; i < 7; i++) {
            const label = document.createElement('span');
            label.className = 'gh-calendar-label';
            label.style.height = `${this.options.theme.grid.cellSize}px`;
            label.style.lineHeight = `${this.options.theme.grid.cellSize}px`;
            // Only show labels for Mon, Wed, Fri (indices 1, 3, 5 in original)
            label.textContent = i % 2 === 1 ? orderedDays[i] : '';
            label.style.fontSize = '10px';
            container.appendChild(label);
        }

        return container;
    }

    /**
     * Builds the main calendar grid of week columns
     */
    buildGrid(): HTMLElement {
        const grid = document.createElement('div');
        grid.className = 'gh-calendar';
        grid.style.gap = `${this.options.theme.grid.gap}px`;

        const startDate = new Date(this.options.startDate + 'T00:00:00Z');
        const endDate = new Date(this.options.endDate + 'T00:00:00Z');

        // Align start to the beginning of the week
        const current = new Date(startDate);
        while (current.getUTCDay() !== this.options.weekStart) {
            current.setUTCDate(current.getUTCDate() - 1);
        }

        while (current <= endDate) {
            const week = document.createElement('div');
            week.className = 'gh-week';
            week.style.gap = `${this.options.theme.grid.gap}px`;

            for (let d = 0; d < 7; d++) {
                const dateStr = this.formatDate(current);
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

    /**
     * Builds the legend showing intensity levels
     */
    private buildLegend(): HTMLElement {
        const legend = document.createElement('div');
        legend.className = 'gh-legend';

        const lessSpan = document.createElement('span');
        lessSpan.textContent = 'Less';
        legend.appendChild(lessSpan);

        const colorLevels = [
            this.options.theme.colors.empty,
            this.options.theme.colors.level1,
            this.options.theme.colors.level2,
            this.options.theme.colors.level3,
            this.options.theme.colors.level4,
        ];

        for (const color of colorLevels) {
            const cell = document.createElement('span');
            cell.className = 'gh-legend-cell';
            cell.style.backgroundColor = color;
            cell.style.width = `${this.options.theme.grid.cellSize}px`;
            cell.style.height = `${this.options.theme.grid.cellSize}px`;
            cell.style.borderRadius = `${this.options.theme.grid.borderRadius}px`;
            cell.style.display = 'inline-block';
            legend.appendChild(cell);
        }

        const moreSpan = document.createElement('span');
        moreSpan.textContent = 'More';
        legend.appendChild(moreSpan);

        return legend;
    }

    /**
     * Returns the intensity color for a given commit count
     */
    getIntensityColor(count: number): string {
        const { colors } = this.options.theme;

        if (count === 0) return colors.empty;

        // Calculate max from data to determine intensity levels
        const maxCount = Math.max(...this.data.map((d) => d.count), 1);
        const ratio = count / maxCount;

        if (ratio <= 0.25) return colors.level1;
        if (ratio <= 0.5) return colors.level2;
        if (ratio <= 0.75) return colors.level3;
        return colors.level4;
    }

    /**
     * Formats a Date object to YYYY-MM-DD
     */
    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
