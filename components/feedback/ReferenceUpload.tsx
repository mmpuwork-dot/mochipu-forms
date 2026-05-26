'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BoxedInput } from '@/components/ui/BoxedInput';

interface FileRef {
  url: string;
  name: string;
  size: number;
}

interface Props {
  urlValue: string;
  urlOnChange: (v: string) => void;
  urlError?: string;
  filesValue: FileRef[];
  filesOnChange: (files: FileRef[]) => void;
}

export function ReferenceUpload({
  urlValue,
  urlOnChange,
  urlError,
  filesValue,
  filesOnChange,
}: Props) {
  const t       = useTranslations('feedback');
  const tCommon = useTranslations('common');
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const results: FileRef[] = [];

    for (const file of selected) {
      const fd = new FormData();
      fd.append('file', file);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Upload failed (${res.status})`);
        }
        const data = await res.json() as FileRef;
        results.push(data);
      } catch (err) {
        setUploadError((err as Error).message);
        setUploading(false);
        return;
      }
    }

    filesOnChange([...filesValue, ...results]);
    setUploading(false);
    // Reset input so the same file can be re-selected if needed
    if (fileRef.current) fileRef.current.value = '';
  }

  function removeFile(index: number) {
    filesOnChange(filesValue.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-ink)] mb-[var(--space-group)]">
        {t('field.reference')}{' '}
        <span className="text-[var(--color-purple-mute)] font-normal">
          — {t('field.referenceOptional')}
        </span>
      </p>

      {/* Drop zone */}
      <div
        className={`border border-dashed border-[var(--color-border-mid)] p-[18px] text-center bg-[var(--color-bg-input)] cursor-pointer hover:border-[var(--color-purple)] transition-colors mb-[var(--space-group)] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*,.psd,.psb,.pdf"
          className="sr-only"
          onChange={handleFileChange}
        />
        {uploading ? (
          <p className="text-[12px] text-[var(--color-purple)] m-0">Uploading…</p>
        ) : (
          <>
            <p className="text-[12.5px] text-[var(--color-purple)] m-0">
              {t.rich('placeholder.uploadHint', {
                browse: (chunks) => (
                  <span className="text-[var(--color-black)] underline underline-offset-[3px]">
                    {chunks}
                  </span>
                ),
              })}
            </p>
            <p className="text-[10.5px] text-[var(--color-purple-mute)] m-0 mt-[6px]">
              {t('placeholder.uploadSpec')}
            </p>
          </>
        )}

        {/* Uploaded file list */}
        {filesValue.length > 0 && (
          <div className="mt-3 space-y-1 text-left">
            {filesValue.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <p className="text-[11px] text-[var(--color-ink)] m-0 truncate">
                  ✓ {f.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="text-[10px] text-[var(--color-purple-mute)] hover:text-[var(--color-required)] bg-transparent border-none cursor-pointer p-0 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload error */}
      {uploadError && (
        <p className="text-[11px] text-[var(--color-required)] mb-[var(--space-group)] m-0">
          {uploadError}
        </p>
      )}

      {/* Or divider */}
      <div className="flex items-center gap-[10px] mb-[var(--space-group)]">
        <span className="flex-1 h-px bg-[var(--color-border-light)]" />
        <span className="text-[10px] text-[var(--color-purple-mute)] tracking-[0.12em] uppercase">
          {tCommon('or')}
        </span>
        <span className="flex-1 h-px bg-[var(--color-border-light)]" />
      </div>

      {/* Cloud link */}
      <div>
        <SectionLabel dash className="mb-[var(--space-tight)]">{t('field.cloudLink')}</SectionLabel>
        <BoxedInput
          type="url"
          placeholder={t('placeholder.urlInput')}
          hint={t('placeholder.urlHint')}
          value={urlValue}
          onChange={(e) => urlOnChange(e.target.value)}
          error={urlError}
        />
      </div>
    </div>
  );
}
