
import React from 'react';
import { X, Check, Link, Link2Off } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PLATFORMS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, connectedPlatforms, connectPlatform, disconnectPlatform } = useAuth();

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-md m-4 animate-slide-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">Account Settings</h3>
            <p className="text-sm text-gray-400">Manage your connected accounts</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
            <p className="text-sm font-medium text-gray-300">Logged in as:</p>
            <p className="font-semibold text-indigo-300">{user?.email}</p>
        </div>
        
        <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Connect Platforms</h4>
            {PLATFORMS.map(({ name, Icon, color }) => {
                const isConnected = connectedPlatforms.includes(name);
                return (
                    <div key={name} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${color}`}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium">{name}</span>
                        </div>
                        {isConnected ? (
                            <button
                                onClick={() => disconnectPlatform(name)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-red-600/20 text-red-300 hover:bg-red-600/40 transition-colors"
                            >
                                <Link2Off className="h-4 w-4" />
                                Disconnect
                            </button>
                        ) : (
                            <button
                                onClick={() => connectPlatform(name)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-green-600/20 text-green-300 hover:bg-green-600/40 transition-colors"
                            >
                                <Link className="h-4 w-4" />
                                Connect
                            </button>
                        )}
                    </div>
                )
            })}
        </div>

        <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors">
                Done
            </button>
        </div>
      </div>
    </div>
  );
};
