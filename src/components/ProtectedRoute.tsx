import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-coral/30 border-t-coral rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}