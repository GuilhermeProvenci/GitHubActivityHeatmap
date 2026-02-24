import type { FastifyInstance } from 'fastify';
import { GitHubAggregator } from '../aggregator';
import type { QueryOptions } from '@gh-heatmap/core';

/**
 * Registers all activity routes with a Fastify instance.
 */
export async function registerFastifyRoutes(
    fastify: FastifyInstance,
    aggregator: GitHubAggregator,
) {
    // GET /activity - Single query endpoint
    fastify.get<{
        Querystring: QueryOptions;
    }>('/activity', async (request) => {
        const data = await aggregator.aggregateActivity(request.query);
        return { data };
    });

    // POST /activity/by-authors - Multi-author endpoint
    fastify.post<{
        Body: { authors: string[] } & Omit<QueryOptions, 'author'>;
    }>('/activity/by-authors', async (request) => {
        const { authors, ...options } = request.body;
        const data = await aggregator.aggregateByAuthors(authors, options);
        return { data: Object.fromEntries(data) };
    });

    // POST /activity/by-repositories - Multi-repository endpoint
    fastify.post<{
        Body: { repositories: string[] } & Omit<QueryOptions, 'repository'>;
    }>('/activity/by-repositories', async (request) => {
        const { repositories, ...options } = request.body;
        const data = await aggregator.aggregateByRepositories(repositories, options);
        return { data: Object.fromEntries(data) };
    });

    // POST /activity/combined - Combined queries endpoint
    fastify.post<{
        Body: { queries: QueryOptions[] };
    }>('/activity/combined', async (request) => {
        const { queries } = request.body;
        const data = await aggregator.aggregateCombined(queries);
        return { data };
    });

    // GET /activity/summary - Summary endpoint
    fastify.get<{
        Querystring: QueryOptions;
    }>('/activity/summary', async (request) => {
        const summary = await aggregator.getActivitySummary(request.query);
        return { summary };
    });
}
