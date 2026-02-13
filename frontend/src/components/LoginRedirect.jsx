import { Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";

export default function LoginRedirect() {
  const token = localStorage.getItem("agriseva_token");
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Login />;
}
