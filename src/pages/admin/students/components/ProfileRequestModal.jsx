import { useState } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { successToast } from "../../../../utils/utils";

const ProfileRequestModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    onClose();
    successToast("Request sent successfully!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Send Request
              </h2>
              <p className="text-sm text-muted-foreground">
                Send a request to fill in the details
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg text-brand-gray-800 font-semibold">
                Request Message
              </h3>

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
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Send"
              iconPosition="left"
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
