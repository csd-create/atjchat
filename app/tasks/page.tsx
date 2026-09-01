'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadges';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  CheckSquare,
  Play,
  Check,
  Car,
  Container,
  Clock,
  User as UserIcon,
} from 'lucide-react';
import type { Task } from '@/types';

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TasksPage() {
  const { tasks, updateTaskStatus, currentUser } = useApp();
  const { toast } = useToast();
  const [tab, setTab] = useState('all');

  const pending = tasks.filter((t) => t.status === 'PENDING');
  const inProgress = tasks.filter((t) => t.status === 'IN PROGRESS');
  const completed = tasks.filter((t) => t.status === 'COMPLETED');

  const visible = tab === 'all' ? tasks : tab === 'pending' ? pending : tab === 'active' ? inProgress : completed;

  function handleStart(t: Task) {
    updateTaskStatus(t.id, 'IN PROGRESS');
    toast({ title: 'Task started', description: t.title });
  }
  function handleComplete(t: Task) {
    updateTaskStatus(t.id, 'COMPLETED');
    toast({ title: 'Task completed', description: t.title });
  }

  function TaskCard({ t }: { t: Task }) {
    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
            </div>
            <PriorityBadge priority={t.priority} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" /> {t.assignedTo}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {timeAgo(t.createdAt)}
            </span>
            {t.relatedVehicleId && (
              <Link href={`/vehicles/${t.relatedVehicleId}`} className="flex items-center gap-1.5 hover:text-primary">
                <Car className="h-3.5 w-3.5" /> Vehicle
              </Link>
            )}
            {t.relatedShipmentId && (
              <Link href={`/shipments/${t.relatedShipmentId}`} className="flex items-center gap-1.5 hover:text-primary">
                <Container className="h-3.5 w-3.5" /> Shipment
              </Link>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <StatusBadge status={t.status} />
            <div className="flex gap-2">
              {t.status === 'PENDING' && (
                <Button size="sm" variant="default" className="h-8 gap-1.5" onClick={() => handleStart(t)}>
                  <Play className="h-3.5 w-3.5" /> Start
                </Button>
              )}
              {t.status === 'IN PROGRESS' && (
                <Button size="sm" variant="default" className="h-8 gap-1.5" onClick={() => handleComplete(t)}>
                  <Check className="h-3.5 w-3.5" /> Complete
                </Button>
              )}
              {t.status === 'COMPLETED' && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <Check className="h-3.5 w-3.5" /> Done
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {pending.length} pending · {inProgress.length} in progress · {completed.length} completed
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="active">In Progress ({inProgress.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((t) => (
              <TaskCard key={t.id} t={t} />
            ))}
          </div>

          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <CheckSquare className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No tasks here</p>
              <p className="text-xs text-muted-foreground">Tasks assigned to your team will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
