import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Logged in → allow access
  return children;
};

export default ProtectedRoute;
