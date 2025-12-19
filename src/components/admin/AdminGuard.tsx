import { useSupabaseSession } from "@/provider/supabaseProvider";
import { isAdmin } from "@/utils";
import { useEditModeStore } from "@/stores/editModeStore";
import { Navigate } from "react-router";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSupabaseSession();
  const userId = session?.user.id;
  const { isEditMode } = useEditModeStore();

  return isAdmin(userId) && isEditMode ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};
