
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: SystemNotification[];
  unreadCount: number;
  addNotification: (title: string, message: string) => void;
  deleteNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Load notifications from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hadahana_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  // Save to local storage whenever notifications change
  useEffect(() => {
    localStorage.setItem('hadahana_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string) => {
    const newNote: SystemNotification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      deleteNotification, 
      markAsRead, 
      markAllAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
