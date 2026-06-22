'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LeadStatus = 'new' | 'in_progress' | 'closed';

interface LeadStatusSelectProps {
  id: string;
  status: LeadStatus;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  closed: 'Закрыта',
};

const STATUS_COLORS: Record<LeadStatus, { bg: string; color: string; border: string }> = {
  new: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  in_progress: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  closed: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
};

export function LeadStatusSelect({ id, status: initialStatus }: LeadStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as LeadStatus;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      } else {
        const json = (await res.json()) as { error?: string };
        alert(json.error ?? 'Ошибка обновления');
      }
    } catch {
      alert('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  }

  const colors = STATUS_COLORS[status];

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      style={{
        padding: '4px 10px',
        borderRadius: 20,
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        color: colors.color,
        fontSize: 12,
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        fontFamily: 'var(--font-family-sans)',
        appearance: 'none',
        WebkitAppearance: 'none',
        paddingRight: 24,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7a99'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
      }}
    >
      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
