'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface IssueRow {
  num: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
}

interface SubmissionResult {
  name: string;
  count: number;
  issues: IssueRow[];
}

const BADGE: Record<
  string,
  { bg: string; color: string; border?: string }
> = {
  high: { bg: 'var(--color-high-bg)', color: 'var(--color-high-text)' },
  medium: { bg: 'var(--color-medium-bg)', color: 'var(--color-medium-text)' },
  low: {
    bg: 'transparent',
    color: 'var(--color-low-text)',
    border: '1px solid var(--color-low-border)',
  },
};

const PRIORITY_LABEL: Record<string, string> = {
  high: 'High',
  medium: 'Med',
  low: 'Low',
};

export default function FeedbackSuccessPage() {
  const t = useTranslations('success.feedback');
  const [result, setResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('mochipu-feedback-result');
      if (stored) {
        setResult(JSON.parse(stored));
        sessionStorage.removeItem('mochipu-feedback-result');
      }
    } catch {
      // ignore
    }
  }, []);

  const name = result?.name ?? '...';
  const count = result?.count ?? 0;
  const issues = result?.issues ?? [];

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex items-start justify-center py-20 px-6">
      <div className="w-full max-w-[540px] text-center space-y-10">

        {/* Logo header */}
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-[var(--color-black)]" />
          <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[var(--color-ink)] m-0">
            Mochipu Live2D
          </p>
          <span className="w-8 h-px bg-[var(--color-black)]" />
        </div>

        {/* Check icon */}
        <div className="w-16 h-16 border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] flex items-center justify-center mx-auto">
          <Check size={28} color="var(--color-accent)" strokeWidth={1.5} />
        </div>

        {/* Label + heading + message */}
        <div>
          <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[var(--color-accent)] m-0 mb-5">
            {t('label')}
          </p>
          <h1 className="text-[30px] font-normal tracking-[-0.01em] text-[var(--color-black)] leading-[1.2] m-0 mb-6">
            {t('title', { name })}
          </h1>
          <p className="text-[13px] text-[var(--color-purple-soft)] leading-[1.9] m-0">
            {t.rich('message', {
              count,
              strong: (chunks) => (
                <span className="text-[var(--color-black)] font-medium">
                  {chunks}
                </span>
              ),
            })}
          </p>
        </div>

        {/* Submission summary */}
        {issues.length > 0 && (
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] p-5 text-left">
            <SectionLabel dash className="mb-[10px]">
              {t('summaryLabel')}
            </SectionLabel>
            <div className="flex flex-col">
              {issues.map(({ num, title, priority }, i, arr) => {
                const badge = BADGE[priority] ?? BADGE.medium;
                return (
                  <div
                    key={num}
                    className="flex items-center justify-between py-[6px]"
                    style={{
                      borderBottom:
                        i < arr.length - 1
                          ? '1px solid var(--color-border-faint)'
                          : undefined,
                    }}
                  >
                    <span className="text-[12px] text-[var(--color-purple-soft)] truncate flex-1 mr-3">
                      {num}
                      {title ? ` · ${title}` : ''}
                    </span>
                    <span
                      className="text-[12px] tracking-[0.06em] px-2 py-[2px] flex-shrink-0 font-medium"
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        border: badge.border,
                      }}
                    >
                      {PRIORITY_LABEL[priority] ?? priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
