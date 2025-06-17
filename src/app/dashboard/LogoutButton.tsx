// ===== src/app/dashboard/LogoutButton.tsx =====
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
    >
      {loading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}