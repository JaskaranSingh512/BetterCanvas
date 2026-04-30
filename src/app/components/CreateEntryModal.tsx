import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { createTask, getCalendarTasks, getCourses } from '../../lib/api';

interface CreateEntryModalProps {
  isOpen: boolean;
  initialDate?: string;
  initialTab?: 'existing' | 'new';
  onClose: () => void;
  onCreated: () => void;
}

export function CreateEntryModal({ isOpen, initialDate, initialTab = 'new', onClose, onCreated }: CreateEntryModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>(initialTab);
  const [taskType, setTaskType] = useState<'assignment' | 'calendar'>('assignment');
  const [eventDate, setEventDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [points, setPoints] = useState('10');
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [time, setTime] = useState('9:00 AM to 9:50 AM');
  const [courses, setCourses] = useState<any[]>([]);
  const [entriesForDay, setEntriesForDay] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Load course options lazily so we always use latest course names/codes.
      getCourses().then((data) => setCourses(data.courses || [])).catch(() => setCourses([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialDate) {
      setEventDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (isOpen) {
      // Day clicks choose the starting tab: existing entries or new entry form.
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen || !eventDate) return;
    // Pull just the selected day's entries for quick in-modal triage.
    getCalendarTasks()
      .then((data) => {
        const group = (data.groups || []).find((item: any) => item.dateKey === eventDate);
        setEntriesForDay(group?.tasks || []);
      })
      .catch(() => setEntriesForDay([]));
  }, [isOpen, eventDate]);

  if (!isOpen) {
    return null;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const nextFieldErrors: Record<string, string> = {};
    // Validate only fields that apply to the currently selected entry type.
    if (!eventDate) nextFieldErrors.eventDate = 'Please choose a date.';
    if (!courseName) nextFieldErrors.courseName = 'Please select a course.';
    if (!taskTitle.trim()) nextFieldErrors.taskTitle = 'Please enter a task name.';
    if (taskType === 'assignment' && !points.trim()) nextFieldErrors.points = 'Please enter points.';
    if (taskType === 'assignment' && !dueTime.trim()) nextFieldErrors.dueTime = 'Please enter a due time.';
    if (taskType === 'calendar' && !time.trim()) nextFieldErrors.time = 'Please enter a time range.';
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }
    try {
      await createTask({
        eventDate,
        courseName,
        courseCode,
        taskTitle,
        taskType,
        points: taskType === 'assignment' ? Number(points || '0') : undefined,
        dueTime: taskType === 'assignment' ? dueTime : undefined,
        time: taskType === 'calendar' ? time : undefined,
        thumbnail: 'red',
        taskSubtitle: taskType === 'calendar' ? courseCode : undefined,
      });
      onCreated();
      onClose();
    } catch (submitError: any) {
      setError(submitError.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
      <form onSubmit={submit} className="w-full max-w-lg rounded-xl p-6 space-y-4" style={{ backgroundColor: 'var(--dashboard-card-bg)', border: '1px solid var(--dashboard-border)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>Day Entries</h3>
          <button type="button" onClick={onClose} className="px-3 py-1 rounded-lg focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', color: 'var(--dashboard-text-primary)' }}>Close</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('existing')}
            className="rounded-lg py-2 font-medium focus:outline-none focus:ring-2"
            style={{ backgroundColor: activeTab === 'existing' ? 'var(--dashboard-info)' : 'var(--dashboard-hover)', color: activeTab === 'existing' ? '#fff' : 'var(--dashboard-text-primary)' }}
          >
            Existing Entries
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className="rounded-lg py-2 font-medium focus:outline-none focus:ring-2"
            style={{ backgroundColor: activeTab === 'new' ? 'var(--dashboard-info)' : 'var(--dashboard-hover)', color: activeTab === 'new' ? '#fff' : 'var(--dashboard-text-primary)' }}
          >
            New Entry
          </button>
        </div>
        {activeTab === 'existing' && (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {entriesForDay.length === 0 ? (
              <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: 'var(--dashboard-hover)', color: 'var(--dashboard-text-secondary)' }}>
                No entries for this day yet. Use the New Entry tab to add one.
              </div>
            ) : (
              entriesForDay.map((entry) => {
                const matchedCourse = courses.find((course) => course.courseCode === entry.courseCode || course.courseName === entry.courseName);
                return (
                  <div key={entry._id} className="rounded-lg p-4 space-y-3" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}>
                    <div>
                      <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {entry.courseCode || entry.courseName}
                      </p>
                      <p className="font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>{entry.taskTitle}</p>
                      <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {entry.taskType === 'assignment' ? `Assignment${entry.dueTime ? ` • Due ${entry.dueTime}` : ''}` : `Calendar event${entry.time ? ` • ${entry.time}` : ''}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/calendar?date=${eventDate}`);
                          onClose();
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2"
                        style={{ backgroundColor: 'var(--dashboard-info)', color: '#ffffff' }}
                      >
                        View in Calendar
                      </button>
                      {matchedCourse && (
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/courses/${matchedCourse._id}`);
                            onClose();
                          }}
                          className="px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2"
                          style={{ backgroundColor: 'var(--dashboard-card-bg)', color: 'var(--dashboard-text-primary)', border: '1px solid var(--dashboard-border)' }}
                        >
                          Go to Course
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        {activeTab === 'new' && (
          <>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setTaskType('assignment')} className="rounded-lg py-2 font-medium focus:outline-none focus:ring-2" style={{ backgroundColor: taskType === 'assignment' ? 'var(--dashboard-info)' : 'var(--dashboard-hover)', color: taskType === 'assignment' ? '#fff' : 'var(--dashboard-text-primary)' }}>Assignment</button>
          <button type="button" onClick={() => setTaskType('calendar')} className="rounded-lg py-2 font-medium focus:outline-none focus:ring-2" style={{ backgroundColor: taskType === 'calendar' ? 'var(--dashboard-info)' : 'var(--dashboard-hover)', color: taskType === 'calendar' ? '#fff' : 'var(--dashboard-text-primary)' }}>Calendar Event</button>
        </div>
        <label className="block">
          <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Date</span>
          <input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
          {fieldErrors.eventDate && <p className="mt-1 text-xs" style={{ color: 'var(--dashboard-accent-red)' }}>{fieldErrors.eventDate}</p>}
        </label>
        <label className="block">
          <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Course</span>
          <select
            value={`${courseCode}|||${courseName}`}
            onChange={(event) => {
              const [nextCode, nextName] = event.target.value.split('|||');
              setCourseCode(nextCode || '');
              setCourseName(nextName || '');
            }}
            className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }}
          >
            <option value="|||">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={`${course.courseCode}|||${course.courseName}`}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
          {fieldErrors.courseName && <p className="mt-1 text-xs" style={{ color: 'var(--dashboard-accent-red)' }}>{fieldErrors.courseName}</p>}
        </label>
        <label className="block">
          <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Title</span>
          <input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
          {fieldErrors.taskTitle && <p className="mt-1 text-xs" style={{ color: 'var(--dashboard-accent-red)' }}>{fieldErrors.taskTitle}</p>}
        </label>
        {taskType === 'assignment' ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Points</span>
              <input value={points} onChange={(event) => setPoints(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
              {fieldErrors.points && <p className="mt-1 text-xs" style={{ color: 'var(--dashboard-accent-red)' }}>{fieldErrors.points}</p>}
            </label>
            <label className="block">
              <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Due Time</span>
              <input value={dueTime} onChange={(event) => setDueTime(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
              {fieldErrors.dueTime && <p className="mt-1 text-xs" style={{ color: 'var(--dashboard-accent-red)' }}>{fieldErrors.dueTime}</p>}
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Time range</span>
            <input value={time} onChange={(event) => setTime(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
            {fieldErrors.time && <p className="mt-1 text-xs" style={{ color: 'var(--dashboard-accent-red)' }}>{fieldErrors.time}</p>}
          </label>
        )}
        {error && <p className="text-sm" style={{ color: 'var(--dashboard-accent-red)' }}>{error}</p>}
        <button type="submit" className="w-full min-h-[44px] rounded-lg font-semibold focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-info)', color: '#fff' }}>
          Save Entry
        </button>
          </>
        )}
      </form>
    </div>
  );
}
