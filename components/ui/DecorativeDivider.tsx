import React from 'react';

interface DecorativeDividerProps {
  /** 色塊位置：'left'（預設，用於頂部）或 'right'（用於底部） */
  side?: 'left' | 'right';
  className?: string;
}

export function DecorativeDivider({ side = 'left', className = '' }: DecorativeDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={['h-px w-full', className].filter(Boolean).join(' ')}
      style={
        side === 'left'
          ? {
              background:
                'linear-gradient(to right, var(--color-ink) 0px, var(--color-ink) 64px, var(--color-border-light) 64px)',
            }
          : {
              background:
                'linear-gradient(to left, var(--color-ink) 0px, var(--color-ink) 64px, var(--color-border-light) 64px)',
            }
      }
    />
  );
}
