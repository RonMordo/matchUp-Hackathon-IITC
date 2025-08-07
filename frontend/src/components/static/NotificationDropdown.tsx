import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { IoIosNotifications } from "react-icons/io";
import { useNotifications, usePatchNotification, useMarkAllNotificationsAsRead } from "@/hooks";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

export const NotificationDropdown = () => {
  const { user } = useAuth();
  const { data: notifications, isLoading } = useNotifications();
  const patchNotification = usePatchNotification();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const [isOpen, setIsOpen] = useState(false);

  // Filter notifications for current user
  const userNotifications = notifications?.filter(
    (notification) => notification.recipient === user?._id
  ) || [];

  const unreadCount = userNotifications.filter(
    (notification) => notification.status === "unread"
  ).length;

  const handleNotificationClick = async (notification: any) => {
    if (notification.status === "unread") {
      try {
        await patchNotification.mutateAsync({
          id: notification._id,
          data: { status: "read" },
        });
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?._id && unreadCount > 0) {
      try {
        await markAllAsRead.mutateAsync(user._id);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return "💬";
      case "request":
        return "📋";
      default:
        return "🔔";
    }
  };

  const getNotificationText = (notification: any) => {
    switch (notification.type) {
      case "message":
        return `New message: ${notification.content}`;
      case "request":
        return `New request: ${notification.content}`;
      default:
        return notification.content;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors">
          <IoIosNotifications size={28} color="#ff6900" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 mt-2 bg-white dark:bg-black border border-orange-300 rounded-md shadow-lg max-h-96 overflow-y-auto"
      >
        <div className="p-3 border-b border-orange-200 dark:border-orange-700">
          <h3 className="font-semibold text-orange-600 dark:text-orange-400">
            Notifications
          </h3>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : userNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {userNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  notification.status === "unread"
                    ? "bg-orange-50 dark:bg-orange-900/10"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        notification.status === "unread"
                          ? "font-semibold text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {getNotificationText(notification)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {notification.status === "unread" && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {userNotifications.length > 0 && unreadCount > 0 && (
          <div className="p-3 border-t border-orange-200 dark:border-orange-700">
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {markAllAsRead.isPending ? "Marking..." : "Mark all as read"}
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
