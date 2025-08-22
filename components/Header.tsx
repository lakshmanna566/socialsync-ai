
import React from 'react';
import { Send, Sparkles, User, LogOut } from 'lucide-react';

interface HeaderProps {
    onOpenSettings: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onLogout }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Send className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Social Poster <span className="text-indigo-400">Magic</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={onOpenSettings}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Open Settings"
            >
                <User className="h-5 w-5" />
            </button>
            <button 
                onClick={onLogout}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Logout"
            >
                <LogOut className="h-5 w-5" />
            </button>
        </div>
      </div>
    </header>
  );
};
