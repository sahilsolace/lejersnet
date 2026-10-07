import type { User } from '@/types';

// Mock auth service — simulates Wix.com Members authentication.
// In production, replace wixLogin/wixSignup with Wix Members API or OAuth.
// Wix Members API reference: https://dev.wix.com/docs/sdk/backend-modules/auth

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const DEMO_EMAIL = 'sofie.hansen@email.com';
const DEMO_PASSWORD = 'demo1234';

export const authService = {
  async wixLogin(email: string, password: string): Promise<{ user: User; error?: string }> {
    await delay(800);
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const user: User = {
        id: 'u1',
        fullName: 'Sofie Hansen',
        email,
        phone: '+45 20 12 34 56',
        dateOfBirth: '1992-03-15',
        location: 'Copenhagen, Denmark',
        bio: 'Tenant at Nørrebro. Love my plants and cozy evenings.',
        photoUrl: null,
        profileUrl: 'lejersnet.com/member/sofie-hansen',
        isPublic: false,
      };
      return { user };
    }
    return { user: null as unknown as User, error: 'Invalid email or password.' };
  },

  async wixSignup(fullName: string, email: string, _password: string): Promise<{ user: User; error?: string }> {
    await delay(1000);
    if (email === DEMO_EMAIL) {
      return { user: null as unknown as User, error: 'An account with this email already exists.' };
    }
    const user: User = {
      id: 'u1',
      fullName,
      email,
      phone: '',
      dateOfBirth: '',
      location: '',
      bio: '',
      photoUrl: null,
      profileUrl: `lejersnet.com/member/${fullName.toLowerCase().replace(/\s+/g, '-')}`,
      isPublic: false,
    };
    return { user };
  },

  async sendPasswordReset(_email: string): Promise<{ success: boolean }> {
    await delay(800);
    return { success: true };
  },

  async resetPassword(_newPassword: string): Promise<{ success: boolean }> {
    await delay(800);
    return { success: true };
  },

  async socialLogin(_provider: 'google' | 'facebook'): Promise<{ user: User }> {
    await delay(800);
    const user: User = {
      id: 'u1',
      fullName: 'Sofie Hansen',
      email: 'sofie.hansen@email.com',
      phone: '+45 20 12 34 56',
      dateOfBirth: '1992-03-15',
      location: 'Copenhagen, Denmark',
      bio: '',
      photoUrl: null,
      profileUrl: 'lejersnet.com/member/sofie-hansen',
      isPublic: false,
    };
    return { user };
  },
};
