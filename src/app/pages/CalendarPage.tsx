import { TaskCard } from '../components/TaskCard';
import { CalendarWidget } from '../components/CalendarWidget';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { getCalendarTasks, patchTask } from '../../lib/api';

export function CalendarPage() {
  const { openCreateEntry, reloadKey } = useOutletContext<{ openCreateEntry: (date?: string) => void; reloadKey: number }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const load = () =>
    getCalendarTasks()
      .then(setData)
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, [reloadKey]);

  const onToggleTask = async (checked: boolean, id?: string) => {
    if (!id) return;
    await patchTask(id, checked);
    await load();
  };

  if (error) return <div className="px-8 py-8">{error}</div>;
  if (!data) return <div className="px-8 py-8">Loading calendar...</div>;

  return (
    <>
      <header className="px-8 py-6">
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          Calendar
        </h1>
        <p
          className="text-lg"
          style={{ color: 'var(--dashboard-text-secondary)' }}
        >
          Your upcoming schedule and deadlines
        </p>
      </header>

      <div className="px-8 py-4">
        <div className="grid grid-cols-[1fr,320px] gap-8">
          {/* Schedule */}
          <div className="space-y-8">
            {data.groups.length === 0 ? (
              <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--dashboard-hover)', color: 'var(--dashboard-text-secondary)' }}>
                <p className="text-lg">No entries yet. Click + to add one.</p>
              </div>
            ) : data.groups.map((group: any) => (
              <section key={group.dateKey}>
                <h3 className="text-xl font-semibold mb-4 px-2" style={{ color: 'var(--dashboard-text-primary)' }}>
                  {group.dateLabel}
                </h3>
                <div className="space-y-4">
                  {group.tasks.map((task: any) => <TaskCard key={task._id} {...task} id={task._id} onCheckedChange={onToggleTask} />)}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar Calendar */}
          <aside className="sticky top-0">
            <CalendarWidget taskDates={data.taskDates || []} onDateClick={openCreateEntry} />
          </aside>
        </div>
      </div>
    </>
  );
}
