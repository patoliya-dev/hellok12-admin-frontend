import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { successToast, errorToast } from "../../../../utils/utils";

import { requestTeacherProfileCompletion } from "reducers/superAdmin/superAdminThunks";
import { selectReq } from "reducers/superAdmin/superAdminSlice";

const DEFAULT_MESSAGE = `Hi!\n\nPlease complete your teacher profile on HelloK12 to finish setup (about 2 minutes).\n\nThank you.`;

const ProfileRequestModal = ({
  isOpen,
  onClose,
  invitation = null,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const req = useSelector(selectReq("requestTeacherProfileCompletion"));
  const loading = req?.status === "loading";

  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    (() => {
      if (!isOpen) return;
      setMessage(DEFAULT_MESSAGE);
    })();
  }, [isOpen]);

  const submitError = useMemo(
    () => (req?.status === "failed" ? req?.error : null),
    [req],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!invitation?._id) return;

      try {
        await dispatch(
          requestTeacherProfileCompletion({
            invitationId: invitation._id,
            message,
          }),
        ).unwrap();

        successToast("Request sent successfully!");
        onClose?.();
        onSuccess?.();
      } catch (err) {
        errorToast(err?.message || err?.error || "Failed to send request");
      }
    },
    [dispatch, invitation, message, onClose, onSuccess],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Send" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Request Profile Completion
              </h2>
              <p className="text-sm text-muted-foreground">
                Send a reminder to complete the teacher profile
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={loading}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg text-brand-gray-800 font-semibold">
                Request Message
              </h3>
              <p className="text-sm text-muted-foreground">
                To:{" "}
                <span className="font-medium">{invitation?.email || "—"}</span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-brand-gray-800 mb-2 block">
                Custom Message
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-brand-gray-800"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a personalized message..."
              />
            </div>

            {submitError ? (
              <p className="text-sm text-destructive">{submitError}</p>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Send"
              iconPosition="left"
              loading={loading}
              disabled={loading}
            >
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileRequestModal;
