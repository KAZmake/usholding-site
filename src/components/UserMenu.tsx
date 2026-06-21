'use client';

import { useState, useEffect, useRef } from 'react';

// Placeholder for Clerk integration (Phase 3).
// Currently renders nothing — auth state managed by Clerk SDK later.
// When Clerk is integrated, this component will receive user data via props or useUser() hook.

interface UserMenuProps {
  user?: {
    name: string;
    surname: string;
    email: string;
  } | null;
  onLogout?: () => void;
  onShowProfile?: (tab: string) => void;
}

export function UserMenu({ user, onLogout, onShowProfile }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = ((user.name?.[0] ?? 'А') + (user.surname?.[0] ?? '')).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-2 rounded-[8px] border-[1.5px] border-[var(--gray-border)] bg-[var(--light-bg)] px-[14px] py-[7px] font-[family-name:var(--font-family-sans)] transition-all duration-200 hover:bg-[var(--gray-border)]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border-2 border-[var(--orange)] bg-[var(--navy)] text-[11px] font-bold text-white">
          {initials}
        </div>
        <span className="text-[13px] font-semibold text-[var(--navy)]">{user.name}</span>
        <span className="text-[11px] text-[var(--gray)]">▾</span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-[300] min-w-[210px] overflow-hidden rounded-[12px] border border-[var(--gray-border)] bg-white shadow-[var(--shadow-lg)]">
          <div className="border-b border-[var(--gray-border)] bg-[var(--light-bg)] px-[18px] py-[14px]">
            <div className="text-[14px] font-bold text-[var(--navy)]">
              {user.name} {user.surname}
            </div>
            <div className="mt-[2px] text-[11px] text-[var(--gray)]">{user.email}</div>
          </div>
          <button
            className="flex w-full cursor-pointer items-center gap-[10px] border-none bg-transparent px-[18px] py-[11px] text-left font-[family-name:var(--font-family-sans)] text-[13px] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--off-white)]"
            onClick={() => {
              setOpen(false);
              onShowProfile?.('info');
            }}
          >
            👤 Мой профиль
          </button>
          <button
            className="flex w-full cursor-pointer items-center gap-[10px] border-none bg-transparent px-[18px] py-[11px] text-left font-[family-name:var(--font-family-sans)] text-[13px] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--off-white)]"
            onClick={() => {
              setOpen(false);
              onShowProfile?.('password');
            }}
          >
            🔒 Сменить пароль
          </button>
          <button
            className="flex w-full cursor-pointer items-center gap-[10px] border-none bg-transparent px-[18px] py-[11px] text-left font-[family-name:var(--font-family-sans)] text-[13px] font-semibold text-[var(--navy)] transition-colors duration-150 hover:bg-[var(--off-white)]"
            onClick={() => {
              setOpen(false);
              window.open('https://outlook.office.com', '_blank');
            }}
          >
            ✉️ Корпоративная почта →
          </button>
          <div className="h-px bg-[var(--gray-border)]" />
          <button
            className="flex w-full cursor-pointer items-center gap-[10px] border-none bg-transparent px-[18px] py-[11px] text-left font-[family-name:var(--font-family-sans)] text-[13px] text-[#E53E3E] transition-colors duration-150 hover:bg-[#FFF5F5]"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
          >
            🚪 Выйти
          </button>
        </div>
      )}
    </div>
  );
}
