import { selectAuthUser } from "../reducers/auth/authSelectors";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { DEFAULT_ROUTES } from "../utils/constant";

const RootRedirect = () => {
  const currentUser = useSelector(selectAuthUser);

  if (currentUser) {
    // Add a fallback to a generic dashboard or home page
    const redirectPath = DEFAULT_ROUTES[currentUser.role] || '/dashboard';
    return <Navigate to={redirectPath} replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;
