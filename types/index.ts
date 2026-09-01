export type Role = 'staff' | 'manager' | 'admin';

export type OnlineStatus = 'online' | 'away' | 'offline';

export type VehicleStatus =
  | 'BOOKED'
  | 'RESERVED'
  | 'PARTIAL PAID'
  | 'AVAILABLE'
  | 'SHIPPED';

export type ShipmentStatus = 'SHIPPED' | 'BOOKING' | 'LOADED' | 'DELIVERED';

export type TaskStatus = 'PENDING' | 'IN PROGRESS' | 'COMPLETED';
export type TaskPriority = 'HIGH' | 'NORMAL' | 'LOW';

export type ReadStatus = 'sent' | 'delivered' | 'read';

export type AttachmentType = 'pdf' | 'image' | 'document';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  department: string;
  role: Role;
  roleLabel: string;
  status: OnlineStatus;
  avatarColor: string;
}

export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  size: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  attachments: Attachment[];
  readStatus: ReadStatus;
  mentions?: string[];
}

export type ConversationType = 'dm' | 'department' | 'vehicle' | 'shipment' | 'management';

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  subtitle?: string;
  emoji?: string;
  memberIds: string[];
  restricted?: boolean;
  recordId?: string;
}

export interface Vehicle {
  id: string;
  reference: string;
  make: string;
  model: string;
  chassis: string;
  status: VehicleStatus;
  destination: string;
  booking: string;
  year: number;
  color: string;
  price: number;
}

export interface Shipment {
  id: string;
  container: string;
  destination: string;
  etd: string;
  eta: string;
  status: ShipmentStatus;
  vehicleIds: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedVehicleId?: string;
  relatedShipmentId?: string;
  createdAt: string;
  createdBy: string;
}

export type NotificationType = 'mention' | 'message' | 'task' | 'shipment' | 'vehicle';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
  link?: string;
}
