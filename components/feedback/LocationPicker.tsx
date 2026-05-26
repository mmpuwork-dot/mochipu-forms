'use client';

import { useTranslations } from 'next-intl';

const LOCATIONS = ['face', 'hair', 'body', 'physics', 'toggle', 'other'] as const;
type Location = (typeof LOCATIONS)[number];

interface Props {
  value: string;
  onChange: (v: Location) => void;
  error?: string;
}

export function LocationPicker({ value, onChange, error }: Props) {
  const t = useTranslations('feedback');

  return (
    <div>
      {/* section label → chips: --space-group (12px) */}
      <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-ink)] mb-[var(--space-group)]">
        {t('field.location')}
      </p>
      <div className="flex flex-wrap gap-[6px]">
        {LOCATIONS.map((loc) => {
          const active = value === loc;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => onChange(loc)}
              className={[
                'px-[14px] py-[6px] text-[12px] border cursor-pointer transition-colors',
                active
                  ? 'bg-[var(--color-black)] text-[var(--color-white)] border-[var(--color-black)]'
                  : 'bg-transparent text-[var(--color-black)] border-[var(--color-border-mid)] hover:border-[var(--color-black)]',
              ].join(' ')}
            >
              {t(`location.${loc}`)}
            </button>
          );
        })}
      </div>
      {/* error sits tight below the chips: --space-tight (6px) */}
      {error && (
        <p className="text-[11px] italic text-[var(--color-required)] mt-[var(--space-tight)]">{error}</p>
      )}
    </div>
  );
}
