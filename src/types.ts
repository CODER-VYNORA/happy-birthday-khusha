export interface MemoryPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  date?: string;
  rotation?: number;
  tag: string;
  sticker?: string;
  secretNote?: string;
}

export interface BirthdayConfig {
  friendName: string;
  nickname: string;
  senderName: string;
  birthdayAge?: string;
  letterTitle: string;
  letterBody: string[];
  letterClosing: string;
  photos: MemoryPhoto[];
  videoUrl: string;
  videoTitle: string;
  videoCaption: string;
  musicType: 'synth' | 'custom';
  customMusicUrl?: string;
}
