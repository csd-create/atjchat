'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function RootPage() {
  const { currentUser } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (currentUser) router.replace('/dashboard');
    else router.replace('/login');
  }, [currentUser, router]);
  return (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      Loading…
    </div>
  );
}
