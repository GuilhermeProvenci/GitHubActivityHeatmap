/**
 * Represents aggregated activity for a single day.
 */
export interface ActivityData {
  /** Date in ISO 8601 format (YYYY-MM-DD) */
  date: string;
  /** Number of commits on this date */
  count: number;
}

/**
 * Theme definition for heatmap visualization.
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
 * Configuration options for SVG heatmap generation.
 */
export interface HeatmapSVGOptions {
  /** Theme name ('dark', 'light', 'github') or a custom Theme object */
  theme?: string | Theme;
  /** Cell size in pixels (default: 10) */
  cellSize?: number;
  /** Gap between cells in pixels (default: 3) */
  cellGap?: number;
  /** Border radius for cells (default: 2) */
  borderRadius?: number;
  /** Week start day: 0 = Sunday, 1 = Monday (default: 0) */
  weekStart?: 0 | 1;
  /** Show month labels (default: true) */
  showMonthLabels?: boolean;
  /** Show day-of-week labels (default: true) */
  showDayLabels?: boolean;
  /** Show the "Less / More" legend (default: true) */
  showLegend?: boolean;
  /** Show the total contribution count header (default: true) */
  showHeader?: boolean;
  /** Custom header text. Use {{count}} as placeholder for the total. */
  headerText?: string;
  /** Background color for the entire SVG (default: transparent) */
  backgroundColor?: string;
  /** Font family (default: system font stack) */
  fontFamily?: string;
  /** Start date in YYYY-MM-DD format (default: 1 year ago) */
  startDate?: string;
  /** End date in YYYY-MM-DD format (default: today) */
  endDate?: string;
}

/**
 * Query options for filtering commits.
 */
export interface QueryOptions {
  startDate: string;
  endDate: string;
  repository?: string;
  author?: string;
  branch?: string;
  path?: string;
}

/**
 * Summary statistics for activity data.
 */
export interface ActivitySummary {
  totalCommits: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  averageCommitsPerDay: number;
  mostActiveDay: { date: string; count: number };
}

/**
 * Result from fetching public commits.
 */
export interface FetchResult {
  data: ActivityData[];
  authors: { login: string; commits: number }[];
}

/**
 * Frontend heatmap component configuration.
 */
export interface HeatmapConfig {
  endpoint: string;
  startDate?: string;
  endDate?: string;
  theme?: string | Theme;
  cellSize?: number;
  cellGap?: number;
  showTooltip?: boolean;
  tooltipFormatter?: (data: ActivityData) => string;
  onClick?: (data: ActivityData) => void;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  weekStart?: 0 | 1;
  loadingText?: string;
  errorText?: string;
  onError?: (error: Error) => void;
  queryOptions?: Partial<QueryOptions>;
}
