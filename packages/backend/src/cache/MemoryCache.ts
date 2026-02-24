import type { ActivityData } from '@gh-heatmap/core';
import type { CacheStrategy } from './CacheStrategy';

interface CacheEntry {
    data: ActivityData[];
    expires: number;
}

/**
 * In-memory cache implementation with TTL expiration.
 * Best for development and single-instance deployments.
 */
export class MemoryCache implements CacheStrategy {
    private cache = new Map<string, CacheEntry>();

    async get(key: string): Promise<ActivityData[] | null> {
        const entry = this.cache.get(key);

        if (!entry) return null;

        if (Date.now() > entry.expires) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    async set(key: string, value: ActivityData[], ttl: number = 21600): Promise<void> {
        this.cache.set(key, {
            data: value,
            expires: Date.now() + ttl * 1000,
        });
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }

    /**
     * Returns the number of items currently in cache
     */
    get size(): number {
        return this.cache.size;
    }
}
