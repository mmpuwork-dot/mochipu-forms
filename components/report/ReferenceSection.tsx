import type { CSSProperties } from 'react';
import type { Json } from '@/lib/supabase/types';

interface FileRef {
  id?: string;
  name: string;
  url: string;
  size?: number;
}

interface Props {
  files?: Json;
  cloudUrl?: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectFileEmoji(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return '🖼';
  if (['mp4', 'mov', 'webm', 'avi'].includes(ext)) return '🎬';
  if (ext === 'psd' || ext === 'psb') return '🎨';
  if (ext === 'pdf') return '📄';
  if (['zip', 'rar', '7z'].includes(ext)) return '🗜';
  return '📎';
}

function detectPlatform(url: string): { emoji: string; name: string } {
  if (url.includes('drive.google.com')) return { emoji: '📁', name: 'Google Drive' };
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { emoji: '▶', name: 'YouTube' };
  if (url.includes('dropbox.com')) return { emoji: '📦', name: 'Dropbox' };
  if (url.includes('vimeo.com')) return { emoji: '🎬', name: 'Vimeo' };
  if (url.includes('mega.nz')) return { emoji: '☁', name: 'MEGA' };
  return { emoji: '🔗', name: 'External link' };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function shortenUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

// ── Shared label style ────────────────────────────────────────────────────────

const labelStyle: CSSProperties = {
  fontSize: '11px',
  color: '#6B5FA0',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  fontWeight: 500,
  margin: '0 0 6px',
};

// ── Sub-components ────────────────────────────────────────────────────────────

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

function isImageFile(filename: string): boolean {
  return IMAGE_EXTS.includes(filename.split('.').pop()?.toLowerCase() ?? '');
}

function FileThumb({ file }: { file: FileRef }) {
  const displayName = file.name.length > 14 ? file.name.slice(0, 12) + '…' : file.name;
  const isImage = isImageFile(file.name);

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '90px',
        border: '0.5px solid #B8D9F0',
        textDecoration: 'none',
        textAlign: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        background: '#EAF2FA',
      }}
    >
      {/* Thumbnail or icon area */}
      {isImage ? (
        <img
          src={file.url}
          alt={file.name}
          style={{
            width: '90px',
            height: '68px',
            objectFit: 'cover',
            display: 'block',
            flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: '90px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#EAF2FA',
        }}>
          <span style={{ fontSize: '26px', lineHeight: 1 }}>{detectFileEmoji(file.name)}</span>
        </div>
      )}

      {/* Filename + size */}
      <div style={{ padding: '4px 4px 5px', width: '100%' }}>
        <p style={{ fontSize: '11px', color: '#2A5A8B', margin: 0, lineHeight: 1.3, wordBreak: 'break-all' }}>
          {displayName}
        </p>
        {file.size != null && (
          <p style={{ fontSize: '10px', color: '#5A8BBF', margin: '2px 0 0' }}>
            {formatBytes(file.size)}
          </p>
        )}
      </div>
    </a>
  );
}

function CloudLinkBox({ url }: { url: string }) {
  const platform = detectPlatform(url);
  const short = shortenUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        background: 'white',
        border: '0.5px solid #B8D9F0',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>{platform.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', color: '#1A1525', fontWeight: 500, margin: '0 0 1px' }}>
          {platform.name}
        </p>
        <p
          style={{
            fontSize: '12px',
            color: '#5A8BBF',
            fontFamily: 'ui-monospace, monospace',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {short}
        </p>
      </div>
      <span style={{ fontSize: '13px', color: '#5A8BBF', flexShrink: 0 }}>↗</span>
    </a>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ReferenceSection({ files, cloudUrl }: Props) {
  // Safely parse the Json field into a FileRef array
  const fileList: FileRef[] = Array.isArray(files)
    ? (files as unknown as FileRef[]).filter(
        (f) => f && typeof f === 'object' && typeof f.url === 'string',
      )
    : [];

  const hasFiles = fileList.length > 0;
  const hasLink  = typeof cloudUrl === 'string' && cloudUrl.trim().length > 0;

  if (!hasFiles && !hasLink) return null;

  return (
    <div
      style={{
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '0.5px solid #EBE6F2',
      }}
    >
      {hasFiles && (
        <div style={hasLink ? { marginBottom: '10px' } : {}}>
          <p style={labelStyle}>— Reference Files</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {fileList.map((f, i) => (
              <FileThumb key={f.id ?? i} file={f} />
            ))}
          </div>
        </div>
      )}

      {hasLink && (
        <div>
          <p style={labelStyle}>— Cloud Link</p>
          <CloudLinkBox url={cloudUrl as string} />
        </div>
      )}
    </div>
  );
}
