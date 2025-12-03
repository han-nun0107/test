import { create } from "zustand";

export type SortType =
  | "latest-asc"
  | "latest-desc"
  | "title-asc"
  | "title-desc"
  | "singer-asc"
  | "singer-desc"
  | "skill-asc"
  | "skill-desc";

export type FilterType = "completed" | "recommend" | "bomb" | "favorite" | null;

type SortFilterState = {
  sortType: SortType;
  filterType: FilterType;
  setSortType: (sortType: SortType) => void;
  setFilterType: (filterType: FilterType) => void;
  reset: () => void;
};

export const useSortFilterStore = create<SortFilterState>((set) => ({
  sortType: "latest-desc",
  filterType: null,
  setSortType: (sortType) => set({ sortType }),
  setFilterType: (filterType) => set({ filterType }),
  reset: () => set({ sortType: "latest-desc", filterType: null }),
}));
