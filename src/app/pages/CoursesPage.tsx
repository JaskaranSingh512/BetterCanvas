import { CourseCard } from '../components/CourseCard';

export function CoursesPage() {
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
          4 enrolled courses
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
              Spring 2026
            </h2>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
            <CourseCard
              courseName="Applied Modern Algebra"
              courseCode="PHSC 114"
              thumbnail="red"
              announcements={2}
              discussions={3}
              files={5}
              latestAnnouncement={{
                title: "HW 04 Now Available",
                preview: "The fourth homework assignment covering chapters 5-6 is now available. Due date is February 25 at 11:59 PM.",
                date: "Feb 15, 2026"
              }}
            />
            <CourseCard
              courseName="Computer Science Foundations"
              courseCode="C S-4063-001"
              thumbnail="green"
              announcements={1}
              discussions={5}
              files={8}
              latestAnnouncement={{
                title: "Exam Schedule Posted",
                preview: "The midterm exam will be held on March 1st in the main auditorium. Review sessions start next week.",
                date: "Feb 14, 2026"
              }}
            />
            <CourseCard
              courseName="Data Structures & Algorithms"
              courseCode="CS-3345-002"
              thumbnail="blue"
              announcements={3}
              discussions={2}
              files={12}
              latestAnnouncement={{
                title: "New Resources Available",
                preview: "Practice problems for binary trees and sorting algorithms have been uploaded to the Files section.",
                date: "Feb 13, 2026"
              }}
            />
            <CourseCard
              courseName="Database Management Systems"
              courseCode="CS-4347-001"
              thumbnail="purple"
              announcements={0}
              discussions={1}
              files={6}
            />
          </div>
        </section>
      </div>
    </>
  );
}
