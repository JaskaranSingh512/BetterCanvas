import { Plus, Calendar, Bell, MoreVertical, Moon, Sun } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../../lib/api';

export function TopNav({ onCreateEntry }: { onCreateEntry?: (date?: string) => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
              aria-label="5 unread items"
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
                  5 new
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
                    color: 'var(--dashboard-info)',
                    borderBottom: `2px solid var(--dashboard-info)`,
                    backgroundColor: 'var(--dashboard-hover)'
                  }}
                >
                  All (5)
                </button>
                <button 
                  className="flex-1 px-4 py-3 text-sm font-medium transition-colors focus:outline-none"
                  style={{ color: 'var(--dashboard-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Messages (2)
                </button>
                <button 
                  className="flex-1 px-4 py-3 text-sm font-medium transition-colors focus:outline-none"
                  style={{ color: 'var(--dashboard-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Announcements (3)
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {/* Message Item 1 */}
                <button 
                  className="w-full px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
                  style={{ 
                    borderBottom: `1px solid var(--dashboard-border)`,
                    backgroundColor: 'var(--dashboard-card-bg)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-card-bg)'}
                  role="menuitem"
                >
                  <div className="flex gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-white"
                      style={{ backgroundColor: 'var(--dashboard-info)' }}
                    >
                      JD
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>
                          Prof. Jane Doe
                        </p>
                        <span className="text-xs shrink-0" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          2h ago
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                        Re: Office Hours Question
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        Hi! I can meet tomorrow at 3pm to discuss your project proposal. Please bring your draft...
                      </p>
                    </div>
                  </div>
                </button>

                {/* Announcement Item 1 */}
                <button 
                  className="w-full px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
                  style={{ 
                    borderBottom: `1px solid var(--dashboard-border)`,
                    backgroundColor: 'var(--dashboard-card-bg)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-card-bg)'}
                  role="menuitem"
                >
                  <div className="flex gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--dashboard-warning)' }}
                    >
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-medium" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          Modern Algebra
                        </p>
                        <span className="text-xs shrink-0" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          3h ago
                        </span>
                      </div>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                        HW 04 Now Available
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        The fourth homework assignment covering chapters 5-6 is now available. Due date is Feb 25...
                      </p>
                    </div>
                  </div>
                </button>

                {/* Message Item 2 */}
                <button 
                  className="w-full px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
                  style={{ 
                    borderBottom: `1px solid var(--dashboard-border)`,
                    backgroundColor: 'var(--dashboard-card-bg)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-card-bg)'}
                  role="menuitem"
                >
                  <div className="flex gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-white"
                      style={{ backgroundColor: 'var(--dashboard-success)' }}
                    >
                      SM
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>
                          Sarah Miller
                        </p>
                        <span className="text-xs shrink-0" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          5h ago
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                        Study group tonight?
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        Hey! Are we still meeting at the library at 7pm? I have some questions about the last lecture...
                      </p>
                    </div>
                  </div>
                </button>

                {/* Announcement Item 2 */}
                <button 
                  className="w-full px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
                  style={{ 
                    borderBottom: `1px solid var(--dashboard-border)`,
                    backgroundColor: 'var(--dashboard-card-bg)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-card-bg)'}
                  role="menuitem"
                >
                  <div className="flex gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--dashboard-warning)' }}
                    >
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-medium" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          Computer Science
                        </p>
                        <span className="text-xs shrink-0" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          1d ago
                        </span>
                      </div>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                        Exam Schedule Posted
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        The midterm exam will be held on March 1st in the main auditorium. Review sessions start next week...
                      </p>
                    </div>
                  </div>
                </button>

                {/* Announcement Item 3 */}
                <button 
                  className="w-full px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
                  style={{ backgroundColor: 'var(--dashboard-card-bg)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-card-bg)'}
                  role="menuitem"
                >
                  <div className="flex gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--dashboard-warning)' }}
                    >
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-medium" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          Data Structures
                        </p>
                        <span className="text-xs shrink-0" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          1d ago
                        </span>
                      </div>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                        New Resources Available
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        Practice problems for binary trees and sorting algorithms have been uploaded to the Files section...
                      </p>
                    </div>
                  </div>
                </button>
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