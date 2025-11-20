import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Layout from "@/components/common/Layout";
import LoadingIndicator from "@/components/common/LoadingIndicator";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Login = lazy(() => import("@/pages/Login"));
const MyPage = lazy(() => import("@/pages/MyPage"));
const Privacy = lazy(() => import("@/pages/Privacy"));

export const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/my-page",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingIndicator />}>
              <MyPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/privacy",
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <Privacy />
          </Suspense>
        ),
      },
    ],
  },
]);
