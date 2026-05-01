import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ChatPayload, ChatWindowData } from './chatTypes';

type ChatbarState = {
  chats: ChatWindowData[];
  activeChatId: string | null;
};

type ChatbarContextValue = ChatbarState & {
  openOrFocusChat: (payload: ChatPayload) => void;
  minimizeChat: (chatId: string) => void;
  restoreChat: (chatId: string) => void;
  closeChat: (chatId: string) => void;
  updateDraft: (chatId: string, draft: string) => void;
  sendMessage: (chatId: string) => void;
};

type ChatbarAction =
  | { type: 'openOrFocus'; payload: ChatPayload }
  | { type: 'minimize'; chatId: string }
  | { type: 'restore'; chatId: string }
  | { type: 'close'; chatId: string }
  | { type: 'updateDraft'; chatId: string; draft: string }
  | { type: 'sendMessage'; chatId: string }
  | { type: 'closeActive' };

const ChatbarContext = createContext<ChatbarContextValue | null>(null);

const initialState: ChatbarState = {
  chats: [],
  activeChatId: null,
};

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function sortChats(chats: ChatWindowData[]) {
  return [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
}

function chatbarReducer(state: ChatbarState, action: ChatbarAction): ChatbarState {
  switch (action.type) {
    case 'openOrFocus': {
      const existing = state.chats.find((chat) => chat.id === action.payload.id);
      if (existing) {
        const chats = state.chats.map((chat) =>
          chat.id === action.payload.id
            ? { ...chat, minimized: false, unreadCount: 0, updatedAt: Date.now() }
            : chat
        );
        return {
          chats: sortChats(chats),
          activeChatId: action.payload.id,
        };
      }

      const nextChat: ChatWindowData = {
        id: action.payload.id,
        kind: action.payload.kind,
        title: action.payload.title,
        subtitle: action.payload.subtitle,
        accentColor: action.payload.accentColor,
        avatarLabel: action.payload.avatarLabel,
        unreadCount: action.payload.unreadCount ?? 0,
        minimized: false,
        messages: action.payload.messages ?? [],
        draft: '',
        updatedAt: Date.now(),
      };

      return {
        chats: sortChats([nextChat, ...state.chats]),
        activeChatId: nextChat.id,
      };
    }
    case 'minimize': {
      const chats = state.chats.map((chat) =>
        chat.id === action.chatId ? { ...chat, minimized: true } : chat
      );
      const nextActive =
        state.activeChatId === action.chatId
          ? chats.find((chat) => !chat.minimized)?.id ?? null
          : state.activeChatId;
      return { chats, activeChatId: nextActive };
    }
    case 'restore': {
      const chats = state.chats.map((chat) =>
        chat.id === action.chatId
          ? { ...chat, minimized: false, unreadCount: 0, updatedAt: Date.now() }
          : chat
      );
      return { chats: sortChats(chats), activeChatId: action.chatId };
    }
    case 'close': {
      const chats = state.chats.filter((chat) => chat.id !== action.chatId);
      const nextActive =
        state.activeChatId === action.chatId ? chats.find((chat) => !chat.minimized)?.id ?? null : state.activeChatId;
      return { chats, activeChatId: nextActive };
    }
    case 'updateDraft': {
      const chats = state.chats.map((chat) =>
        chat.id === action.chatId ? { ...chat, draft: action.draft } : chat
      );
      return { ...state, chats };
    }
    case 'sendMessage': {
      const chat = state.chats.find((item) => item.id === action.chatId);
      if (!chat || !chat.draft.trim()) return state;
      const outgoing = {
        id: `${chat.id}-outgoing-${Date.now()}`,
        author: 'You',
        body: chat.draft.trim(),
        timestamp: nowLabel(),
        direction: 'outgoing' as const,
      };
      const chats = state.chats.map((item) =>
        item.id === action.chatId
          ? {
              ...item,
              draft: '',
              minimized: false,
              updatedAt: Date.now(),
              messages: [...item.messages, outgoing],
            }
          : item
      );
      return { chats: sortChats(chats), activeChatId: action.chatId };
    }
    case 'closeActive': {
      if (!state.activeChatId) return state;
      const chats = state.chats.filter((chat) => chat.id !== state.activeChatId);
      return {
        chats,
        activeChatId: chats.find((chat) => !chat.minimized)?.id ?? null,
      };
    }
    default:
      return state;
  }
}

export function ChatbarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatbarReducer, initialState);

  const openOrFocusChat = useCallback((payload: ChatPayload) => {
    dispatch({ type: 'openOrFocus', payload });
  }, []);

  const minimizeChat = useCallback((chatId: string) => {
    dispatch({ type: 'minimize', chatId });
  }, []);

  const restoreChat = useCallback((chatId: string) => {
    dispatch({ type: 'restore', chatId });
  }, []);

  const closeChat = useCallback((chatId: string) => {
    dispatch({ type: 'close', chatId });
  }, []);

  const updateDraft = useCallback((chatId: string, draft: string) => {
    dispatch({ type: 'updateDraft', chatId, draft });
  }, []);

  const sendMessage = useCallback((chatId: string) => {
    dispatch({ type: 'sendMessage', chatId });
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch({ type: 'closeActive' });
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const value = useMemo<ChatbarContextValue>(
    () => ({
      chats: state.chats,
      activeChatId: state.activeChatId,
      openOrFocusChat,
      minimizeChat,
      restoreChat,
      closeChat,
      updateDraft,
      sendMessage,
    }),
    [state.chats, state.activeChatId, openOrFocusChat, minimizeChat, restoreChat, closeChat, updateDraft, sendMessage]
  );

  return <ChatbarContext.Provider value={value}>{children}</ChatbarContext.Provider>;
}

export function useChatbar() {
  const context = useContext(ChatbarContext);
  if (!context) {
    throw new Error('useChatbar must be used inside ChatbarProvider');
  }
  return context;
}
