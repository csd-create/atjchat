import type {
  User,
  Vehicle,
  Shipment,
  Conversation,
  Message,
  Task,
  AppNotification,
} from '@/types';
import {
  mockUsers,
  mockVehicles,
  mockShipments,
  mockConversations,
  mockMessages,
  mockTasks,
  mockNotifications,
} from '@/lib/mock-data';

/**
 * ERP API service layer.
 *
 * Currently returns mock data. Each function is the single integration point
 * that a real ERP API can later replace — swap the mock imports for fetch
 * calls without changing call sites.
 *
 *   ATJ CHAT  ->  API SERVICE  ->  ERP API  ->  ERP DATABASE
 */

const SIMULATED_LATENCY = 0;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY));
}

export const erpApi = {
  async getUsers(): Promise<User[]> {
    return delay(mockUsers);
  },
  async getUser(id: string): Promise<User | undefined> {
    return delay(mockUsers.find((u) => u.id === id));
  },
  async authenticate(email: string, password: string): Promise<User | null> {
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    return delay(user ?? null);
  },

  async getVehicles(): Promise<Vehicle[]> {
    return delay(mockVehicles);
  },
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return delay(mockVehicles.find((v) => v.id === id));
  },
  async getVehicleByReference(ref: string): Promise<Vehicle | undefined> {
    return delay(mockVehicles.find((v) => v.reference === ref));
  },

  async getShipments(): Promise<Shipment[]> {
    return delay(mockShipments);
  },
  async getShipment(id: string): Promise<Shipment | undefined> {
    return delay(mockShipments.find((s) => s.id === id));
  },
  async getShipmentByContainer(container: string): Promise<Shipment | undefined> {
    return delay(mockShipments.find((s) => s.container === container));
  },

  async getConversations(): Promise<Conversation[]> {
    return delay(mockConversations);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return delay(mockMessages.filter((m) => m.conversationId === conversationId));
  },
  async getTasks(): Promise<Task[]> {
    return delay(mockTasks);
  },
  async getNotifications(): Promise<AppNotification[]> {
    return delay(mockNotifications);
  },

  async search(query: string): Promise<{
    users: User[];
    vehicles: Vehicle[];
    shipments: Shipment[];
    messages: Message[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) return delay({ users: [], vehicles: [], shipments: [], messages: [] });
    return delay({
      users: mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
      ),
      vehicles: mockVehicles.filter(
        (v) =>
          v.reference.toLowerCase().includes(q) ||
          v.chassis.toLowerCase().includes(q) ||
          v.booking.toLowerCase().includes(q) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
      ),
      shipments: mockShipments.filter(
        (s) =>
          s.container.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
      ),
      messages: mockMessages.filter((m) =>
        m.message.toLowerCase().includes(q)
      ),
    });
  },
};

export type ErpApi = typeof erpApi;
