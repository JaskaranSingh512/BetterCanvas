import { HelpCircle, BookOpen, MessageSquare, FileText } from 'lucide-react';

const helpTopics = [
  { icon: BookOpen, title: 'Getting Started', description: 'Learn the basics of navigating your dashboard and courses', color: 'var(--dashboard-info)' },
  { icon: FileText, title: 'Submitting Assignments', description: 'How to upload and submit your coursework on time', color: 'var(--dashboard-success)' },
  { icon: MessageSquare, title: 'Messaging & Discussions', description: 'Communicate with instructors and classmates', color: 'var(--dashboard-warning)' },
  { icon: HelpCircle, title: 'Technical Support', description: 'Troubleshoot common issues and contact support', color: 'var(--dashboard-accent-red)' },
];

export function HelpPage() {
  return (
    <>
      <header className="px-8 py-6">
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          Help
        </h1>
        <p
          className="text-lg"
          style={{ color: 'var(--dashboard-text-secondary)' }}
        >
          Find answers and get support
        </p>
      </header>

      <div className="px-8 py-4">
        <div className="grid grid-cols-2 gap-5">
          {helpTopics.map((topic) => (
            <button
              key={topic.title}
              className="p-6 rounded-lg text-left transition-all focus:outline-none focus:ring-2 hover:shadow-md"
              style={{
                backgroundColor: 'var(--dashboard-card-bg)',
                border: `1px solid var(--dashboard-border)`
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: topic.color }}
              >
                <topic.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--dashboard-text-primary)' }}>
                {topic.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                {topic.description}
              </p>
            </button>
          ))}
        </div>

        {/* Contact */}
        <div
          className="mt-8 p-6 rounded-lg text-center"
          style={{
            backgroundColor: 'var(--dashboard-hover)',
            border: `1px solid var(--dashboard-border)`
          }}
        >
          <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--dashboard-text-primary)' }}>
            Still need help?
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--dashboard-text-secondary)' }}>
            Contact your institution's support team for personalized assistance.
          </p>
          <button
            className="px-6 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 min-h-[44px]"
            style={{
              backgroundColor: 'var(--dashboard-info)',
              color: '#ffffff'
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </>
  );
}
