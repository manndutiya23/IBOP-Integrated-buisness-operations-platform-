import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const { user } = useAuth();

  // not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // role check
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Access Denied
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;