'use client';

import { useController, Control, FieldErrors, FieldPath } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { LocationPicker } from './LocationPicker';
import { TypePicker } from './TypePicker';
import { PriorityPicker } from './PriorityPicker';
import { DescriptionFields } from './DescriptionFields';
import { ReferenceUpload } from './ReferenceUpload';
import type { FeedbackInput, IssueInput } from '@/lib/validations/feedback';

interface Props {
  index: number;
  control: Control<FeedbackInput>;
  errors?: FieldErrors<IssueInput>;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

const BADGE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  high: {
    bg: 'var(--color-high-bg)',
    text: 'var(--color-high-text)',
    dot: 'var(--color-high)',
  },
  medium: {
    bg: 'var(--color-medium-bg)',
    text: 'var(--color-medium-text)',
    dot: 'var(--color-medium)',
  },
  low: {
    bg: 'var(--color-low-bg)',
    text: 'var(--color-low-text)',
    dot: 'var(--color-low)',
  },
};

export function IssueCard({
  index,
  control,
  errors,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
}: Props) {
  const t = useTranslations('feedback');

  // Helper to build type-safe field paths for the issues array
  function p(key: keyof IssueInput): FieldPath<FeedbackInput> {
    return `issues.${index}.${key}` as FieldPath<FeedbackInput>;
  }

  // All controller hooks must be declared unconditionally
  const { field: locationField } = useController({ control, name: p('location') });
  const { field: typeField }     = useController({ control, name: p('type') });
  const { field: priorityField } = useController({ control, name: p('priority') });
  const { field: expectedField } = useController({ control, name: p('expected') });
  const { field: currentField }  = useController({ control, name: p('current_state') });
  const { field: urlField }      = useController({ control, name: p('reference_url') });
  const { field: filesField }    = useController({ control, name: p('reference_files') });

  // Derive collapsed title from description
  const rawTitle =
    String(expectedField.value ?? '').trim() ||
    String(currentField.value ?? '').trim();
  const derivedTitle =
    rawTitle.length > 0
      ? rawTitle.slice(0, 45) + (rawTitle.length > 45 ? '…' : '')
      : null;

  const issueNum = String(index + 1).padStart(2, '0');
  const priority = String(priorityField.value ?? 'medium');
  const badge = BADGE_STYLES[priority] ?? BADGE_STYLES.medium;

  /* ── Collapsed ── */
  if (!isExpanded) {
    return (
      <div className="border border-[var(--color-border-light)] px-5 py-[14px] flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-purple)] m-0 mb-[3px]">
            {t('section.issue', { n: issueNum })}
          </p>
          <p className="text-[13px] text-[var(--color-purple-soft)] m-0 truncate">
            {derivedTitle ?? t('titleHint')}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className="text-[10px] px-[10px] py-1 flex items-center gap-[6px] font-medium tracking-[0.08em]"
            style={{ background: badge.bg, color: badge.text }}
          >
            <span
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{ background: badge.dot }}
            />
            {t(`priority.${priority}`)}
          </span>
          <button
            type="button"
            onClick={onToggle}
            className="text-[11px] text-[var(--color-purple)] bg-transparent border-none cursor-pointer p-0 hover:text-[var(--color-ink)] transition-colors"
          >
            {t('action.expand')}
          </button>
        </div>
      </div>
    );
  }

  /* ── Expanded ── */
  return (
    <div className="relative bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] px-5 py-6">
      {/* Purple 32px accent bar at top-left */}
      <span
        className="absolute -top-px -left-px w-8 h-[2px] bg-[var(--color-purple)]"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-[var(--space-section)]">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-purple)] m-0">
            {t('section.issue', { n: issueNum })}
          </p>
          <div className="flex gap-[14px]">
            <button
              type="button"
              onClick={onToggle}
              className="text-[11px] text-[var(--color-purple)] bg-transparent border-none cursor-pointer p-0 hover:text-[var(--color-ink)] transition-colors"
            >
              {t('action.collapse')}
            </button>
            {canRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="text-[11px] text-[var(--color-purple)] bg-transparent border-none cursor-pointer p-0 hover:text-[var(--color-required)] transition-colors"
              >
                {t('action.remove')}
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[var(--color-purple-mute)] m-0">
          {t('titleHint')}
        </p>
      </div>

      {/* Pickers — each section: mb-6 except last */}
      <div className="mb-[var(--space-section)]">
        <LocationPicker
          value={String(locationField.value ?? 'face')}
          onChange={(v) => locationField.onChange(v)}
          error={errors?.location?.message as string | undefined}
        />
      </div>
      <div className="mb-[var(--space-section)]">
        <TypePicker
          value={String(typeField.value ?? 'model_error')}
          onChange={(v) => typeField.onChange(v)}
          error={errors?.type?.message as string | undefined}
        />
      </div>
      <div className="mb-[var(--space-section)]">
        <PriorityPicker
          value={String(priorityField.value ?? 'high')}
          onChange={(v) => priorityField.onChange(v)}
          error={errors?.priority?.message as string | undefined}
        />
      </div>
      <div className="mb-[var(--space-section)]">
        <DescriptionFields
          expectedValue={String(expectedField.value ?? '')}
          expectedOnChange={(v) => expectedField.onChange(v)}
          currentValue={String(currentField.value ?? '')}
          currentOnChange={(v) => currentField.onChange(v)}
          expectedError={errors?.expected?.message as string | undefined}
          currentError={errors?.current_state?.message as string | undefined}
        />
      </div>
      {/* ReferenceUpload — last section, no bottom margin */}
      <ReferenceUpload
        urlValue={String(urlField.value ?? '')}
        urlOnChange={(v) => urlField.onChange(v)}
        urlError={errors?.reference_url?.message as string | undefined}
        filesValue={Array.isArray(filesField.value) ? (filesField.value as { url: string; name: string; size: number }[]) : []}
        filesOnChange={(files) => filesField.onChange(files)}
      />
    </div>
  );
}
