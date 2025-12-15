import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/supabase/supabase";

type UserProfileStats = {
  user_id: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  favorite_count?: number;
  request_count?: number;
  last_requested_song?: string;
  [key: string]: unknown;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfileStats | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setUserProfile: (userProfile: UserProfileStats | null) => void;
  setLoading: (isLoading: boolean) => void;
  initializeAuth: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
  ensureUserProfileStats: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  userProfile: null,
  isLoading: true,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchUserProfile: async (userId: string) => {
    try {
      // 회원가입 시 user_profile_stats 초기 레코드 생성
      await get().ensureUserProfileStats(userId);

      const { data, error } = await supabase
        .from("user_profile_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        console.error("Error fetching user profile:", error);
        set({ userProfile: null });
        return;
      }

      // Supabase Auth에서 이메일과 가입일 정보 가져오기
      const currentUser = get().user;
      const userProfile: UserProfileStats = Object.assign(
        {},
        data as UserProfileStats,
        {
          email: currentUser?.email ?? undefined,
          created_at: currentUser?.created_at ?? undefined,
        },
      );

      set({ userProfile });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({ userProfile: null });
    }
  },

  ensureUserProfileStats: async (userId: string) => {
    const { data: profile } = await supabase
      .from("user_profile_stats")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile) {
      // 레코드가 없으면 초기 레코드 생성
      const { error } = await supabase
        .from("user_profile_stats")
        .insert([{ user_id: userId, favorites: [] }] as never);

      if (error) {
        console.error("user_profile_stats 초기 레코드 생성 실패:", error);
      }
    }
  },

  initializeAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      if (session?.user?.id) {
        await get().fetchUserProfile(session.user.id);
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });

        if (session?.user?.id) {
          await get().fetchUserProfile(session.user.id);
        } else {
          set({ userProfile: null });
        }
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({
        session: null,
        user: null,
        userProfile: null,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },
}));
