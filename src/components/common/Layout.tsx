import { useMemo } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useSearchStore } from "@/stores/searchStore";
import { useEditModeStore } from "@/stores/editModeStore";
import { useSupabaseSession } from "@/provider/supabaseProvider";
import { isAdmin } from "@/utils/isAdmin";
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
  Modal,
  ContactForm,
} from "@/components";

type LayoutProps = {
  children: React.ReactNode;
  toggleButtons?: ToggleButton[];
};

export default function Layout({ children, toggleButtons = [] }: LayoutProps) {
  const {
    isLeftMenuOpen,
    isSearchOpen,
    isSortOpen,
    isFilterOpen,
    isContactOpen,
    toggleLeftMenu,
    toggleSort,
    toggleFilter,
    closeLeftMenu,
    closeSearch,
    closeSort,
    closeFilter,
    closeContact,
  } = useLayoutStore();
  const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();
  const { isEditMode } = useEditModeStore();
  const { session } = useSupabaseSession();
  const userId = session?.user.id;
  const isUserAdmin = isAdmin(userId);
  const { searchResults, isLoading: isSearchLoading } =
    useSearchSongs(searchQuery);
  const { handleMenuClick, handleSongClick } = useLayoutHandlers();

  const menuItems = useMemo(
    () => createMenuItems(handleMenuClick, isEditMode, isUserAdmin),
    [handleMenuClick, isEditMode, isUserAdmin],
  );

  const defaultToggleButtons = useMemo(
    () =>
      createToggleButtons(
        {
          onMenuClick: toggleLeftMenu,
          onSortClick: toggleSort,
          onFilterClick: toggleFilter,
        },
        () => {},
      ),
    [toggleLeftMenu, toggleSort, toggleFilter],
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

      <Modal isOpen={isContactOpen} onClose={closeContact} title="건의사항">
        <div className="mt-6 w-full max-w-md">
          <ContactForm />
        </div>
      </Modal>

      <ToggleButtonGroup buttons={buttons} />
    </div>
  );
}
