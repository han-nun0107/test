import type { ReactNode } from "react";

export type ToggleButton = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  active?: boolean;
};

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

export const createToggleButtons = (
  handlers: {
    onMenuClick: () => void;
    onSearchClick: () => void;
    onSortClick: () => void;
    onFilterClick: () => void;
  },
  onCloseExpanded: () => void,
): ToggleButton[] => [
  {
    id: "toggle-1",
    label: "메뉴",
    icon: <MenuIcon />,
    onClick: () => {
      handlers.onMenuClick();
      onCloseExpanded();
    },
  },
  {
    id: "toggle-2",
    label: "검색",
    icon: <SearchIcon />,
    onClick: () => {
      handlers.onSearchClick();
      onCloseExpanded();
    },
  },
  {
    id: "toggle-3",
    label: "정렬",
    icon: <SortIcon />,
    onClick: () => {
      handlers.onSortClick();
      onCloseExpanded();
    },
  },
  {
    id: "toggle-4",
    label: "필터",
    icon: <FilterIcon />,
    onClick: () => {
      handlers.onFilterClick();
      onCloseExpanded();
    },
  },
];
