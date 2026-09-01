'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, StatusDot } from '@/components/StatusBadges';
import { erpApi } from '@/services/erpApi';
import type { User, Vehicle, Shipment, Message } from '@/types';
import {
  Search,
  Car,
  Container,
  User as UserIcon,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function SearchPage() {
  const params = useSearchParams();
  const initialQ = params.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    users: User[];
    vehicles: Vehicle[];
    shipments: Shipment[];
    messages: Message[];
  }>({ users: [], vehicles: [], shipments: [], messages: [] });
  const { getUser } = useApp();

  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setResults({ users: [], vehicles: [], shipments: [], messages: [] });
      return;
    }
    setLoading(true);
    erpApi.search(query).then((r) => {
      if (active) {
        setResults(r);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [query]);

  const hasResults =
    results.users.length + results.vehicles.length + results.shipments.length + results.messages.length > 0;

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Search</h1>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search staff, vehicles, chassis, containers, bookings, messages…"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching…
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Start typing to search</p>
              <p className="text-xs text-muted-foreground">
                Find staff, vehicles, shipments, and messages across ATJ Chat.
              </p>
            </div>
          )}

          {!loading && query.trim() && !hasResults && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No results for “{query}”</p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="space-y-6">
              {/* Users */}
              {results.users.length > 0 && (
                <Section title="Staff" icon={UserIcon} count={results.users.length}>
                  <div className="space-y-2">
                    {results.users.map((u) => (
                      <Link
                        key={u.id}
                        href="/teams"
                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-accent/5"
                      >
                        <div className="relative">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className={cn('text-xs font-bold text-white', u.avatarColor)}>
                              {initials(u.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-0.5 -right-0.5">
                            <StatusDot status={u.status} />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.department} · {u.roleLabel}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Section>
              )}

              {/* Vehicles */}
              {results.vehicles.length > 0 && (
                <Section title="Vehicles" icon={Car} count={results.vehicles.length}>
                  <div className="space-y-2">
                    {results.vehicles.map((v) => (
                      <Link
                        key={v.id}
                        href={`/vehicles/${v.id}`}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-accent/5"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                          <Car className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{v.reference}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {v.make} {v.model} · {v.chassis}
                          </p>
                        </div>
                        <StatusBadge status={v.status} />
                      </Link>
                    ))}
                  </div>
                </Section>
              )}

              {/* Shipments */}
              {results.shipments.length > 0 && (
                <Section title="Shipments" icon={Container} count={results.shipments.length}>
                  <div className="space-y-2">
                    {results.shipments.map((s) => (
                      <Link
                        key={s.id}
                        href={`/shipments/${s.id}`}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-accent/5"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                          <Container className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{s.container}</p>
                          <p className="truncate text-xs text-muted-foreground">{s.destination}</p>
                        </div>
                        <StatusBadge status={s.status} />
                      </Link>
                    ))}
                  </div>
                </Section>
              )}

              {/* Messages */}
              {results.messages.length > 0 && (
                <Section title="Messages" icon={MessageSquare} count={results.messages.length}>
                  <div className="space-y-2">
                    {results.messages.slice(0, 8).map((m) => (
                      <Link
                        key={m.id}
                        href={`/chat?c=${m.conversationId}`}
                        className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-accent/5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{m.senderName}</p>
                          <p className="truncate text-xs text-muted-foreground">{m.message}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  icon: typeof Search;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{title}</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}
