import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchPublicCommits } from '../src/github';

describe('fetchPublicCommits', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws on invalid repo format', async () => {
    await expect(fetchPublicCommits('bad', '2024-01-01', '2024-12-31')).rejects.toThrow(
      'Invalid repository format',
    );
  });

  it('fetches and aggregates commits', async () => {
    const mockCommits = [
      {
        commit: { author: { date: '2024-06-15T10:00:00Z', name: 'Alice' } },
        author: { login: 'alice' },
      },
      {
        commit: { author: { date: '2024-06-15T14:00:00Z', name: 'Alice' } },
        author: { login: 'alice' },
      },
      {
        commit: { author: { date: '2024-06-16T09:00:00Z', name: 'Bob' } },
        author: { login: 'bob' },
      },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCommits),
      headers: new Headers(),
    } as Response);

    const result = await fetchPublicCommits('owner/repo', '2024-06-01', '2024-06-30');

    expect(result.data).toHaveLength(2);
    expect(result.data.find((d) => d.date === '2024-06-15')?.count).toBe(2);
    expect(result.data.find((d) => d.date === '2024-06-16')?.count).toBe(1);

    expect(result.authors).toHaveLength(2);
    expect(result.authors[0]).toEqual({ login: 'alice', commits: 2 });
    expect(result.authors[1]).toEqual({ login: 'bob', commits: 1 });
  });

  it('handles rate limit gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      headers: new Headers({ 'x-ratelimit-remaining': '0' }),
    } as Response);

    const result = await fetchPublicCommits('owner/repo', '2024-01-01', '2024-12-31');
    expect(result.data).toEqual([]);
    expect(result.authors).toEqual([]);
  });

  it('throws on non-rate-limit API errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers({ 'x-ratelimit-remaining': '59' }),
    } as Response);

    await expect(
      fetchPublicCommits('owner/repo', '2024-01-01', '2024-12-31'),
    ).rejects.toThrow('GitHub API error: 404 Not Found');
  });

  it('passes author filter in URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
      headers: new Headers(),
    } as Response);

    await fetchPublicCommits('owner/repo', '2024-01-01', '2024-12-31', 'alice');

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('author=alice');
  });
});
