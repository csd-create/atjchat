'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusDot, PriorityBadge, StatusBadge } from '@/components/StatusBadges';
import {
  ShieldCheck,
  Crown,
  User as UserIcon,
  Mail,
  Building2,
  Bell,
  CheckSquare,
  MessageSquare,
  Lock,
  CircleDot,
  Cpu,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const roleConfig: Record<string, { icon: typeof UserIcon; label: string; color: string }> = {
  staff: { icon: UserIcon, label: 'Staff', color: 'text-sky-600 bg-sky-100' },
  manager: { icon: ShieldCheck, label: 'Manager', color: 'text-violet-600 bg-violet-100' },
  admin: { icon: Crown, label: 'Administrator', color: 'text-rose-600 bg-rose-100' },
};

const permissionsByRole: Record<string, { can: string[]; cannot: string[] }> = {
  staff: {
    can: ['Send messages', 'View allowed departments', 'View vehicle chats', 'View shipment chats'],
    cannot: ['Create department conversations', 'Assign tasks', 'Access management area'],
  },
  manager: {
    can: [
      'Everything staff can do',
      'Create department conversations',
      'Assign tasks',
      'Manage department members',
    ],
    cannot: ['Manage users', 'Manage permissions'],
  },
  admin: {
    can: [
      'Everything',
      'Manage users',
      'Manage channels',
      'Access management area',
      'Manage permissions',
    ],
    cannot: [],
  },
};

export default function ProfilePage() {
  const { currentUser, tasks, notifications } = useApp();
  if (!currentUser) return null;

  const role = roleConfig[currentUser.role];
  const RoleIcon = role.icon;
  const perms = permissionsByRole[currentUser.role];
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser.department || t.createdBy === currentUser.name);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
          {/* Profile header */}
          <Card className="mb-6 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-accent" />
            <CardContent className="px-6 pb-6">
              <div className="-mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-4 ring-card">
                    <AvatarFallback className={cn('text-xl font-bold text-white', currentUser.avatarColor)}>
                      {initials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1">
                    <StatusDot status={currentUser.status} className="ring-2 ring-card" />
                  </span>
                </div>
                <div className="flex-1 pb-1">
                  <h1 className="text-xl font-bold text-foreground">{currentUser.name}</h1>
                  <p className="text-sm text-muted-foreground">{currentUser.roleLabel}</p>
                </div>
                <div className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold', role.color)}>
                  <RoleIcon className="h-3.5 w-3.5" />
                  {role.label}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-foreground">{currentUser.department}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tasks" className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/60">
                  <CheckSquare className="h-4 w-4 text-rose-500" />
                  <span className="flex-1 text-sm text-foreground">My tasks</span>
                  <span className="text-sm font-bold text-foreground">{myTasks.length}</span>
                </Link>
                <Link href="/notifications" className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/60">
                  <Bell className="h-4 w-4 text-amber-500" />
                  <span className="flex-1 text-sm text-foreground">Unread notifications</span>
                  <span className="text-sm font-bold text-foreground">{unread}</span>
                </Link>
                <Link href="/chat" className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/60">
                  <MessageSquare className="h-4 w-4 text-sky-500" />
                  <span className="flex-1 text-sm text-foreground">Conversations</span>
                  <span className="text-sm font-bold text-foreground">15</span>
                </Link>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Permissions</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-600">Can do</p>
                    <ul className="space-y-1.5">
                      {perms.can.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {perms.cannot.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Restricted</p>
                      <ul className="space-y-1.5">
                        {perms.cannot.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ERP integration info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                ERP Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <CircleDot className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">ERP Integration</p>
                    <p className="text-sm font-semibold text-foreground">READY</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Database className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Mode</p>
                    <p className="text-sm font-semibold text-foreground">DEMO</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Cpu className="h-5 w-5 text-sky-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">API Connection</p>
                    <p className="text-sm font-semibold text-foreground">MOCK</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                This is a prototype. The service layer in <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-foreground">services/erpApi.ts</code> is the single
                integration point — swap the mock functions for real ERP API calls without changing call sites.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
