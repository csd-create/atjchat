'use client';

import { useEffect, useRef, useState } from 'react';
import type { Conversation, Attachment, Message } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
  Paperclip,
  Image as ImageIcon,
  Smile,
  Send,
  Check,
  CheckCheck,
  FileText,
  File,
  Search,
  MoreVertical,
  Phone,
  Video,
  Lock,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusDot } from '@/components/StatusBadges';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function ReadReceipt({ status }: { status: Message['readStatus'] }) {
  if (status === 'sent') return <Check className="h-3.5 w-3.5 text-white/70" />;
  if (status === 'delivered') return <CheckCheck className="h-3.5 w-3.5 text-white/70" />;
  return <CheckCheck className="h-3.5 w-3.5 text-sky-200" />;
}

function AttachmentChip({ att }: { att: Attachment }) {
  const icon =
    att.type === 'pdf' ? (
      <FileText className="h-4 w-4 text-red-400" />
    ) : att.type === 'image' ? (
      <ImageIcon className="h-4 w-4 text-sky-400" />
    ) : (
      <File className="h-4 w-4 text-emerald-400" />
    );
  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs">
      {icon}
      <div className="min-w-0">
        <p className="truncate font-medium text-white">{att.name}</p>
        <p className="text-white/60">{att.size}</p>
      </div>
    </div>
  );
}

const EMOJIS = ['👍', '🙏', '✅', '🚗', '🚢', '📦', '💰', '🔔', '✓', '🇯🇵', '🇵🇰', '😅'];

export function ChatView({
  conversation,
  className,
}: {
  conversation: Conversation;
  className?: string;
}) {
  const { currentUser, getUser, messagesFor, sendMessage, markConversationRead } = useApp();
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = messagesFor(conversation.id);

  useEffect(() => {
    markConversationRead(conversation.id);
  }, [conversation.id, messages.length, markConversationRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (!currentUser) return null;

  function handleSend() {
    sendMessage(conversation.id, text, pendingAttachments);
    setText('');
    setPendingAttachments([]);
    setShowEmoji(false);
  }

  function simulateAttachment(type: Attachment['type']) {
    const names: Record<Attachment['type'], string> = {
      pdf: `Document_${Date.now().toString().slice(-4)}.pdf`,
      image: `Photo_${Date.now().toString().slice(-4)}.jpg`,
      document: `Report_${Date.now().toString().slice(-4)}.docx`,
    };
    const sizes: Record<Attachment['type'], string> = {
      pdf: `${(Math.random() * 1 + 0.5).toFixed(1)} MB`,
      image: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
      document: `${(Math.random() * 0.5 + 0.2).toFixed(1)} MB`,
    };
    setPendingAttachments((prev) => [
      ...prev,
      { id: `att-${Date.now()}`, type, name: names[type], size: sizes[type] },
    ]);
  }

  const headerSubtitle =
    conversation.type === 'dm'
      ? conversation.subtitle
      : conversation.type === 'management'
        ? 'Private Management Channel'
        : `${conversation.memberIds.length + 2} members`;

  let lastDateLabel = '';

  return (
    <div className={cn('flex h-full min-h-0 flex-col bg-background', className)}>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback
            className={cn(
              'text-sm font-bold text-white',
              conversation.type === 'dm'
                ? getUser(conversation.memberIds[0])?.avatarColor ?? 'bg-slate-500'
                : 'bg-gradient-to-br from-primary to-accent'
            )}
          >
            {conversation.emoji ?? initials(conversation.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-foreground">
              {conversation.name}
            </h2>
            {conversation.restricted && (
              <Lock className="h-3.5 w-3.5 text-amber-500" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {conversation.type === 'dm' && (
              <StatusDot status={getUser(conversation.memberIds[0])?.status ?? 'offline'} />
            )}
            <span className="truncate">{headerSubtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Search className="h-4 w-4" />
          </button>
          <button className="hidden rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground sm:block">
            <Phone className="h-4 w-4" />
          </button>
          <button className="hidden rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground sm:block">
            <Video className="h-4 w-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Conversation info</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Mark as read</DropdownMenuItem>
              <DropdownMenuItem>Export chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-secondary/30 px-4 py-4 scrollbar-thin">
        <div className="mx-auto max-w-3xl space-y-1">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                {conversation.emoji ? (
                  <span className="text-2xl">{conversation.emoji}</span>
                ) : (
                  <Send className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground">Start the conversation.</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const dateLabel = formatDateLabel(msg.timestamp);
            const showDate = dateLabel !== lastDateLabel;
            lastDateLabel = dateLabel;
            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="my-4 flex justify-center">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                      {dateLabel}
                    </span>
                  </div>
                )}
                <div className={cn('flex gap-2.5', isMe ? 'justify-end' : 'justify-start')}>
                  {!isMe && (
                    <Avatar className="mt-1 h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px] font-bold text-white bg-slate-500">
                        {initials(msg.senderName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn('max-w-[75%]', isMe && 'items-end')}>
                    {!isMe && (
                      <p className="mb-0.5 ml-1 text-xs font-semibold text-foreground">
                        {msg.senderName}
                      </p>
                    )}
                    <div
                      className={cn(
                        'message-bubble rounded-2xl px-3.5 py-2 text-sm shadow-sm',
                        isMe
                          ? 'rounded-br-md bg-primary text-primary-foreground'
                          : 'rounded-bl-md bg-card text-card-foreground border border-border'
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      {msg.attachments.length > 0 && (
                        <div className={cn('space-y-1', isMe && 'mt-1')}>
                          {msg.attachments.map((att) => (
                            <AttachmentChip key={att.id} att={att} />
                          ))}
                        </div>
                      )}
                      <div
                        className={cn(
                          'mt-1 flex items-center gap-1 text-[10px]',
                          isMe ? 'justify-end text-white/60' : 'text-muted-foreground'
                        )}
                      >
                        <span>{formatTime(msg.timestamp)}</span>
                        {isMe && <ReadReceipt status={msg.readStatus} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending attachments */}
      {pendingAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border bg-card px-4 py-2">
          {pendingAttachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1.5 text-xs"
            >
              {att.type === 'pdf' ? (
                <FileText className="h-3.5 w-3.5 text-red-500" />
              ) : att.type === 'image' ? (
                <ImageIcon className="h-3.5 w-3.5 text-sky-500" />
              ) : (
                <File className="h-3.5 w-3.5 text-emerald-500" />
              )}
              <span className="font-medium">{att.name}</span>
              <button
                onClick={() =>
                  setPendingAttachments((prev) => prev.filter((a) => a.id !== att.id))
                }
                className="text-muted-foreground hover:text-destructive"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div className="border-t border-border bg-card px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => {
                  setText((t) => t + e);
                  setShowEmoji(false);
                }}
                className="rounded-md p-1.5 text-lg hover:bg-secondary"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="shrink-0 border-t border-border bg-card p-3">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Paperclip className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => simulateAttachment('document')}>
                <File className="mr-2 h-4 w-4" /> Attach document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => simulateAttachment('image')}>
                <ImageIcon className="mr-2 h-4 w-4" /> Attach image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => simulateAttachment('pdf')}>
                <FileText className="mr-2 h-4 w-4" /> Attach PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => simulateAttachment('image')}
            className="rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowEmoji((s) => !s)}
            className={cn(
              'rounded-lg p-2.5 hover:bg-secondary',
              showEmoji ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Smile className="h-5 w-5" />
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder={
              conversation.type === 'vehicle'
                ? 'Write a message about this vehicle…'
                : conversation.type === 'shipment'
                  ? 'Write a message about this shipment…'
                  : 'Type a message…'
            }
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring scrollbar-thin"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() && pendingAttachments.length === 0}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
