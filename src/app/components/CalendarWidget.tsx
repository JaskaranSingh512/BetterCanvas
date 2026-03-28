import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarWidget() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [
    [null, null, null, null, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, null, null]
  ];

  const today = 15;
  const datesWithTasks = [15, 16, 20];

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
          February 2026
        </h3>
        <div className="flex gap-1">
          <button 
            className="w-8 h-8 flex items-center justify-center rounded hover:opacity-80 transition-opacity focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--dashboard-hover)' }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--dashboard-text-primary)' }} />
          </button>
          <button 
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
        {dates.flat().map((date, index) => (
          <button
            key={index}
            disabled={date === null}
            className="aspect-square flex flex-col items-center justify-center rounded text-sm transition-all focus:outline-none focus:ring-2 relative"
            style={{
              backgroundColor: date === today 
                ? 'var(--dashboard-info)' 
                : date && datesWithTasks.includes(date)
                ? 'var(--dashboard-hover)'
                : 'transparent',
              color: date === today 
                ? '#ffffff' 
                : date 
                ? 'var(--dashboard-text-primary)' 
                : 'transparent',
              cursor: date ? 'pointer' : 'default'
            }}
            onMouseEnter={(e) => {
              if (date && date !== today) {
                e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (date && date !== today && !datesWithTasks.includes(date)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              } else if (date && datesWithTasks.includes(date) && date !== today) {
                e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)';
              }
            }}
            aria-label={date ? `February ${date}, 2026` : undefined}
            aria-current={date === today ? 'date' : undefined}
          >
            {date}
            {date && datesWithTasks.includes(date) && date !== today && (
              <div 
                className="absolute bottom-1 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--dashboard-info)' }}
              ></div>
            )}
          </button>
        ))}
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
        </div>
      </div>
    </div>
  );
}
