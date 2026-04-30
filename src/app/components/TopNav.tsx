import { Plus, Calendar, Bell, MoreVertical, Moon, Sun } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../../lib/api';
import { useChatbar } from '../chat/ChatbarProvider';
import type { ChatPayload } from '../chat/chatTypes';

type NotificationItem = {
  id: string;
  category: 'message' | 'announcement';
  source: string;
  title: string;
  preview: string;
  timeAgo: string;
  avatarLabel: string;
  accentColor: string;
  chatPayload: ChatPayload;
};

export function TopNav({ onCreateEntry }: { onCreateEntry?: (date?: string) => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'message' | 'announcement'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { openOrFocusChat } = useChatbar();

  const notifications: NotificationItem[] = [
    {
      id: 'chat-prof-jane-doe',
      category: 'message',
      source: 'Prof. Jane Doe',
      title: 'Re: Office Hours Question',
      preview: 'Hi! I can meet tomorrow at 3pm to discuss your project proposal. Please bring your draft...',
      timeAgo: '2h ago',
      avatarLabel: 'JD',
      accentColor: 'var(--dashboard-info)',
      chatPayload: {
        id: 'chat-prof-jane-doe',
        kind: 'message',
        title: 'Prof. Jane Doe',
        subtitle: 'Office Hours',
        avatarLabel: 'JD',
        accentColor: 'var(--dashboard-info)',
        unreadCount: 1,
        messages: [
          { id: 'm-1', author: 'Prof. Jane Doe', body: 'Hi! I can meet tomorrow at 3pm to discuss your project proposal.', timestamp: '2:11 PM', direction: 'incoming' },
        ],
      },
    },
    {
      id: 'chat-modern-algebra',
      category: 'announcement',
      source: 'Modern Algebra',
      title: 'HW 04 Now Available',
      preview: 'The fourth homework assignment covering chapters 5-6 is now available. Due date is Feb 25...',
      timeAgo: '3h ago',
      avatarLabel: 'MA',
      accentColor: 'var(--dashboard-warning)',
      chatPayload: {
        id: 'chat-modern-algebra',
        kind: 'course',
        title: 'Modern Algebra',
        subtitle: 'Course announcements',
        avatarLabel: 'MA',
        accentColor: 'var(--dashboard-warning)',
        messages: [
          { id: 'a-1', author: 'Modern Algebra', body: 'The fourth homework assignment is now available.', timestamp: '1:34 PM', direction: 'incoming' },
        ],
      },
    },
    {
      id: 'chat-sarah-miller',
      category: 'message',
      source: 'Sarah Miller',
      title: 'Study group tonight?',
      preview: 'Hey! Are we still meeting at the library at 7pm? I have some questions about the last lecture...',
      timeAgo: '5h ago',
      avatarLabel: 'SM',
      accentColor: 'var(--dashboard-success)',
      chatPayload: {
        id: 'chat-sarah-miller',
        kind: 'message',
        title: 'Sarah Miller',
        subtitle: 'Study group',
        avatarLabel: 'SM',
        accentColor: 'var(--dashboard-success)',
        unreadCount: 1,
        messages: [
          { id: 'm-2', author: 'Sarah Miller', body: 'Are we still meeting at the library at 7pm?', timestamp: '11:40 AM', direction: 'incoming' },
        ],
      },
    },
    {
      id: 'chat-computer-science',
      category: 'announcement',
      source: 'Computer Science',
      title: 'Exam Schedule Posted',
      preview: 'The midterm exam will be held on March 1st in the main auditorium. Review sessions start next week...',
      timeAgo: '1d ago',
      avatarLabel: 'CS',
      accentColor: 'var(--dashboard-warning)',
      chatPayload: {
        id: 'chat-computer-science',
        kind: 'course',
        title: 'Computer Science',
        subtitle: 'Exam updates',
        avatarLabel: 'CS',
        accentColor: 'var(--dashboard-warning)',
        messages: [
          { id: 'a-2', author: 'Computer Science', body: 'The midterm exam schedule has been posted.', timestamp: 'Yesterday', direction: 'incoming' },
        ],
      },
    },
    {
      id: 'chat-data-structures',
      category: 'announcement',
      source: 'Data Structures',
      title: 'New Resources Available',
      preview: 'Practice problems for binary trees and sorting algorithms have been uploaded to the Files section...',
      timeAgo: '1d ago',
      avatarLabel: 'DS',
      accentColor: 'var(--dashboard-warning)',
      chatPayload: {
        id: 'chat-data-structures',
        kind: 'course',
        title: 'Data Structures',
        subtitle: 'Course resources',
        avatarLabel: 'DS',
        accentColor: 'var(--dashboard-warning)',
        messages: [
          { id: 'a-3', author: 'Data Structures', body: 'New practice problems are now available in files.', timestamp: 'Yesterday', direction: 'incoming' },
        ],
      },
    },
  ];

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((item) => item.category === activeFilter);
  const messageCount = notifications.filter((item) => item.category === 'message').length;
  const announcementCount = notifications.filter((item) => item.category === 'announcement').length;

  const openChatFromNotification = (item: NotificationItem) => {
    openOrFocusChat(item.chatPayload);
    setShowNotifications(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showNotifications]);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className="flex items-center justify-between px-6 py-3 transition-colors duration-200"
      style={{ 
        borderBottom: `1px solid var(--dashboard-border)`,
        backgroundColor: 'var(--dashboard-card-bg)'
      }}
    >
      <div className="flex items-center gap-3">
        <button 
          className="px-5 py-2 rounded-lg transition-all min-h-[44px] hover:opacity-80 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: 'var(--dashboard-info)',
            color: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          aria-label="View today's tasks"
        >
          Today
        </button>
        
        <button 
          onClick={() => onCreateEntry?.()}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: 'var(--dashboard-hover)',
            color: 'var(--dashboard-text-primary)'
          }}
          aria-label="Add new task"
        >
          <Plus className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => navigate('/calendar')}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: 'var(--dashboard-hover)',
            color: 'var(--dashboard-text-primary)'
          }}
          aria-label="Open calendar"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: 'var(--dashboard-hover)',
            color: 'var(--dashboard-text-primary)'
          }}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Interactive Notification/Messages Dropdown - Replaces Inbox */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 relative"
            style={{ 
              backgroundColor: showNotifications ? 'var(--dashboard-info)' : 'var(--dashboard-hover)',
              color: showNotifications ? '#ffffff' : 'var(--dashboard-text-primary)'
            }}
            aria-label="Notifications and messages"
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Bell className="w-5 h-5" />
            {/* Notification Badge */}
            <span 
              className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: 'var(--dashboard-accent-red)' }}
              aria-label={`${notifications.length} unread items`}
            ></span>
          </button>

          {/* Comprehensive Dropdown with Messages & Announcements */}
          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-96 rounded-lg shadow-xl overflow-hidden z-50"
              style={{ 
                backgroundColor: 'var(--dashboard-card-bg)',
                border: `1px solid var(--dashboard-border)`,
                maxHeight: '600px'
              }}
              role="menu"
              aria-label="Notifications and messages menu"
            >
              {/* Header */}
              <div 
                className="px-4 py-3 flex items-center justify-between"
                style={{ 
                  borderBottom: `1px solid var(--dashboard-border)`,
                  backgroundColor: 'var(--dashboard-hover)'
                }}
              >
                <h3 className="font-semibold text-base" style={{ color: 'var(--dashboard-text-primary)' }}>
                  Updates
                </h3>
                <span 
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: 'var(--dashboard-accent-red)',
                    color: '#ffffff'
                  }}
                >
                  {notifications.length} new
                </span>
              </div>
              
              {/* Tabs */}
              <div 
                className="flex"
                style={{ borderBottom: `1px solid var(--dashboard-border)` }}
              >
                <button
                  className="flex-1 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none"
                  style={{ 
                    color: activeFilter === 'all' ? 'var(--dashboard-info)' : 'var(--dashboard-text-secondary)',
                    borderBottom: activeFilter === 'all' ? `2px solid var(--dashboard-info)` : '2px solid transparent',
                    backgroundColor: activeFilter === 'all' ? 'var(--dashboard-hover)' : 'transparent'
                  }}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({notifications.length})
                </button>
                <button 
                  className="flex-1 px-4 py-3 text-sm transition-colors focus:outline-none"
                  style={{
                    color: activeFilter === 'message' ? 'var(--dashboard-info)' : 'var(--dashboard-text-secondary)',
                    borderBottom: activeFilter === 'message' ? `2px solid var(--dashboard-info)` : '2px solid transparent',
                    fontWeight: activeFilter === 'message' ? 600 : 500,
                  }}
                  onClick={() => setActiveFilter('message')}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Messages ({messageCount})
                </button>
                <button 
                  className="flex-1 px-4 py-3 text-sm transition-colors focus:outline-none"
                  style={{
                    color: activeFilter === 'announcement' ? 'var(--dashboard-info)' : 'var(--dashboard-text-secondary)',
                    borderBottom: activeFilter === 'announcement' ? `2px solid var(--dashboard-info)` : '2px solid transparent',
                    fontWeight: activeFilter === 'announcement' ? 600 : 500,
                  }}
                  onClick={() => setActiveFilter('announcement')}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Announcements ({announcementCount})
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.map((item, index) => (
                  <button
                    key={item.id}
                    className="w-full px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
                    style={{
                      borderBottom: index === filteredNotifications.length - 1 ? 'none' : `1px solid var(--dashboard-border)`,
                      backgroundColor: 'var(--dashboard-card-bg)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--dashboard-card-bg)')}
                    onClick={() => openChatFromNotification(item)}
                    role="menuitem"
                  >
                    <div className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-white"
                        style={{ backgroundColor: item.accentColor }}
                      >
                        {item.avatarLabel}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-medium" style={{ color: 'var(--dashboard-text-secondary)' }}>
                            {item.source}
                          </p>
                          <span className="text-xs shrink-0" style={{ color: 'var(--dashboard-text-secondary)' }}>
                            {item.timeAgo}
                          </span>
                        </div>
                        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                          {item.title}
                        </p>
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          {item.preview}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <button 
                className="w-full px-4 py-3 text-center font-semibold text-sm transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  color: 'var(--dashboard-info)',
                  borderTop: `1px solid var(--dashboard-border)`
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                View All Updates
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={onLogout}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: 'var(--dashboard-hover)',
            color: 'var(--dashboard-text-primary)'
          }}
          aria-label="Log out"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}