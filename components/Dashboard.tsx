
import React, { useState, useMemo } from 'react';
import { usePosts } from '../context/PostContext';
import { PostStatus } from '../types';
import type { Post } from '../types';
import { PostCard } from './PostCard';
import { List, CheckCircle, Clock } from 'lucide-react';

type Tab = 'Scheduled' | 'Published';

export const Dashboard: React.FC = () => {
  const { posts } = usePosts();
  const [activeTab, setActiveTab] = useState<Tab>('Scheduled');

  const filteredPosts = useMemo(() => {
    const statusMap: Record<Tab, PostStatus[]> = {
      'Scheduled': [PostStatus.Scheduled],
      'Published': [PostStatus.Published, PostStatus.Error],
    };
    return posts
      .filter(post => statusMap[activeTab].includes(post.status))
      .sort((a, b) => {
        const dateA = a.scheduledAt || a.publishedAt || new Date(0);
        const dateB = b.scheduledAt || b.publishedAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  }, [posts, activeTab]);

  const TabButton: React.FC<{ tabName: Tab; icon: React.ReactNode }> = ({ tabName, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        activeTab === tabName ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      {tabName}
    </button>
  );

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg animate-slide-in-up" style={{ animationDelay: '100ms' }}>
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Posts</h2>
        <div className="flex items-center gap-2 bg-gray-900/70 p-1 rounded-lg">
          <TabButton tabName="Scheduled" icon={<Clock className="h-4 w-4" />} />
          <TabButton tabName="Published" icon={<CheckCircle className="h-4 w-4" />} />
        </div>
      </div>
      <div className="p-4 h-[calc(100vh-250px)] min-h-[400px] overflow-y-auto">
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <List className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No posts here</h3>
            <p className="text-sm">Create a new post to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
