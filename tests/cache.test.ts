import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryCache } from '../src/cache';

describe('MemoryCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores and retrieves values', () => {
    const cache = new MemoryCache<string>();
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('returns null for missing keys', () => {
    const cache = new MemoryCache();
    expect(cache.get('missing')).toBeNull();
  });

  it('expires entries after TTL', () => {
    const cache = new MemoryCache<string>(1000);
    cache.set('key', 'value');

    expect(cache.get('key')).toBe('value');

    vi.advanceTimersByTime(1001);

    expect(cache.get('key')).toBeNull();
  });

  it('supports custom TTL per entry', () => {
    const cache = new MemoryCache<string>(10000);
    cache.set('short', 'value', 500);
    cache.set('long', 'value', 5000);

    vi.advanceTimersByTime(600);

    expect(cache.get('short')).toBeNull();
    expect(cache.get('long')).toBe('value');
  });

  it('deletes specific keys', () => {
    const cache = new MemoryCache<string>();
    cache.set('a', '1');
    cache.set('b', '2');

    cache.delete('a');
    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBe('2');
  });

  it('clears all entries', () => {
    const cache = new MemoryCache<string>();
    cache.set('a', '1');
    cache.set('b', '2');

    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.get('a')).toBeNull();
  });

  it('tracks size correctly', () => {
    const cache = new MemoryCache<number>();
    expect(cache.size).toBe(0);

    cache.set('a', 1);
    expect(cache.size).toBe(1);

    cache.set('b', 2);
    expect(cache.size).toBe(2);

    cache.delete('a');
    expect(cache.size).toBe(1);
  });
});
