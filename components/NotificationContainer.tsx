
import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import type { Notification } from '../types';
import { NotificationType } from '../types';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast: React.FC<{ notification: Notification; onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);
  
  const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 500);
  };

  const icons = {
    [NotificationType.Success]: <CheckCircle className="h-6 w-6 text-green-400" />,
    [NotificationType.Error]: <AlertTriangle className="h-6 w-6 text-red-400" />,
    [NotificationType.Info]: <Info className="h-6 w-6 text-blue-400" />,
  };
  
  const colors = {
      [NotificationType.Success]: 'border-green-500/50',
      [NotificationType.Error]: 'border-red-500/50',
      [NotificationType.Info]: 'border-blue-500/50',
  }

  return (
    <div
      className={`w-full max-w-sm bg-gray-800/80 backdrop-blur-md border ${colors[notification.type]} shadow-lg rounded-lg p-4 flex items-start gap-4 transition-all duration-500 ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div className="flex-shrink-0">{icons[notification.type]}</div>
      <div className="flex-grow">
        <h4 className="font-semibold text-white">{notification.title}</h4>
        <p className="text-sm text-gray-300">{notification.message}</p>
      </div>
      <button onClick={handleDismiss} className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-gray-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};


export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-0 right-0 p-4 md:p-6 space-y-4 z-[100]">
      {notifications.map(notification => (
        <Toast key={notification.id} notification={notification} onDismiss={removeNotification} />
      ))}
    </div>
  );
};
