import clsx from 'clsx';
import { Link } from '@/i18n/navigation';

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={clsx('inline-flex items-center gap-1 font-display text-xl font-bold', className)} aria-label="AiGo">
      <span className="rounded-xl bg-brand px-2 py-1 text-sm text-white">Ai</span>
      <span className={dark ? 'text-white' : 'text-ink'}>Go</span>
    </Link>
  );
}
