import { Flame, ChevronDown, Plus, CheckCircle2, Circle, FileText } from 'lucide-react';

export function StreakPanel() {
  const weekProgress = [
    { day: 'Mon', complete: true },
    { day: 'Tue', complete: true },
    { day: 'Wed', complete: true },
    { day: 'Thu', complete: false },
    { day: 'Fri', complete: false },
    { day: 'Sat', complete: false },
    { day: 'Sun', complete: false },
  ];

  return (
    <div 
      className="w-[360px] flex flex-col transition-colors duration-200 overflow-y-auto"
      style={{ 
        borderLeft: `1px solid var(--dashboard-border)`,
        backgroundColor: 'var(--dashboard-card-bg)'
      }}
    >
      <div className="p-6 space-y-6">
        {/* Streak Header */}
        <div>
          <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--dashboard-text-primary)' }}>
            Your Progress
          </h2>

          {/* Streak Info */}
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
                    color: '#ffffff'
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

        {/* Overall Progress Circle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base" style={{ color: 'var(--dashboard-text-primary)' }}>
              Overall Progress
            </h3>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: 'var(--dashboard-hover)',
                color: 'var(--dashboard-text-primary)'
              }}
            >
              <span>All Courses</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Simplified Progress Circle */}
          <div className="flex items-center justify-center py-6 relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="var(--dashboard-border)"
                strokeWidth="16"
              />
              {/* Progress circle - 50% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="var(--dashboard-success)"
                strokeWidth="16"
                strokeDasharray="502.65 502.65"
                strokeDashoffset="251.33"
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>50%</div>
              <div className="text-base mt-1" style={{ color: 'var(--dashboard-text-secondary)' }}>2 of 4 complete</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--dashboard-hover)' }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-success)' }}>2</div>
              <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Completed</div>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--dashboard-hover)' }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-accent-red)' }}>2</div>
              <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>Remaining</div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <h3 className="font-semibold text-base mb-3" style={{ color: 'var(--dashboard-text-primary)' }}>
            Due Soon
          </h3>
          
          <div className="space-y-3">
            {/* Task 1 */}
            <div 
              className="flex gap-3 p-3 rounded-lg transition-all hover:shadow-sm"
              style={{ 
                backgroundColor: 'var(--dashboard-hover)',
                border: `1px solid var(--dashboard-border)`
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--dashboard-accent-red)' }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                  HW 03
                </div>
                <div className="text-xs mb-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  MATH-4383-001
                </div>
                <div className="text-xs flex items-center gap-1" style={{ color: 'var(--dashboard-warning)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--dashboard-warning)' }}></span>
                  Due Feb 20 at 9:00 AM
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>25</div>
                <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>pts</div>
              </div>
            </div>

            {/* Task 2 */}
            <div 
              className="flex gap-3 p-3 rounded-lg transition-all hover:shadow-sm"
              style={{ 
                backgroundColor: 'var(--dashboard-hover)',
                border: `1px solid var(--dashboard-border)`
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--dashboard-accent-green)' }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                  Case Study 1
                </div>
                <div className="text-xs mb-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  C S-4063-001
                </div>
                <div className="text-xs flex items-center gap-1" style={{ color: 'var(--dashboard-warning)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--dashboard-warning)' }}></span>
                  Due Feb 20 at 11:59 PM
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>20</div>
                <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>pts</div>
              </div>
            </div>
          </div>

          {/* New Task Button */}
          <button 
            className="w-full mt-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--dashboard-info)',
              color: '#ffffff'
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