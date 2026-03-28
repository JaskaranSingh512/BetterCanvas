import { User, Mail, BookOpen, Shield } from 'lucide-react';

export function AccountPage() {
  return (
    <>
      <header className="px-8 py-6">
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          Account
        </h1>
        <p
          className="text-lg"
          style={{ color: 'var(--dashboard-text-secondary)' }}
        >
          Manage your profile and settings
        </p>
      </header>

      <div className="px-8 py-4 space-y-6">
        {/* Profile Card */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--dashboard-hover)',
            border: `1px solid var(--dashboard-border)`
          }}
        >
          <div className="flex items-center gap-5 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--dashboard-info)' }}
            >
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
                Student User
              </h2>
              <p className="text-base" style={{ color: 'var(--dashboard-text-secondary)' }}>
                student@university.edu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: BookOpen, label: 'Enrolled Courses', value: '4' },
              { icon: Mail, label: 'Unread Messages', value: '2' },
              { icon: Shield, label: 'Account Status', value: 'Active' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--dashboard-card-bg)' }}
              >
                <item.icon className="w-5 h-5 mb-2" style={{ color: 'var(--dashboard-info)' }} />
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                  {item.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--dashboard-hover)',
            border: `1px solid var(--dashboard-border)`
          }}
        >
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--dashboard-text-primary)' }}>
            Settings
          </h3>
          <div className="space-y-3">
            {['Notification Preferences', 'Display Settings', 'Privacy & Security', 'Language & Region'].map((setting) => (
              <button
                key={setting}
                className="w-full flex items-center justify-between p-4 rounded-lg text-left transition-all focus:outline-none focus:ring-2 hover:shadow-sm"
                style={{
                  backgroundColor: 'var(--dashboard-card-bg)',
                  color: 'var(--dashboard-text-primary)'
                }}
              >
                <span>{setting}</span>
                <span style={{ color: 'var(--dashboard-text-secondary)' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
