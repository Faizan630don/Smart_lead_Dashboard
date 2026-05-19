import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const shapes = {
    text: 'h-4 w-3/4 rounded',
    rect: 'rounded-lg',
    circle: 'rounded-full',
  };

  return <div className={`skeleton-pulse ${shapes[variant]} ${className}`} />;
};

interface SkeletonTableRowsProps {
  rows?: number;
  cols?: number;
}

export const SkeletonTableRows: React.FC<SkeletonTableRowsProps> = ({ rows = 5, cols = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-800/40">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-6 py-4.5">
              <Skeleton className="h-4 w-24" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

interface SkeletonCardsProps {
  count?: number;
}

export const SkeletonCards: React.FC<SkeletonCardsProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16 animate-pulse" />
          </div>
          <Skeleton className="h-4 w-40" />
          <div className="border-t border-slate-800/60 pt-4 flex justify-between">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
