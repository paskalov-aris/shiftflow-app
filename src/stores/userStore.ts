import { create } from 'zustand';

export interface UserProfile {
  name: string;
  surname: string;
  role: 'manager' | 'team_lead' | 'worker';
  teamId: string | null;
  email: string;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>(set => ({
  profile: null,
  loading: false,
  setProfile: profile => set({ profile }),
  setLoading: loading => set({ loading }),
}));
