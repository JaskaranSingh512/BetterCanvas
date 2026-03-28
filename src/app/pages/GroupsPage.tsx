import { Users, MessageSquare } from 'lucide-react';

const groups = [
  { name: 'Algebra Study Group', members: 8, course: 'PHSC 114', lastActive: '2 hours ago', color: 'var(--dashboard-accent-red)' },
  { name: 'CS Foundations Lab Team', members: 4, course: 'C S-4063-001', lastActive: '5 hours ago', color: 'var(--dashboard-accent-green)' },
  { name: 'Data Structures Review', members: 12, course: 'CS-3345-002', lastActive: '1 day ago', color: 'var(--dashboard-info)' },
  { name: 'Database Project Team', members: 3, course: 'CS-4347-001', lastActive: '3 days ago', color: '#8b5cf6' },
];

export function GroupsPage() {
  return (
    <>
      <header className="px-8 py-6">
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          Groups
        </h1>
        <p
          className="text-lg"
          style={{ color: 'var(--dashboard-text-secondary)' }}
        >
          {groups.length} active groups
        </p>
      </header>

      <div className="px-8 py-4 space-y-4">
        {groups.map((group) => (
          <button
            key={group.name}
            className="w-full flex items-center gap-5 p-5 rounded-lg text-left transition-all focus:outline-none focus:ring-2 hover:shadow-md"
            style={{
              backgroundColor: 'var(--dashboard-card-bg)',
              border: `1px solid var(--dashboard-border)`
            }}
          >
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: group.color }}
            >
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                {group.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                {group.course} • {group.members} members
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                <MessageSquare className="w-4 h-4" />
                <span>Active {group.lastActive}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
