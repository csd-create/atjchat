'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { StatusDot } from '@/components/StatusBadges';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Users,
  Car,
  Container,
  CheckSquare,
  Bell,
  UserCircle,
  Search,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Lock,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: MessageSquare },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/vehicles', label: 'Vehicles', icon: Car },
  { href: '/shipments', label: 'Shipments', icon: Container },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, unreadNotificationCount } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!currentUser) return null;

  function initials(name: string) {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>
      </div>

      <div className="px-3 py-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-9 pl-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" style={{ width: 18, height: 18 }} />
              <span className="flex-1">{item.label}</span>
              {item.href === '/notifications' && unreadNotificationCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 rounded-md bg-secondary/60 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-muted-foreground">
            ERP Integration: READY
          </span>
          <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
            DEMO
          </span>
        </div>
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary"
        >
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarFallback className={cn('text-xs font-bold text-white', currentUser.avatarColor)}>
                {initials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5">
              <StatusDot status={currentUser.status} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.roleLabel}
            </p>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => {
            logout();
            router.push('/login');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64">
            {sidebar}
            <button
              className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo size="sm" showText={false} />
          <span className="text-sm font-semibold">ATJ Chat</span>
          <Link
            href="/notifications"
            className="ml-auto relative rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
        </header>
        <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

export function ManagementGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'manager')) {
    return (
      fallback ?? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Restricted area</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            This channel is only available to Management and Administrator roles.
          </p>
        </div>
      )
    );
  }
  return <>{children}</>;
}
