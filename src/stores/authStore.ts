import { create } from "zustand";
import { supabase } from "@/supabase/supabase";
import { getConsentInfo } from "@/utils";
import type { AuthState, UserProfileStats } from "@/types";

const getKoreaTimeISO = (): string => {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return koreaTime.toISOString();
};

const logError = (context: string, error: unknown) => {
  console.error(`[${context}]`, error);
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

  ensureUserProfileStats: async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("user_profile_stats")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile) return;

      const { error } = await supabase
        .from("user_profile_stats")
        .insert({ user_id: userId, favorites: [] } as never);

      if (error && error.code !== "23505") {
        logError("ensureUserProfileStats", error);
      }
    } catch (error) {
      logError("ensureUserProfileStats", error);
    }
  },

  fetchUserProfile: async (userId: string) => {
    try {
      if (get().userProfile?.user_id === userId) return;

      await get().ensureUserProfileStats(userId);

      const { data, error } = await supabase
        .from("user_profile_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        logError("fetchUserProfile", error);
        set({ userProfile: null });
        return;
      }

      if (!data) {
        set({ userProfile: null });
        return;
      }

      const currentUser = get().user;
      const profileData = data as UserProfileStats;
      const userProfile: UserProfileStats = {
        ...profileData,
        email: currentUser?.email,
        created_at: currentUser?.created_at,
      };

      set({ userProfile });
    } catch (error) {
      logError("fetchUserProfile", error);
      set({ userProfile: null });
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
        logError("checkUserExists", error);
        return false;
      }

      return !!data;
    } catch (error) {
      logError("checkUserExists", error);
      return false;
    }
  },

  createUserRecord: async (userId: string) => {
    try {
      const consentInfo = getConsentInfo();

      if (consentInfo) {
        const { error: updateError } = await supabase.from("users").upsert(
          {
            id: userId,
            consentgiven: true,
            consentat: getKoreaTimeISO(),
          } as never,
          { onConflict: "id" },
        );

        if (updateError) {
          logError("createUserRecord:upsert", updateError);
        }
      }

      await get().ensureUserProfileStats(userId);
    } catch (error) {
      logError("createUserRecord", error);
      try {
        await get().ensureUserProfileStats(userId);
      } catch (retryError) {
        logError("createUserRecord:retry", retryError);
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
        await get().createUserRecord(session.user.id);
        await get().fetchUserProfile(session.user.id);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });

        if (session?.user?.id) {
          if (event === "SIGNED_IN") {
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
      logError("initializeAuth", error);
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
      logError("signOut", error);
    }
  },

  deleteAccount: async (userId: string) => {
    try {
      const { error: profileError } = await supabase
        .from("user_profile_stats")
        .delete()
        .eq("user_id", userId);

      if (profileError) {
        logError("deleteAccount:profile", profileError);
        return { success: false, error: profileError.message };
      }

      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (userError) {
        logError("deleteAccount:user", userError);
      }

      const { error: authError } = await supabase.auth.signOut();

      if (authError) {
        logError("deleteAccount:auth", authError);
      }

      set({
        session: null,
        user: null,
        userProfile: null,
      });

      return { success: true };
    } catch (error) {
      logError("deleteAccount", error);
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
