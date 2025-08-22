
import type { LucideProps } from 'lucide-react';
import type React from 'react';

export enum PlatformName {
  Facebook = 'Facebook',
  X = 'X',
  Instagram = 'Instagram',
  Youtube = 'Youtube',
  LinkedIn = 'LinkedIn',
  Pinterest = 'Pinterest',
  TikTok = 'TikTok',
}

export enum PostStatus {
  Draft = 'Draft',
  Scheduled = 'Scheduled',
  Published = 'Published',
  Error = 'Error',
}

export interface Platform {
  name: PlatformName;
  Icon: React.FC<LucideProps>;
  color: string;
}

export interface Post {
  id: string;
  platforms: PlatformName[];
  content: string;
  media?: {
    name: string;
    type: 'image' | 'video';
    url: string; // Using data URL for local preview
  };
  status: PostStatus;
  scheduledAt: Date | null;
  publishedAt?: Date;
  error?: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export enum NotificationType {
  Success = 'Success',
  Error = 'Error',
  Info = 'Info',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

export interface User {
  id: string;
  email: string;
}
