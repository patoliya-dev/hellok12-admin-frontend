import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../reducers/auth/authSelectors";
import { getDefaultRedirectForUser } from "../utils/roleRedirect";

const ProtectedRoute = ({
  allowedRoles, // string[]
  allow, // (user) => boolean
  deny, // (user) => boolean
  redirectTo, // string
}) => {
  const user = useSelector(selectAuthUser);
  const location = useLocation();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const fallback = redirectTo || getDefaultRedirectForUser(user);

  // Role gate
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={fallback} replace />;
    }
  }

  // Deny gate (takes precedence; explicit "block these users")
  if (typeof deny === "function" && deny(user)) {
    return <Navigate to={fallback} replace state={{ from: location }} />;
  }

  // Allow gate (explicit "only if allowed")
  if (typeof allow === "function" && !allow(user)) {
    return <Navigate to={fallback} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
