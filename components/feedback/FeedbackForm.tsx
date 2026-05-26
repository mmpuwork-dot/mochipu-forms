'use client';

import { useState } from 'react';
import { useForm, useFieldArray, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { feedbackSchema, type FeedbackInput } from '@/lib/validations/feedback';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DecorativeDivider } from '@/components/ui/DecorativeDivider';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { FeedbackRoundIndicator } from './FeedbackRoundIndicator';
import { IssueCard } from './IssueCard';

const BLANK_ISSUE: FeedbackInput['issues'][number] = {
  location: 'face',
  type: 'model_error',
  priority: 'high',
  expected: '',
  current_state: '',
  reference_url: '',
  reference_files: [],
};

export function FeedbackForm() {
  const t = useTranslations('feedback');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();

  // expanded set — first issue open by default
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      commission_name: '',
      email: '',
      feedback_round: 1,
      locale: locale as 'en' | 'ja' | 'zh',
      issues: [{ ...BLANK_ISSUE }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'issues' });

  // Controlled field for feedback_round
  const { field: roundField } = useController({ control, name: 'feedback_round' });

  function toggleCard(i: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function removeIssue(i: number) {
    remove(i);
    // Shift expanded indices above the removed one
    setExpanded((prev) => {
      const next = new Set<number>();
      prev.forEach((idx) => {
        if (idx < i) next.add(idx);
        else if (idx > i) next.add(idx - 1);
      });
      return next;
    });
  }

  function addIssue() {
    append({ ...BLANK_ISSUE });
    // Auto-expand the newly added card
    setExpanded((prev) => new Set([...prev, fields.length]));
  }

  async function onSubmit(data: FeedbackInput) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Submission failed');

      const summary = {
        name: data.commission_name,
        count: data.issues.length,
        issues: data.issues.map((issue, idx) => ({
          num: String(idx + 1).padStart(2, '0'),
          title:
            (issue.expected ?? '').trim().slice(0, 40) ||
            (issue.current_state ?? '').trim().slice(0, 40) ||
            '',
          priority: issue.priority,
        })),
      };
      sessionStorage.setItem('mochipu-feedback-result', JSON.stringify(summary));
      router.push(`/feedback/success?name=${encodeURIComponent(data.commission_name)}`);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="max-w-[640px] mx-auto px-6 py-8 space-y-8">

          {/* ── Header ── */}
          <div>
            <div className="flex items-start justify-between gap-6 mb-7">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-[18px]">
                  <span className="w-8 h-px bg-[var(--color-black)]" aria-hidden="true" />
                  <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[var(--color-ink)] m-0">
                    Mochipu Live2D
                  </p>
                </div>
                <h1 className="text-[30px] font-normal tracking-[0.02em] text-[var(--color-ink)] m-0 mb-2.5 leading-[1.2]">
                  {t('title')}
                </h1>
                <p className="text-[13px] text-[var(--color-purple-soft)] leading-[1.75] m-0 max-w-[420px]">
                  {t('subtitle')}
                </p>
              </div>
              <div className="pt-[26px] flex-shrink-0">
                <LanguageSwitcher />
              </div>
            </div>
            <DecorativeDivider side="left" />
          </div>

          {/* ── Scope notice ── */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-purple)] m-0 mb-2">
              {t('scopeNotice.label')}
            </p>
            <p className="text-[12.5px] text-[var(--color-purple-soft)] leading-[1.8] m-0">
              {t('scopeNotice.content')}
            </p>
            <p className="text-[11px] text-[var(--color-purple-mute)] m-0 mt-[14px]">
              <span className="text-[var(--color-high)]">
                {tCommon('required')}
              </span>{' '}
              {t('scopeNotice.requiredHint')}
            </p>
          </div>

          {/* ── Basic info ── */}
          <div>
            {/* section label → fields: --space-group (12px) */}
            <SectionLabel withLine className="mb-[var(--space-group)]">{t('section.basic')}</SectionLabel>
            {/* fields → FeedbackRoundIndicator: --space-section (24px) — two distinct content groups */}
            <div className="grid grid-cols-2 gap-5 mb-[var(--space-section)]">
              <Input
                label={t('field.commissionName')}
                placeholder={t('placeholder.commissionName')}
                required
                {...register('commission_name')}
                error={errors.commission_name?.message}
              />
              <Input
                label={t('field.email')}
                type="email"
                placeholder={t('placeholder.email')}
                required
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <FeedbackRoundIndicator
              value={roundField.value as number}
              onChange={(v) => roundField.onChange(v)}
            />
          </div>

          {/* ── Issue cards ── */}
          <div className="space-y-3">
            {fields.map((field, i) => (
              <IssueCard
                key={field.id}
                index={i}
                control={control}
                errors={errors.issues?.[i]}
                isExpanded={expanded.has(i)}
                onToggle={() => toggleCard(i)}
                onRemove={() => removeIssue(i)}
                canRemove={fields.length > 1}
              />
            ))}
          </div>

          {/* ── Add issue ── */}
          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="lg"
            onClick={addIssue}
          >
            {t('action.addIssue')}
          </Button>

          {/* ── Footer ── */}
          <DecorativeDivider side="right" />
          <div className="flex items-center justify-between gap-4 pb-8">
            <Button
              type="button"
              variant="link"
              className="!px-0 !pt-0 !pb-[2px] text-[12px]"
              onClick={() => router.push('/confirm')}
            >
              {t('action.noIssues')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
            >
              {submitting ? '…' : t('action.submit')}
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}
