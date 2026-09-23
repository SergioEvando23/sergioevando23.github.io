'use client';

import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';

interface UserAvatarProps {
  email: string | null;
  photoUrl: string | null;
}

export function UserAvatar({ email, photoUrl }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasPhoto = Boolean(photoUrl?.trim()) && !imageFailed;
  const avatar = (
    <span
      aria-label={email ?? undefined}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-secondary text-text-muted"
      role="img"
      tabIndex={email ? 0 : undefined}
    >
      {hasPhoto ? (
        // Firebase profile images use dynamic external hosts, so a native image avoids an allowlist.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
          src={photoUrl ?? undefined}
        />
      ) : (
        <PersonIcon aria-hidden="true" fontSize="small" />
      )}
    </span>
  );

  return email ? (
    <Tooltip arrow title={email}>
      {avatar}
    </Tooltip>
  ) : (
    avatar
  );
}
