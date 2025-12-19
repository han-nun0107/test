import type { Session, User } from "@supabase/supabase-js";

// 사용자 프로필 통계 정보

export type UserProfileStats = {
  user_id: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  favorite_count?: number;
  request_count?: number;
  last_requested_song?: string;
  [key: string]: unknown;
};

// 인증 상태 관리 타입
export type AuthState = {
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
  deleteAccount: (userId: string) => Promise<DeleteAccountResult>;
};

// 로그인 방법 타입
export type LoginMethod = "email" | "google";

// 회원가입 방법 타입
export type SignUpMethod = "email" | "google";

// 계정 삭제 결과 타입
export type DeleteAccountResult = {
  success: boolean;
  error?: string;
};
