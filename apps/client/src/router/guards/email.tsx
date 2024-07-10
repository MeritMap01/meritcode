import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/client/services/user";

export const EmailVerifiedGuard = () => {
  const location = useLocation();
  const redirectTo = location.pathname + location.search;

  const { user, loading } = useUser();

  if (loading) return null;

  if (user && user.emailVerified) {
    return <Outlet/>
  }

  return <Navigate to={`/dashboard/settings`} replace />;
};
