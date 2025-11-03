import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "@/hooks/useAuth";

export default function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}


