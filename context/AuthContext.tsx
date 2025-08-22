
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, PlatformName } from '../types';
import { useNotifications } from './NotificationContext';
import { NotificationType } from '../types';

// This is a mock user database. In a real app, this would be a server-side database.
const MOCK_USER_DB_KEY = 'mockUserDB';
const getMockUserDB = () => {
    try {
        const db = localStorage.getItem(MOCK_USER_DB_KEY);
        return db ? JSON.parse(db) : {};
    } catch {
        return {};
    }
};
const saveMockUserDB = (db: any) => {
    localStorage.setItem(MOCK_USER_DB_KEY, JSON.stringify(db));
};


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  connectedPlatforms: PlatformName[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  signup: (email: string, pass: string) => boolean;
  connectPlatform: (platform: PlatformName) => void;
  disconnectPlatform: (platform: PlatformName) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safelyParseJSON = <T,>(json: string | null, fallback: T): T => {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return fallback;
  }
};


export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => safelyParseJSON<User | null>(localStorage.getItem('authUser'), null));
  const [connectedPlatforms, setConnectedPlatforms] = useState<PlatformName[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        const userConnections = safelyParseJSON<PlatformName[]>(localStorage.getItem(`connections_${user.id}`), []);
        setConnectedPlatforms(userConnections);
    } else {
        localStorage.removeItem('authUser');
        setConnectedPlatforms([]);
        // Dispatch a custom event to notify other contexts (like PostContext)
        window.dispatchEvent(new CustomEvent('user-logout'));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`connections_${user.id}`, JSON.stringify(connectedPlatforms));
    }
  }, [connectedPlatforms, user]);

  const login = (email: string, password: string): boolean => {
    const db = getMockUserDB();
    if (db[email] && db[email].password === password) {
        const loggedInUser: User = { id: db[email].id, email };
        setUser(loggedInUser);
        addNotification(NotificationType.Success, 'Login Successful', 'Welcome back!');
        return true;
    }
    addNotification(NotificationType.Error, 'Login Failed', 'Invalid email or password.');
    return false;
  };

  const signup = (email: string, password: string): boolean => {
    const db = getMockUserDB();
    if (db[email]) {
      addNotification(NotificationType.Error, 'Signup Failed', 'An account with this email already exists.');
      return false;
    }
    const id = crypto.randomUUID();
    db[email] = { id, password };
    saveMockUserDB(db);
    const newUser: User = { id, email };
    setUser(newUser);
    addNotification(NotificationType.Success, 'Account Created', 'Welcome to Social Poster Magic!');
    return true;
  };

  const logout = () => {
    setUser(null);
    addNotification(NotificationType.Info, 'Logged Out', 'You have been successfully logged out.');
  };

  const connectPlatform = (platform: PlatformName) => {
    setConnectedPlatforms(prev => [...new Set([...prev, platform])]);
    addNotification(NotificationType.Success, `${platform} Connected`, `Your ${platform} account has been linked.`);
  };

  const disconnectPlatform = (platform: PlatformName) => {
    setConnectedPlatforms(prev => prev.filter(p => p !== platform));
    addNotification(NotificationType.Info, `${platform} Disconnected`, `Your ${platform} account has been unlinked.`);
  };

  return (
    <AuthContext.Provider value={{
        isAuthenticated: !!user,
        user,
        connectedPlatforms,
        login,
        logout,
        signup,
        connectPlatform,
        disconnectPlatform
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
