import { Facebook, X, Instagram, Youtube, Linkedin, Pin, Film } from 'lucide-react';
import type { Platform } from './types';
import { PlatformName } from './types';

export const PLATFORMS: Platform[] = [
  { name: PlatformName.Facebook, Icon: Facebook, color: 'bg-brand-facebook' },
  { name: PlatformName.X, Icon: X, color: 'bg-brand-x' },
  { name: PlatformName.Instagram, Icon: Instagram, color: 'bg-brand-instagram' },
  { name: PlatformName.Youtube, Icon: Youtube, color: 'bg-brand-youtube' },
  { name: PlatformName.LinkedIn, Icon: Linkedin, color: 'bg-brand-linkedin' },
  { name: PlatformName.Pinterest, Icon: Pin, color: 'bg-brand-pinterest' },
  { name: PlatformName.TikTok, Icon: Film, color: 'bg-brand-tiktok' },
];
