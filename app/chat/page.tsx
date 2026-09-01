'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AppShell, ManagementGate } from '@/components/AppShell';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatView } from '@/components/chat/ChatView';
import { MessageSquare, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { conversations, getConversation, currentUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('c');
  const [activeId, setActiveId] = useState<string | undefined>(queryId ?? undefined);

  useEffect(() => {
    if (queryId) setActiveId(queryId);
  }, [queryId]);

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations]);

  const active = activeId ? getConversation(activeId) : undefined;

  function handleSelect(id: string) {
    setActiveId(id);
    router.replace(`/chat?c=${id}`, { scroll: false });
  }

  return (
    <AppShell>
      <div className="flex h-full">
        {/* Conversation list - desktop */}
        <div className="hidden w-72 shrink-0 border-r border-border md:block">
          <ConversationList activeId={activeId} onSelect={handleSelect} />
        </div>

        {/* Chat area */}
        <div className="min-w-0 flex-1">
          {active ? (
            active.type === 'management' ? (
              <ManagementGate>
                <ChatView conversation={active} />
              </ManagementGate>
            ) : (
              <ChatView conversation={active} />
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <MessageSquare className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Select a conversation</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Choose a direct message, department, vehicle, or shipment chat from the list.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
