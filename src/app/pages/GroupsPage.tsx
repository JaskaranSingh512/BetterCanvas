import { Users, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getGroups } from '../../lib/api';

export function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getGroups()
      .then((response) => setGroups(response.groups))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="px-8 py-8">{error}</div>;

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
