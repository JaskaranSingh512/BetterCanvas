import { 
  User, 
  Home, 
  BookOpen, 
  Users, 
  Calendar, 
  HelpCircle, 
  ArrowLeft 
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

const navItems = [
  { to: '/account', icon: User, label: 'Account', isAvatar: true },
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/groups', icon: Users, label: 'Groups' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <div 
      className="w-[86px] flex flex-col items-center py-6 shrink-0 transition-colors duration-200"
      style={{ backgroundColor: 'var(--dashboard-sidebar-bg)' }}
    >
      {/* Logo */}
      <div 
        className="w-[60px] h-[60px] rounded-lg flex items-center justify-center mb-8 transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        role="img"
        aria-label="Dashboard Logo"
      >
        <div 
          className="w-9 h-9 rounded-full"
          style={{
            border: '3px dashed var(--dashboard-sidebar-text)',
          }}
        ></div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col items-center gap-6 flex-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="flex flex-col items-center gap-2 min-h-[44px] min-w-[44px] rounded-lg transition-all px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/50 no-underline"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            })}
            aria-label={item.label}
          >
            {({ isActive }) => (
              <>
                {item.isAvatar ? (
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: 'var(--dashboard-hover)' }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: 'var(--dashboard-sidebar-text)' }} />
                  </div>
                ) : (
                  <item.icon className="w-8 h-8" style={{ color: 'var(--dashboard-sidebar-text)' }} />
                )}
                <span 
                  className="text-xs"
                  style={{ 
                    color: 'var(--dashboard-sidebar-text)',
                    fontWeight: isActive ? 600 : 400
                  }}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Back Arrow */}
      <button 
        onClick={() => navigate(-1)}
        className="mt-auto min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Go back"
      >
        <ArrowLeft className="w-8 h-8" style={{ color: 'var(--dashboard-sidebar-text)' }} />
      </button>
    </div>
  );
}
