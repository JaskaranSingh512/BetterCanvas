import { MessageSquare, Bell, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CourseCardProps {
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
}

export function CourseCard({
  courseName,
  courseCode,
  thumbnail,
  announcements = 0,
  discussions = 0,
  files = 0,
  latestAnnouncement
}: CourseCardProps) {
  const [showAnnouncementPreview, setShowAnnouncementPreview] = useState(false);
  const [showDiscussionPreview, setShowDiscussionPreview] = useState(false);
  const [showFilesPreview, setShowFilesPreview] = useState(false);

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
      className="rounded-lg overflow-hidden transition-all shadow-sm"
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
      {/* Thumbnail */}
      <div 
        className="h-32 relative"
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
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 
          className="font-semibold text-base mb-4 line-clamp-2 min-h-[3rem]"
          style={{ color: 'var(--dashboard-text-primary)' }}
        >
          {courseName}
        </h3>

        {/* Action Icons */}
        <div className="flex gap-2">
          {/* Announcements */}
          <div className="relative flex-1">
            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: announcements > 0 ? 'var(--dashboard-warning)' : 'var(--dashboard-hover)',
                color: announcements > 0 ? '#ffffff' : 'var(--dashboard-text-secondary)'
              }}
              onMouseEnter={() => announcements > 0 && setShowAnnouncementPreview(true)}
              onMouseLeave={() => setShowAnnouncementPreview(false)}
              aria-label={`${announcements} announcement${announcements !== 1 ? 's' : ''}`}
            >
              <Bell className="w-5 h-5" />
              {announcements > 0 && <span className="font-semibold">{announcements}</span>}
            </button>

            {/* Announcement Preview Tooltip */}
            {showAnnouncementPreview && latestAnnouncement && (
              <div 
                className="absolute left-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50 overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--dashboard-card-bg)',
                  border: `1px solid var(--dashboard-border)`
                }}
                role="tooltip"
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
                  <h4 
                    className="font-semibold text-sm mb-2"
                    style={{ color: 'var(--dashboard-text-primary)' }}
                  >
                    {latestAnnouncement.title}
                  </h4>
                  <p 
                    className="text-sm mb-2 line-clamp-2"
                    style={{ color: 'var(--dashboard-text-secondary)' }}
                  >
                    {latestAnnouncement.preview}
                  </p>
                  <div 
                    className="text-xs flex items-center justify-between"
                    style={{ color: 'var(--dashboard-text-secondary)' }}
                  >
                    <span>{latestAnnouncement.date}</span>
                    <span 
                      className="flex items-center gap-1 font-medium"
                      style={{ color: 'var(--dashboard-info)' }}
                    >
                      View all
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Discussions */}
          <div className="relative flex-1">
            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: discussions > 0 ? 'var(--dashboard-info)' : 'var(--dashboard-hover)',
                color: discussions > 0 ? '#ffffff' : 'var(--dashboard-text-secondary)'
              }}
              onMouseEnter={() => discussions > 0 && setShowDiscussionPreview(true)}
              onMouseLeave={() => setShowDiscussionPreview(false)}
              aria-label={`${discussions} discussion${discussions !== 1 ? 's' : ''}`}
            >
              <MessageSquare className="w-5 h-5" />
              {discussions > 0 && <span className="font-semibold">{discussions}</span>}
            </button>

            {/* Discussion Preview Tooltip */}
            {showDiscussionPreview && (
              <div 
                className="absolute left-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50 overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--dashboard-card-bg)',
                  border: `1px solid var(--dashboard-border)`
                }}
                role="tooltip"
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
                    <div>
                      <h4 
                        className="font-semibold text-sm mb-1"
                        style={{ color: 'var(--dashboard-text-primary)' }}
                      >
                        Week 3 Study Group
                      </h4>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--dashboard-text-secondary)' }}
                      >
                        3 new replies
                      </p>
                    </div>
                  </div>
                  <div 
                    className="text-xs mt-3 flex items-center justify-end gap-1 font-medium"
                    style={{ color: 'var(--dashboard-info)' }}
                  >
                    View all
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Files */}
          <div className="relative flex-1">
            <button
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: files > 0 ? 'var(--dashboard-success)' : 'var(--dashboard-hover)',
                color: files > 0 ? '#ffffff' : 'var(--dashboard-text-secondary)'
              }}
              onMouseEnter={() => files > 0 && setShowFilesPreview(true)}
              onMouseLeave={() => setShowFilesPreview(false)}
              aria-label={`${files} file${files !== 1 ? 's' : ''}`}
            >
              <FileText className="w-5 h-5" />
              {files > 0 && <span className="font-semibold">{files}</span>}
            </button>

            {/* Files Preview Tooltip */}
            {showFilesPreview && (
              <div 
                className="absolute left-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50 overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--dashboard-card-bg)',
                  border: `1px solid var(--dashboard-border)`
                }}
                role="tooltip"
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
                    <div className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>
                      Lecture_Notes_Week3.pdf
                    </div>
                    <div className="text-sm" style={{ color: 'var(--dashboard-text-primary)' }}>
                      Assignment_Rubric.docx
                    </div>
                  </div>
                  <div 
                    className="text-xs mt-3 flex items-center justify-end gap-1 font-medium"
                    style={{ color: 'var(--dashboard-success)' }}
                  >
                    View all
                    <ChevronRight className="w-3 h-3" />
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
