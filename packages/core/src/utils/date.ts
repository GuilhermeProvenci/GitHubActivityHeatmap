/**
 * Formats a Date object to ISO 8601 date string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Parses a date string and returns a Date object
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
 * Validates that a date range is valid (start <= end)
 */
export function isValidDateRange(start: string, end: string): boolean {
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    return startDate <= endDate;
}

/**
 * Calculates the number of days between two date strings
 */
export function getDaysBetween(start: string, end: string): number {
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns a default start date (365 days ago) as ISO string
 */
export function getDefaultStartDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return formatDateISO(date);
}

/**
 * Returns today's date as ISO string
 */
export function getDefaultEndDate(): string {
    return formatDateISO(new Date());
}

/**
 * Generates an array of all dates between start and end (inclusive)
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
