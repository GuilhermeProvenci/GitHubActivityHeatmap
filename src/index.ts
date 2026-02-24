// Types
export type {
  ActivityData,
  Theme,
  HeatmapSVGOptions,
  QueryOptions,
  ActivitySummary,
  FetchResult,
  HeatmapConfig,
} from './types';

// SVG generation
export { generateHeatmapSVG } from './svg';

// Themes
export { themes, resolveTheme } from './themes';

// Utilities
export {
  formatDateISO,
  parseDate,
  isValidDateRange,
  getDaysBetween,
  getDefaultStartDate,
  getDefaultEndDate,
  getDateRange,
  isValidRepositoryFormat,
  isValidDateFormat,
  validateQueryOptions,
} from './utils';

// GitHub fetcher
export { fetchPublicCommits } from './github';

// Cache
export { MemoryCache } from './cache';
