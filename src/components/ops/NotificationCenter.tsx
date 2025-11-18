
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { useSystemNotifications } from "@/hooks/useSystemNotifications";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface NotificationCenterProps {
  moduleTarget: string;
}

export const NotificationCenter = ({ moduleTarget }: NotificationCenterProps) => {
  const { data: notifications = [], markAsRead, deleteNotification } = useSystemNotifications(moduleTarget);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-200';
      case 'high':
        return 'bg-orange-100 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification.mutate(notificationId);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifiche</span>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} non lette</Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Nessuna notifica
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-b-0 ${
                  !notification.is_read ? 'bg-blue-50' : ''
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start gap-2">
                  {getNotificationIcon(notification.notification_type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium truncate ${
                        !notification.is_read ? 'font-semibold' : ''
                      }`}>
                        {notification.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 hover:bg-red-100"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {format(new Date(notification.created_at), 'dd/MM HH:mm', { locale: it })}
                      </span>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Segna come letto
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm">
              Visualizza tutte le notifiche
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
