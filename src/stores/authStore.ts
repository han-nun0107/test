import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/supabase/supabase";
import { getConsentInfo, removeConsentInfo } from "@/utils/consentStorage";

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
  createUserRecord: (userId: string) => Promise<void>;
  checkUserExists: (userId: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  deleteAccount: (
    userId: string,
  ) => Promise<{ success: boolean; error?: string }>;
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
      const currentProfile = get().userProfile;
      if (currentProfile?.user_id === userId) {
        return;
      }

      await get().ensureUserProfileStats(userId);

      const { data, error } = await supabase
        .from("user_profile_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        set({ userProfile: null });
        return;
      }

      const currentUser = get().user;
      const userProfile: UserProfileStats = {
        ...(data as UserProfileStats),
        email: currentUser?.email,
        created_at: currentUser?.created_at,
      };

      set({ userProfile });
    } catch (error) {
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
      const { error } = await supabase
        .from("user_profile_stats")
        .insert([{ user_id: userId, favorites: [] }] as never);

      if (error) {
        if (error.code === "23505") {
          return;
        }
      }
    }
  },

  checkUserExists: async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("회원 확인 오류:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("회원 확인 오류:", error);
      return false;
    }
  },

  createUserRecord: async (userId: string) => {
    try {
      const consentInfo = getConsentInfo();

      if (!consentInfo) {
        await get().ensureUserProfileStats(userId);
        return;
      }

      const now = new Date();
      const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const koreaTimeISO = koreaTime.toISOString();

      const { error: updateError } = await supabase.from("users").upsert(
        [
          {
            id: userId,
            consentgiven: true,
            consentat: koreaTimeISO,
          },
        ] as never,
        { onConflict: "id" },
      );

      if (updateError) {
      }

      await get().ensureUserProfileStats(userId);
      removeConsentInfo();
    } catch (error) {
      await get()
        .ensureUserProfileStats(userId)
        .catch(() => {});
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
        const userExists = await get().checkUserExists(session.user.id);
        if (userExists) {
          await get().createUserRecord(session.user.id);
          await get().fetchUserProfile(session.user.id);
        }
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });

        if (session?.user?.id) {
          if (event === "SIGNED_IN") {
            const userExists = await get().checkUserExists(session.user.id);

            if (!userExists) {
              await supabase.auth.signOut();
              return;
            }

            await get().createUserRecord(session.user.id);
          }
          if (
            event !== "SIGNED_IN" &&
            get().userProfile?.user_id === session.user.id
          ) {
            return;
          }
          await get().fetchUserProfile(session.user.id);
        } else {
          set({ userProfile: null });
        }
      });
    } catch (error) {
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
    } catch (error) {}
  },

  deleteAccount: async (userId: string) => {
    try {
      const { error: profileError } = await supabase
        .from("user_profile_stats")
        .delete()
        .eq("user_id", userId);

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (userError) {
      }

      const { error: authError } = await supabase.auth.signOut();

      if (authError) {
        // Error handling
      }

      set({
        session: null,
        user: null,
        userProfile: null,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  },
}));
