import { useState, useMemo, useCallback } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useSearchStore } from "@/stores/searchStore";
import { useSearchSongs, useLayoutHandlers } from "@/hooks";
import { createMenuItems } from "@/constants/layout/menuItems";
import {
  createToggleButtons,
  type ToggleButton,
} from "@/constants/layout/toggleButtons";
import {
  SideMenu,
  SearchPanel,
  SortPanel,
  FilterPanel,
  ToggleButtonGroup,
} from "@/components";

type LayoutProps = {
  children: React.ReactNode;
  toggleButtons?: ToggleButton[];
};

export default function Layout({ children, toggleButtons = [] }: LayoutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isLeftMenuOpen,
    isSearchOpen,
    isSortOpen,
    isFilterOpen,
    toggleLeftMenu,
    toggleSearch,
    toggleSort,
    toggleFilter,
    closeLeftMenu,
    closeSearch,
    closeSort,
    closeFilter,
  } = useLayoutStore();
  const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();
  const { searchResults, isLoading: isSearchLoading } =
    useSearchSongs(searchQuery);
  const { handleMenuClick, handleSongClick } = useLayoutHandlers();

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const menuItems = useMemo(
    () => createMenuItems(handleMenuClick),
    [handleMenuClick],
  );

  const defaultToggleButtons = useMemo(
    () =>
      createToggleButtons(
        {
          onMenuClick: toggleLeftMenu,
          onSearchClick: toggleSearch,
          onSortClick: toggleSort,
          onFilterClick: toggleFilter,
        },
        handleCloseExpanded,
      ),
    [
      toggleLeftMenu,
      toggleSearch,
      toggleSort,
      toggleFilter,
      handleCloseExpanded,
    ],
  );

  const buttons = useMemo(
    () => (toggleButtons.length > 0 ? toggleButtons : defaultToggleButtons),
    [toggleButtons, defaultToggleButtons],
  );

  return (
    <div className="relative min-h-screen">
      {children}

      <SideMenu
        isOpen={isLeftMenuOpen}
        onClose={closeLeftMenu}
        menuItems={menuItems}
      />

      <SearchPanel
        isOpen={isSearchOpen}
        onClose={closeSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
        searchResults={searchResults}
        isLoading={isSearchLoading}
        onSongClick={handleSongClick}
      />

      <SortPanel isOpen={isSortOpen} onClose={closeSort} />

      <FilterPanel isOpen={isFilterOpen} onClose={closeFilter} />

      <ToggleButtonGroup
        buttons={buttons}
        isExpanded={isExpanded}
        onToggle={handleToggleExpanded}
      />
    </div>
  );
}
