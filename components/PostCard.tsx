
import React from 'react';
import type { Post } from '../types';
import { PostStatus } from '../types';
import { PLATFORMS } from '../constants';
import { Clock, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { usePosts } from '../context/PostContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { deletePost } = usePosts();

  const getStatusInfo = () => {
    switch (post.status) {
      case PostStatus.Scheduled:
        return {
          icon: <Clock className="h-4 w-4 text-yellow-400" />,
          text: `Scheduled for ${post.scheduledAt?.toLocaleString()}`,
          color: 'text-yellow-400',
        };
      case PostStatus.Published:
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-400" />,
          text: `Published on ${post.publishedAt?.toLocaleString()}`,
          color: 'text-green-400',
        };
      case PostStatus.Error:
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
          text: `Failed: ${post.error}`,
          color: 'text-red-400',
        };
      default:
        return { icon: null, text: '', color: '' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 animate-fade-in transition-transform hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className={`flex items-center gap-2 text-sm mb-2 ${statusInfo.color}`}>
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </div>
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
        </div>
        <button onClick={() => deletePost(post.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/20 rounded-full transition-colors">
            <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-2">
            {post.platforms.map(platformName => {
                const platform = PLATFORMS.find(p => p.name === platformName);
                if (!platform) return null;
                const { Icon } = platform;
                return <div key={platformName} className={`p-1.5 rounded-full ${platform.color}`}><Icon className="h-4 w-4 text-white"/></div>
            })}
        </div>
        
        {post.media && (
            <div className="w-24 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                {post.media.type === 'image' ? (
                    <img src={post.media.url} alt={post.media.name} className="w-full h-full object-cover" />
                ) : (
                    <video src={post.media.url} className="w-full h-full object-cover" />
                )}
            </div>
        )}
      </div>
    </div>
  );
};
