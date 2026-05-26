'use client';

import { useTranslations } from 'next-intl';

const MAIN_TYPES = ['model_error', 'change_artwork', 'adjust_physics', 'add_remove'] as const;
const ALL_TYPES = [...MAIN_TYPES, 'other'] as const;
type IssueType = (typeof ALL_TYPES)[number];

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function TypePicker({ value, onChange, error }: Props) {
  const t = useTranslations('feedback');

  return (
    <div>
      {/* section label → buttons: --space-group (12px) */}
      <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-ink)] mb-[var(--space-group)]">
        {t('field.type')}
      </p>
      <div className="grid grid-cols-2 gap-[6px]">
        {MAIN_TYPES.map((type) => {
          const active = value === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={[
                'flex items-center justify-center px-3 py-2 text-[12px] border cursor-pointer text-center transition-colors',
                active
                  ? 'bg-[var(--color-black)] text-[var(--color-white)] border-[var(--color-black)]'
                  : 'bg-transparent text-[var(--color-black)] border-[var(--color-border-mid)] hover:border-[var(--color-black)]',
              ].join(' ')}
            >
              {t(`type.${type}`)}
            </button>
          );
        })}
        {/* Other — spans full width */}
        <button
          type="button"
          onClick={() => onChange('other')}
          className={[
            'col-span-2 flex items-center justify-center px-3 py-2 text-[12px] border cursor-pointer transition-colors',
            value === 'other'
              ? 'bg-[var(--color-black)] text-[var(--color-white)] border-[var(--color-black)]'
              : 'bg-transparent text-[var(--color-black)] border-[var(--color-border-mid)] hover:border-[var(--color-black)]',
          ].join(' ')}
        >
          {t('type.other')}
        </button>
      </div>
      {/* error sits tight below the buttons: --space-tight (6px) */}
      {error && (
        <p className="text-[11px] italic text-[var(--color-required)] mt-[var(--space-tight)]">{error}</p>
      )}
    </div>
  );
}
