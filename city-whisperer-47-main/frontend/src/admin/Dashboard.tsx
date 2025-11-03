import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout, getToken, getUser } from "@/hooks/useAuth";
import { setAuthToken } from "@/lib/api";
import { initSocket, getSocket } from "@/lib/socket";

export default function AdminDashboard() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) setAuthToken(token);
    const s = initSocket(token);
    s.emit("join-admin");
    return () => {
      getSocket()?.off("newIssue");
    };
  }, []);

  const onLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const user = getUser();

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className={`border-r ${open ? '' : 'hidden md:block'}`}>
        <div className="p-4 font-bold text-lg">SmartCityFix Admin</div>
        <nav className="flex flex-col p-2 gap-1">
          <NavItem to="." label="Dashboard" />
          <NavItem to="users" label="Users" />
          <NavItem to="issues" label="Issues" />
          <NavItem to="feedback" label="Feedback" />
          <NavItem to="analytics" label="Analytics" />
        </nav>
      </aside>
      <main className="p-4">
        <header className="flex items-center justify-between mb-4">
          <div className="md:hidden">
            <Button variant="outline" onClick={() => setOpen(!open)}>Menu</Button>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:inline">{user?.email}</span>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      end
      to={to}
      className={({ isActive }) => `px-3 py-2 rounded text-sm ${isActive ? 'bg-secondary' : 'hover:bg-muted'}`}
    >
      {label}
    </NavLink>
  );
}


