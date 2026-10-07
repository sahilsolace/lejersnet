export type InspectionType = 'move_in' | 'move_out';
export type InspectionStatus = 'in_progress' | 'completed';
export type MediaCategory =
  | 'Living Room'
  | 'Kitchen'
  | 'Bathroom'
  | 'Bedroom'
  | 'Hallway'
  | 'Balcony/Terrace'
  | 'Windows & Doors'
  | 'Floors'
  | 'Walls & Ceiling'
  | 'Meters'
  | 'Keys'
  | 'Other'
  | 'Rental Contract'
  | 'Deposit Receipt'
  | 'Inventory List'
  | 'Correspondence'
  | 'Insurance';

export type MediaType = 'photo' | 'document';
export type AddressStatus = 'upcoming' | 'current' | 'past';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type OrderStatus = 'paid' | 'refunded' | 'failed';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  bio: string;
  photoUrl: string | null;
  profileUrl: string;
  isPublic: boolean;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  floorDoor: string;
  postcode: string;
  city: string;
  landlordName: string;
  landlordContact: string;
  moveInDate: string;
  moveOutDate: string | null;
  notes: string;
  status: AddressStatus;
}

export interface Inspection {
  id: string;
  type: InspectionType;
  addressId: string;
  date: string;
  status: InspectionStatus;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  category: MediaCategory;
  addressId: string;
  inspectionId: string;
  name: string;
  dataUrl: string;
  size: number;
  caption: string;
  favourite: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: string;
  price: number;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string;
  endDate: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  vat: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  items: { name: string; price: number }[];
  billing: { name: string; email: string; address: string; city: string; postcode: string };
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  topic: string;
}

export interface BlockedMember {
  id: string;
  name: string;
  avatar: string | null;
  blockedDate: string;
}

export interface Settings {
  privacy: 'private' | 'public';
  notificationsEnabled: boolean;
  lastSyncedAt: string | null;
  wixLinked: boolean;
}

export interface MockDB {
  user: User | null;
  addresses: Address[];
  inspections: Inspection[];
  media: MediaItem[];
  subscriptions: Subscription[];
  orders: Order[];
  notifications: AppNotification[];
  blockedMembers: BlockedMember[];
  settings: Settings;
  isAuthenticated: boolean;
}
