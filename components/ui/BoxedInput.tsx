import React from 'react';

interface BoxedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  prefix?: React.ReactNode;
}

export function BoxedInput({
  label,
  error,
  hint,
  required,
  prefix,
  className = '',
  id,
  ...props
}: BoxedInputProps) {
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
      <div
        className={[
          'flex items-center bg-[var(--color-bg-input)]',
          'border border-[var(--color-border-light)]',
          'focus-within:border-[var(--color-black)]',
          'transition-colors duration-150',
          error ? '!border-[var(--color-high)]' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {prefix && (
          <span className="pl-3 text-[12px] text-[var(--color-purple-mute)] select-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          {...props}
          className={[
            'flex-1 min-w-0 bg-transparent',
            'px-3 py-2.5 text-[12.5px] text-[var(--color-ink)]',
            'placeholder:text-[var(--color-purple-mute)]',
            'outline-none',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      {error && (
        <p className="text-[11px] italic text-[var(--color-required)] m-0">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[10.5px] text-[var(--color-purple-mute)] m-0">{hint}</p>
      )}
    </div>
  );
}
