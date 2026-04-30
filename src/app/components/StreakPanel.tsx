import React from 'react';
import { Flame, ChevronDown, Plus, CheckCircle2, Circle, FileText, Calendar } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getCalendarTasks } from '../../lib/api';

type CalendarTask = {
  _id: string;
  courseCode?: string;
  courseName: string;
  taskTitle: string;
  taskType: 'assignment' | 'calendar';
  points?: number;
  dueTime?: string;
  time?: string;
  checked?: boolean;
  thumbnail?: string;
  eventDate: string;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toYMD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDaysYMD(ymd: string, days: number) {
  // Parse as local date parts to avoid UTC offset surprises.
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return toYMD(date);
}

function formatShortDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function thumbnailColor(thumbnail?: string) {
  switch (thumbnail) {
    case 'red':
      return 'var(--dashboard-accent-red)';
    case 'green':
      return 'var(--dashboard-accent-green)';
    case 'blue':
      return 'var(--dashboard-info)';
    case 'purple':
      return '#8b5cf6';
    default:
      return 'var(--dashboard-accent-red)';
  }
}

function courseLabel(task: CalendarTask) {
  if (task.courseCode?.trim()) return task.courseCode.trim();
  const name = task.courseName || '';
  const dash = name.indexOf(' - ');
  if (dash > 0) return name.slice(0, dash).trim();
  return name.slice(0, 24) || 'Course';
}

const DUE_SOON_DAYS = 14;
const MAX_ITEMS = 6;

export function StreakPanel({
  onCreateEntry,
  reloadKey = 0,
}: {
  onCreateEntry?: (date?: string) => void;
  reloadKey?: number;
}) {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);

  const weekProgress = [
    { day: 'Mon', complete: true },
    { day: 'Tue', complete: true },
    { day: 'Wed', complete: true },
    { day: 'Thu', complete: false },
    { day: 'Fri', complete: false },
    { day: 'Sat', complete: false },
    { day: 'Sun', complete: false },
  ];

  useEffect(() => {
    // Keep the side panel in sync after new entries are created.
    getCalendarTasks()
      .then((data) => {
        const flat: CalendarTask[] = [];
        for (const group of data.groups || []) {
          for (const task of group.tasks || []) {
            flat.push(task);
          }
        }
        setTasks(flat);
      })
      .catch(() => setTasks([]));
  }, [reloadKey]);

  const dueSoonItems = useMemo(() => {
    const today = toYMD(new Date());
    const end = addDaysYMD(today, DUE_SOON_DAYS);
    // "Due soon" = incomplete assignments + scheduled events in window.
    const upcoming = tasks.filter((task) => {
      if (!task.eventDate) return false;
      if (task.eventDate < today || task.eventDate > end) return false;
      if (task.taskType === 'assignment') return !task.checked;
      return task.taskType === 'calendar';
    });
    upcoming.sort((a, b) => {
      if (a.eventDate !== b.eventDate) return a.eventDate.localeCompare(b.eventDate);
      return (a.taskTitle || '').localeCompare(b.taskTitle || '');
    });
    return upcoming.slice(0, MAX_ITEMS);
  }, [tasks]);

  const assignmentWindow = useMemo(() => {
    const today = toYMD(new Date());
    const end = addDaysYMD(today, DUE_SOON_DAYS);
    // Progress ring only tracks assignments, not calendar-only events.
    return tasks.filter(
      (t) => t.taskType === 'assignment' && t.eventDate >= today && t.eventDate <= end
    );
  }, [tasks]);

  const completedInWindow = assignmentWindow.filter((t) => t.checked).length;
  const totalInWindow = assignmentWindow.length;
  const remainingInWindow = totalInWindow - completedInWindow;
  const percent =
    totalInWindow > 0 ? Math.round((completedInWindow / totalInWindow) * 100) : 0;
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="w-[360px] flex flex-col transition-colors duration-200 overflow-y-auto"
      style={{
        borderLeft: `1px solid var(--dashboard-border)`,
        backgroundColor: 'var(--dashboard-card-bg)',
      }}
    >
      <div className="p-6 space-y-6">
        {/* Streak Header */}
        <div>
          <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--dashboard-text-primary)' }}>
            Your Progress
          </h2>

          <div
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{ backgroundColor: 'var(--dashboard-hover)' }}
          >
            <Flame className="w-7 h-7 shrink-0" style={{ color: 'var(--dashboard-info)', fill: 'var(--dashboard-info)' }} />
            <div className="flex-1">
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-info)' }}>
                171 days
              </div>
              <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                without missing a task
              </div>
            </div>
          </div>
        </div>

        {/* Week Progress Visualization */}
        <div>
          <h3 className="font-semibold text-base mb-3" style={{ color: 'var(--dashboard-text-primary)' }}>
            This Week
          </h3>
          <div className="flex justify-between gap-2">
            {weekProgress.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: item.complete ? 'var(--dashboard-success)' : 'var(--dashboard-hover)',
                    color: '#ffffff',
                  }}
                  aria-label={`${item.day}: ${item.complete ? 'Complete' : 'Incomplete'}`}
                >
                  {item.complete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: 'var(--dashboard-text-secondary)' }} />
                  )}
                </div>
                <span className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress Circle — from assignments in the same window as Due Soon */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base" style={{ color: 'var(--dashboard-text-primary)' }}>
              Overall Progress
            </h3>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--dashboard-hover)',
                color: 'var(--dashboard-text-primary)',
              }}
            >
              <span>All Courses</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center py-6 relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="var(--dashboard-border)" strokeWidth="16" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="var(--dashboard-success)"
                strokeWidth="16"
                strokeDasharray={`${circumference} ${circumference}`}
                // Empty ring when nothing is due in the current window.
                strokeDashoffset={totalInWindow === 0 ? circumference : dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
                {totalInWindow > 0 ? `${percent}%` : '—'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--dashboard-hover)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-success)' }}>
                {totalInWindow > 0 ? completedInWindow : '—'}
              </div>
              <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                Completed
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--dashboard-hover)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-accent-red)' }}>
                {totalInWindow > 0 ? remainingInWindow : '—'}
              </div>
              <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                Remaining
              </div>
            </div>
          </div>
        </div>

        {/* Due Soon — real calendar / assignment entries in the next 14 days */}
        <div>
          <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
            Due Soon
          </h3>
          <p className="text-xs mb-3" style={{ color: 'var(--dashboard-text-secondary)' }}>
            Next {DUE_SOON_DAYS} days · incomplete assignments and scheduled events
          </p>

          <div className="space-y-3">
            {dueSoonItems.length === 0 ? (
              <div
                className="p-4 rounded-lg text-sm text-center"
                style={{ backgroundColor: 'var(--dashboard-hover)', color: 'var(--dashboard-text-secondary)' }}
              >
                Nothing due in the next {DUE_SOON_DAYS} days. Add a task or check your calendar.
              </div>
            ) : (
              dueSoonItems.map((task) => {
                const isAssignment = task.taskType === 'assignment';
                const dueLine = isAssignment
                  ? `Due ${formatShortDate(task.eventDate)}${task.dueTime ? ` at ${task.dueTime}` : ''}`
                  : `${formatShortDate(task.eventDate)}${task.time ? ` · ${task.time}` : ''}`;
                return (
                  <div
                    key={task._id}
                    className="flex gap-3 p-3 rounded-lg transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: 'var(--dashboard-hover)',
                      border: `1px solid var(--dashboard-border)`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: thumbnailColor(task.thumbnail) }}
                    >
                      {isAssignment ? (
                        <FileText className="w-6 h-6 text-white" />
                      ) : (
                        <Calendar className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--dashboard-text-primary)' }}>
                        {task.taskTitle}
                      </div>
                      <div className="text-xs mb-1 truncate" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {courseLabel(task)}
                      </div>
                      <div className="text-xs flex items-center gap-1" style={{ color: 'var(--dashboard-warning)' }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--dashboard-warning)' }} />
                        <span className="truncate">{dueLine}</span>
                      </div>
                    </div>
                    {isAssignment && task.points !== undefined && task.points !== null ? (
                      <div className="text-right shrink-0">
                        <div className="text-lg font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>
                          {task.points}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          pts
                        </div>
                      </div>
                    ) : (
                      <div className="text-right shrink-0 text-xs font-medium" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        Event
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => onCreateEntry?.()}
            className="w-full mt-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--dashboard-info)',
              color: '#ffffff',
            }}
            aria-label="Create new task"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
