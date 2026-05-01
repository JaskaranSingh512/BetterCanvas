import { User, Mail, BookOpen, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { getAccount, patchAccount } from '../../lib/api';

const PROFILE_PHOTO_KEY = 'bettercanvas_profile_photo';

export function AccountPage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  const load = () =>
    getAccount()
      .then((response) => setProfile(response.profile))
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const toggleSetting = async (setting: string) => {
    if (!profile) return;
    const exists = profile.settings.includes(setting);
    const settings = exists
      ? profile.settings.filter((item: string) => item !== setting)
      : [...profile.settings, setting];
    await patchAccount(settings);
    await load();
  };

  if (error) return <div className="px-8 py-8">{error}</div>;
  if (!profile) return <div className="px-8 py-8">Loading account...</div>;

  const onProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextPhoto = typeof reader.result === 'string' ? reader.result : '';
      if (!nextPhoto) return;
      setProfilePhoto(nextPhoto);
      localStorage.setItem(PROFILE_PHOTO_KEY, nextPhoto);
      window.dispatchEvent(new Event('bettercanvas-profile-photo-updated'));
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = '';
  };

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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2"
              style={{ backgroundColor: profilePhoto ? 'var(--dashboard-card-bg)' : 'var(--dashboard-info)' }}
              aria-label="Upload profile picture"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </button>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
                {profile.name}
              </h2>
              <p className="text-base" style={{ color: 'var(--dashboard-text-secondary)' }}>
                {profile.email}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm font-medium underline-offset-2 hover:underline focus:outline-none focus:ring-2 rounded"
                style={{ color: 'var(--dashboard-info)' }}
              >
                {profilePhoto ? 'Change profile picture' : 'Add profile picture'}
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onProfilePhotoChange}
          />

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: BookOpen, label: 'Enrolled Courses', value: String(profile.enrolledCourses) },
              { icon: Mail, label: 'Unread Messages', value: String(profile.unreadMessages) },
              { icon: Shield, label: 'Account Status', value: profile.accountStatus },
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
                  backgroundColor: profile.settings.includes(setting) ? 'var(--dashboard-info)' : 'var(--dashboard-card-bg)',
                  color: profile.settings.includes(setting) ? '#ffffff' : 'var(--dashboard-text-primary)'
                }}
                onClick={() => toggleSetting(setting)}
              >
                <span>{setting}</span>
                <span style={{ color: profile.settings.includes(setting) ? '#ffffff' : 'var(--dashboard-text-secondary)' }}>
                  {profile.settings.includes(setting) ? 'Enabled' : '→'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
