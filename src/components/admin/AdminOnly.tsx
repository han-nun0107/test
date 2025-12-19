import { useSupabaseSession } from "@/provider/supabaseProvider";
import { isAdmin } from "@/utils/isAdmin";
import { useEditModeStore } from "@/stores/editModeStore";

export const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSupabaseSession();
  const userId = session?.user.id;
  const { isEditMode } = useEditModeStore();

  return isAdmin(userId) && isEditMode ? <>{children}</> : null;
};
