import { Octokit } from '@octokit/rest';
import type {
    ActivityData,
    ActivitySummary,
    AggregatorConfig,
    QueryOptions,
} from '@gh-heatmap/core';
import { validateQueryOptions } from '@gh-heatmap/core';
import { RateLimiter } from '../rate-limiter';
import { generateCacheKey, MemoryCache } from '../cache';
import type { CacheStrategy } from '../cache';
import { FileCache } from '../cache/FileCache';
import { AggregationError } from '../errors';

/**
 * Core aggregation service for fetching and aggregating GitHub commit activity.
 * Exposes only date + count data, never commit messages, hashes, or author details.
 */
export class GitHubAggregator {
    private octokit: Octokit;
    private config: AggregatorConfig;
    private rateLimiter: RateLimiter;
    private cache: CacheStrategy;

    constructor(config: AggregatorConfig) {
        this.config = config;
        this.octokit = new Octokit({
            auth: config.githubToken,
        });
        this.rateLimiter = new RateLimiter();
        this.cache = this.initializeCache(config);
    }

    /**
     * Initializes the appropriate cache strategy based on config
     */
    private initializeCache(config: AggregatorConfig): CacheStrategy {
        const cacheConfig = config.cache;
        if (!cacheConfig) return new MemoryCache();

        switch (cacheConfig.strategy) {
            case 'file':
                return new FileCache(
                    (cacheConfig.options?.['cacheDir'] as string) || './.cache',
                );
            case 'redis':
                // Redis requires external client injection; fall back to memory
                return new MemoryCache();
            case 'memory':
            default:
                return new MemoryCache();
        }
    }

    /**
     * Sets a custom cache strategy (e.g. RedisCache with injected client)
     */
    setCache(cache: CacheStrategy): void {
        this.cache = cache;
    }

    /**
     * Aggregates commit activity from repository with flexible filtering
     */
    async aggregateActivity(options: QueryOptions): Promise<ActivityData[]> {
        validateQueryOptions(options);

        // Check cache first
        const cacheKey = generateCacheKey(options);
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        try {
            const commits = await this.fetchCommits(options);
            const data = this.aggregateByDate(commits);

            // Store in cache
            await this.cache.set(cacheKey, data, this.config.cache?.ttl);

            return data;
        } catch (error) {
            throw new AggregationError(
                'Failed to fetch commits from GitHub API',
                error instanceof Error ? error : undefined,
            );
        }
    }

    /**
     * Fetches commits with advanced filtering
     */
    private async fetchCommits(options: QueryOptions) {
        const {
            startDate,
            endDate,
            repository = this.config.repository,
            author,
            branch,
            path,
        } = options;

        const [owner, repo] = repository.split('/');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
            owner,
            repo,
            since: `${startDate}T00:00:00Z`,
            until: `${endDate}T23:59:59Z`,
            per_page: 100,
        };

        if (author) params.author = author;
        if (branch) params.sha = branch;
        if (path) params.path = path;

        return this.paginateCommits(params);
    }

    /**
     * Handles pagination for large commit histories
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async paginateCommits(params: any): Promise<any[]> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const commits: any[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            await this.rateLimiter.checkLimit();

            const response = await this.octokit.repos.listCommits({
                ...params,
                page,
            });

            commits.push(...response.data);
            hasMore = response.data.length === 100;
            page++;

            // Update rate limiter from response headers
            this.rateLimiter.updateFromHeaders(
                response.headers as Record<string, string | number | undefined>,
            );
        }

        return commits;
    }

    /**
     * Aggregates commits by date, returning only date + count
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private aggregateByDate(commits: any[]): ActivityData[] {
        const activityMap = new Map<string, number>();

        for (const commit of commits) {
            const dateStr = commit.commit?.author?.date;
            if (!dateStr) continue;

            const date = dateStr.split('T')[0];
            activityMap.set(date, (activityMap.get(date) || 0) + 1);
        }

        return Array.from(activityMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    /**
     * Gets activity summary statistics
     */
    async getActivitySummary(options: QueryOptions): Promise<ActivitySummary> {
        const data = await this.aggregateActivity(options);

        return {
            totalCommits: data.reduce((sum, d) => sum + d.count, 0),
            activeDays: data.filter((d) => d.count > 0).length,
            longestStreak: this.calculateLongestStreak(data),
            currentStreak: this.calculateCurrentStreak(data),
            averageCommitsPerDay: this.calculateAverage(data),
            mostActiveDay: this.findMostActiveDay(data),
        };
    }

    /**
     * Aggregates activity across multiple authors
     */
    async aggregateByAuthors(
        authors: string[],
        options: Omit<QueryOptions, 'author'>,
    ): Promise<Map<string, ActivityData[]>> {
        const results = new Map<string, ActivityData[]>();

        for (const author of authors) {
            const data = await this.aggregateActivity({
                ...options,
                author,
            } as QueryOptions);
            results.set(author, data);
        }

        return results;
    }

    /**
     * Aggregates activity across multiple repositories
     */
    async aggregateByRepositories(
        repositories: string[],
        options: Omit<QueryOptions, 'repository'>,
    ): Promise<Map<string, ActivityData[]>> {
        const results = new Map<string, ActivityData[]>();

        for (const repository of repositories) {
            const data = await this.aggregateActivity({
                ...options,
                repository,
            } as QueryOptions);
            results.set(repository, data);
        }

        return results;
    }

    /**
     * Combines activity from multiple queries into a unified view
     */
    async aggregateCombined(queries: QueryOptions[]): Promise<ActivityData[]> {
        const allData = await Promise.all(
            queries.map((query) => this.aggregateActivity(query)),
        );

        const merged = new Map<string, number>();

        for (const dataset of allData) {
            for (const { date, count } of dataset) {
                merged.set(date, (merged.get(date) || 0) + count);
            }
        }

        return Array.from(merged.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    // --- Helper methods ---

    private calculateLongestStreak(data: ActivityData[]): number {
        let longest = 0;
        let current = 0;

        for (const entry of data) {
            if (entry.count > 0) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 0;
            }
        }

        return longest;
    }

    private calculateCurrentStreak(data: ActivityData[]): number {
        let streak = 0;

        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].count > 0) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    private calculateAverage(data: ActivityData[]): number {
        if (data.length === 0) return 0;
        const total = data.reduce((sum, d) => sum + d.count, 0);
        return Math.round((total / data.length) * 10) / 10;
    }

    private findMostActiveDay(data: ActivityData[]): { date: string; count: number } {
        if (data.length === 0) return { date: '', count: 0 };

        return data.reduce(
            (max, d) => (d.count > max.count ? d : max),
            { date: '', count: 0 },
        );
    }
}
