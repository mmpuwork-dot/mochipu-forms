'use client';

import { useTranslations } from 'next-intl';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Textarea } from '@/components/ui/Textarea';

interface Props {
  expectedValue: string;
  expectedOnChange: (v: string) => void;
  currentValue: string;
  currentOnChange: (v: string) => void;
  expectedError?: string;
  currentError?: string;
}

export function DescriptionFields({
  expectedValue,
  expectedOnChange,
  currentValue,
  currentOnChange,
  expectedError,
  currentError,
}: Props) {
  const t = useTranslations('feedback');

  return (
    <div>
      {/* "問題描述" main label → first sub-label: --space-group (12px) */}
      <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-ink)] mb-[var(--space-group)]">
        {t('field.description')}
      </p>

      {/* Expected block — --space-group (12px) below before Current sub-label */}
      <div className="mb-[var(--space-group)]">
        {/* "— 期望效果" sub-label → textarea: --space-tight (6px) */}
        <SectionLabel dash className="mb-[var(--space-tight)]">{t('field.expected')}</SectionLabel>
        <Textarea
          placeholder={t('placeholder.expectedExample')}
          value={expectedValue}
          onChange={(e) => expectedOnChange(e.target.value)}
          rows={3}
          error={expectedError}
        />
      </div>

      {/* Current block */}
      <div>
        {/* "— 目前狀況" sub-label → textarea: --space-tight (6px) */}
        <SectionLabel dash className="mb-[var(--space-tight)]">{t('field.current')}</SectionLabel>
        <Textarea
          placeholder={t('placeholder.currentExample')}
          value={currentValue}
          onChange={(e) => currentOnChange(e.target.value)}
          rows={3}
          error={currentError}
        />
      </div>
    </div>
  );
}
