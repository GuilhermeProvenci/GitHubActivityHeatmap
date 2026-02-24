import express from 'express';
import cors from 'cors';
import { GitHubAggregator } from '@gh-heatmap/backend';
import { createExpressHandler } from '@gh-heatmap/backend';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize aggregator
const aggregator = new GitHubAggregator({
    githubToken: process.env.GITHUB_TOKEN!,
    repository: process.env.GITHUB_REPOSITORY || 'owner/repo',
    cache: {
        strategy: 'memory',
        ttl: 21600, // 6 hours
    },
});

// Mount activity API routes
app.use('/api', createExpressHandler(aggregator));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Activity API running on http://localhost:${PORT}`);
    console.log(`Try: http://localhost:${PORT}/api/activity?startDate=2024-01-01&endDate=2024-12-31`);
});
