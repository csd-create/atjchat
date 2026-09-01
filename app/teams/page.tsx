'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { StatusDot } from '@/components/StatusBadges';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MessageSquare, ShieldCheck, Crown, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const roleIcon: Record<string, typeof UserIcon> = {
  staff: UserIcon,
  manager: ShieldCheck,
  admin: Crown,
};

const statusLabel: Record<string, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

export default function TeamsPage() {
  const { users, conversations, currentUser } = useApp();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.department.toLowerCase().includes(query.toLowerCase()) ||
      u.roleLabel.toLowerCase().includes(query.toLowerCase())
  );

  function openDirectChat(userId: string) {
    const conv = conversations.find((c) => c.type === 'dm' && c.memberIds.includes(userId));
    if (conv) router.push(`/chat?c=${conv.id}`);
  }

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff Directory</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Click a team member to open a direct chat.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff, department, role…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((u) => {
              const RoleIcon = roleIcon[u.role] ?? UserIcon;
              const isMe = u.id === currentUser?.id;
              return (
                <Card key={u.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className={cn('text-sm font-bold text-white', u.avatarColor)}>
                            {initials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5">
                          <StatusDot status={u.status} />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-sm font-bold text-foreground">{u.name}</h3>
                          {isMe && (
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              You
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{u.department}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <RoleIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{u.roleLabel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            u.status === 'online' ? 'bg-emerald-500' : u.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                          )}
                        />
                        {statusLabel[u.status]}
                      </span>
                      {!isMe && (
                        <button
                          onClick={() => openDirectChat(u.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Message
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No staff found</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
