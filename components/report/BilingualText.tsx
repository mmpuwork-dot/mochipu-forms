import type { CSSProperties } from 'react';
import { getBilingualLayout } from './utils';
import type { DisplayMode } from './types';

interface Props {
  original: string;
  translated?: string;
  locale: string;
  mode: DisplayMode;
}

const textStyle: CSSProperties = {
  fontSize: '15px',
  color: '#1A1525',
  lineHeight: 1.65,
  margin: 0,
};

export function BilingualText({ original, translated, locale, mode }: Props) {
  // Original mode — or no translation available
  if (mode === 'original' || !translated) {
    return <p style={textStyle}>{original}</p>;
  }

  // Translated mode — show only translation
  if (mode === 'translated') {
    return <p style={{ ...textStyle, fontStyle: 'italic' }}>{translated}</p>;
  }

  // Bilingual mode — show both with smart layout
  const layout = getBilingualLayout(original);
  const localeTag = locale.toUpperCase();

  const labelStyle: CSSProperties = {
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 500,
    margin: '0 0 3px',
  };

  const originalBox = (
    <div style={{ background: 'white', border: '0.5px solid #D9D2E8', padding: '5px 8px' }}>
      <p style={{ ...labelStyle, color: '#6B5FA0' }}>Original · {localeTag}</p>
      <p style={textStyle}>{original}</p>
    </div>
  );

  const translationBox = (
    <div style={{ background: '#EAF2FA', border: '0.5px solid #B8D9F0', padding: '5px 8px' }}>
      <p style={{ ...labelStyle, color: '#2A5A8B' }}>Translation · ZH</p>
      <p style={{ ...textStyle, fontStyle: 'italic' }}>{translated}</p>
    </div>
  );

  if (layout === 'side-by-side') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        {originalBox}
        {translationBox}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {originalBox}
      {translationBox}
    </div>
  );
}
