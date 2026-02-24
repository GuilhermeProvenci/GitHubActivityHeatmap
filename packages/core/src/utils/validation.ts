import type { QueryOptions } from '../types/activity';
import { isValidDateRange } from './date';

/**
 * Validates query options and throws descriptive errors
 * @throws Error if validation fails
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

/**
 * Validates repository format (owner/repo)
 */
export function isValidRepositoryFormat(repo: string): boolean {
    return /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo);
}

/**
 * Validates a date string is in YYYY-MM-DD format
 */
export function isValidDateFormat(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}
