'use client';

import { useState, useEffect, useRef } from 'react';
import type { ReportTranslations } from '@/components/report/types';
import { generateIssueTitle } from '@/components/report/utils';
import type { FeedbackIssue } from '@/lib/supabase/types';

// ── Input shapes ─────────────────────────────────────────────────────────────

interface FeedbackInput {
  type: 'feedback';
  locale: string;
  issues: FeedbackIssue[];
}

interface ConfirmInput {
  type: 'confirm';
  locale: string;
  additional_message?: string;
}

export type TranslationInput = FeedbackInput | ConfirmInput;

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation(input: TranslationInput, mode: string) {
  const [translations, setTranslations] = useState<ReportTranslations | undefined>();
  const [loading, setLoading] = useState(false);
  // True when the translation attempt has resolved (success, skip, or failure).
  // Drives the `data-report-ready` attribute Puppeteer waits on.
  const [done, setDone] = useState(
    () => mode === 'original' || input.locale === 'zh',
  );
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Original mode or ZH locale → no translation needed
    if (mode === 'original' || input.locale === 'zh') {
      setTranslations(undefined);
      setDone(true);
      return;
    }

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setDone(false);
    setLoading(true);

    async function doTranslate() {
      try {
        if (input.type === 'feedback') {
          await translateFeedback(input, controller.signal);
        } else {
          await translateConfirm(input, controller.signal);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('[useTranslation]', err);
          setTranslations(undefined);
        }
      } finally {
        setLoading(false);
        setDone(true);
      }
    }

    async function translateFeedback(data: FeedbackInput, signal: AbortSignal) {
      // Build a flat list of texts + mapping back to issue/field
      const texts: string[] = [];
      const map: { issueIdx: number; field: 'title' | 'expected' | 'current_state' }[] = [];

      data.issues.forEach((issue, idx) => {
        const title = generateIssueTitle(issue.expected, issue.current_state);
        if (title !== '(no description)') {
          map.push({ issueIdx: idx, field: 'title' });
          texts.push(title);
        }
        if (issue.expected) {
          map.push({ issueIdx: idx, field: 'expected' });
          texts.push(issue.expected);
        }
        if (issue.current_state) {
          map.push({ issueIdx: idx, field: 'current_state' });
          texts.push(issue.current_state);
        }
      });

      if (texts.length === 0) { setTranslations(undefined); return; }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, sourceLang: data.locale }),
        signal,
      });
      if (!res.ok) throw new Error('translate API error');

      const json = await res.json();
      if (json.skipped) { setTranslations(undefined); return; }

      // Rebuild per-issue translation objects
      const issueTranslations: NonNullable<ReportTranslations['issues']> =
        data.issues.map(() => ({}));

      map.forEach(({ issueIdx, field }, i) => {
        const t = json.translations[i];
        if (t) issueTranslations[issueIdx][field] = t;
      });

      setTranslations({ issues: issueTranslations });
    }

    async function translateConfirm(data: ConfirmInput, signal: AbortSignal) {
      if (!data.additional_message) { setTranslations(undefined); return; }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [data.additional_message], sourceLang: data.locale }),
        signal,
      });
      if (!res.ok) throw new Error('translate API error');

      const json = await res.json();
      if (json.skipped || !json.translations?.[0]) { setTranslations(undefined); return; }

      setTranslations({ additional_message: json.translations[0] });
    }

    doTranslate();

    return () => { controller.abort(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, input.locale]);

  return { translations, loading, done };
}
