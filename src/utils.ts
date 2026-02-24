import type { QueryOptions } from './types';

/**
 * Formats a Date object to ISO 8601 date string (YYYY-MM-DD).
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parses a date string and returns a Date object.
 * @throws Error if the date string is invalid
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString + 'T00:00:00Z');
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`);
  }
  return date;
}

/**
 * Validates that a date range is valid (start <= end).
 */
export function isValidDateRange(start: string, end: string): boolean {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  return startDate <= endDate;
}

/**
 * Calculates the number of days between two date strings.
 */
export function getDaysBetween(start: string, end: string): number {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns a default start date (365 days ago) as ISO string.
 */
export function getDefaultStartDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return formatDateISO(date);
}

/**
 * Returns today's date as ISO string.
 */
export function getDefaultEndDate(): string {
  return formatDateISO(new Date());
}

/**
 * Generates an array of all dates between start and end (inclusive).
 */
export function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = parseDate(start);
  const endDate = parseDate(end);

  while (current <= endDate) {
    dates.push(formatDateISO(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

/**
 * Validates repository format (owner/repo).
 */
export function isValidRepositoryFormat(repo: string): boolean {
  return /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo);
}

/**
 * Validates a date string is in YYYY-MM-DD format.
 */
export function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Validates query options and throws descriptive errors.
 */
export function validateQueryOptions(options: QueryOptions): void {
  if (!options.startDate || !options.endDate) {
    throw new Error('startDate and endDate are required');
  }
  if (!isValidDateRange(options.startDate, options.endDate)) {
    throw new Error('startDate must be before endDate');
  }
  if (options.repository && !isValidRepositoryFormat(options.repository)) {
    throw new Error('Repository must be in format "owner/repo"');
  }
}
