export type ChatKind = 'message' | 'course';

export type ChatMessage = {
  id: string;
  author: string;
  body: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
};

export type ChatWindowData = {
  id: string;
  kind: ChatKind;
  title: string;
  subtitle?: string;
  accentColor?: string;
  avatarLabel?: string;
  unreadCount: number;
  minimized: boolean;
  messages: ChatMessage[];
  draft: string;
  updatedAt: number;
};

export type ChatPayload = {
  id: string;
  kind: ChatKind;
  title: string;
  subtitle?: string;
  accentColor?: string;
  avatarLabel?: string;
  unreadCount?: number;
  messages?: ChatMessage[];
};
