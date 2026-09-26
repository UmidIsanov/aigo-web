'use client';

import clsx from 'clsx';
import { Camera, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { toAvatarDataUrl } from '@/lib/image';
import { useProgress } from '@/lib/progress';

export function Avatar({ name, photo, className }: { name: string; photo: string | null; className?: string }) {
  return (
    <span className={clsx('grid shrink-0 place-items-center overflow-hidden rounded-full bg-sun font-display font-bold text-ink', className)}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- local data URL, next/image adds nothing here
        <img src={photo} alt={name} className="size-full object-cover" />
      ) : (
        (name.trim()[0] ?? '?').toUpperCase()
      )}
    </span>
  );
}

/** Avatar with upload/remove controls; the photo is downscaled and saved to the profile. */
export function PhotoPicker({ size = 'lg' }: { size?: 'md' | 'lg' }) {
  const t = useTranslations('onboarding.name');
  const { profile, updateProfile } = useProgress();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      updateProfile({ photo: await toAvatarDataUrl(file) });
      setError(false);
    } catch {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label={profile.photo ? t('photoChange') : t('photo')}
        className="group relative rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
      >
        <Avatar name={profile.name} photo={profile.photo} className={size === 'lg' ? 'size-28 text-4xl' : 'size-20 text-2xl'} />
        <span className="absolute bottom-0 right-0 grid size-9 place-items-center rounded-full bg-brand text-white shadow-float ring-4 ring-canvas transition group-hover:scale-110">
          <Camera className="size-4" />
        </span>
      </button>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <div className="flex items-center gap-3 text-sm">
        <button type="button" onClick={() => input.current?.click()} className="font-semibold text-brand hover:underline">
          {profile.photo ? t('photoChange') : t('photo')}
        </button>
        {profile.photo ? (
          <button type="button" onClick={() => updateProfile({ photo: null })} className="inline-flex items-center gap-1 text-muted hover:text-coral-ink">
            <Trash2 className="size-3.5" />
            {t('photoRemove')}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-coral-ink">{t('photoError')}</p> : null}
    </div>
  );
}
