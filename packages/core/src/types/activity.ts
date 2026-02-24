/**
 * Represents aggregated activity for a single day
 */
export interface ActivityData {
    /** Date in ISO 8601 format (YYYY-MM-DD) */
    date: string;

    /** Number of commits on this date */
    count: number;
}

/**
 * Query options for filtering commits
 */
export interface QueryOptions {
    /** Start date in ISO 8601 format (YYYY-MM-DD) */
    startDate: string;

    /** End date in ISO 8601 format (YYYY-MM-DD) */
    endDate: string;

    /** Repository in format "owner/repo" */
    repository?: string;

    /** GitHub username or email to filter by author */
    author?: string;

    /** Branch name to filter commits (e.g., "main", "develop") */
    branch?: string;

    /** File or directory path to filter commits */
    path?: string;
}

/**
 * Metadata about the activity dataset
 */
export interface ActivityMetadata {
    startDate: string;
    endDate: string;
    totalCommits: number;
    cachedAt: string;
    repository?: string;
    filters?: {
        author?: string;
        branch?: string;
        path?: string;
    };
}

/**
 * Complete API response structure
 */
export interface ActivityResponse {
    data: ActivityData[];
    meta: ActivityMetadata;
}

/**
 * Summary statistics
 */
export interface ActivitySummary {
    totalCommits: number;
    activeDays: number;
    longestStreak: number;
    currentStreak: number;
    averageCommitsPerDay: number;
    mostActiveDay: {
        date: string;
        count: number;
    };
}

/**
 * Multi-author response structure
 */
export interface MultiAuthorResponse {
    data: Record<string, ActivityData[]>;
    meta: {
        startDate: string;
        endDate: string;
        authors: number;
    };
}

/**
 * Multi-repository response structure
 */
export interface MultiRepositoryResponse {
    data: Record<string, ActivityData[]>;
    meta: {
        startDate: string;
        endDate: string;
        repositories: number;
    };
}

/**
 * Combined query response structure
 */
export interface CombinedQueryResponse {
    data: ActivityData[];
    meta: {
        startDate: string;
        endDate: string;
        totalQueries: number;
        totalCommits: number;
    };
}
