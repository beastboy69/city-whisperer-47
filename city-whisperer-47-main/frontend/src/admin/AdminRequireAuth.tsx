import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api, { setAuthToken } from "@/lib/api";
import { getToken, getUser, logout } from "@/hooks/useAuth";

export default function AdminRequireAuth({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    if (!token) return setOk(false);
    setAuthToken(token);
    api
      .get("/admin/verify")
      .then(() => {
        const user = getUser();
        if (!user || user.role !== "admin") return setOk(false);
        setOk(true);
      })
      .catch(() => {
        logout();
        setOk(false);
      });
  }, [location.pathname]);

  if (ok === null) return null;
  if (!ok) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}



