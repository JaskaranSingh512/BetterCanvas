import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

export function CalendarWidget({
  taskDates = [],
  taskMarkers = {},
  onDateClick,
}: {
  taskDates?: string[];
  taskMarkers?: Record<string, { count: number; courses: string[] }>;
  onDateClick?: (date: string, hasTask: boolean) => void;
}) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [monthDate, setMonthDate] = useState(new Date());
  const todayString = new Date().toISOString().slice(0, 10);

  const { dates, monthLabel, monthIndex, year } = useMemo(() => {
    const yearValue = monthDate.getFullYear();
    const monthValue = monthDate.getMonth();
    const first = new Date(yearValue, monthValue, 1);
    const offset = first.getDay();
    const daysInMonth = new Date(yearValue, monthValue + 1, 0).getDate();
    const flat = [];
    // Fill leading/trailing null slots so grid stays aligned by weekday.
    for (let i = 0; i < offset; i += 1) flat.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) flat.push(day);
    while (flat.length % 7 !== 0) flat.push(null);
    return {
      dates: flat,
      monthLabel: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      monthIndex: monthValue,
      year: yearValue,
    };
  }, [monthDate]);

  return (
    <div 
      className="rounded-lg p-4 shadow-sm"
      style={{ 
        backgroundColor: 'var(--dashboard-card-bg)',
        border: `1px solid var(--dashboard-border)`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base" style={{ color: 'var(--dashboard-text-primary)' }}>
          {monthLabel}
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => setMonthDate(new Date(year, monthIndex - 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded hover:opacity-80 transition-opacity focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--dashboard-hover)' }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--dashboard-text-primary)' }} />
          </button>
          <button 
            onClick={() => setMonthDate(new Date(year, monthIndex + 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded hover:opacity-80 transition-opacity focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--dashboard-hover)' }}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--dashboard-text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div 
            key={day} 
            className="text-center text-xs font-medium py-1"
            style={{ color: 'var(--dashboard-text-secondary)' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const dateString = date === null ? '' : `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
          const marker = taskMarkers[dateString];
          const fallbackHasTask = !!date && taskDates.includes(dateString);
          // Prefer rich marker data, but keep backward compatibility with plain date list.
          const hasTask = !!date && (!!marker || fallbackHasTask);
          const taskCount = marker?.count || 0;
          const courses = marker?.courses || [];
          const primaryCourse = courses[0] || '';
          const extraCourseCount = Math.max(0, courses.length - 1);
          const isToday = dateString === todayString;
          const labelParts = [];
          if (dateString) {
            labelParts.push(
              new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            );
          }
          if (hasTask) {
            if (courses.length > 0) {
              labelParts.push(`Assignments: ${courses.join(', ')}`);
            } else {
              labelParts.push('Assignments due');
            }
          }
          return (
          <button
            key={index}
            disabled={date === null}
            className="aspect-square min-h-[42px] rounded text-sm transition-all focus:outline-none focus:ring-2 relative pt-1"
            style={{
              backgroundColor: isToday 
                ? 'var(--dashboard-info)' 
                : hasTask
                ? 'var(--dashboard-hover)'
                : 'transparent',
              color: isToday 
                ? '#ffffff' 
                : date 
                ? 'var(--dashboard-text-primary)' 
                : 'transparent',
              cursor: date ? 'pointer' : 'default'
            }}
            onMouseEnter={(e) => {
              if (date && !isToday) {
                e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)';
              }
            }}
            onMouseLeave={(e) => {
              // Preserve visual cue for task days after hover-out.
              if (date && !isToday && !hasTask) {
                e.currentTarget.style.backgroundColor = 'transparent';
              } else if (date && hasTask && !isToday) {
                e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)';
              }
            }}
            aria-label={date ? labelParts.join('. ') : undefined}
            aria-current={isToday ? 'date' : undefined}
            onClick={() => dateString && onDateClick?.(dateString, hasTask)}
          >
            <span className="block text-center font-medium">{date}</span>
            {hasTask && !isToday && (
              <span
                className="block mx-auto mt-1 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: 'var(--dashboard-info)' }}
              ></span>
            )}
            {hasTask && courses.length > 0 && (
              <span
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 max-w-[92%] truncate rounded px-1 py-[1px] text-[9px] font-semibold"
                style={{
                  backgroundColor: 'var(--dashboard-info)',
                  color: '#ffffff',
                }}
                title={courses.join(', ')}
              >
                {primaryCourse}
                {extraCourseCount > 0 ? ` +${extraCourseCount}` : ''}
              </span>
            )}
            {hasTask && taskCount > 1 && (
              <span
                className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] leading-4 text-center font-semibold"
                style={{
                  backgroundColor: 'var(--dashboard-warning)',
                  color: '#ffffff',
                }}
                title={`${taskCount} assignments`}
              >
                {taskCount}
              </span>
            )}
          </button>
        )})}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3" style={{ borderTop: `1px solid var(--dashboard-border)` }}>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--dashboard-info)' }}></div>
            <span style={{ color: 'var(--dashboard-text-secondary)' }}>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: 'var(--dashboard-info)' }}></div>
            <span style={{ color: 'var(--dashboard-text-secondary)' }}>Has tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-[16px] h-4 px-1 rounded-full text-[10px] leading-4 text-center font-semibold" style={{ backgroundColor: 'var(--dashboard-warning)', color: '#ffffff' }}>2</div>
            <span style={{ color: 'var(--dashboard-text-secondary)' }}>Task count</span>
          </div>
        </div>
      </div>
    </div>
  );
}
