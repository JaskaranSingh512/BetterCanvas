import { useMemo } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { useChatbar } from './ChatbarProvider';

function useMaxOpenWindows() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
  if (width < 900) return 1;
  if (width < 1280) return 2;
  return 3;
}

export function ChatbarDock() {
  const { chats, activeChatId, restoreChat, minimizeChat, closeChat, updateDraft, sendMessage, openOrFocusChat } = useChatbar();
  const maxOpen = useMaxOpenWindows();

  const { visibleOpenChats, minimizedChats } = useMemo(() => {
    const openChats = chats.filter((chat) => !chat.minimized);
    const explicitMinimized = chats.filter((chat) => chat.minimized);
    if (openChats.length <= maxOpen) {
      return { visibleOpenChats: openChats, minimizedChats: explicitMinimized };
    }

    const active = activeChatId ? openChats.find((chat) => chat.id === activeChatId) : null;
    const withoutActive = active ? openChats.filter((chat) => chat.id !== active.id) : openChats;
    const visible = active ? [active, ...withoutActive.slice(0, maxOpen - 1)] : openChats.slice(0, maxOpen);
    const overflow = openChats.filter((chat) => !visible.some((item) => item.id === chat.id));

    return {
      visibleOpenChats: visible,
      minimizedChats: [...explicitMinimized, ...overflow],
    };
  }, [chats, maxOpen, activeChatId]);

  if (!chats.length) return null;

  return (
    <div className="fixed bottom-0 right-4 z-50 flex items-end gap-2" aria-label="Bottom chatbar">
      {minimizedChats.length > 0 && (
        <div className="mb-2 flex items-center gap-2">
          {minimizedChats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className="h-10 px-3 rounded-full border shadow-sm flex items-center gap-2 max-w-44"
              style={{
                backgroundColor: 'var(--dashboard-card-bg)',
                borderColor: 'var(--dashboard-border)',
              }}
              onClick={() => restoreChat(chat.id)}
              aria-label={`Restore chat with ${chat.title}`}
            >
              <div
                className="w-6 h-6 rounded-full text-[10px] font-semibold text-white flex items-center justify-center shrink-0"
                style={{ backgroundColor: chat.accentColor || 'var(--dashboard-info)' }}
                aria-hidden
              >
                {chat.avatarLabel || chat.title.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm truncate" style={{ color: 'var(--dashboard-text-primary)' }}>
                {chat.title}
              </span>
              {chat.unreadCount > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: 'var(--dashboard-accent-red)', color: '#ffffff' }}
                >
                  {chat.unreadCount}
                </span>
              )}
              <X
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: 'var(--dashboard-text-secondary)' }}
                onClick={(event) => {
                  event.stopPropagation();
                  closeChat(chat.id);
                }}
              />
            </button>
          ))}
        </div>
      )}

      {visibleOpenChats.map((chat) => (
        <ChatWindow
          key={chat.id}
          chat={chat}
          active={activeChatId === chat.id}
          onFocus={(chatId) => openOrFocusChat({ ...chat, id: chatId })}
          onMinimize={minimizeChat}
          onClose={closeChat}
          onDraftChange={updateDraft}
          onSend={sendMessage}
        />
      ))}

      {!visibleOpenChats.length && minimizedChats.length > 0 && (
        <button
          type="button"
          className="mb-2 h-10 w-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--dashboard-info)', color: '#ffffff' }}
          onClick={() => restoreChat(minimizedChats[0].id)}
          aria-label="Open minimized chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
