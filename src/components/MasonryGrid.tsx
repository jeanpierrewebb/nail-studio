'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface MasonryGridProps {
  children: ReactNode[];
  className?: string;
  gap?: number;
}

export default function MasonryGrid({ 
  children, 
  className = "",
  gap = 12
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        if (w < 500) setColumns(2);
        else if (w < 768) setColumns(3);
        else setColumns(4);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const getColumnItems = () => {
    const cols: ReactNode[][] = Array.from({ length: columns }, () => []);
    children.forEach((child, i) => {
      cols[i % columns].push(
        <div key={i} style={{ marginBottom: `${gap}px` }}>
          {child}
        </div>
      );
    });
    return cols;
  };

  return (
    <div ref={containerRef} className={className} style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: `${gap}px` }}>
        {getColumnItems().map((colChildren, i) => (
          <div key={i} style={{ flex: 1, minWidth: 0 }}>
            {colChildren}
          </div>
        ))}
      </div>
    </div>
  );
}
