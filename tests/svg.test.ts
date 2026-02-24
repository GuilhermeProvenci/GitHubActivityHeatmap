import { describe, it, expect } from 'vitest';
import { generateHeatmapSVG } from '../src/svg';
import type { ActivityData } from '../src/types';

function makeSampleData(): ActivityData[] {
  const data: ActivityData[] = [];
  const start = new Date('2024-01-01T00:00:00Z');
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    data.push({
      date: d.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10),
    });
  }
  return data;
}

describe('generateHeatmapSVG', () => {
  const data = makeSampleData();

  it('returns a valid SVG string', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('</svg>');
  });

  it('contains data-date attributes on cells', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(svg).toContain('data-date="2024-01-01"');
    expect(svg).toContain('data-date="2024-06-15"');
  });

  it('includes month labels by default', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    // Months with enough space get labels (edge months may be skipped to avoid overlap)
    expect(svg).toContain('>Mar<');
    expect(svg).toContain('>Jun<');
    expect(svg).toContain('>Sep<');
  });

  it('hides month labels when showMonthLabels is false', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      showMonthLabels: false,
    });
    expect(svg).not.toContain('>Jan<');
  });

  it('includes day labels by default', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(svg).toContain('>Mon<');
    expect(svg).toContain('>Wed<');
    expect(svg).toContain('>Fri<');
  });

  it('hides day labels when showDayLabels is false', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      showDayLabels: false,
    });
    expect(svg).not.toContain('>Mon<');
  });

  it('includes legend by default', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(svg).toContain('>Less<');
    expect(svg).toContain('>More<');
  });

  it('hides legend when showLegend is false', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      showLegend: false,
    });
    expect(svg).not.toContain('>Less<');
    expect(svg).not.toContain('>More<');
  });

  it('includes header with contribution count', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(svg).toContain('contributions in the last year');
  });

  it('supports custom header text with {{count}} placeholder', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      headerText: 'Total: {{count}} commits',
    });
    expect(svg).toContain('Total:');
    expect(svg).toContain('commits');
  });

  it('hides header when showHeader is false', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      showHeader: false,
    });
    expect(svg).not.toContain('contributions in the last year');
  });

  it('applies custom cellSize', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      cellSize: 15,
    });
    expect(svg).toContain('width="15"');
    expect(svg).toContain('height="15"');
  });

  it('applies background color', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      backgroundColor: '#1a1a2e',
    });
    expect(svg).toContain('fill="#1a1a2e"');
  });

  it('uses theme colors', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      theme: 'light',
    });
    expect(svg).toContain('#ebedf0'); // light theme empty color
  });

  it('handles empty data', () => {
    const svg = generateHeatmapSVG([], {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('supports weekStart Monday', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      weekStart: 1,
    });
    expect(svg).toContain('>Tue<');
    expect(svg).toContain('>Thu<');
  });

  it('does not include background rect when transparent', () => {
    const svg = generateHeatmapSVG(data, {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      backgroundColor: 'transparent',
    });
    expect(svg).not.toContain('fill="transparent" rx="6"');
  });
});
