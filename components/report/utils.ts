// ── Round card style ────────────────────────────────────────────────────────

export function getRoundStyle(round: number) {
  if (round === 1) return { bg: '#F4F2F7', border: '#D9D2E8', text: '#5D5470', warning: null };
  if (round <= 3) return { bg: '#FBEFD9', border: '#E0A14A', text: '#7A4D08', warning: null };
  return { bg: '#FCEBEB', border: '#C04A6A', text: '#791F1F', warning: '⚠ 4+ may charge' };
}

// ── Priority style ───────────────────────────────────────────────────────────

export function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'high':
      return { bg: '#F8E4E4', border: '#D88C8C', text: '#791F1F', accent: '#C04A6A' };
    case 'medium':
      return { bg: '#FBEFD9', border: '#E0A14A', text: '#7A4D08', accent: '#E0A14A' };
    default: // low
      return { bg: '#EDF4E6', border: '#B8D198', text: '#4A6B2A', accent: '#6FA94A' };
  }
}

// ── Bilingual layout decision ────────────────────────────────────────────────

export function getBilingualLayout(text: string): 'side-by-side' | 'top-bottom' {
  const isCJK = /[一-鿿぀-ヿ]/.test(text);
  const effectiveLength = isCJK ? text.length * 2 : text.length;
  return effectiveLength <= 160 ? 'side-by-side' : 'top-bottom';
}

// ── File type icon (emoji) ───────────────────────────────────────────────────

export function detectFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return '🖼';
  if (['mp4', 'mov', 'webm', 'avi'].includes(ext)) return '🎬';
  if (ext === 'psd') return '🎨';
  if (ext === 'pdf') return '📄';
  if (['zip', 'rar', '7z'].includes(ext)) return '🗜';
  return '📎';
}

// ── Cloud link platform detection ────────────────────────────────────────────

export function detectPlatform(url: string): { emoji: string; name: string } {
  if (url.includes('drive.google.com'))                 return { emoji: '📁', name: 'Google Drive' };
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { emoji: '▶', name: 'YouTube' };
  if (url.includes('dropbox.com'))                      return { emoji: '📦', name: 'Dropbox' };
  if (url.includes('vimeo.com'))                        return { emoji: '🎬', name: 'Vimeo' };
  if (url.includes('mega.nz'))                          return { emoji: '☁', name: 'MEGA' };
  return { emoji: '🔗', name: 'External link' };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024)            return `${bytes} B`;
  if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// ── Issue title generation ────────────────────────────────────────────────────

/**
 * Generate a short text-based issue title from expected / current_state.
 * - Uses first sentence if ≤ 40 chars
 * - Otherwise truncates at 40 chars on a word boundary
 */
export function generateIssueTitle(expected?: string, currentState?: string): string {
  const source = (expected ?? '').trim() || (currentState ?? '').trim();
  if (!source) return '(no description)';

  const firstSentence = source.split(/[.!?。！？]/)[0]?.trim() ?? '';
  if (firstSentence && firstSentence.length <= 40) return firstSentence;

  if (source.length <= 40) return source;
  const cut = source.slice(0, 40);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut) + '...';
}

// ── Display labels (never translated) ────────────────────────────────────────

export const LOCATION_LABELS: Record<string, string> = {
  face:    'Face',
  hair:    'Hair',
  body:    'Body',
  physics: 'Physics',
  toggle:  'Toggle',
  other:   'Other',
};

export const TYPE_LABELS: Record<string, string> = {
  model_error:    'Model Error',
  change_artwork: 'Change Artwork',
  adjust_physics: 'Adjust Physics / Motion',
  add_remove:     'Add / Remove',
  other:          'Other',
};

export const PRIORITY_LABELS: Record<string, string> = {
  high:   'HIGH',
  medium: 'MEDIUM',
  low:    'LOW',
};
