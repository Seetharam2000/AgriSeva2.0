import { Navigate } from "react-router-dom";

export default function AuthRedirect() {
  const token = localStorage.getItem("agriseva_token");
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
}
