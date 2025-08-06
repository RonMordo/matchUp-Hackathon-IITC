import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router";

export function ProtectRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
