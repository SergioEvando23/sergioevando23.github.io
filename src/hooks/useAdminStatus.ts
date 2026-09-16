import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { hasFirebaseConfig } from '@/lib/firebase/client';
import { ADMIN_EMAIL, getAdminDocument } from '@/services/firebase/admins';

interface AdminStatus {
  isAdmin: boolean;
  loading: boolean;
}

export function useAdminStatus(user: User | null) {
  const [status, setStatus] = useState<AdminStatus>({
    isAdmin: false,
    loading: false,
  });

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (!user) {
        setStatus({ isAdmin: false, loading: false });
        return;
      }

      setStatus({ isAdmin: false, loading: true });

      if (
        !hasFirebaseConfig() ||
        !user.emailVerified ||
        user.email !== ADMIN_EMAIL
      ) {
        if (active) {
          setStatus({ isAdmin: false, loading: false });
        }
        return;
      }

      try {
        const admin = await getAdminDocument(user.uid);
        const isAdmin =
          admin?.active === true && admin.email === user.email && user.emailVerified;

        if (active) {
          setStatus({ isAdmin, loading: false });
        }
      } catch {
        if (active) {
          setStatus({ isAdmin: false, loading: false });
        }
      }
    }

    void checkAdmin();

    return () => {
      active = false;
    };
  }, [user]);

  return status;
}
