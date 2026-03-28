import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { StreakPanel } from './StreakPanel';

export function Layout() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <div className="flex-1 flex overflow-hidden">
          <div
            className="flex-1 overflow-auto transition-colors duration-200"
            style={{ backgroundColor: 'var(--dashboard-card-bg)' }}
          >
            <Outlet />
          </div>
          <StreakPanel />
        </div>
      </div>
    </div>
  );
}
