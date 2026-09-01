'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  AtSign,
  MessageSquare,
  CheckSquare,
  Car,
  Container,
  CheckCheck,
  MailOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationType } from '@/types';

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  mention: { icon: AtSign, color: 'bg-sky-100 text-sky-600' },
  message: { icon: MessageSquare, color: 'bg-violet-100 text-violet-600' },
  task: { icon: CheckSquare, color: 'bg-rose-100 text-rose-600' },
  vehicle: { icon: Car, color: 'bg-violet-100 text-violet-600' },
  shipment: { icon: Container, color: 'bg-amber-100 text-amber-600' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useApp();

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {unreadNotificationCount} unread of {notifications.length} total
              </p>
            </div>
            {unreadNotificationCount > 0 && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllNotificationsRead}>
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.map((n) => {
              const cfg = typeConfig[n.type];
              const Icon = cfg.icon;
              return (
                <Card
                  key={n.id}
                  className={cn(
                    'transition-colors',
                    !n.read && 'border-primary/20 bg-primary/5'
                  )}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', cfg.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.timestamp)}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {n.link && (
                        <Link href={n.link}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            View
                          </Button>
                        </Link>
                      )}
                      {!n.read && (
                        <button
                          onClick={() => markNotificationRead(n.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <MailOpen className="h-3.5 w-3.5" />
                          Mark read
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bell className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground">You are all caught up.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
