import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { can, pagePermission } from "../../lib/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, accessReady, refreshAccess, logout } =
    useAuthStore();
  const location = useLocation();
  const session = useQuery({
    queryKey: ["access-session", user?.id],
    queryFn: async () => {
      await refreshAccess();
      return true;
    },
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (session.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="space-y-4 text-center">
          <p className="text-slate-700">
            Unable to verify your access. Please try again.
          </p>
          <button
            onClick={() => session.refetch()}
            className="rounded-xl bg-green-800 px-4 py-2 text-white"
          >
            Retry
          </button>
          <button onClick={logout} className="ml-3 text-sm text-slate-600">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (!accessReady) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-sm text-slate-500">
        <Loader2 className="animate-spin" size={22} /> Checking access...
      </div>
    );
  }

  if (location.pathname.startsWith("/admin") && user?.role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  const permission = pagePermission(location.pathname);
  if (permission && !can(user, permission)) {
    const home = [
      "/dashboard",
      "/inbox",
      "/contacts",
      "/email-campaigns",
      "/templates",
      "/scraper",
      "/automation",
      "/settings/users",
    ].find((path) => can(user, pagePermission(path)!));
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <ShieldAlert className="mx-auto text-amber-600" size={32} />
          <h1 className="text-xl font-bold text-slate-900">
            Access restricted
          </h1>
          <p className="text-sm text-slate-500">
            Your role does not have access to this page. Contact your workspace
            administrator to update your permissions.
          </p>
          {home && (
            <Link
              to={home}
              className="inline-block rounded-xl bg-green-800 px-4 py-2 text-sm font-semibold text-white"
            >
              Return to workspace
            </Link>
          )}
          <button onClick={logout} className="ml-3 text-sm text-slate-600">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Handle onboarding redirect
  if (user && user.onboardingStep < 4 && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
