'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  value: string | undefined; // YYYY-MM-DD
  onChange: (v: string) => void;
  error?: string;
}

const WEEKDAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'];
const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];

function formatMonthYear(year: number, month: number, locale: string): string {
  if (locale === 'zh') return `${year} 年 ${month + 1} 月`;
  if (locale === 'ja') return `${year}年${month + 1}月`;
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long' }).format(
    new Date(year, month),
  );
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

export function DatePicker({ value, onChange, error }: Props) {
  const t = useTranslations('confirm.field');
  const locale = useLocale();

  const today = new Date();
  const [viewYear, setViewYear] = useState(
    value ? parseInt(value.slice(0, 4)) : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value ? parseInt(value.slice(5, 7)) - 1 : today.getMonth(),
  );

  const weekdays =
    locale === 'zh' ? WEEKDAYS_ZH : locale === 'ja' ? WEEKDAYS_JA : WEEKDAYS_EN;

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  type Cell = { day: number; type: 'prev' | 'current' | 'next'; dateStr?: string };
  const cells: Cell[] = [];

  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ day: daysInPrevMonth - firstWeekday + 1 + i, type: 'prev' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push({ day: d, type: 'current', dateStr: `${viewYear}-${mm}-${dd}` });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay++, type: 'next' });
  }

  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] p-5">
      <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-ink)] mb-3">
        {t('selectDate')}
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-[14px]">
        <span className="text-[14px] text-[var(--color-ink)] tracking-[0.04em]">
          {formatMonthYear(viewYear, viewMonth, locale)}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="w-7 h-7 flex items-center justify-center text-[var(--color-purple)] hover:text-[var(--color-ink)] bg-transparent border-none cursor-pointer transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="w-7 h-7 flex items-center justify-center text-[var(--color-purple)] hover:text-[var(--color-ink)] bg-transparent border-none cursor-pointer transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((d) => (
          <span
            key={d}
            className="text-[10px] text-[var(--color-purple)] text-center py-1 tracking-[0.04em]"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (cell.type !== 'current') {
            return (
              <span
                key={i}
                className="text-[12px] text-[var(--color-border-mid)] text-center py-2"
              >
                {cell.day}
              </span>
            );
          }
          const isSelected = cell.dateStr === value;
          return (
            <button
              key={i}
              type="button"
              onClick={() => cell.dateStr && onChange(cell.dateStr)}
              className={[
                'text-[12px] text-center py-2 border-none cursor-pointer transition-colors w-full',
                isSelected
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg-surface)] font-medium'
                  : 'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-bg-page)]',
              ].join(' ')}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      {/* Selected date display */}
      {value && (
        <p className="text-[11px] text-[var(--color-purple-soft)] mt-[14px] pt-3 border-t border-[var(--color-border-light)] m-0">
          {t('selectedDate')}
          <span className="text-[var(--color-accent)] font-medium">
            {formatDate(value, locale)}
          </span>
        </p>
      )}

      {error && (
        <p className="text-[11px] text-[var(--color-required)] mt-2">{error}</p>
      )}
    </div>
  );
}
