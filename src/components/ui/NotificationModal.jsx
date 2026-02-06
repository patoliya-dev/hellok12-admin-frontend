import Button from "./Button";

const NotificationModal = ({ notifications, handleNotificationClick }) => {
  return (
    <div className="absolute -right-12 sm:right-0 top-full mt-2 w-60 sm:w-80 bg-popover border border-border rounded-lg shadow-elevation-3 animate-slide-down">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            className={`p-4 border-b border-border cursor-pointer hover:bg-muted transition-smooth ${
              notification.unread ? "bg-accent/5" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm">
                  {notification.title}
                </h4>
                <p className="text-muted-foreground text-xs mt-1">
                  {notification.message}
                </p>
                <span className="text-muted-foreground text-xs mt-2 block">
                  {notification.time}
                </span>
              </div>
              {notification.unread && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full">
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationModal;
