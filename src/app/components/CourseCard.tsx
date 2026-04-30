import { MessageSquare, Bell, FileText, ChevronRight, Pin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface CourseCardProps {
  id?: string;
  courseName: string;
  courseCode: string;
  thumbnail: 'red' | 'green' | 'blue' | 'purple';
  announcements?: number;
  discussions?: number;
  files?: number;
  latestAnnouncement?: {
    title: string;
    preview: string;
    date: string;
  };
  announcementFeed?: Array<{
    title: string;
    preview: string;
    date: string;
  }>;
  discussionThreads?: Array<{
    title: string;
    replies: number;
    updatedAtLabel: string;
  }>;
  recentFiles?: Array<{
    name: string;
    uploadedAtLabel: string;
  }>;
  focused?: boolean;
  onSetFocused?: (id?: string) => void;
}

export function CourseCard({
  id,
  courseName,
  courseCode,
  thumbnail,
  announcements = 0,
  discussions = 0,
  files = 0,
  latestAnnouncement,
  announcementFeed = [],
  discussionThreads = [],
  recentFiles = [],
  focused = false,
  onSetFocused
}: CourseCardProps) {
  const navigate = useNavigate();
  const [showAnnouncementPreview, setShowAnnouncementPreview] = useState(false);
  const [showDiscussionPreview, setShowDiscussionPreview] = useState(false);
  const [showFilesPreview, setShowFilesPreview] = useState(false);
  const goCourse = (tab?: string) => {
    if (!id) return;
    navigate(tab ? `/courses/${id}?tab=${tab}` : `/courses/${id}`);
  };

  const getBgColor = () => {
    switch (thumbnail) {
      case 'red': return 'var(--dashboard-accent-red)';
      case 'green': return 'var(--dashboard-accent-green)';
      case 'blue': return 'var(--dashboard-info)';
      case 'purple': return '#8b5cf6';
      default: return 'var(--dashboard-accent-red)';
    }
  };

  return (
    <article 
      className="rounded-lg overflow-visible transition-all shadow-sm"
      style={{ 
        backgroundColor: 'var(--dashboard-card-bg)',
        border: `1px solid var(--dashboard-border)`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail (clip rounded corners only here so popovers below are not clipped) */}
      <div 
        className="h-32 relative rounded-t-lg overflow-hidden"
        style={{ backgroundColor: getBgColor() }}
        role="img"
        aria-label={`${courseName} course thumbnail`}
      >
        <div 
          className="absolute top-3 left-3 px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm"
          style={{ 
            backgroundColor: '#ffffff',
            color: 'var(--dashboard-text-primary)'
          }}
        >
          {courseCode}
        </div>
        <button
          onClick={() => onSetFocused?.(id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-md flex items-center justify-center focus:outline-none focus:ring-2"
          style={{ backgroundColor: focused ? 'var(--dashboard-warning)' : 'rgba(255,255,255,0.8)', color: focused ? '#ffffff' : 'var(--dashboard-text-primary)' }}
          aria-label="Set as focused course"
        >
          <Pin className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => goCourse()}
          className="w-full text-left font-semibold text-base mb-2 line-clamp-2 min-h-[3rem] rounded-lg px-1 py-1 -mx-1 focus:outline-none focus:ring-2"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          {courseName}
        </button>
        <button
          type="button"
          onClick={() => goCourse()}
          className="text-xs font-medium mb-4 underline-offset-2 hover:underline focus:outline-none focus:ring-2 rounded"
          style={{ color: 'var(--dashboard-info)' }}
        >
          View course
        </button>

        {/* Action Icons */}
        <div className="flex gap-2">
          {/* Announcements — hover zone wraps trigger + panel so the gap is not a dead zone */}
          <div
            className="relative flex-1"
            onMouseEnter={() => announcements > 0 && (latestAnnouncement || announcementFeed.length > 0) && setShowAnnouncementPreview(true)}
            onMouseLeave={() => setShowAnnouncementPreview(false)}
          >
            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: announcements > 0 ? 'var(--dashboard-warning)' : 'var(--dashboard-hover)',
                color: announcements > 0 ? '#ffffff' : 'var(--dashboard-text-secondary)'
              }}
              onClick={() => goCourse('announcements')}
              aria-label={`${announcements} announcement${announcements !== 1 ? 's' : ''}`}
            >
              <Bell className="w-5 h-5" />
              {announcements > 0 && <span className="font-semibold">{announcements}</span>}
            </button>

            {/* Announcement Preview Tooltip — pt-2 bridges button→panel (no mt gap that loses hover) */}
            {(showAnnouncementPreview) && (latestAnnouncement || announcementFeed.length > 0) && (
              <div 
                className="absolute left-0 top-full z-[60] w-80 pt-2"
                role="tooltip"
              >
              <div
                className="rounded-lg shadow-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--dashboard-card-bg)',
                  border: `1px solid var(--dashboard-border)`
                }}
              >
                <div 
                  className="px-4 py-3"
                  style={{ 
                    backgroundColor: 'var(--dashboard-warning)',
                    color: '#ffffff'
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4" />
                    <span className="font-semibold text-sm">Latest Announcement</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {(announcementFeed.length > 0 ? announcementFeed : latestAnnouncement ? [latestAnnouncement] : []).map((item, idx) => (
                      <div key={`${item.title}-${idx}`} className="pb-2" style={{ borderBottom: idx < (announcementFeed.length > 0 ? announcementFeed : [latestAnnouncement]).length - 1 ? '1px solid var(--dashboard-border)' : 'none' }}>
                        <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                          {item.title}
                        </h4>
                        <p className="text-sm mb-1 line-clamp-2" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          {item.preview}
                        </p>
                        <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>{item.date}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goCourse('announcements')}
                    className="text-xs mt-3 w-full flex items-center justify-end gap-1 font-medium focus:outline-none focus:ring-2 rounded"
                    style={{ color: 'var(--dashboard-info)' }}
                  >
                    <span>{announcements} total</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Discussions */}
          <div
            className="relative flex-1"
            onMouseEnter={() => discussions > 0 && setShowDiscussionPreview(true)}
            onMouseLeave={() => setShowDiscussionPreview(false)}
          >
            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: discussions > 0 ? 'var(--dashboard-info)' : 'var(--dashboard-hover)',
                color: discussions > 0 ? '#ffffff' : 'var(--dashboard-text-secondary)'
              }}
              onClick={() => goCourse('discussions')}
              aria-label={`${discussions} discussion${discussions !== 1 ? 's' : ''}`}
            >
              <MessageSquare className="w-5 h-5" />
              {discussions > 0 && <span className="font-semibold">{discussions}</span>}
            </button>

            {/* Discussion Preview Tooltip */}
            {(showDiscussionPreview) && (
              <div 
                className="absolute left-0 top-full z-[60] w-80 pt-2"
                role="tooltip"
              >
              <div
                className="rounded-lg shadow-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--dashboard-card-bg)',
                  border: `1px solid var(--dashboard-border)`
                }}
              >
                <div 
                  className="px-4 py-3"
                  style={{ 
                    backgroundColor: 'var(--dashboard-info)',
                    color: '#ffffff'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold text-sm">Recent Discussions</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {(discussionThreads.length > 0 ? discussionThreads : [{ title: 'No active discussions yet', replies: 0, updatedAtLabel: 'Just now' }]).map((thread, idx) => (
                      <div key={`${thread.title}-${idx}`}>
                        <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--dashboard-text-primary)' }}>
                          {thread.title}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--dashboard-text-secondary)' }}>
                          {thread.replies} replies - {thread.updatedAtLabel}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goCourse('discussions')}
                    className="text-xs mt-3 w-full flex items-center justify-end gap-1 font-medium focus:outline-none focus:ring-2 rounded"
                    style={{ color: 'var(--dashboard-info)' }}
                  >
                    View all
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Files */}
          <div
            className="relative flex-1"
            onMouseEnter={() => files > 0 && setShowFilesPreview(true)}
            onMouseLeave={() => setShowFilesPreview(false)}
          >
            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: files > 0 ? 'var(--dashboard-success)' : 'var(--dashboard-hover)',
                color: files > 0 ? '#ffffff' : 'var(--dashboard-text-secondary)'
              }}
              onClick={() => goCourse('files')}
              aria-label={`${files} file${files !== 1 ? 's' : ''}`}
            >
              <FileText className="w-5 h-5" />
              {files > 0 && <span className="font-semibold">{files}</span>}
            </button>

            {/* Files Preview Tooltip */}
            {(showFilesPreview) && (
              <div 
                className="absolute left-0 top-full z-[60] w-80 pt-2"
                role="tooltip"
              >
              <div
                className="rounded-lg shadow-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--dashboard-card-bg)',
                  border: `1px solid var(--dashboard-border)`
                }}
              >
                <div 
                  className="px-4 py-3"
                  style={{ 
                    backgroundColor: 'var(--dashboard-success)',
                    color: '#ffffff'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-semibold text-sm">Recent Files</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {(recentFiles.length > 0 ? recentFiles : [{ name: 'No files uploaded yet', uploadedAtLabel: 'Recently' }]).map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>
                        {file.name}
                        <div className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>{file.uploadedAtLabel}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goCourse('files')}
                    className="text-xs mt-3 w-full flex items-center justify-end gap-1 font-medium focus:outline-none focus:ring-2 rounded"
                    style={{ color: 'var(--dashboard-success)' }}
                  >
                    View all
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
