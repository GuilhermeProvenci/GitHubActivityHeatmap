import type { Theme } from '@gh-heatmap/core';

/**
 * Tooltip component for showing activity details on hover.
 * Creates a fixed-position tooltip near the hovered cell.
 */
export class Tooltip {
    private element: HTMLElement | null = null;

    constructor(private theme: Theme) { }

    /**
     * Shows the tooltip near the target element
     */
    show(target: HTMLElement, content: string): void {
        this.hide();

        const tooltip = document.createElement('div');
        tooltip.className = 'gh-tooltip';
        tooltip.textContent = content;
        tooltip.style.backgroundColor = this.theme.tooltip.background;
        tooltip.style.color = this.theme.tooltip.text;
        tooltip.style.borderColor = this.theme.tooltip.border;
        tooltip.style.border = `1px solid ${this.theme.tooltip.border}`;

        document.body.appendChild(tooltip);
        this.element = tooltip;

        // Position above the target
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
    }

    /**
     * Hides and removes the tooltip from the DOM
     */
    hide(): void {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    /**
     * Updates the theme used for tooltip styling
     */
    setTheme(theme: Theme): void {
        this.theme = theme;
    }

    /**
     * Cleans up the tooltip
     */
    destroy(): void {
        this.hide();
    }
}
