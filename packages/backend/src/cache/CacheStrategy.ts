import type { ActivityData, QueryOptions } from '@gh-heatmap/core';

/**
 * Interface for cache strategy implementations
 */
export interface CacheStrategy {
    get(key: string): Promise<ActivityData[] | null>;
    set(key: string, value: ActivityData[], ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}

/**
 * Generates a deterministic cache key from query options.
 * Key format: repository::startDate::endDate[::author:name][::branch:name][::path:name]
 */
export function generateCacheKey(options: QueryOptions): string {
    const parts = [
        options.repository || 'default',
        options.startDate,
        options.endDate,
    ];

    if (options.author) parts.push(`author:${options.author}`);
    if (options.branch) parts.push(`branch:${options.branch}`);
    if (options.path) parts.push(`path:${options.path}`);

    return parts.join('::');
}
