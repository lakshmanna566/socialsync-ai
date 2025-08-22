
import React, { useState, useRef, useCallback } from 'react';
import { PlatformName } from '../types';
import type { Post } from '../types';
import { PLATFORMS } from '../constants';
import { generateCaptions } from '../services/geminiService';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Image as ImageIcon, Video, Calendar, Clock, X as XIcon, Paperclip, Send, AlertCircle } from 'lucide-react';
import { Scheduler } from './Scheduler';

export const Composer: React.FC = () => {
  const { addPost } = usePosts();
  const { connectedPlatforms } = useAuth();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformName[]>([]);
  const [media, setMedia] = useState<{ name: string; type: 'image' | 'video'; url: string } | null>(null);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlatformToggle = (platformName: PlatformName) => {
    if (!connectedPlatforms.includes(platformName)) return; // Prevent toggling unconnected platforms
    setSelectedPlatforms(prev =>
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const url = URL.createObjectURL(file);
      setMedia({ name: file.name, type, url });
    }
  };
  
  const handleGenerateCaptions = useCallback(async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setSuggestions([]);
    try {
        const generated = await generateCaptions(topic);
        setSuggestions(generated);
    } catch (error) {
        console.error(error);
        // Here you would add a user-facing error notification
    } finally {
        setIsGenerating(false);
    }
  }, [topic]);

  const handleSubmit = (isSchedule: boolean) => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      // Add user notification about required fields
      return;
    }
    const postData: Omit<Post, 'id' | 'status'> = {
      content,
      platforms: selectedPlatforms,
      media: media || undefined,
      scheduledAt: isSchedule ? scheduledAt : null,
    };
    addPost(postData);
    // Reset form
    setContent('');
    setSelectedPlatforms([]);
    setMedia(null);
    setScheduledAt(null);
    setSuggestions([]);
    setTopic('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const canPost = content.trim().length > 0 && selectedPlatforms.length > 0;

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 shadow-lg animate-slide-in-up">
      <h2 className="text-xl font-bold mb-4">Create a new post</h2>
      
      {connectedPlatforms.length === 0 && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
                <h3 className="font-semibold text-yellow-300">No accounts connected</h3>
                <p className="text-sm text-yellow-400/80">Please connect a social media account in Settings to start posting.</p>
            </div>
        </div>
      )}

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-400 mb-2 block">Select Platforms</label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {PLATFORMS.map(({ name, Icon, color }) => {
            const isConnected = connectedPlatforms.includes(name);
            const isSelected = selectedPlatforms.includes(name);

            return (
              <button
                key={name}
                onClick={() => handlePlatformToggle(name)}
                disabled={!isConnected}
                title={isConnected ? `Post to ${name}` : `Connect your ${name} account in settings`}
                className={`p-2 rounded-lg transition-all duration-200 flex justify-center items-center relative ${
                  isSelected ? `${color} text-white shadow-md scale-105` 
                  : isConnected ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed filter grayscale opacity-50'
                }`}
              >
                <Icon className="h-6 w-6" />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-indigo-500 rounded-full h-4 w-4 border-2 border-gray-800" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-32 bg-gray-900/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />

      {media && (
        <div className="mt-2 bg-gray-700 p-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
                {media.type === 'image' ? <ImageIcon className="h-5 w-5 text-gray-400 flex-shrink-0" /> : <Video className="h-5 w-5 text-gray-400 flex-shrink-0"/>}
                <span className="text-sm text-gray-300 truncate">{media.name}</span>
            </div>
            <button onClick={() => setMedia(null)} className="p-1 rounded-full hover:bg-gray-600">
                <XIcon className="h-4 w-4 text-gray-400"/>
            </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic for AI captions (e.g., sunset photo)"
                className="flex-grow bg-transparent text-sm focus:outline-none"
            />
            <button
                onClick={handleGenerateCaptions}
                disabled={isGenerating || !topic.trim()}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? 'Generating...' : 'Generate'}
            </button>
        </div>
        {suggestions.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-gray-700 pt-3">
                {suggestions.map((s, i) => (
                    <div key={i} onClick={() => setContent(s)} className="text-sm p-2 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer transition-colors">
                        {s}
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <Paperclip className="h-5 w-5" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            
            <button onClick={() => setShowScheduler(true)} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <Calendar className="h-5 w-5" />
            </button>
            
            {scheduledAt && (
                <div className="flex items-center gap-1 text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    <span>{scheduledAt.toLocaleDateString()} {scheduledAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <button onClick={() => setScheduledAt(null)} className="ml-1"><XIcon className="h-3 w-3"/></button>
                </div>
            )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
                onClick={() => handleSubmit(true)}
                disabled={!canPost || !scheduledAt}
                className="w-full flex-1 justify-center px-4 py-2 text-sm font-semibold rounded-md bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                Schedule
            </button>
            <button 
                onClick={() => handleSubmit(false)}
                disabled={!canPost}
                className="w-full flex-1 justify-center flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                <span>Post Now</span>
                <Send className="h-4 w-4" />
            </button>
        </div>
      </div>
      
      <Scheduler 
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        value={scheduledAt}
        onChange={setScheduledAt}
      />
    </div>
  );
};
