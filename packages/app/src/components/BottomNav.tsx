'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, UserCircle } from 'lucide-react';

const NAV_ROUTES = ['/', '/classement', '/profil'];

const TABS = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/classement', label: 'Classement', icon: Trophy },
  { href: '/profil', label: 'Profil', icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  if (!NAV_ROUTES.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-indigo-950/90 backdrop-blur-md border-t border-white/10 z-40">
      <div className="flex">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
            >
              <Icon
                size={22}
                className={active ? 'text-pink-400' : 'text-white/40'}
              />
              <span className={`text-[10px] font-semibold ${active ? 'text-pink-400' : 'text-white/40'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
