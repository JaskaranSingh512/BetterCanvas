import { TaskCard } from '../components/TaskCard';
import { CalendarWidget } from '../components/CalendarWidget';

export function CalendarPage() {
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
            {/* Yesterday */}
            <section>
              <h3
                className="text-xl font-semibold mb-4 px-2"
                style={{ color: 'var(--dashboard-text-primary)' }}
              >
                Yesterday, February 14
              </h3>
              <div
                className="text-center py-12 rounded-lg"
                style={{
                  backgroundColor: 'var(--dashboard-hover)',
                  color: 'var(--dashboard-text-secondary)'
                }}
              >
                <p className="text-lg">Nothing Planned</p>
              </div>
            </section>

            {/* Today */}
            <section>
              <div className="mb-4 px-2">
                <h3
                  className="text-xl font-semibold"
                  style={{ color: 'var(--dashboard-text-primary)' }}
                >
                  Today
                </h3>
                <p
                  className="text-base"
                  style={{ color: 'var(--dashboard-text-secondary)' }}
                >
                  February 15
                </p>
              </div>
              <TaskCard
                courseCode="C S-4063-001"
                courseName="C S-4063-001 - SPRING 2026 ASSIGNMENT"
                taskTitle="Project Proposal"
                taskType="assignment"
                points={10}
                dueTime="11:59 PM"
                checked={true}
                thumbnail="green"
              />
            </section>

            {/* Tomorrow */}
            <section>
              <h3
                className="text-xl font-semibold mb-4 px-2"
                style={{ color: 'var(--dashboard-text-primary)' }}
              >
                Tomorrow, February 16
              </h3>
              <div className="space-y-4">
                <TaskCard
                  courseCode=""
                  courseName="APPLIED MODERN ALGEBRA - SPRING 2026 CALENDAR EVENT"
                  taskTitle="Applied Modern Algebra Lecture"
                  taskSubtitle="PHSC 114"
                  taskType="calendar"
                  time="9:00 AM to 9:50 AM"
                  checked={false}
                  thumbnail="red"
                  thumbnailLabel="APPLIED MODERN ALGEBRA - SPRING 2026"
                />
                <TaskCard
                  courseCode=""
                  courseName="APPLIED MODERN ALGEBRA - SPRING 2026 CALENDAR EVENT"
                  taskTitle="Applied Modern Algebra Office Hours"
                  taskSubtitle="PHSC 1121"
                  taskType="calendar"
                  time="10:00 AM to 11:00 AM"
                  checked={false}
                  thumbnail="red"
                  thumbnailLabel="APPLIED MODERN ALGEBRA - SPRING 2026"
                />
                <TaskCard
                  courseCode=""
                  courseName="APPLIED MODERN ALGEBRA - SPRING 2026 ASSIGNMENT"
                  taskTitle="HW 03"
                  taskType="assignment"
                  points={5}
                  checked={true}
                  thumbnail="red"
                  thumbnailLabel=""
                />
              </div>
            </section>
          </div>

          {/* Sidebar Calendar */}
          <aside className="sticky top-0">
            <CalendarWidget />
          </aside>
        </div>
      </div>
    </>
  );
}
