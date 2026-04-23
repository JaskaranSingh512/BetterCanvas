import { CourseCard } from '../components/CourseCard';
import { useEffect, useState } from 'react';
import { getCourses, setFocusedCourse } from '../../lib/api';

export function CoursesPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const load = () => {
    getCourses()
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <div className="px-8 py-8">{error}</div>;
  if (!data) return <div className="px-8 py-8">Loading courses...</div>;

  return (
    <>
      <header className="px-8 py-6">
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          Courses
        </h1>
        <p
          className="text-lg"
          style={{ color: 'var(--dashboard-text-secondary)' }}
        >
          {data.courses.length} enrolled courses
        </p>
      </header>

      <div className="px-8 py-4">
        <section aria-labelledby="spring-2026-heading">
          <div
            className="flex items-center justify-between mb-6 pb-4"
            style={{ borderBottom: `3px solid var(--dashboard-border)` }}
          >
            <h2
              id="spring-2026-heading"
              className="text-3xl font-bold"
              style={{ color: 'var(--dashboard-text-primary)' }}
            >
              {data.term}
            </h2>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
            {data.courses.map((course: any) => (
              <CourseCard
                key={course._id}
                {...course}
                id={course._id}
                onSetFocused={async (id) => {
                  if (!id) return;
                  await setFocusedCourse(id);
                  await load();
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
