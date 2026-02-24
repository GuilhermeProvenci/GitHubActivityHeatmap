// Aggregator
export { GitHubAggregator } from './aggregator';

// Cache
export type { CacheStrategy, RedisClient } from './cache';
export { generateCacheKey, MemoryCache, FileCache, RedisCache } from './cache';

// Rate Limiter
export { RateLimiter } from './rate-limiter';

// API Adapters
export { createExpressHandler } from './api/express';
export { registerFastifyRoutes } from './api/fastify';

// Errors
export {
    RateLimitError,
    AggregationError,
    ValidationError,
    AuthorNotFoundError,
} from './errors';
