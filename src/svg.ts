import type { ActivityData, Theme, HeatmapSVGOptions } from './types';
import { resolveTheme } from './themes';

export type { HeatmapSVGOptions };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEFAULT_OPTIONS: Required<Omit<HeatmapSVGOptions, 'startDate' | 'endDate'>> = {
  theme: 'dark',
  cellSize: 10,
  cellGap: 3,
  borderRadius: 2,
  weekStart: 0,
  showMonthLabels: true,
  showDayLabels: true,
  showLegend: true,
  showHeader: true,
  headerText: '{{count}} contributions in the last year',
  backgroundColor: 'transparent',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif",
};

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getTextColor(theme: string | Theme | undefined): string {
  if (!theme || theme === 'dark') return '#8b949e';
  if (theme === 'light' || theme === 'github') return '#57606a';
  return '#8b949e';
}

function formatTooltip(dateStr: string, count: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  const month = MONTHS[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const formatted = `${month} ${day}, ${year}`;

  if (count === 0) return `No contributions on ${formatted}`;
  const plural = count === 1 ? 'contribution' : 'contributions';
  return `${count} ${plural} on ${formatted}`;
}

/**
 * Generates a GitHub-style contribution heatmap as a standalone SVG string.
 *
 * The SVG is fully self-contained - no external CSS, JS, or fonts required.
 * It can be served as `image/svg+xml`, embedded in `<img>` tags, or used
 * in GitHub READMEs.
 *
 * @example
 * ```ts
 * import { generateHeatmapSVG } from 'gh-heatmap';
 *
 * const svg = generateHeatmapSVG(activityData, { theme: 'dark' });
 * res.setHeader('Content-Type', 'image/svg+xml');
 * res.send(svg);
 * ```
 */
export function generateHeatmapSVG(
  data: ActivityData[],
  options?: HeatmapSVGOptions,
): string {
  // Filter out undefined values so they don't override defaults
  const defined: Record<string, unknown> = {};
  if (options) {
    for (const [k, v] of Object.entries(options)) {
      if (v !== undefined) defined[k] = v;
    }
  }
  const opts = { ...DEFAULT_OPTIONS, ...defined } as Required<
    Omit<HeatmapSVGOptions, 'startDate' | 'endDate'>
  > &
    Pick<HeatmapSVGOptions, 'startDate' | 'endDate'>;
  const theme = resolveTheme(opts.theme);

  const cellSize = opts.cellSize;
  const gap = opts.cellGap;
  const borderRadius = opts.borderRadius;
  const weekWidth = cellSize + gap;

  // Build data map
  const dataMap = new Map(data.map((d) => [d.date, d.count]));
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  function getColor(count: number): string {
    if (count === 0) return theme.colors.empty;
    const r = count / maxCount;
    if (r <= 0.25) return theme.colors.level1;
    if (r <= 0.5) return theme.colors.level2;
    if (r <= 0.75) return theme.colors.level3;
    return theme.colors.level4;
  }

  // Date calculations
  const now = new Date();
  const endDate = opts.endDate
    ? new Date(opts.endDate + 'T00:00:00Z')
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startDate = opts.startDate
    ? new Date(opts.startDate + 'T00:00:00Z')
    : new Date(Date.UTC(endDate.getUTCFullYear() - 1, endDate.getUTCMonth(), endDate.getUTCDate()));

  // Align to week start
  const cursor = new Date(startDate);
  while (cursor.getUTCDay() !== opts.weekStart) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  // Layout offsets
  const dayLabelWidth = opts.showDayLabels ? 32 : 0;
  const monthLabelHeight = opts.showMonthLabels ? 18 : 0;
  const headerHeight = opts.showHeader ? 24 : 0;
  const legendHeight = opts.showLegend ? 22 : 0;

  // Build cells
  const cells: string[] = [];
  const weeks: Date[][] = [];
  const weekCursor = new Date(cursor);

  while (weekCursor <= endDate) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(weekCursor));
      weekCursor.setUTCDate(weekCursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  const gridOffsetX = dayLabelWidth;
  const gridOffsetY = headerHeight + monthLabelHeight;

  for (let w = 0; w < weeks.length; w++) {
    for (let d = 0; d < 7; d++) {
      const day = weeks[w][d];
      const dateStr = day.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      const inRange = day >= startDate && day <= endDate;

      const x = gridOffsetX + w * weekWidth;
      const y = gridOffsetY + d * weekWidth;

      if (inRange) {
        const color = getColor(count);
        cells.push(
          `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${borderRadius}" ry="${borderRadius}" fill="${color}" data-date="${dateStr}" data-count="${count}"><title>${formatTooltip(dateStr, count)}</title></rect>`,
        );
      }
    }
  }

  const totalGridWidth = weeks.length * weekWidth;
  const totalGridHeight = 7 * weekWidth;

  // Month labels
  const monthLabels: string[] = [];
  if (opts.showMonthLabels) {
    let lastMonth = -1;
    let lastLabelX = -Infinity;
    const minLabelSpacing = Math.max(weekWidth * 3, 40); // need at least ~40px space
    for (let w = 0; w < weeks.length; w++) {
      const firstDayOfWeek = weeks[w][0];
      const m = firstDayOfWeek.getUTCMonth();
      if (m !== lastMonth) {
        const x = gridOffsetX + w * weekWidth;
        if (x - lastLabelX >= minLabelSpacing) {
          monthLabels.push(
            `<text x="${x}" y="${headerHeight + 12}" fill="${getTextColor(opts.theme)}" font-size="12">${MONTHS[m]}</text>`,
          );
          lastLabelX = x;
          lastMonth = m;
        }
      }
    }
  }

  // Day labels
  const dayLabels: string[] = [];
  if (opts.showDayLabels) {
    const orderedDays = opts.weekStart === 1 ? [...DAYS.slice(1), DAYS[0]] : DAYS;
    for (const idx of [1, 3, 5]) {
      const y = gridOffsetY + idx * weekWidth + cellSize - 1;
      dayLabels.push(
        `<text x="${dayLabelWidth - 6}" y="${y}" fill="${getTextColor(opts.theme)}" font-size="12" text-anchor="end">${orderedDays[idx]}</text>`,
      );
    }
  }

  // Header
  let headerSvg = '';
  if (opts.showHeader) {
    const text = opts.headerText.replace('{{count}}', totalCount.toLocaleString());
    headerSvg = `<text x="${gridOffsetX}" y="16" fill="${getTextColor(opts.theme)}" font-size="14" font-weight="normal">${escapeXml(text)}</text>`;
  }

  // Legend
  let legendSvg = '';
  if (opts.showLegend) {
    const legendY = gridOffsetY + totalGridHeight + 6;
    const legendColors = [
      theme.colors.empty,
      theme.colors.level1,
      theme.colors.level2,
      theme.colors.level3,
      theme.colors.level4,
    ];
    const legendCellSize = cellSize;
    const legendGap = 3;
    const legendTotalWidth = 5 * (legendCellSize + legendGap) + 60;
    const legendStartX = gridOffsetX + totalGridWidth - legendTotalWidth;

    let lx = legendStartX;
    legendSvg += `<text x="${lx}" y="${legendY + legendCellSize - 1}" fill="${getTextColor(opts.theme)}" font-size="11">Less</text>`;
    lx += 30;

    for (const color of legendColors) {
      legendSvg += `<rect x="${lx}" y="${legendY}" width="${legendCellSize}" height="${legendCellSize}" rx="${borderRadius}" ry="${borderRadius}" fill="${color}"/>`;
      lx += legendCellSize + legendGap;
    }

    legendSvg += `<text x="${lx + 2}" y="${legendY + legendCellSize - 1}" fill="${getTextColor(opts.theme)}" font-size="11">More</text>`;
  }

  // Compute SVG dimensions
  const svgWidth = gridOffsetX + totalGridWidth + 2;
  const svgHeight = gridOffsetY + totalGridHeight + legendHeight + 8;

  // Assemble SVG
  const bgRect =
    opts.backgroundColor !== 'transparent'
      ? `<rect width="100%" height="100%" fill="${opts.backgroundColor}" rx="6"/>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" font-family="${escapeXml(opts.fontFamily)}">
${bgRect}
${headerSvg}
${monthLabels.join('\n')}
${dayLabels.join('\n')}
${cells.join('\n')}
${legendSvg}
</svg>`;
}
