'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  User,
  Conversation,
  Message,
  Task,
  AppNotification,
  Attachment,
} from '@/types';
import { erpApi } from '@/services/erpApi';
import {
  mockUsers,
  mockConversations,
  mockMessages,
  mockTasks,
  mockNotifications,
  mockVehicles,
  mockShipments,
} from '@/lib/mock-data';

interface AppState {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  messages: Message[];
  tasks: Task[];
  notifications: AppNotification[];
  vehicles: typeof mockVehicles;
  shipments: typeof mockShipments;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendMessage: (
    conversationId: string,
    text: string,
    attachments?: Attachment[]
  ) => void;
  markConversationRead: (conversationId: string) => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  getUser: (id: string) => User | undefined;
  getConversation: (id: string) => Conversation | undefined;
  getVehicle: (id: string) => (typeof mockVehicles)[number] | undefined;
  getShipment: (id: string) => (typeof mockShipments)[number] | undefined;
  messagesFor: (conversationId: string) => Message[];
  unreadNotificationCount: number;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(mockUsers);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(mockNotifications);
  const [vehicles] = useState(mockVehicles);
  const [shipments] = useState(mockShipments);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('atj_user') : null;
    if (saved) {
      const u = mockUsers.find((x) => x.id === saved);
      if (u) setCurrentUser(u);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await erpApi.authenticate(email, password);
    if (user) {
      setCurrentUser(user);
      if (typeof window !== 'undefined') localStorage.setItem('atj_user', user.id);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem('atj_user');
  }, []);

  const getUser = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );
  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );
  const getVehicle = useCallback(
    (id: string) => vehicles.find((v) => v.id === id),
    [vehicles]
  );
  const getShipment = useCallback(
    (id: string) => shipments.find((s) => s.id === id),
    [shipments]
  );
  const messagesFor = useCallback(
    (conversationId: string) =>
      messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [messages]
  );

  const addNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      setNotifications((prev) => [
        {
          ...n,
          id: `n-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    },
    []
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string, attachments: Attachment[] = []) => {
      if (!currentUser) return;
      const trimmed = text.trim();
      if (!trimmed && attachments.length === 0) return;

      const mentionMatches = trimmed.match(/@(\w+)/g) || [];
      const mentions = mentionMatches.map((m) => m.slice(1));

      const newMessage: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        message: trimmed,
        timestamp: new Date().toISOString(),
        attachments,
        readStatus: 'sent',
        mentions: mentions.length ? mentions : undefined,
      };
      setMessages((prev) => [...prev, newMessage]);

      if (mentions.length) {
        addNotification({
          type: 'mention',
          title: `${currentUser.name} mentioned you`,
          body: `“${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}”`,
          link: `/chat?c=${conversationId}`,
        });
      }

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id ? { ...m, readStatus: 'delivered' } : m
          )
        );
      }, 800);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id ? { ...m, readStatus: 'read' } : m
          )
        );
      }, 2000);
    },
    [currentUser, addNotification]
  );

  const markConversationRead = useCallback((conversationId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.conversationId === conversationId ? { ...m, readStatus: 'read' } : m
      )
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = useMemo<AppState>(
    () => ({
      currentUser,
      users,
      conversations,
      messages,
      tasks,
      notifications,
      vehicles,
      shipments,
      login,
      logout,
      sendMessage,
      markConversationRead,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      updateTaskStatus,
      getUser,
      getConversation,
      getVehicle,
      getShipment,
      messagesFor,
      unreadNotificationCount,
    }),
    [
      currentUser,
      users,
      conversations,
      messages,
      tasks,
      notifications,
      vehicles,
      shipments,
      login,
      logout,
      sendMessage,
      markConversationRead,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      updateTaskStatus,
      getUser,
      getConversation,
      getVehicle,
      getShipment,
      messagesFor,
      unreadNotificationCount,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
