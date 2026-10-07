import type { User } from '@/types';

// Mock Wix service — simulates Wix.com Members API for profile sync.
// In production, replace with Wix Backend Members API:
// https://dev.wix.com/docs/sdk/backend-modules/members

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const wixService = {
  async getMemberProfile(): Promise<Partial<User>> {
    await delay(1500);
    return {
      fullName: 'Sofie Hansen',
      email: 'sofie.hansen@email.com',
      phone: '+45 20 12 34 56',
      dateOfBirth: '1992-03-15',
      location: 'Copenhagen, Denmark',
      bio: 'Tenant at Nørrebro. Love my plants and cozy evenings.',
      photoUrl: null,
      profileUrl: 'lejersnet.com/member/sofie-hansen',
      isPublic: false,
    };
  },

  async getSubscriptionStatus(): Promise<{ active: boolean; renewalDate?: string }> {
    await delay(500);
    return { active: true, renewalDate: new Date(Date.now() + 86400000).toISOString() };
  },

  async updateProfile(_updates: Partial<User>): Promise<{ success: boolean }> {
    await delay(800);
    return { success: true };
  },
};
