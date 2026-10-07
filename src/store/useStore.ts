import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  MockDB,
  User,
  Address,
  Inspection,
  MediaItem,
  Subscription,
  Order,
  AppNotification,
  Settings,
} from '@/types';
import { seedData } from '@/data/seed';

interface AppStore extends MockDB {
  // Auth
  setAuthenticated: (v: boolean) => void;
  setUser: (u: User | null) => void;

  // Addresses
  addAddress: (a: Omit<Address, 'id' | 'status'>) => void;
  updateAddress: (id: string, a: Partial<Address>) => void;
  deleteAddress: (id: string) => void;

  // Inspections
  addInspection: (i: Omit<Inspection, 'id'>) => string;
  updateInspection: (id: string, i: Partial<Inspection>) => void;

  // Media
  addMedia: (m: Omit<MediaItem, 'id' | 'createdAt' | 'favourite'>) => void;
  updateMedia: (id: string, m: Partial<MediaItem>) => void;
  deleteMedia: (id: string) => void;
  toggleFavourite: (id: string) => void;

  // Subscriptions
  addSubscription: (s: Omit<Subscription, 'id'>) => void;
  cancelSubscription: (id: string) => void;

  // Orders
  addOrder: (o: Omit<Order, 'id'>) => void;

  // Notifications
  addNotification: (n: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Blocked members
  blockMember: (name: string) => void;
  unblockMember: (id: string) => void;

  // Settings
  updateSettings: (s: Partial<Settings>) => void;

  // Utility
  resetDB: () => void;
  getActiveSubscription: () => Subscription | null;
}

const uid = () => Math.random().toString(36).substring(2, 11);

const computeAddressStatus = (moveIn: string, moveOut: string | null): Address['status'] => {
  const today = new Date();
  const start = new Date(moveIn);
  if (start > today) return 'upcoming';
  if (moveOut && new Date(moveOut) < today) return 'past';
  return 'current';
};

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...seedData,

      setAuthenticated: (v) => set({ isAuthenticated: v }),
      setUser: (u) => set({ user: u }),

      addAddress: (a) =>
        set((s) => ({
          addresses: [
            ...s.addresses,
            { ...a, id: uid(), status: computeAddressStatus(a.moveInDate, a.moveOutDate) },
          ],
        })),
      updateAddress: (id, a) =>
        set((s) => ({
          addresses: s.addresses.map((addr) =>
            addr.id === id
              ? {
                  ...addr,
                  ...a,
                  status: computeAddressStatus(
                    a.moveInDate ?? addr.moveInDate,
                    a.moveOutDate ?? addr.moveOutDate,
                  ),
                }
              : addr,
          ),
        })),
      deleteAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.filter((a) => a.id !== id),
          media: s.media.filter((m) => m.addressId !== id),
          inspections: s.inspections.filter((i) => i.addressId !== id),
        })),

      addInspection: (i) => {
        const id = uid();
        set((s) => ({ inspections: [...s.inspections, { ...i, id }] }));
        return id;
      },
      updateInspection: (id, i) =>
        set((s) => ({
          inspections: s.inspections.map((ins) => (ins.id === id ? { ...ins, ...i } : ins)),
        })),

      addMedia: (m) =>
        set((s) => ({
          media: [
            ...s.media,
            { ...m, id: uid(), createdAt: new Date().toISOString(), favourite: false },
          ],
        })),
      updateMedia: (id, m) =>
        set((s) => ({
          media: s.media.map((med) => (med.id === id ? { ...med, ...m } : med)),
        })),
      deleteMedia: (id) => set((s) => ({ media: s.media.filter((m) => m.id !== id) })),
      toggleFavourite: (id) =>
        set((s) => ({
          media: s.media.map((m) => (m.id === id ? { ...m, favourite: !m.favourite } : m)),
        })),

      addSubscription: (sub) =>
        set((s) => ({ subscriptions: [{ ...sub, id: uid() }, ...s.subscriptions] })),
      cancelSubscription: (id) =>
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: 'cancelled', endDate: new Date().toISOString() } : sub,
          ),
        })),

      addOrder: (o) => set((s) => ({ orders: [{ ...o, id: uid() }, ...s.orders] })),

      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: uid(), date: new Date().toISOString(), read: false },
            ...s.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      blockMember: (name) =>
        set((s) => ({
          blockedMembers: [
            ...s.blockedMembers,
            { id: uid(), name, avatar: null, blockedDate: new Date().toISOString() },
          ],
        })),
      unblockMember: (id) =>
        set((s) => ({ blockedMembers: s.blockedMembers.filter((b) => b.id !== id) })),

      updateSettings: (st) => set((s) => ({ settings: { ...s.settings, ...st } })),

      resetDB: () => set({ ...seedData }),

      getActiveSubscription: () => {
        const subs = get().subscriptions;
        return subs.find((s) => s.status === 'active') ?? null;
      },
    }),
    {
      name: 'lejersnet-db',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
