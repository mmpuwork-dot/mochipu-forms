'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';

const LANGUAGES: { code: string; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JP' },
  { code: 'zh', label: 'ZH' },
];

const STORAGE_KEY = 'mochipu-locale';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Restore saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== locale && LANGUAGES.some((l) => l.code === saved)) {
      router.replace(pathname, { locale: saved as 'en' | 'ja' | 'zh' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure active button and slide the indicator
  useEffect(() => {
    function update() {
      const idx = LANGUAGES.findIndex((l) => l.code === locale);
      const btn = btnRefs.current[idx];
      const container = containerRef.current;
      if (btn && container) {
        const bRect = btn.getBoundingClientRect();
        const cRect = container.getBoundingClientRect();
        setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
      }
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [locale]);

  function handleSwitch(code: string) {
    localStorage.setItem(STORAGE_KEY, code);
    router.replace(pathname, { locale: code as 'en' | 'ja' | 'zh' });
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-3 flex-shrink-0"
      role="navigation"
      aria-label="Language switcher"
    >
      {/* Single sliding underline — moves between active buttons */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 h-px bg-[var(--color-black)] pointer-events-none"
        style={{
          left: indicator?.left ?? 0,
          width: indicator?.width ?? 0,
          opacity: indicator ? 1 : 0,
          transition: indicator
            ? 'left 300ms cubic-bezier(0.4,0,0.2,1), width 300ms cubic-bezier(0.4,0,0.2,1), opacity 200ms'
            : 'none',
        }}
      />

      {LANGUAGES.map(({ code, label }, i) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            ref={(el) => { btnRefs.current[i] = el; }}
            onClick={() => handleSwitch(code)}
            aria-current={isActive ? 'true' : undefined}
            className={[
              'relative bg-transparent border-none p-0 pb-[3px] cursor-pointer',
              'text-[11px] uppercase tracking-[0.12em] whitespace-nowrap',
              'transition-colors duration-300',
              isActive
                ? 'text-[var(--color-black)] font-medium'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
