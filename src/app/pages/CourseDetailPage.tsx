import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, Bell, FileText, MessageSquare, TrendingUp, GraduationCap } from 'lucide-react';
import { getCourse } from '../../lib/api';

type TabId = 'overview' | 'announcements' | 'discussions' | 'files' | 'grades';

function thumbnailColor(thumbnail: string) {
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

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const tabFromUrl = useMemo((): TabId => {
    const t = searchParams.get('tab');
    if (t === 'announcements' || t === 'discussions' || t === 'files' || t === 'grades') return t;
    return 'overview';
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<TabId>(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getCourse(courseId)
      .then((data) => setCourse(data.course))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  const setTab = (tab: TabId) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    if (tab === 'overview') {
      next.delete('tab');
    } else {
      next.set('tab', tab);
    }
    setSearchParams(next, { replace: true });
  };

  if (loading) {
    return <div className="px-8 py-8">Loading course...</div>;
  }
  if (error || !course) {
    return (
      <div className="px-8 py-8 space-y-4">
        <p style={{ color: 'var(--dashboard-accent-red)' }}>{error || 'Course not found.'}</p>
        <Link to="/courses" className="inline-flex items-center gap-2 font-medium focus:outline-none focus:ring-2 rounded" style={{ color: 'var(--dashboard-info)' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
      </div>
    );
  }

  const announcements =
    course.announcementFeed?.length > 0
      ? course.announcementFeed
      : course.latestAnnouncement
        ? [course.latestAnnouncement]
        : [];

  const tabs: { id: TabId; label: string; icon: typeof Bell }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'grades', label: 'Grades', icon: GraduationCap },
  ];

  const gradebookEntries =
    course.gradebookEntries?.length > 0
      ? course.gradebookEntries
      : [
          { title: 'In-Class Activities 21', group: 'Assignments', dueLabel: 'Apr 21 by 1:30pm', scoreLabel: '1 / 1' },
          { title: 'Code Review', group: 'Term Project', dueLabel: 'Apr 30 by 11:59pm', scoreLabel: '- / 10' },
          { title: 'Project Deliverable', group: 'Term Project', dueLabel: 'Apr 30 by 11:59pm', scoreLabel: '- / 20' },
          { title: 'Project Presentation', group: 'Term Project', dueLabel: 'May 6 by 11:59pm', scoreLabel: '- / 10' },
          { title: 'Term Project Report', group: 'Term Project', dueLabel: 'May 6 by 11:59pm', scoreLabel: '- / 20' },
          { title: 'Final Exam', group: 'Exams', dueLabel: 'May 12 by 11:59pm', scoreLabel: '- / 0' },
        ];

  const gradeGroups =
    course.gradeGroups?.length > 0
      ? course.gradeGroups
      : [
          { name: 'Assignments', percentLabel: '81.73%', pointsLabel: '85.00 / 104.00' },
          { name: 'Term Project', percentLabel: '98.39%', pointsLabel: '30.50 / 31.00' },
          { name: 'Group Discussion', percentLabel: '100%', pointsLabel: '80.00 / 80.00' },
          { name: 'Exams', percentLabel: '90%', pointsLabel: '54.00 / 60.00' },
          { name: 'Imported Assignments', percentLabel: 'N/A', pointsLabel: '0.00 / 0.00' },
        ];

  const totalPointsLabel =
    course.totalPointsLabel ||
    `${Math.max(0, Math.round(((course.gradePercent ?? 0) / 100) * 27500) / 100).toFixed(2)} / 275.00`;

  return (
    <>
      <header className="px-8 py-6">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium mb-4 focus:outline-none focus:ring-2 rounded"
          style={{ color: 'var(--dashboard-info)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--dashboard-text-primary)' }}>
              {course.courseName}
            </h1>
            <p className="text-lg" style={{ color: 'var(--dashboard-text-secondary)' }}>
              {course.courseCode} · {course.term}
            </p>
          </div>
          <div
            className="h-20 w-full max-w-md rounded-lg shrink-0 md:w-72"
            style={{ backgroundColor: thumbnailColor(course.thumbnail) }}
            role="img"
            aria-hidden
          />
        </div>
      </header>

      <div className="px-8 pb-10">
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Course sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: activeTab === id ? 'var(--dashboard-info)' : 'var(--dashboard-hover)',
                color: activeTab === id ? '#ffffff' : 'var(--dashboard-text-primary)',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {activeTab === 'overview' && (
          <section className="grid gap-6 md:grid-cols-2">
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--dashboard-text-primary)' }}>
                Grades & progress
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8" style={{ color: 'var(--dashboard-success)' }} />
                <div>
                  <div className="text-3xl font-bold" style={{ color: 'var(--dashboard-success)' }}>
                    {course.gradePercent ?? 0}%
                  </div>
                  <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Current grade
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: '1px solid var(--dashboard-border)' }}>
                <div>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                    {course.assignmentsDue ?? 0}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Assignments due
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                    {course.upcomingEvents ?? 0}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Upcoming events
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                    {course.nextExamIn || '—'}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    Next exam
                  </div>
                </div>
              </div>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--dashboard-text-primary)' }}>
                Activity summary
              </h2>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                <li>{course.announcements ?? 0} announcements</li>
                <li>{course.discussions ?? 0} discussion topics</li>
                <li>{course.files ?? 0} files in this course</li>
                {course.focused && <li style={{ color: 'var(--dashboard-warning)' }}>Pinned as a focused course</li>}
              </ul>
            </div>
          </section>
        )}

        {activeTab === 'announcements' && (
          <section
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--dashboard-text-primary)' }}>
              <Bell className="w-5 h-5" style={{ color: 'var(--dashboard-warning)' }} />
              Announcements
            </h2>
            {announcements.length === 0 ? (
              <p style={{ color: 'var(--dashboard-text-secondary)' }}>No announcements yet.</p>
            ) : (
              <ul className="space-y-4">
                {announcements.map((item: any, idx: number) => (
                  <li
                    key={`${item.title}-${idx}`}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--dashboard-card-bg)', border: '1px solid var(--dashboard-border)' }}
                  >
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      {item.preview}
                    </p>
                    <span className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      {item.date}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'discussions' && (
          <section
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--dashboard-text-primary)' }}>
              <MessageSquare className="w-5 h-5" style={{ color: 'var(--dashboard-info)' }} />
              Discussions
            </h2>
            {!course.discussionThreads?.length ? (
              <p style={{ color: 'var(--dashboard-text-secondary)' }}>No discussions yet.</p>
            ) : (
              <ul className="space-y-3">
                {course.discussionThreads.map((thread: any, idx: number) => (
                  <li
                    key={`${thread.title}-${idx}`}
                    className="p-4 rounded-lg flex justify-between gap-4 items-start"
                    style={{ backgroundColor: 'var(--dashboard-card-bg)', border: '1px solid var(--dashboard-border)' }}
                  >
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>
                        {thread.title}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: 'var(--dashboard-text-secondary)' }}>
                        {thread.replies} replies · updated {thread.updatedAtLabel}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'files' && (
          <section
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--dashboard-text-primary)' }}>
              <FileText className="w-5 h-5" style={{ color: 'var(--dashboard-success)' }} />
              Files
            </h2>
            {!course.recentFiles?.length ? (
              <p style={{ color: 'var(--dashboard-text-secondary)' }}>No files listed yet.</p>
            ) : (
              <ul className="space-y-2">
                {course.recentFiles.map((file: any, idx: number) => (
                  <li
                    key={`${file.name}-${idx}`}
                    className="p-4 rounded-lg flex justify-between items-center"
                    style={{ backgroundColor: 'var(--dashboard-card-bg)', border: '1px solid var(--dashboard-border)' }}
                  >
                    <span className="font-medium" style={{ color: 'var(--dashboard-text-primary)' }}>
                      {file.name}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      {file.uploadedAtLabel}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'grades' && (
          <section
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: 'var(--dashboard-hover)', border: '1px solid var(--dashboard-border)' }}
          >
            <div
              className="grid grid-cols-[1.4fr,1fr,140px] px-5 py-3 text-xs font-semibold uppercase tracking-wide"
              style={{
                color: 'var(--dashboard-text-secondary)',
                backgroundColor: 'var(--dashboard-card-bg)',
                borderBottom: '1px solid var(--dashboard-border)',
              }}
            >
              <span>Assignment</span>
              <span>Due</span>
              <span className="text-right">Score</span>
            </div>

            <div>
              {gradebookEntries.map((entry: any, idx: number) => (
                <div
                  key={`${entry.title}-${idx}`}
                  className="grid grid-cols-[1.4fr,1fr,140px] gap-3 px-5 py-3 items-center"
                  style={{ borderBottom: '1px solid var(--dashboard-border)' }}
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate" style={{ color: 'var(--dashboard-info)' }}>
                      {entry.title}
                    </p>
                    <p className="text-sm truncate" style={{ color: 'var(--dashboard-text-secondary)' }}>
                      {entry.group}
                    </p>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    {entry.dueLabel}
                  </p>
                  <p className="text-right font-medium" style={{ color: 'var(--dashboard-text-primary)' }}>
                    {entry.scoreLabel}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              {gradeGroups.map((group: any, idx: number) => (
                <div
                  key={`${group.name}-${idx}`}
                  className="grid grid-cols-[1fr,140px,180px] gap-4 px-5 py-3 items-center"
                  style={{ borderTop: '1px solid var(--dashboard-border)' }}
                >
                  <p className="font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>
                    {group.name}
                  </p>
                  <p className="text-right font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>
                    {group.percentLabel}
                  </p>
                  <p className="text-right font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                    {group.pointsLabel}
                  </p>
                </div>
              ))}
              <div
                className="grid grid-cols-[1fr,140px,180px] gap-4 px-5 py-4 items-center"
                style={{
                  borderTop: '1px solid var(--dashboard-border)',
                  backgroundColor: 'var(--dashboard-card-bg)',
                }}
              >
                <p className="text-3xl font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>
                  Total
                </p>
                <p className="text-4xl text-right font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
                  {course.gradePercent ?? 0}%
                </p>
                <p className="text-2xl text-right font-semibold" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  {totalPointsLabel}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
