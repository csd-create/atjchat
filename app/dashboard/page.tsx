'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Car,
  Container,
  CheckSquare,
  Users,
  TrendingUp,
  ArrowRight,
  Activity,
  CircleDot,
} from 'lucide-react';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  const { currentUser, users, vehicles, shipments, tasks, messages } = useApp();

  const stats = [
    { label: 'Messages', value: 24, icon: MessageSquare, color: 'bg-sky-500', href: '/chat' },
    { label: 'Vehicle Discussions', value: 8, icon: Car, color: 'bg-violet-500', href: '/vehicles' },
    { label: 'Shipment Updates', value: 3, icon: Container, color: 'bg-amber-500', href: '/shipments' },
    { label: 'Pending Tasks', value: tasks.filter((t) => t.status !== 'COMPLETED').length, icon: CheckSquare, color: 'bg-rose-500', href: '/tasks' },
    { label: 'Online Staff', value: users.filter((u) => u.status === 'online').length, icon: Users, color: 'bg-emerald-500', href: '/teams' },
  ];

  const recentActivity = [
    { icon: Car, text: 'AT21235 updated', time: '10m ago', color: 'text-violet-500' },
    { icon: Container, text: 'TYOGD5827400 shipment updated', time: '30m ago', color: 'text-amber-500' },
    { icon: MessageSquare, text: 'Japan Yard sent a message', time: '1h ago', color: 'text-sky-500' },
    { icon: CheckSquare, text: 'New task assigned', time: '2h ago', color: 'text-rose-500' },
    { icon: TrendingUp, text: 'Sales inquiry from Guyana dealer', time: '3h ago', color: 'text-emerald-500' },
  ];

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {currentUser?.name.split(' ')[0]}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here is what is happening across Afridi Trading Japan today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href={s.href}>
                  <Card className="group transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white', s.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Recent activity */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                {recentActivity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-secondary/60"
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', a.color)} />
                      <span className="flex-1 text-sm text-foreground">{a.text}</span>
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Online staff */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Online Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                {users.map((u) => (
                  <Link
                    key={u.id}
                    href="/teams"
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/60"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn('text-[10px] font-bold text-white', u.avatarColor)}>
                          {initials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card',
                          u.status === 'online' ? 'bg-emerald-500' : u.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.department}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Vehicles + Shipments */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Recent Vehicles</CardTitle>
                <Link href="/vehicles" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {vehicles.slice(0, 3).map((v) => (
                  <Link
                    key={v.id}
                    href={`/vehicles/${v.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-accent/5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{v.reference}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {v.make} {v.model} · {v.destination}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Recent Shipments</CardTitle>
                <Link href="/shipments" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {shipments.map((s) => (
                  <Link
                    key={s.id}
                    href={`/shipments/${s.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-accent/5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Container className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{s.container}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.destination} · {s.vehicleIds.length} vehicles
                      </p>
                    </div>
                    <StatusBadge status={s.status} />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ERP status banner */}
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            <CircleDot className="h-5 w-5 text-emerald-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">ERP Integration: READY</p>
              <p className="text-xs text-muted-foreground">
                Current Mode: DEMO · API Connection: MOCK · Real ERP can be connected via the service layer.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
