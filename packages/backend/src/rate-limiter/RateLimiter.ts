import { RateLimitError } from '../errors';

/**
 * Manages GitHub API rate limits
 */
export class RateLimiter {
    private remaining: number = 5000;
    private resetAt: Date = new Date();

    /**
     * Checks if a request can proceed based on current rate limits.
     * @throws RateLimitError if rate limit is near exhaustion
     */
    async checkLimit(): Promise<boolean> {
        if (this.remaining <= 100) {
            const now = new Date();
            if (now < this.resetAt) {
                throw new RateLimitError(
                    `Rate limit near exhaustion. Resets at ${this.resetAt.toISOString()}`,
                    this.resetAt,
                );
            }
        }
        return true;
    }

    /**
     * Updates internal counters from GitHub API response headers.
     */
    updateFromHeaders(headers: Record<string, string | number | undefined>): void {
        const remaining = headers['x-ratelimit-remaining'];
        const reset = headers['x-ratelimit-reset'];

        if (remaining !== undefined) {
            this.remaining = parseInt(String(remaining), 10);
        }
        if (reset !== undefined) {
            this.resetAt = new Date(parseInt(String(reset), 10) * 1000);
        }
    }

    /**
     * Returns current rate limit status
     */
    getStatus(): { remaining: number; resetAt: Date } {
        return {
            remaining: this.remaining,
            resetAt: this.resetAt,
        };
    }
}
