import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const { user, loading } = useAuth();
  // while loading
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center ibop-surface-dark text-white">Loading...</div>;
  }
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
      <div className="flex min-h-screen items-center justify-center ibop-surface-dark text-white">
        Access Denied
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;