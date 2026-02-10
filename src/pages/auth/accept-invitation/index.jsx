import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Loader from "../../../components/ui/Loader";
import Icon from "../../../components/AppIcon";
import { errorToast, successToast } from "../../../utils/utils";

import {
  validateInvitation,
  acceptInvitation,
} from "../../../reducers/invitations/invitationsThunks";
import {
  selectInvite,
  selectInvitationReq,
} from "../../../reducers/invitations/invitationsSlice";
import { setAuthFromExternal } from "../../../reducers/auth/authSlice";

const AcceptInvitationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const inviteId = sp.get("inviteId");
  const ticket = sp.get("ticket");

  const authUser = useSelector((s) => s.auth?.user);
  const invite = useSelector(selectInvite);

  const validateReq = useSelector(selectInvitationReq("validateInvitation"));
  const acceptReq = useSelector(selectInvitationReq("acceptInvitation"));

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const missingParams = useMemo(() => !inviteId || !ticket, [inviteId, ticket]);

  useEffect(() => {
    if (missingParams) return;
    dispatch(validateInvitation({ inviteId, ticket }));
  }, [dispatch, inviteId, ticket, missingParams]);

  const canDirectAccept =
    !!authUser?.email && !!invite?.recipientEmail
      ? authUser.email.toLowerCase() === invite.recipientEmail.toLowerCase()
      : false;

  const handleAccept = async () => {
    try {
      const res = await dispatch(
        acceptInvitation({
          inviteId,
          ticket,
          // only needed when user is not logged in or backend requires it
          fullName: canDirectAccept ? undefined : fullName,
          password: password,
        }),
      ).unwrap();

      // backend recommended response:
      // { user, accessToken, redirectTo } OR { success: true }
      if (res?.accessToken && res?.user) {
        dispatch(
          setAuthFromExternal({ accessToken: res.accessToken, user: res.user }),
        );
      }

      successToast("Invitation accepted successfully!");
      navigate(res?.redirectTo || "/");
    } catch (e) {
      errorToast(e?.message || e?.error || "Failed to accept invitation");
    }
  };

  if (missingParams) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-card border border-border rounded-lg p-6">
            <h1 className="text-xl font-semibold text-card-foreground">
              Invalid invitation link
            </h1>
            <p className="text-muted-foreground mt-2">
              Missing required parameters. Please open the invitation link
              again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const validating = validateReq.status === "loading";
  const accepting = acceptReq.status === "loading";

  return (
    <div className="min-h-screen bg-background">
      {/* optional header (keep simple) */}
      <RoleBasedHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-card border border-border rounded-lg p-6">
          {validateReq.status !== "failed" && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="UserPlus" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-card-foreground">
                  Accept Invitation
                </h1>
                <p className="text-sm text-muted-foreground">
                  Validate and accept your HelloK12 invitation
                </p>
              </div>
            </div>
          )}

          {validating ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : validateReq.status === "failed" ? (
            <div className="mt-6">
              <p className="text-destructive text-center">
                {validateReq.error || "Invitation is invalid or expired."}
              </p>
              {/* <p className="text-muted-foreground mt-2">
                Please ask the school to resend the invitation.
              </p> */}
            </div>
          ) : (
            <>
              <div className="mt-6 bg-muted rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Invited Email
                    </p>
                    <p className="text-card-foreground font-medium">
                      {invite?.recipientEmail || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="text-card-foreground font-medium">
                      {invite?.recipientRole || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-card-foreground font-medium">
                      {invite?.status || "PENDING"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="text-card-foreground font-medium">
                      {invite?.expiresAt
                        ? new Date(invite.expiresAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {invite?.invitationMessage ? (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="text-card-foreground whitespace-pre-line mt-1">
                      {invite.invitationMessage}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 space-y-4">
                <>
                  {!canDirectAccept && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        If you don’t have an account, create one now to accept
                        the invitation. If you already have an account, log in
                        with the invited email and come back to this page.
                      </p>
                      <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </>
                  )}
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="New Password"
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      // error={errors.password}
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                </>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
                <Button
                  variant="default"
                  iconName="Check"
                  iconPosition="left"
                  loading={accepting}
                  disabled={
                    accepting ||
                    (canDirectAccept ? false : !fullName || !password)
                  }
                  onClick={handleAccept}
                >
                  {accepting ? "Accepting..." : "Accept Invitation"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcceptInvitationPage;
