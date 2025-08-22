
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Composer } from './components/Composer';
import { Dashboard } from './components/Dashboard';
import { PostProvider } from './context/PostContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationContainer } from './components/NotificationContainer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { SettingsModal } from './components/SettingsModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <PostProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <Header onOpenSettings={() => setSettingsOpen(true)} onLogout={logout} />
        <main className="container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4">
            <Composer />
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
            <Dashboard />
          </div>
        </main>
        <NotificationContainer />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </PostProvider>
  );
};


const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
          <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
