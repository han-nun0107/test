import {
  LogIn,
  LogOut,
  MessageSquare,
  Pencil,
  User,
  UserPlus,
} from "lucide-react";
import type { ReactNode } from "react";

export type MenuItem = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

export const createMenuItems = (
  onMenuClick: (action: string) => void,
  isEditMode: boolean = false,
  isAdmin: boolean = false,
  isLoggedIn: boolean = false,
): MenuItem[] => {
  const menuItems: MenuItem[] = [];

  if (isAdmin) {
    menuItems.push({
      icon: <Pencil size={20} />,
      label: isEditMode ? "Edit 모드 끄기" : "Edit 모드",
      onClick: () => onMenuClick("edit"),
    });
  }

  if (isLoggedIn) {
    menuItems.push(
      {
        icon: <LogOut size={20} />,
        label: "로그아웃",
        onClick: () => onMenuClick("logout"),
      },
      {
        icon: <User size={20} />,
        label: "회원정보",
        onClick: () => onMenuClick("profile"),
      },
    );
  } else {
    menuItems.push(
      {
        icon: <LogIn size={20} />,
        label: "로그인",
        onClick: () => onMenuClick("login"),
      },
      {
        icon: <UserPlus size={20} />,
        label: "회원가입",
        onClick: () => onMenuClick("signup"),
      },
    );
  }

  menuItems.push({
    icon: <MessageSquare size={20} />,
    label: "건의사항",
    onClick: () => onMenuClick("contact"),
  });

  return menuItems;
};
