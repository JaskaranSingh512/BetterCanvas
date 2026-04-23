import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { StreakPanel } from './StreakPanel';
import { useState } from 'react';
import { CreateEntryModal } from './CreateEntryModal';

export function Layout() {
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [reloadKey, setReloadKey] = useState(0);

  const openCreateEntry = (date?: string) => {
    setSelectedDate(date);
    setEntryModalOpen(true);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onCreateEntry={openCreateEntry} />
        <div className="flex-1 flex overflow-hidden">
          <div
            className="flex-1 overflow-auto transition-colors duration-200"
            style={{ backgroundColor: 'var(--dashboard-card-bg)' }}
          >
            <Outlet context={{ openCreateEntry, reloadKey }} />
          </div>
          <StreakPanel onCreateEntry={openCreateEntry} />
        </div>
      </div>
      <CreateEntryModal
        isOpen={entryModalOpen}
        initialDate={selectedDate}
        onClose={() => setEntryModalOpen(false)}
        onCreated={() => setReloadKey((previous) => previous + 1)}
      />
    </div>
  );
}
