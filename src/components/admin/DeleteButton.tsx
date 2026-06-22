'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  id: string;
  apiPath: string;
  label: string;
  redirectTo: string;
}

export function DeleteButton({ id, apiPath, label, redirectTo }: DeleteButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        const json = (await res.json()) as { error?: string };
        alert(json.error ?? 'Ошибка удаления');
        setConfirming(false);
      }
    } catch {
      alert('Ошибка соединения');
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-light)' }}>
          Удалить «{label.slice(0, 20)}»?
        </span>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            background: '#dc2626',
            color: '#fff',
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '...' : 'Да'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            background: 'var(--light-bg)',
            color: 'var(--text)',
            border: '1px solid var(--gray-border)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Нет
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        padding: '6px 14px',
        borderRadius: 6,
        background: '#fff',
        color: '#dc2626',
        border: '1px solid #fca5a5',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      Удалить
    </button>
  );
}
