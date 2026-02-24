import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3334;
const REPO = 'facebook/react';

/**
 * Fetches commits from a public GitHub repo (no token needed)
 */
async function fetchPublicCommits(
    repo: string,
    startDate: string,
    endDate: string,
): Promise<{ date: string; count: number }[]> {
    const [owner, repoName] = repo.split('/');
    const perPage = 100;
    const commits: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 5) {
        // Cap at 5 pages to stay under rate limits
        const url = `https://api.github.com/repos/${owner}/${repoName}/commits?since=${startDate}T00:00:00Z&until=${endDate}T23:59:59Z&per_page=${perPage}&page=${page}`;

        const res = await fetch(url, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'gh-activity-heatmap-demo',
            },
        });

        if (!res.ok) {
            const remaining = res.headers.get('x-ratelimit-remaining');
            if (remaining === '0') {
                console.log(
                    '⚠️  GitHub API rate limit hit. Using cached/partial data.',
                );
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
    const map = new Map<string, number>();
    for (const commit of commits) {
        const dateStr = commit.commit?.author?.date;
        if (!dateStr) continue;
        const date = dateStr.split('T')[0];
        map.set(date, (map.get(date) || 0) + 1);
    }

    return Array.from(map.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Simple HTTP server serving the demo page + API
 */
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://localhost:${PORT}`);

    // API endpoint
    if (url.pathname === '/api/activity') {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(
            Date.now() - 365 * 24 * 60 * 60 * 1000,
        )
            .toISOString()
            .split('T')[0];

        const repo = url.searchParams.get('repository') || REPO;

        try {
            console.log(`📡 Fetching commits from ${repo}...`);
            const data = await fetchPublicCommits(repo, startDate, endDate);
            console.log(`✅ Got ${data.length} days of activity data`);

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            res.end(JSON.stringify({ data, repository: repo }));
        } catch (err: any) {
            console.error('❌ Error:', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // Serve demo HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const htmlPath = path.join(__dirname, 'index.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`   Try killing the process on that port or change the PORT in server.ts`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
    }
});

server.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════════════╗');
    console.log('  ║   📊 GitHub Activity Heatmap — Live Demo        ║');
    console.log('  ╠══════════════════════════════════════════════════╣');
    console.log(`  ║   🌐 http://localhost:${PORT}                      ║`);
    console.log(`  ║   📦 Repository: ${REPO.padEnd(28)}   ║`);
    console.log('  ║   ⏹  Press Ctrl+C to stop                      ║');
    console.log('  ╚══════════════════════════════════════════════════╝');
    console.log('');
});
