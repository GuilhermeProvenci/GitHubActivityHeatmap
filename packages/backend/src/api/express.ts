import type { Router, Request, Response } from 'express';
import { GitHubAggregator } from '../aggregator';

/**
 * Creates an Express router with all activity API endpoints.
 * Mount with: app.use('/api', createExpressHandler(aggregator))
 */
export function createExpressHandler(aggregator: GitHubAggregator): Router {
    // Dynamic import to avoid hard dependency on express
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const express = require('express');
    const router: Router = express.Router();

    // GET /activity - Single query with filters
    router.get('/activity', async (req: Request, res: Response) => {
        try {
            const { startDate, endDate, repository, author, branch, path } = req.query;

            const data = await aggregator.aggregateActivity({
                startDate: startDate as string,
                endDate: endDate as string,
                repository: repository as string | undefined,
                author: author as string | undefined,
                branch: branch as string | undefined,
                path: path as string | undefined,
            });

            res.json({ data });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'AggregationFailed', message });
        }
    });

    // POST /activity/by-authors - Multi-author aggregation
    router.post('/activity/by-authors', async (req: Request, res: Response) => {
        try {
            const { authors, ...options } = req.body;

            const data = await aggregator.aggregateByAuthors(authors, options);

            res.json({
                data: Object.fromEntries(data),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'AggregationFailed', message });
        }
    });

    // POST /activity/by-repositories - Multi-repository aggregation
    router.post('/activity/by-repositories', async (req: Request, res: Response) => {
        try {
            const { repositories, ...options } = req.body;

            const data = await aggregator.aggregateByRepositories(repositories, options);

            res.json({
                data: Object.fromEntries(data),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'AggregationFailed', message });
        }
    });

    // POST /activity/combined - Combined query aggregation
    router.post('/activity/combined', async (req: Request, res: Response) => {
        try {
            const { queries } = req.body;

            const data = await aggregator.aggregateCombined(queries);

            res.json({ data });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'AggregationFailed', message });
        }
    });

    // GET /activity/summary - Activity summary statistics
    router.get('/activity/summary', async (req: Request, res: Response) => {
        try {
            const { startDate, endDate, repository, author, branch, path } = req.query;

            const summary = await aggregator.getActivitySummary({
                startDate: startDate as string,
                endDate: endDate as string,
                repository: repository as string | undefined,
                author: author as string | undefined,
                branch: branch as string | undefined,
                path: path as string | undefined,
            });

            res.json({ summary });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'AggregationFailed', message });
        }
    });

    return router;
}
