import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import type { ActivityData } from '@gh-heatmap/core';
import type { CacheStrategy } from './CacheStrategy';

/**
 * File-system based cache implementation.
 * Persists cache across restarts, no external dependencies.
 * Best for single-server deployments.
 */
export class FileCache implements CacheStrategy {
    constructor(private cacheDir: string) { }

    async get(key: string): Promise<ActivityData[] | null> {
        const filePath = this.getFilePath(key);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const { data, expires } = JSON.parse(content);

            if (Date.now() > expires) {
                await this.delete(key);
                return null;
            }

            return data;
        } catch {
            return null;
        }
    }

    async set(key: string, value: ActivityData[], ttl: number = 21600): Promise<void> {
        const filePath = this.getFilePath(key);
        const content = JSON.stringify({
            data: value,
            expires: Date.now() + ttl * 1000,
        });

        await fs.mkdir(this.cacheDir, { recursive: true });
        await fs.writeFile(filePath, content, 'utf-8');
    }

    async delete(key: string): Promise<void> {
        const filePath = this.getFilePath(key);
        try {
            await fs.unlink(filePath);
        } catch {
            // File doesn't exist - ignore
        }
    }

    async clear(): Promise<void> {
        try {
            const files = await fs.readdir(this.cacheDir);
            await Promise.all(
                files.map((file) => fs.unlink(path.join(this.cacheDir, file))),
            );
        } catch {
            // Directory doesn't exist - ignore
        }
    }

    private getFilePath(key: string): string {
        const hash = crypto.createHash('sha256').update(key).digest('hex');
        return path.join(this.cacheDir, `${hash}.json`);
    }
}
