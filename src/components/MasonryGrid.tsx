'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface MasonryGridProps {
  children: ReactNode[];
  className?: string;
  columnWidth?: number;
  gap?: number;
}

export default function MasonryGrid({ 
  children, 
  className = "",
  columnWidth = 280,
  gap = 16
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newColumns = Math.max(1, Math.floor(containerWidth / columnWidth));
        setColumns(newColumns);
        setColumnHeights(new Array(newColumns).fill(0));
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columnWidth]);

  const getColumnItems = () => {
    const columnItems: ReactNode[][] = Array(columns).fill(null).map(() => []);
    
    children.forEach((child, index) => {
      if (columnHeights.length > 0) {
        // Find the column with the smallest height
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        columnItems[shortestColumnIndex].push(
          <div key={index} className="mb-4">
            {child}
          </div>
        );
        
        // Estimate height increase (this is approximate)
        columnHeights[shortestColumnIndex] += 300; // Estimated height
      }
    });

    return columnItems;
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div 
        className="flex gap-4"
        style={{ gap: `${gap}px` }}
      >
        {getColumnItems().map((columnChildren, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1"
            style={{ minWidth: `${columnWidth}px` }}
          >
            {columnChildren}
          </div>
        ))}
      </div>
    </div>
  );
}