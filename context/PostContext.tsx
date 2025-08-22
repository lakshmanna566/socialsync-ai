
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Post } from '../types';
import { PostStatus } from '../types';
import { useNotifications } from './NotificationContext';
import { NotificationType } from '../types';

interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'status'>) => void;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
  getPost: (postId: string) => Post | undefined;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const safelyParseJSON = <T,>(json: string | null, fallback: T): T => {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json, (key, value) => {
      if (key === 'scheduledAt' || key === 'publishedAt') {
        return value ? new Date(value) : null;
      }
      return value;
    });
    return parsed as T;
  } catch (e) {
    return fallback;
  }
};

export const PostProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => safelyParseJSON<Post[]>(localStorage.getItem('posts'), []));
  const { addNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  // Listen for logout event to clear posts
  useEffect(() => {
    const handleLogout = () => {
      setPosts([]);
      localStorage.removeItem('posts');
    };
    window.addEventListener('user-logout', handleLogout);
    return () => window.removeEventListener('user-logout', handleLogout);
  }, []);

  const checkScheduledPosts = useCallback(() => {
    const now = new Date();
    posts.forEach(post => {
      if (post.status === PostStatus.Scheduled && post.scheduledAt && now >= post.scheduledAt) {
        updatePost({ ...post, status: PostStatus.Published, publishedAt: now });
        addNotification(NotificationType.Success, 'Post Published!', `Your post to ${post.platforms.join(', ')} has been published.`);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, addNotification]); 


  useEffect(() => {
    const interval = setInterval(checkScheduledPosts, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [checkScheduledPosts]);

  const addPost = (postData: Omit<Post, 'id' | 'status'>) => {
    const newPost: Post = {
      ...postData,
      id: crypto.randomUUID(),
      status: postData.scheduledAt ? PostStatus.Scheduled : PostStatus.Published,
      publishedAt: postData.scheduledAt ? undefined : new Date(),
    };
    if (newPost.status === PostStatus.Published) {
        addNotification(NotificationType.Success, 'Post Published!', `Your post has been successfully published.`);
    } else if (newPost.status === PostStatus.Scheduled) {
        addNotification(NotificationType.Info, 'Post Scheduled', `Your post is scheduled for ${newPost.scheduledAt?.toLocaleString()}.`);
    }
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };
  
  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    addNotification(NotificationType.Info, 'Post Deleted', 'The post has been removed.');
  };

  const getPost = (postId: string) => {
    return posts.find(p => p.id === postId);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, deletePost, getPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
