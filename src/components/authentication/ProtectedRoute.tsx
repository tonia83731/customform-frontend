import { Navigate } from "react-router";
import { ReactElement, useEffect, useState } from "react";
import { axiosFetch } from "../../api";

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const authToken = localStorage.getItem("authToken");
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authToken) {
      setIsAuth(false);
      return;
    }
    const fetchCheckedAuth = async () => {
      try {
        const res = await axiosFetch("GET", "/auth");

        if (res?.data.success) {
          const { is_auth } = res?.data.data || {};
          setIsAuth(is_auth);
          if (!is_auth) localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.log(error);
        setIsAuth(false);
      }
    };
    fetchCheckedAuth();
  }, [authToken]);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return isAuth ? element : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
