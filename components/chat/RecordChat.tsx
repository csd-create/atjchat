'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { ChatView } from '@/components/chat/ChatView';
import type { ConversationType } from '@/types';

/**
 * Finds the conversation linked to a business record (vehicle or shipment)
 * and renders the ChatView for it. This is the core "chat connected to
 * business records" concept.
 */
export function RecordChat({
  recordId,
  type,
  title,
}: {
  recordId: string;
  type: ConversationType;
  title: string;
}) {
  const { conversations } = useApp();
  const conversation = useMemo(
    () =>
      conversations.find(
        (c) => c.recordId === recordId && c.type === type
      ),
    [conversations, recordId, type]
  );

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-sm font-medium text-foreground">Discussion not found</p>
        <p className="text-xs text-muted-foreground">
          No conversation is linked to {title} yet.
        </p>
      </div>
    );
  }

  return <ChatView conversation={conversation} />;
}
