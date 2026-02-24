import type { ActivityData, FetchResult } from './types';

interface RawCommit {
  commit?: {
    author?: { date?: string; name?: string };
  };
  author?: { login?: string };
}

import { formatDateISO, getDefaultEndDate, getDefaultStartDate } from './utils';

/**
 * Fetches commits from a public GitHub repository using the REST API.
 * No token required for public repos.
 *
 * Returns aggregated activity data (date + count) and a list of unique authors
 * sorted by commit count.
 *
 * @param repo - Repository in "owner/repo" format
 * @param startDate - Optional start date in YYYY-MM-DD format (default: 365 days ago)
 * @param endDate - Optional end date in YYYY-MM-DD format (default: today)
 * @param authorFilter - Optional GitHub username to filter commits
 */
export async function fetchPublicCommits(
  repo: string,
  startDate: string | undefined = getDefaultStartDate(),
  endDate: string | undefined = getDefaultEndDate(),
  authorFilter?: string,
): Promise<FetchResult> {
  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    throw new Error(`Invalid repository format: "${repo}". Expected "owner/repo".`);
  }

  const perPage = 100;
  const commits: RawCommit[] = [];
  let page = 1;
  let hasMore = true;

  const baseUrl = `https://api.github.com/repos/${owner}/${repoName}/commits`;

  while (hasMore && page <= 10) {
    let url = `${baseUrl}?since=${startDate}T00:00:00Z&until=${endDate}T23:59:59Z&per_page=${perPage}&page=${page}`;
    if (authorFilter) {
      url += `&author=${encodeURIComponent(authorFilter)}`;
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'gh-heatmap',
    };

    if (typeof process !== 'undefined' && process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) {
      const remaining = res.headers.get('x-ratelimit-remaining');
      if (remaining === '0') {
        break;
      }
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    commits.push(...data);
    hasMore = data.length === perPage;
    page++;
  }

  // Aggregate by date
  const dateMap = new Map<string, number>();
  const authorMap = new Map<string, number>();

  for (const commit of commits) {
    const dateStr = commit.commit?.author?.date;
    if (!dateStr) continue;
    const date = dateStr.split('T')[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);

    const login = commit.author?.login || commit.commit?.author?.name || 'unknown';
    authorMap.set(login, (authorMap.get(login) || 0) + 1);
  }

  const data: ActivityData[] = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const authors = Array.from(authorMap.entries())
    .map(([login, commits]) => ({ login, commits }))
    .sort((a, b) => b.commits - a.commits);

  return { data, authors };
}
