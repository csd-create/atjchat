'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusDot } from '@/components/StatusBadges';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Car, Container, Users, Lock } from 'lucide-react';
import type { Conversation } from '@/types';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function ConvItem({
  conv,
  active,
  onClick,
  preview,
}: {
  conv: Conversation;
  active: boolean;
  onClick: () => void;
  preview?: string;
}) {
  const { getUser } = useApp();
  const isDm = conv.type === 'dm';
  const member = isDm ? getUser(conv.memberIds[0]) : undefined;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        active ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-secondary'
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback
          className={cn(
            'text-xs font-bold text-white',
            isDm ? member?.avatarColor ?? 'bg-slate-500' : 'bg-gradient-to-br from-primary to-accent'
          )}
        >
          {conv.emoji ?? initials(conv.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-foreground">{conv.name}</p>
          {conv.restricted && <Lock className="h-3 w-3 shrink-0 text-amber-500" />}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {preview ?? conv.subtitle}
        </p>
      </div>
      {isDm && (
        <span className="shrink-0">
          <StatusDot status={member?.status ?? 'offline'} />
        </span>
      )}
    </button>
  );
}

export function ConversationList({
  activeId,
  onSelect,
  className,
}: {
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const { conversations, currentUser, messages } = useApp();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = conversations;
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, query]);

  const lastMessageFor = (convId: string) => {
    const msgs = messages.filter((m) => m.conversationId === convId);
    if (!msgs.length) return undefined;
    return msgs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
  };

  const dms = filtered.filter((c) => c.type === 'dm');
  const departments = filtered.filter(
    (c) => c.type === 'department' || c.type === 'management'
  );
  const vehicles = filtered.filter((c) => c.type === 'vehicle');
  const shipments = filtered.filter((c) => c.type === 'shipment');

  const sections: { title: string; icon: typeof MessageSquare; items: Conversation[] }[] = [
    { title: 'Direct Messages', icon: MessageSquare, items: dms },
    { title: 'Departments', icon: Users, items: departments },
    { title: 'Recent Vehicles', icon: Car, items: vehicles },
    { title: 'Recent Shipments', icon: Container, items: shipments },
  ];

  return (
    <div className={cn('flex h-full flex-col bg-card', className)}>
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations…"
            className="h-9 pl-9 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {filtered.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            No conversations found.
          </p>
        )}
        {sections.map((section) =>
          section.items.length === 0 ? null : (
            <div key={section.title} className="mb-3">
              <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((conv) => {
                  const last = lastMessageFor(conv.id);
                  const preview = last
                    ? `${last.senderName.split(' ')[0]}: ${last.message}`
                    : conv.subtitle;
                  return (
                    <ConvItem
                      key={conv.id}
                      conv={conv}
                      active={activeId === conv.id}
                      onClick={() => onSelect?.(conv.id)}
                      preview={preview}
                    />
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
