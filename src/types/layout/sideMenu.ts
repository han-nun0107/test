import type { MenuItem } from "@/types";

export type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
};
