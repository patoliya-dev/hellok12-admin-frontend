import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../../../reducers/auth/authThunks";
import {
  selectVerifyEmailError,
  selectVerifyEmailStatus,
} from "../../../../reducers/auth/authSelectors";

export default function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // selectors
  const verifyEmailStatus = useSelector(selectVerifyEmailStatus);
  const verifyEmailError = useSelector(selectVerifyEmailError);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (verifyEmailStatus === "succeeded") {
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  }, [verifyEmailStatus, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {verifyEmailStatus === "loading" && <p>Verifying your email...</p>}
      {verifyEmailStatus === "succeeded" && (
        <p>Email verified ✅ Redirecting to login...</p>
      )}
      {verifyEmailError && (
        <p style={{ color: "red" }}>❌ {verifyEmailError}</p>
      )}
    </div>
  );
}
