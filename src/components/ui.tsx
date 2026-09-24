import clsx from 'clsx';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'lime' | 'white' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-[0_8px_20px_-6px_rgb(24_119_242/0.55)]',
  secondary: 'bg-surface text-ink ring-1 ring-inset ring-line hover:ring-ink/30',
  ghost: 'text-brand hover:bg-brand-soft',
  lime: 'bg-lime text-ink hover:brightness-95 shadow-[0_8px_20px_-6px_rgb(198_244_50/0.6)]',
  white: 'bg-white text-brand hover:bg-brand-soft',
  dark: 'bg-ink text-white hover:bg-ink-2',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
};

/** Shared button styling for <button> and <Link>. */
export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30',
    'disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]',
    variants[variant],
    sizes[size],
    extra,
  );
}

export type Tone = 'brand' | 'lime' | 'coral' | 'sky' | 'sun' | 'success' | 'ink' | 'neutral';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand',
  lime: 'bg-lime-soft text-lime-ink',
  coral: 'bg-coral-soft text-coral-ink',
  sky: 'bg-sky-soft text-sky-ink',
  sun: 'bg-sun-soft text-sun-ink',
  success: 'bg-success-soft text-success',
  ink: 'bg-ink text-white',
  neutral: 'bg-surface text-ink ring-1 ring-inset ring-line',
};

export function Chip({ children, tone = 'brand', dot, className }: { children: ReactNode; tone?: Tone; dot?: string; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold', tones[tone], className)}>
      {dot ? <span className="size-2 rounded-full" style={{ background: dot }} /> : null}
      {children}
    </span>
  );
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={clsx('text-xs font-bold uppercase tracking-[0.14em]', dark ? 'text-lime' : 'text-brand')}>{children}</p>
  );
}

export function SectionTitle({ eyebrow, title, subtitle, dark, center }: { eyebrow: string; title: string; subtitle?: string; dark?: boolean; center?: boolean }) {
  return (
    <div className={clsx('max-w-2xl', center && 'mx-auto text-center')}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className={clsx('mt-3 font-display text-3xl font-bold leading-[1.15] sm:text-4xl', dark ? 'text-white' : 'text-ink')}>{title}</h2>
      {subtitle ? <p className={clsx('mt-4 text-lg leading-relaxed', dark ? 'text-ink-muted' : 'text-muted')}>{subtitle}</p> : null}
    </div>
  );
}

export function ProgressBar({ value, className, barClassName }: { value: number; className?: string; barClassName?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={clsx('h-2 overflow-hidden rounded-full bg-line', className)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={clsx('h-full rounded-full bg-brand transition-[width] duration-700', barClassName)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-3xl bg-surface p-6 ring-1 ring-line', className)}>{children}</div>;
}
