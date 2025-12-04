import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role: "team" | "admin";
}) => {
  const { isTeamLoggedIn, isAdminLoggedIn } = useAuth();

  if (role === "team" && !isTeamLoggedIn) return <Navigate to="/login" replace />;
  if (role === "admin" && !isAdminLoggedIn) return <Navigate to="/admin-login" replace />;

  return children;
};

export default ProtectedRoute;
