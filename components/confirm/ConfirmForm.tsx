'use client';

import { useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { confirmSchema, type ConfirmInput } from '@/lib/validations/confirm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DecorativeDivider } from '@/components/ui/DecorativeDivider';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { DatePicker } from './DatePicker';

export function ConfirmForm() {
  const t = useTranslations('confirm');
  const tCommon = useTranslations('common');
  const tFeedback = useTranslations('feedback');
  const locale = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConfirmInput>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      commission_name: '',
      email: '',
      locale: locale as 'en' | 'ja' | 'zh',
      debut_date_status: 'undecided',
      debut_date: undefined,
      additional_message: '',
      confirmed: false as unknown as true,
    },
  });

  const { field: dateStatusField } = useController({ control, name: 'debut_date_status' });
  const { field: dateField }       = useController({ control, name: 'debut_date' });
  const { field: confirmedField }  = useController({ control, name: 'confirmed' });

  const dateStatus = watch('debut_date_status');

  async function onSubmit(data: ConfirmInput) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Submission failed');

      const summary = {
        name: data.commission_name,
        email: data.email,
        debutDate: data.debut_date,
      };
      sessionStorage.setItem('mochipu-confirm-result', JSON.stringify(summary));
      router.push('/confirm/success');
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

          {/* ── Warning notice — left black 2px accent ── */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] border-l-2 border-l-[var(--color-ink)] px-5 py-6">
            <p
              className="text-[13px] font-medium text-[var(--color-purple)] m-0 mb-5"
              style={{
                textTransform: locale === 'en' ? 'uppercase' : 'none',
                letterSpacing: locale === 'en' ? '0.22em' : '0.05em',
              }}
            >
              {t('warning.label')}
            </p>
            <p className="text-[12.5px] text-[var(--color-purple-soft)] leading-[1.7] m-0 mb-4">
              {t.rich('warning.main', {
                strong: (chunks) => (
                  <span className="text-[var(--color-black)] font-medium">{chunks}</span>
                ),
              })}
            </p>
            <p className="text-[12px] text-[var(--color-purple-soft)] leading-[1.7] m-0 mb-4">
              {t.rich('warning.future', {
                strong: (chunks) => (
                  <span className="text-[var(--color-purple)] font-medium">{chunks}</span>
                ),
              })}
            </p>
            <p className="text-[11px] text-[var(--color-purple-mute)] m-0">
              <span className="text-[var(--color-required)]">{tCommon('required')}</span>{' '}
              {t('warning.requiredHint')}
            </p>
          </div>

          {/* ── Basic info ── */}
          <div>
            {/* section label → fields: --space-group (12px) */}
            <SectionLabel withLine className="mb-[var(--space-group)]">{t('section.basic')}</SectionLabel>
            <div className="grid grid-cols-2 gap-5">
              <Input
                label={tFeedback('field.commissionName')}
                placeholder={tFeedback('placeholder.commissionName')}
                required
                {...register('commission_name')}
                error={errors.commission_name?.message}
              />
              <Input
                label={tFeedback('field.email')}
                type="email"
                placeholder={tFeedback('placeholder.email')}
                required
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
          </div>

          {/* ── Debut date ── */}
          <div>
            {/* section label → hint: --space-group (12px) */}
            <SectionLabel withLine className="mb-[var(--space-group)]">{t('section.debutDate')}</SectionLabel>
            {/* hint → radio options: --space-group (12px) */}
            <p className="text-[12px] text-[var(--color-purple-mute)] m-0 mb-[var(--space-group)]">
              {t('field.dateOptional')}
            </p>

            {/* Radio options — no bottom margin when undecided (no DatePicker follows) */}
            <div className="flex flex-col gap-2">
              {/* Decided */}
              <label className="flex items-center gap-3 px-[14px] py-[10px] border border-[var(--color-border-mid)] cursor-pointer bg-[var(--color-bg-surface)]">
                <span className="w-[14px] h-[14px] border rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: dateStatus === 'decided' ? 'var(--color-black)' : 'var(--color-border-mid)' }}>
                  {dateStatus === 'decided' && (
                    <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-black)]" />
                  )}
                </span>
                <input
                  type="radio"
                  className="sr-only"
                  checked={dateStatus === 'decided'}
                  onChange={() => dateStatusField.onChange('decided')}
                />
                <span className={`text-[13px] ${dateStatus === 'decided' ? 'text-[var(--color-ink)]' : 'text-[var(--color-purple-soft)]'}`}>
                  {t('field.dateDecided')}
                </span>
              </label>

              {/* Undecided */}
              <label className="flex items-center gap-3 px-[14px] py-[10px] border border-[var(--color-border-mid)] cursor-pointer">
                <span className="w-[14px] h-[14px] border rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: dateStatus === 'undecided' ? 'var(--color-black)' : 'var(--color-border-mid)' }}>
                  {dateStatus === 'undecided' && (
                    <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-black)]" />
                  )}
                </span>
                <input
                  type="radio"
                  className="sr-only"
                  checked={dateStatus === 'undecided'}
                  onChange={() => {
                    dateStatusField.onChange('undecided');
                    dateField.onChange(undefined);
                  }}
                />
                <span className={`text-[13px] ${dateStatus === 'undecided' ? 'text-[var(--color-ink)]' : 'text-[var(--color-purple-soft)]'}`}>
                  {t('field.dateUndecided')}
                </span>
              </label>
            </div>

            {/* DatePicker — radio options → calendar: --space-group (12px) */}
            {dateStatus === 'decided' && (
              <div className="mt-[var(--space-group)]">
                <DatePicker
                  value={dateField.value as string | undefined}
                  onChange={(v) => dateField.onChange(v)}
                  error={errors.debut_date?.message as string | undefined}
                />
              </div>
            )}
          </div>

          {/* ── Additional message ── */}
          <div>
            {/* section label → hint: --space-group (12px) */}
            <SectionLabel withLine className="mb-[var(--space-group)]">{t('section.message')}</SectionLabel>
            {/* hint → textarea: --space-group (12px) */}
            <p className="text-[12px] text-[var(--color-purple-mute)] m-0 mb-[var(--space-group)]">
              {t('field.messageOptional')}
            </p>
            <Textarea
              rows={4}
              placeholder={t('field.messagePlaceholder')}
              {...register('additional_message')}
              error={errors.additional_message?.message}
            />
          </div>

          {/* ── Confirmed checkbox ── */}
          <div className="pt-6 border-t border-[var(--color-border-light)]">
            <label className="flex items-start gap-[14px] cursor-pointer">
              <span
                className={[
                  'w-[18px] h-[18px] border flex items-center justify-center flex-shrink-0 mt-[2px] transition-colors',
                  confirmedField.value
                    ? 'border-[var(--color-black)] bg-[var(--color-black)]'
                    : 'border-[var(--color-border-mid)] bg-transparent',
                ].join(' ')}
              >
                {confirmedField.value && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                    <path d="M1 4L4 7.5L10 1" stroke="var(--color-bg-surface)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!confirmedField.value}
                onChange={(e) => confirmedField.onChange(e.target.checked as unknown as true)}
              />
              <div>
                <p className="text-[13px] text-[var(--color-ink)] font-medium m-0 mb-1">
                  {t('checkbox.label')}{' '}
                  <span className="text-[var(--color-high)]">{tCommon('required')}</span>
                </p>
                <p className="text-[12px] text-[var(--color-purple-soft)] leading-[1.65] m-0">
                  {t('checkbox.description')}
                </p>
              </div>
            </label>
            {errors.confirmed && (
              <p className="text-[11px] text-[var(--color-required)] mt-3 ml-8">
                {locale === 'zh'
                  ? '請勾選後再送出'
                  : locale === 'ja'
                    ? '確認してから送信してください'
                    : 'Please confirm before submitting'}
              </p>
            )}
          </div>

          {/* ── Footer ── */}
          <DecorativeDivider side="right" />
          <div className="flex items-center justify-between gap-4 pb-8">
            <Button
              type="button"
              variant="link"
              className="!px-0 !pt-0 !pb-[2px] text-[12px]"
              onClick={() => router.push('/feedback')}
            >
              {t('action.back')}
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
