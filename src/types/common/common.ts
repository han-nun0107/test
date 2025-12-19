import type { ReactNode } from "react";

// 메뉴 아이템 타입
export type MenuItem = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

// 토글 버튼 타입
export type ToggleButton = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  active?: boolean;
};
