import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Textarea({
  label,
  error,
  hint,
  required,
  className = '',
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-ink)] m-0">
          {label}
          {required && (
            <span className="ml-1 text-[var(--color-high)]">*</span>
          )}
        </p>
      )}
      <textarea
        id={inputId}
        rows={rows}
        {...props}
        className={[
          'w-full bg-[var(--color-bg-input)] resize-none',
          'border border-[var(--color-border-light)]',
          'px-3 py-2.5 text-[12.5px] text-[var(--color-ink)]',
          'placeholder:text-[var(--color-purple-mute)]',
          'leading-[1.65] outline-none transition-colors duration-150',
          'focus:border-[var(--color-black)]',
          error ? '!border-[var(--color-high)]' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && (
        <p className="text-[11px] italic text-[var(--color-required)] m-0">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[11px] italic text-[var(--color-purple-mute)] m-0">{hint}</p>
      )}
    </div>
  );
}
