import type { ActivityData } from '@gh-heatmap/core';
import type { CacheStrategy } from './CacheStrategy';

/**
 * Minimal Redis client interface to avoid hard dependency on ioredis
 */
export interface RedisClient {
    get(key: string): Promise<string | null>;
    setex(key: string, seconds: number, value: string): Promise<string>;
    del(...keys: string[]): Promise<number>;
    flushdb(): Promise<string>;
}

/**
 * Redis-based cache for production/distributed deployments.
 * Requires an ioredis-compatible client to be injected.
 */
export class RedisCache implements CacheStrategy {
    constructor(private redisClient: RedisClient) { }

    async get(key: string): Promise<ActivityData[] | null> {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }

    async set(key: string, value: ActivityData[], ttl: number = 21600): Promise<void> {
        await this.redisClient.setex(key, ttl, JSON.stringify(value));
    }

    async delete(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async clear(): Promise<void> {
        await this.redisClient.flushdb();
    }
}
