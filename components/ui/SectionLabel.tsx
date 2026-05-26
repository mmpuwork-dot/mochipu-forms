import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  /** withLine: 左側加 20px 紫色短線（用於表單區段標題） */
  withLine?: boolean;
  /** dash: 加 — 前綴（用於 card 內的小標籤） */
  dash?: boolean;
  className?: string;
}

export function SectionLabel({ children, withLine = false, dash = false, className = '' }: SectionLabelProps) {
  if (withLine) {
    return (
      <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
        <span className="w-5 h-px bg-[var(--color-purple)] flex-shrink-0" aria-hidden="true" />
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-purple)] m-0">
          {children}
        </p>
      </div>
    );
  }

  // dash variant: lower-case sub-label, tight tracking (e.g. — 期望效果)
  if (dash) {
    return (
      <p
        className={[
          'text-[10px] tracking-[0.08em] text-[var(--color-purple)] m-0',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {`— ${children}`}
      </p>
    );
  }

  return (
    <p
      className={[
        'text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-purple)] m-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  );
}
