import { HTMLAttributes, ReactNode } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'secondary';
}

const badgeStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white',
  secondary: 'inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700',
};

export function Badge({ children, className = '', variant = 'default', ...props }: BadgeProps) {
  return (
    <span className={`${badgeStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
