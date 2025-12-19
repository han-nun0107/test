import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { ProtectedRoute, Layout, LoadingIndicator } from "@/components";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
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
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <SignUp />
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
