import type { AppNotification } from '@/types';

// Mock notification service — simulates Firebase Cloud Messaging (FCM).
// In production, replace these stubs with the FCM SDK:
// https://firebase.google.com/docs/cloud-messaging

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const notificationService = {
  // Subscribe the user to a broadcast topic.
  // Currently all users get the 'lejersnet-all' topic.
  // This can later be moved from the Firebase Console
  // to a programmatic server-side send using the FCM Admin SDK.
  async subscribeToTopic(_topic: string): Promise<{ success: boolean }> {
    await delay(500);
    return { success: true };
  },

  async requestPermission(): Promise<{ granted: boolean }> {
    await delay(500);
    // In production: Notification.requestPermission()
    return { granted: true };
  },

  // Simulates a broadcast notification sent from the Firebase Console.
  // In production, this would be triggered server-side via the FCM HTTP v1 API.
  async simulateBroadcast(title: string, body: string): Promise<AppNotification> {
    await delay(200);
    return {
      id: Math.random().toString(36).substring(2, 11),
      title,
      body,
      date: new Date().toISOString(),
      read: false,
      topic: 'lejersnet-all',
    };
  },
};
