import { TaskCard } from '../components/TaskCard';
import { CalendarWidget } from '../components/CalendarWidget';
import { CourseCard } from '../components/CourseCard';
import { Star, TrendingUp, Pin } from 'lucide-react';
import { useNavigate } from 'react-router';

export function DashboardPage() {
  const navigate = useNavigate();

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
        {/* Focused Courses Section with Pin Icon */}
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
            className="p-6 rounded-lg relative"
            style={{
              backgroundColor: 'var(--dashboard-hover)',
              border: `2px solid var(--dashboard-warning)`
            }}
          >
            <div
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--dashboard-warning)' }}
              aria-label="Pinned course"
            >
              <Pin className="w-4 h-4 text-white" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ color: 'var(--dashboard-text-primary)' }}
                >
                  Applied Modern Algebra
                </h3>
                <p
                  className="text-base"
                  style={{ color: 'var(--dashboard-text-secondary)' }}
                >
                  PHSC 114 • Spring 2026
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--dashboard-success)' }} />
                  <span
                    className="text-2xl font-bold"
                    style={{ color: 'var(--dashboard-success)' }}
                  >
                    92%
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
              <div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>3</div>
                <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>Assignments Due</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>2</div>
                <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>Upcoming Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>5 days</div>
                <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>Until Next Exam</div>
              </div>
            </div>
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

            <TaskCard
              courseCode="PHSC 114"
              courseName="APPLIED MODERN ALGEBRA - SPRING 2026 ASSIGNMENT"
              taskTitle="HW 02"
              taskType="assignment"
              points={25}
              dueTime="9:00 AM"
              checked={true}
              thumbnail="red"
            />
          </section>

          <aside aria-label="Calendar">
            <CalendarWidget />
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
    </>
  );
}
