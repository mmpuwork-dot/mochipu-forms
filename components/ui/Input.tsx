import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Input({
  label,
  error,
  hint,
  required,
  className = '',
  id,
  ...props
}: InputProps) {
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
      <input
        id={inputId}
        {...props}
        className={[
          'w-full bg-transparent',
          'border-b border-[var(--color-border-mid)]',
          'pt-1 pb-2 text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-purple-mute)]',
          'outline-none transition-colors duration-150',
          'focus:border-b-[var(--color-black)]',
          error ? '!border-b-[var(--color-high)]' : '',
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
