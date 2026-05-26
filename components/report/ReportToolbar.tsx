'use client';

interface Props {
  locale: string;
  baseUrl: string;
  token: string;
  currentMode: string;
}

const MODES = [
  { value: 'original',   label: 'Original'  },
  { value: 'translated', label: '中文翻譯'  },
  { value: 'bilingual',  label: '雙語對照'  },
] as const;

const PDF_LABELS: Record<string, string> = {
  original:   'Download PDF',
  translated: 'Download PDF · 中文翻譯',
  bilingual:  'Download PDF · 雙語對照',
};

export function ReportToolbar({ locale, baseUrl, token, currentMode }: Props) {
  if (locale === 'zh') return null;

  const downloadUrl = `${baseUrl}/pdf?token=${token}&mode=${currentMode}`;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#F4F2F7',
        borderBottom: '0.5px solid #D9D2E8',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        overflow: 'visible',
      }}
    >
      {/* Left: mode switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '11px', color: '#A89FC2', flexShrink: 0 }}>Display:</span>
        {/* Mode button group */}
        <div style={{ display: 'flex', background: 'white', border: '0.5px solid #D9D2E8' }}>
          {MODES.map((m, i) => (
            <a
              key={m.value}
              href={`${baseUrl}?token=${token}&mode=${m.value}`}
              style={{
                fontSize: '11px',
                padding: '7px 14px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                color: currentMode === m.value ? '#FBFAFD' : '#5D5470',
                background: currentMode === m.value ? '#1A1525' : 'transparent',
                fontWeight: currentMode === m.value ? 500 : 400,
                borderLeft: i > 0 ? '0.5px solid #D9D2E8' : 'none',
              }}
            >
              {m.label}
            </a>
          ))}
        </div>
      </div>

      {/* Right: print + download */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => window.print()}
          style={{
            fontSize: '11px',
            color: '#5D5470',
            background: 'white',
            border: '0.5px solid #D9D2E8',
            padding: '7px 14px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ⎙ Print
        </button>
        <a
          href={downloadUrl}
          download
          style={{
            fontSize: '11px',
            color: '#FBFAFD',
            background: '#1A1525',
            border: '0.5px solid #1A1525',
            padding: '7px 14px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}
        >
          ↓ {PDF_LABELS[currentMode] ?? 'Download PDF'}
        </a>
      </div>
    </div>
  );
}
