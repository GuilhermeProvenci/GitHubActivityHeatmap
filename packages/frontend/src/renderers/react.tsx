import React, { useEffect, useRef } from 'react';
import { Heatmap } from '../components/Heatmap';
import type { HeatmapConfig } from '@gh-heatmap/core';

export interface ActivityHeatmapProps {
    /** API endpoint URL */
    endpoint: string;
    /** Heatmap configuration options */
    config?: Partial<HeatmapConfig>;
}

/**
 * React wrapper for the Heatmap component.
 * Manages lifecycle and re-renders on prop changes.
 */
export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
    endpoint,
    config,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heatmapRef = useRef<Heatmap | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Destroy previous instance
        if (heatmapRef.current) {
            heatmapRef.current.destroy();
        }

        const mergedConfig: HeatmapConfig = {
            endpoint,
            ...(config || {}),
        };

        // Create new heatmap instance
        heatmapRef.current = new Heatmap(containerRef.current, mergedConfig);

        // Load data based on mode
        if (mergedConfig.mode === 'multi-author' && mergedConfig.multiConfig?.authors) {
            heatmapRef.current.loadMultiAuthor(mergedConfig.multiConfig.authors);
        } else if (mergedConfig.mode === 'multi-repository' && mergedConfig.multiConfig?.repositories) {
            heatmapRef.current.loadMultiRepository(mergedConfig.multiConfig.repositories);
        } else if (mergedConfig.mode === 'combined' && mergedConfig.multiConfig?.queries) {
            heatmapRef.current.loadCombined(mergedConfig.multiConfig.queries);
        } else {
            heatmapRef.current.load(endpoint);
        }

        return () => {
            heatmapRef.current?.destroy();
            heatmapRef.current = null;
        };
    }, [endpoint, JSON.stringify(config)]);

    return React.createElement('div', {
        ref: containerRef,
        className: 'gh-activity-heatmap-wrapper',
    });
};

export default ActivityHeatmap;
