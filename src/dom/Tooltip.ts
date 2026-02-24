import type { Theme } from '../types';

export class Tooltip {
  private element: HTMLElement | null = null;

  constructor(private theme: Theme) {}

  show(target: HTMLElement, content: string): void {
    this.hide();
    const tooltip = document.createElement('div');
    tooltip.className = 'gh-tooltip';
    tooltip.textContent = content;
    tooltip.style.backgroundColor = this.theme.tooltip.background;
    tooltip.style.color = this.theme.tooltip.text;
    tooltip.style.border = `1px solid ${this.theme.tooltip.border}`;
    document.body.appendChild(tooltip);
    this.element = tooltip;

    const rect = target.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - tipRect.height - 8}px`;
  }

  hide(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
  }

  destroy(): void {
    this.hide();
  }
}
