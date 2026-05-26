import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  // 黑色實心 CTA
  primary:
    'bg-[var(--color-black)] text-[var(--color-bg-surface)] border-none cursor-pointer ' +
    'hover:bg-[var(--color-ink-soft)]',
  // 虛線次按鈕 — 紫色文字
  secondary:
    'bg-transparent text-[var(--color-purple)] border border-dashed border-[var(--color-border-mid)] cursor-pointer ' +
    'hover:border-[var(--color-purple)]',
  // Ghost 無邊框
  ghost:
    'bg-transparent text-[var(--color-purple-soft)] border-none cursor-pointer ' +
    'hover:text-[var(--color-ink)]',
  // 文字連結樣式（border-bottom 底線，精確 2px 偏移）
  link:
    'bg-transparent text-[var(--color-purple-soft)] border-0 ' +
    '[border-bottom:1px_solid_currentColor] pb-[2px] cursor-pointer ' +
    'hover:text-[var(--color-ink)] transition-colors duration-150',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-[12px] tracking-[0.08em]',
  md: 'px-8 py-3.5 text-[12px] tracking-[0.08em]',
  lg: 'px-9 py-[14px] text-[12px] tracking-[0.08em]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center',
        'font-medium transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-purple)] focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
