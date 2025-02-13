import { Navigate } from "react-router";
import { ReactElement } from "react";

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const authToken = localStorage.getItem("authToken");

  return authToken ? element : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
