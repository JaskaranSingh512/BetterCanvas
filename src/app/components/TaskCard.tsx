import { Check, FileText, Calendar as CalendarIcon, Info } from 'lucide-react';
import { useState } from 'react';

interface TaskCardProps {
  courseCode: string;
  courseName: string;
  taskTitle: string;
  taskType: 'assignment' | 'calendar';
  points?: number;
  dueTime?: string;
  time?: string;
  checked?: boolean;
  thumbnail?: 'red' | 'green';
  taskSubtitle?: string;
  thumbnailLabel?: string;
}

export function TaskCard({
  courseCode,
  courseName,
  taskTitle,
  taskType,
  points,
  dueTime,
  time,
  checked = false,
  thumbnail = 'red',
  taskSubtitle,
  thumbnailLabel
}: TaskCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const getBgColor = () => {
    if (thumbnail === 'red') return 'var(--dashboard-accent-red)';
    return 'var(--dashboard-accent-green)';
  };
  
  return (
    <article 
      className="flex gap-6 items-start py-5 px-4 rounded-lg transition-all"
      style={{ 
        border: `1px solid var(--dashboard-border)`,
        backgroundColor: 'var(--dashboard-card-bg)'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dashboard-card-bg)'}
    >
      {/* Thumbnail */}
      <div 
        className="w-[200px] h-[130px] rounded-lg shrink-0 relative overflow-hidden shadow-sm"
        style={{ backgroundColor: getBgColor() }}
        role="img"
        aria-label={`${courseName} course thumbnail`}
      >
        {(thumbnailLabel !== undefined ? thumbnailLabel : courseCode) && (
          <div 
            className="absolute top-3 left-3 px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm"
            style={{ 
              backgroundColor: '#ffffff',
              color: 'var(--dashboard-info)'
            }}
          >
            {thumbnailLabel !== undefined ? thumbnailLabel : courseCode}
          </div>
        )}
      </div>

      {/* Checkbox */}
      <div className="flex items-start pt-3">
        <button
          className="min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 rounded-lg transition-all"
          aria-label={checked ? 'Mark as incomplete' : 'Mark as complete'}
          aria-pressed={checked}
          style={{
            backgroundColor: checked ? 'var(--dashboard-success)' : 'transparent',
            border: checked ? 'none' : '2px solid var(--dashboard-border)',
          }}
        >
          {checked && <Check className="w-6 h-6 text-white" strokeWidth={3} />}
        </button>
      </div>

      {/* Icon with Tooltip */}
      <div className="flex items-start pt-3 relative">
        <button
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: 'var(--dashboard-hover)',
            color: 'var(--dashboard-text-secondary)'
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={`${taskType === 'assignment' ? 'Assignment' : 'Calendar event'} details`}
        >
          {taskType === 'assignment' ? (
            <FileText className="w-6 h-6" />
          ) : (
            <CalendarIcon className="w-6 h-6" />
          )}
        </button>

        {/* Hover Tooltip */}
        {showTooltip && (
          <div 
            className="absolute left-12 top-0 z-10 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap"
            style={{ 
              backgroundColor: 'var(--dashboard-card-bg)',
              border: `1px solid var(--dashboard-border)`,
              color: 'var(--dashboard-text-primary)'
            }}
            role="tooltip"
          >
            {taskType === 'assignment' 
              ? `Assignment • ${points || 0} points`
              : `Event • ${time || 'No time set'}`
            }
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-2">
        <div 
          className="text-xs uppercase tracking-wide mb-2 font-medium"
          style={{ color: 'var(--dashboard-text-secondary)' }}
        >
          {courseName}
        </div>
        <h3 
          className="font-semibold text-lg mb-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          {taskTitle}
        </h3>
        {taskSubtitle && (
          <div 
            className="text-base"
            style={{ color: 'var(--dashboard-text-secondary)' }}
          >
            {taskSubtitle}
          </div>
        )}
        {!taskSubtitle && taskType === 'assignment' && courseCode && (
          <div 
            className="text-base"
            style={{ color: 'var(--dashboard-text-secondary)' }}
          >
            {courseCode}
          </div>
        )}
      </div>

      {/* Right side - Points/Time */}
      <div className="text-right shrink-0 pt-2">
        {points !== undefined && (
          <div>
            <div 
              className="text-4xl font-bold mb-1"
              style={{ color: 'var(--dashboard-text-primary)' }}
            >
              {points}
            </div>
            <div 
              className="text-xs uppercase tracking-wide font-semibold"
              style={{ color: 'var(--dashboard-text-secondary)' }}
            >
              POINTS
            </div>
            {dueTime && (
              <div 
                className="text-xs mt-2 px-2 py-1 rounded"
                style={{ 
                  color: 'var(--dashboard-warning)',
                  backgroundColor: 'var(--dashboard-hover)'
                }}
              >
                Due: {dueTime}
              </div>
            )}
          </div>
        )}
        {time && (
          <div 
            className="text-base font-medium px-3 py-2 rounded-lg"
            style={{ 
              color: 'var(--dashboard-text-primary)',
              backgroundColor: 'var(--dashboard-hover)'
            }}
          >
            {time}
          </div>
        )}
      </div>
    </article>
  );
}
