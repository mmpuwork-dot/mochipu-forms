'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Mail, RefreshCw, X } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface ConfirmResult {
  name: string;
  email: string;
  debutDate?: string;
}

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (locale === 'zh')
    return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  if (locale === 'ja')
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export default function ConfirmSuccessPage() {
  const t = useTranslations('success.confirm');
  const locale = useLocale();
  const [result, setResult] = useState<ConfirmResult | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('mochipu-confirm-result');
      if (stored) {
        setResult(JSON.parse(stored));
        sessionStorage.removeItem('mochipu-confirm-result');
      }
    } catch {
      // ignore
    }
  }, []);

  const debutDate = result?.debutDate;

  const boldSpan = (chunks: ReactNode) => (
    <span className="text-[var(--color-black)] font-medium">{chunks}</span>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex items-start justify-center py-16 px-6">
      <div className="w-full max-w-[540px] text-center space-y-7">

        {/* Logo header */}
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-[var(--color-black)]" />
          <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[var(--color-ink)] m-0">
            Mochipu Live2D
          </p>
          <span className="w-8 h-px bg-[var(--color-black)]" />
        </div>

        {/* Sparkles icon with decorative corner squares */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] flex items-center justify-center">
            <Sparkles size={32} color="var(--color-accent)" strokeWidth={1.5} />
          </div>
          <span className="absolute -top-[6px] -right-[6px] w-[14px] h-[14px] bg-[var(--color-black)]" aria-hidden="true" />
          <span className="absolute -bottom-[6px] -left-[6px] w-[10px] h-[10px] bg-[var(--color-purple)]" aria-hidden="true" />
        </div>

        {/* Label + heading + body */}
        <div>
          <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[var(--color-accent)] m-0 mb-3">
            {t('label')}
          </p>
          <h1 className="text-[30px] font-normal tracking-[-0.01em] text-[var(--color-black)] leading-[1.2] m-0 mb-4">
            {t('title')}
          </h1>
          <p className="text-[13px] text-[var(--color-purple-soft)] leading-[1.75] m-0">
            {t('message')}
          </p>
        </div>

        {/* Debut date card — only when date was set */}
        {debutDate && (
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] border-l-2 border-l-[var(--color-accent)] px-5 py-5 text-left space-y-1.5">
            <SectionLabel dash className="text-[var(--color-accent)]">
              {t('debutLabel')}
            </SectionLabel>
            <p className="text-[14px] text-[var(--color-ink)] font-medium tracking-[0.02em] m-0">
              {formatDate(debutDate, locale)}
            </p>
            <p className="text-[12px] text-[var(--color-purple-soft)] leading-[1.6] m-0">
              {t('debutNote')}
            </p>
          </div>
        )}

        {/* Info rows */}
        <div className="flex flex-col text-left">
          {[
            {
              Icon: Mail,
              text: t('emailNote'),
            },
            {
              Icon: RefreshCw,
              text: t.rich('futureNote', {
                email: 'mmpu.work@gmail.com',
                b: boldSpan,
              }),
            },
            {
              Icon: X,
              text: t.rich('snsNote', {
                handle: '@mochimochibubu',
                b: boldSpan,
              }),
            },
          ].map(({ Icon, text }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 border-t border-[var(--color-border-light)] last:border-b last:border-b-[var(--color-border-light)]"
            >
              <Icon size={16} color="var(--color-purple)" strokeWidth={1.5} className="flex-shrink-0" />
              <p className="text-[12px] text-[var(--color-purple-soft)] m-0 flex-1 leading-[1.6]">
                {text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
