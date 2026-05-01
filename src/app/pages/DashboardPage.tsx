import { TaskCard } from '../components/TaskCard';
import { CalendarWidget } from '../components/CalendarWidget';
import { Star, TrendingUp, Pin } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router';
import { useEffect, useState } from 'react';
import { getDashboard, getCourses, setFocusedCourse } from '../../lib/api';

export function DashboardPage() {
  const navigate = useNavigate();
  const { openCreateEntry, reloadKey } = useOutletContext<{ openCreateEntry: (date?: string, hasTask?: boolean) => void; reloadKey: number }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [showWeekAssignments, setShowWeekAssignments] = useState(false);
  const [showWeekEvents, setShowWeekEvents] = useState(false);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, [reloadKey]);

  useEffect(() => {
    if (showCustomize) {
      getCourses()
        .then((response) => setAllCourses(response.courses))
        .catch(() => setAllCourses([]));
    }
  }, [showCustomize]);

  if (error) {
    return <div className="px-8 py-8">{error}</div>;
  }

  if (!data) {
    return <div className="px-8 py-8">Loading dashboard...</div>;
  }

  const focused = data.focusedCourse;
  const task = data.recentTask;
  const focusedWeek = data.focusedWeek || {
    weekLabel: '',
    assignmentsDue: [] as Array<{ id: string; title: string; eventDate: string; dateLabel: string; dueTime: string }>,
    calendarEvents: [] as Array<{ id: string; title: string; eventDate: string; dateLabel: string; time: string }>,
  };
  const weekAssignmentCount = focused ? focusedWeek.assignmentsDue.length : 0;
  const weekEventCount = focused ? focusedWeek.calendarEvents.length : 0;

  return (
    <>
      <header className="px-8 py-6">
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          Dashboard
        </h1>
        <p
          className="text-lg"
          style={{ color: 'var(--dashboard-text-secondary)' }}
        >
          Welcome back! Here's what's happening today.
        </p>
      </header>

      <div className="px-8 py-4">
        {/* Focused Courses Section */}
        <section className="mb-10" aria-labelledby="focused-courses-heading">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6" style={{ color: 'var(--dashboard-warning)', fill: 'var(--dashboard-warning)' }} />
              <h2
                id="focused-courses-heading"
                className="text-2xl font-semibold"
                style={{ color: 'var(--dashboard-text-primary)' }}
              >
                Focused Courses
              </h2>
            </div>
            <button
              onClick={() => setShowCustomize(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 min-h-[44px]"
              style={{
                backgroundColor: 'var(--dashboard-hover)',
                color: 'var(--dashboard-text-primary)'
              }}
              aria-label="Customize focused courses"
            >
              <Pin className="w-4 h-4" />
              <span className="text-sm font-medium">Customize</span>
            </button>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: 'var(--dashboard-hover)',
              border: `2px solid var(--dashboard-warning)`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ color: 'var(--dashboard-text-primary)' }}
                >
                  {focused?.courseName || 'No focused course'}
                </h3>
                <p
                  className="text-base"
                  style={{ color: 'var(--dashboard-text-secondary)' }}
                >
                  {focused?.courseCode} • {focused?.term}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--dashboard-success)' }} />
                  <span
                    className="text-2xl font-bold"
                    style={{ color: 'var(--dashboard-success)' }}
                  >
                    {focused?.gradePercent ?? 0}%
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: 'var(--dashboard-text-secondary)' }}
                >
                  Course Grade
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: `1px solid var(--dashboard-border)` }}>
              <div
                className="relative min-h-[72px]"
                onMouseEnter={() => focused && setShowWeekAssignments(true)}
                onMouseLeave={() => setShowWeekAssignments(false)}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                  {focused ? weekAssignmentCount : '—'}
                </div>
                <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  Assignments due this week
                </div>
                {focused && showWeekAssignments && (
                  <div className="absolute left-0 top-full z-[40] w-full min-w-[220px] max-w-[min(100vw-2rem,320px)] pt-2">
                    <div
                      className="rounded-lg shadow-xl p-3 text-left text-sm max-h-56 overflow-y-auto"
                      style={{
                        backgroundColor: 'var(--dashboard-card-bg)',
                        border: '1px solid var(--dashboard-border)',
                      }}
                    >
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {focusedWeek.weekLabel}
                      </p>
                      {focusedWeek.assignmentsDue.length === 0 ? (
                        <p style={{ color: 'var(--dashboard-text-secondary)' }}>No assignments due this week.</p>
                      ) : (
                        <ul className="space-y-2">
                          {focusedWeek.assignmentsDue.map((item) => (
                            <li key={item.id} className="pb-2 border-b last:border-0 last:pb-0" style={{ borderColor: 'var(--dashboard-border)' }}>
                              <div className="font-medium" style={{ color: 'var(--dashboard-text-primary)' }}>
                                {item.title}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--dashboard-text-secondary)' }}>
                                {item.dateLabel}
                                {item.dueTime ? ` · ${item.dueTime}` : ''}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div
                className="relative min-h-[72px]"
                onMouseEnter={() => focused && setShowWeekEvents(true)}
                onMouseLeave={() => setShowWeekEvents(false)}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                  {focused ? weekEventCount : '—'}
                </div>
                <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  Events this week
                </div>
                {focused && showWeekEvents && (
                  <div className="absolute left-0 top-full z-[40] w-full min-w-[220px] max-w-[min(100vw-2rem,320px)] pt-2">
                    <div
                      className="rounded-lg shadow-xl p-3 text-left text-sm max-h-56 overflow-y-auto"
                      style={{
                        backgroundColor: 'var(--dashboard-card-bg)',
                        border: '1px solid var(--dashboard-border)',
                      }}
                    >
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {focusedWeek.weekLabel}
                      </p>
                      {focusedWeek.calendarEvents.length === 0 ? (
                        <p style={{ color: 'var(--dashboard-text-secondary)' }}>No calendar events this week.</p>
                      ) : (
                        <ul className="space-y-2">
                          {focusedWeek.calendarEvents.map((item) => (
                            <li key={item.id} className="pb-2 border-b last:border-0 last:pb-0" style={{ borderColor: 'var(--dashboard-border)' }}>
                              <div className="font-medium" style={{ color: 'var(--dashboard-text-primary)' }}>
                                {item.title}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--dashboard-text-secondary)' }}>
                                {item.dateLabel}
                                {item.time ? ` · ${item.time}` : ''}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>{focused?.nextExamIn ?? 'N/A'}</div>
                <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>Until next exam</div>
              </div>
            </div>
            {focused && focusedWeek.weekLabel ? (
              <p className="text-xs mt-3" style={{ color: 'var(--dashboard-text-secondary)' }}>
                Counts use your calendar entries for this focused course, week of {focusedWeek.weekLabel}.
              </p>
            ) : null}
          </div>
        </section>

        {/* Two Column Layout for Recent Activity and Calendar */}
        <div className="grid grid-cols-[1fr,320px] gap-6 mb-10">
          <section aria-labelledby="recent-activity-heading">
            <div
              className="flex items-center justify-between mb-4 px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--dashboard-info)' }}
            >
              <h2
                id="recent-activity-heading"
                className="text-lg font-semibold text-white"
              >
                NEW ACTIVITY
              </h2>
              <span className="text-white text-xl">↑</span>
            </div>

            {task ? <TaskCard {...task} /> : <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--dashboard-hover)' }}>No activity yet.</div>}
          </section>

          <aside aria-label="Calendar">
            <CalendarWidget
              taskDates={data.taskDates || []}
              taskMarkers={data.taskMarkers || {}}
              onDateClick={openCreateEntry}
            />
          </aside>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/courses')}
            className="p-6 rounded-lg text-left transition-all hover:shadow-md focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--dashboard-hover)',
              border: `1px solid var(--dashboard-border)`
            }}
          >
            <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
              All Courses →
            </h3>
            <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
              View Spring 2026 courses and materials
            </p>
          </button>
          <button
            onClick={() => navigate('/calendar')}
            className="p-6 rounded-lg text-left transition-all hover:shadow-md focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--dashboard-hover)',
              border: `1px solid var(--dashboard-border)`
            }}
          >
            <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
              Calendar →
            </h3>
            <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
              Upcoming assignments and events
            </p>
          </button>
          <button
            onClick={() => navigate('/groups')}
            className="p-6 rounded-lg text-left transition-all hover:shadow-md focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--dashboard-hover)',
              border: `1px solid var(--dashboard-border)`
            }}
          >
            <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
              Groups →
            </h3>
            <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
              Study groups and collaboration
            </p>
          </button>
        </div>
      </div>
      {showCustomize && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <div className="w-full max-w-lg rounded-xl p-6 space-y-4" style={{ backgroundColor: 'var(--dashboard-card-bg)', border: '1px solid var(--dashboard-border)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>Choose focused course</h3>
              <button onClick={() => setShowCustomize(false)} className="px-3 py-1 rounded-lg focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', color: 'var(--dashboard-text-primary)' }}>Close</button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {allCourses.map((course) => (
                <button
                  key={course._id}
                  onClick={async () => {
                    await setFocusedCourse(course._id);
                    const refreshed = await getDashboard();
                    setData(refreshed);
                    setShowCustomize(false);
                  }}
                  className="w-full p-3 rounded-lg text-left focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: course.focused ? 'var(--dashboard-info)' : 'var(--dashboard-hover)',
                    color: course.focused ? '#ffffff' : 'var(--dashboard-text-primary)',
                  }}
                >
                  <div className="font-semibold">{course.courseName}</div>
                  <div className="text-sm" style={{ color: course.focused ? '#ffffff' : 'var(--dashboard-text-secondary)' }}>{course.courseCode}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
