/**
 * Simple in-memory cache with TTL expiration.
 */
export class MemoryCache<T = unknown> {
  private cache = new Map<string, { data: T; expires: number }>();

  constructor(private defaultTtlMs: number = 5 * 60 * 1000) {}

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, value: T, ttlMs?: number): void {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
