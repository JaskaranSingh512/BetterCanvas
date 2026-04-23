import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { createTask, getCourses } from '../../lib/api';

interface CreateEntryModalProps {
  isOpen: boolean;
  initialDate?: string;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateEntryModal({ isOpen, initialDate, onClose, onCreated }: CreateEntryModalProps) {
  const [taskType, setTaskType] = useState<'assignment' | 'calendar'>('assignment');
  const [eventDate, setEventDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [points, setPoints] = useState('10');
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [time, setTime] = useState('9:00 AM to 9:50 AM');
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      getCourses().then((data) => setCourses(data.courses || [])).catch(() => setCourses([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialDate) {
      setEventDate(initialDate);
    }
  }, [initialDate]);

  if (!isOpen) {
    return null;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
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
          <h3 className="text-xl font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>Create new entry</h3>
          <button type="button" onClick={onClose} className="px-3 py-1 rounded-lg focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', color: 'var(--dashboard-text-primary)' }}>Close</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setTaskType('assignment')} className="rounded-lg py-2 font-medium focus:outline-none focus:ring-2" style={{ backgroundColor: taskType === 'assignment' ? 'var(--dashboard-info)' : 'var(--dashboard-hover)', color: taskType === 'assignment' ? '#fff' : 'var(--dashboard-text-primary)' }}>Assignment</button>
          <button type="button" onClick={() => setTaskType('calendar')} className="rounded-lg py-2 font-medium focus:outline-none focus:ring-2" style={{ backgroundColor: taskType === 'calendar' ? 'var(--dashboard-info)' : 'var(--dashboard-hover)', color: taskType === 'calendar' ? '#fff' : 'var(--dashboard-text-primary)' }}>Calendar Event</button>
        </div>
        <label className="block">
          <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Date</span>
          <input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
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
        </label>
        <label className="block">
          <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Title</span>
          <input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
        </label>
        {taskType === 'assignment' ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Points</span>
              <input value={points} onChange={(event) => setPoints(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
            </label>
            <label className="block">
              <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Due Time</span>
              <input value={dueTime} onChange={(event) => setDueTime(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>Time range</span>
            <input value={time} onChange={(event) => setTime(event.target.value)} className="mt-1 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)', color: 'var(--dashboard-text-primary)' }} />
          </label>
        )}
        {error && <p className="text-sm" style={{ color: 'var(--dashboard-accent-red)' }}>{error}</p>}
        <button type="submit" className="w-full min-h-[44px] rounded-lg font-semibold focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--dashboard-info)', color: '#fff' }}>
          Save Entry
        </button>
      </form>
    </div>
  );
}
