'use client';
import { useEffect, useState } from 'react';
import WelcomeModal from '@/components/common/WelcomeModal';
import { useLoginStore } from '@/stores/loginStore';
import { usePathname } from 'next/navigation';

export default function ClientLayout() {
  const user = useLoginStore(state => state.user);
  const isAdmin = user?.type === 'admin';
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (pathname === '/login' || isAdmin) {
      setShowModal(false);
      return;
    }

    const doNotShowUntil = localStorage.getItem('doNotShowUntil');
    const now = new Date();

    if (!doNotShowUntil || new Date(doNotShowUntil) < now) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [pathname, isAdmin]);

  if (isAdmin || pathname === '/login') {
    return null;
  }

  return <>{showModal && <WelcomeModal onClose={() => setShowModal(false)} />}</>;
}
