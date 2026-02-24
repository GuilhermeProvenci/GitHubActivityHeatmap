import React, { useEffect, useRef } from 'react';
import { Heatmap } from './dom/Heatmap';
import type { HeatmapConfig } from './types';

export interface ActivityHeatmapProps {
  endpoint: string;
  config?: Partial<HeatmapConfig>;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ endpoint, config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<Heatmap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (heatmapRef.current) heatmapRef.current.destroy();

    const mergedConfig: HeatmapConfig = { endpoint, ...(config || {}) };
    heatmapRef.current = new Heatmap(containerRef.current, mergedConfig);
    heatmapRef.current.load(endpoint);

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
