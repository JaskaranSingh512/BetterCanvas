import { Minus, Send, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ChatWindowData } from './chatTypes';

type ChatWindowProps = {
  chat: ChatWindowData;
  active: boolean;
  onFocus: (chatId: string) => void;
  onMinimize: (chatId: string) => void;
  onClose: (chatId: string) => void;
  onDraftChange: (chatId: string, draft: string) => void;
  onSend: (chatId: string) => void;
};

export function ChatWindow({
  chat,
  active,
  onFocus,
  onMinimize,
  onClose,
  onDraftChange,
  onSend,
}: ChatWindowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
    }
  }, [active]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chat.messages]);

  return (
    <article
      className="w-80 rounded-t-lg shadow-xl border flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--dashboard-card-bg)',
        borderColor: active ? 'var(--dashboard-info)' : 'var(--dashboard-border)',
      }}
      aria-label={`Chat with ${chat.title}`}
      onMouseDown={() => onFocus(chat.id)}
    >
      <header
        className="h-11 px-3 flex items-center justify-between cursor-pointer"
        style={{ backgroundColor: active ? 'var(--dashboard-info)' : 'var(--dashboard-hover)' }}
        onClick={() => onFocus(chat.id)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ backgroundColor: chat.accentColor || 'var(--dashboard-info)' }}
            aria-hidden
          >
            {chat.avatarLabel || chat.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#ffffff' }}>
              {chat.title}
            </p>
            {chat.subtitle && (
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {chat.subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ color: '#ffffff' }}
            onClick={(event) => {
              event.stopPropagation();
              onMinimize(chat.id);
            }}
            aria-label={`Minimize ${chat.title} chat`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ color: '#ffffff' }}
            onClick={(event) => {
              event.stopPropagation();
              onClose(chat.id);
            }}
            aria-label={`Close ${chat.title} chat`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div ref={messagesRef} className="h-72 overflow-y-auto p-3 space-y-2">
        {!chat.messages.length ? (
          <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
            Start the conversation with {chat.title}.
          </p>
        ) : (
          chat.messages.map((message) => (
            <div
              key={message.id}
              className="max-w-[85%] px-3 py-2 rounded-lg"
              style={{
                marginLeft: message.direction === 'outgoing' ? 'auto' : 0,
                backgroundColor: message.direction === 'outgoing' ? 'var(--dashboard-info)' : 'var(--dashboard-hover)',
                color: message.direction === 'outgoing' ? '#ffffff' : 'var(--dashboard-text-primary)',
              }}
            >
              <p className="text-sm">{message.body}</p>
              <p
                className="text-[11px] mt-1"
                style={{ color: message.direction === 'outgoing' ? 'rgba(255,255,255,0.85)' : 'var(--dashboard-text-secondary)' }}
              >
                {message.author} · {message.timestamp}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        className="p-2 border-t flex items-center gap-2"
        style={{ borderColor: 'var(--dashboard-border)' }}
        onSubmit={(event) => {
          event.preventDefault();
          onSend(chat.id);
        }}
      >
        <input
          ref={inputRef}
          className="flex-1 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--dashboard-hover)',
            color: 'var(--dashboard-text-primary)',
          }}
          placeholder="Type a message..."
          value={chat.draft}
          onChange={(event) => onDraftChange(chat.id, event.target.value)}
          onFocus={() => onFocus(chat.id)}
          aria-label={`Message ${chat.title}`}
        />
        <button
          type="submit"
          className="w-9 h-9 rounded flex items-center justify-center"
          style={{ backgroundColor: 'var(--dashboard-info)', color: '#ffffff' }}
          aria-label={`Send message to ${chat.title}`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </article>
  );
}
