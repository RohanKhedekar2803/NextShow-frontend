import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // ✅ Toast will show only once
    toast.error("Please login before booking tickets", {
      id: "auth-required",
    });

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
