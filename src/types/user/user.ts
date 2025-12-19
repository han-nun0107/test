// 간단한 사용자 정보 타입 (UI 표시용)
export type SimpleUser = {
  avatar_url?: string;
  email?: string;
  created_at?: string;
};

// 상세 사용자 정보 타입 (데이터베이스)
export type IdentityData = {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  phone_verified: boolean;
  picture: string;
  provider_id: string;
  sub: string;
};

// 사용자 정보 타입
export type User = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
};
