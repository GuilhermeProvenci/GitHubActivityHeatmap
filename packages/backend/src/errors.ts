/**
 * Custom error for rate limit exceeded
 */
export class RateLimitError extends Error {
    constructor(
        message: string,
        public resetAt: Date,
    ) {
        super(message);
        this.name = 'RateLimitError';
    }
}

/**
 * Custom error for aggregation failures
 */
export class AggregationError extends Error {
    constructor(
        message: string,
        public cause?: Error,
    ) {
        super(message);
        this.name = 'AggregationError';
    }
}

/**
 * Custom error for invalid query options
 */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Custom error when author is not found
 */
export class AuthorNotFoundError extends Error {
    constructor(author: string) {
        super(`No commits found for author '${author}'`);
        this.name = 'AuthorNotFoundError';
    }
}
