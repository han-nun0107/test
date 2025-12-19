import { useEffect } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { router } from "@/pages/routes";
import { useAuthStore } from "@/stores/authStore";
import { ToastContainer } from "react-toastify";
import { SupabaseProvider } from "@/provider/supabaseProvider";

// QueryClient를 컴포넌트 외부로 이동하여 재생성 방지
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 10,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
    import("react-toastify/dist/ReactToastify.css");
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          limit={5}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
        />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}

export default App;
