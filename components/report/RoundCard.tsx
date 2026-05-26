import { getRoundStyle } from './utils';

export function RoundCard({ round }: { round: number }) {
  const s = getRoundStyle(round);

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        padding: '8px 14px',
        textAlign: 'center',
        minWidth: '72px',
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: s.text,
          margin: '0 0 3px',
        }}
      >
        Round
      </p>
      <p
        style={{
          fontSize: '25px',
          fontWeight: 500,
          color: s.text,
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {round}
      </p>
      {s.warning && (
        <p
          style={{
            fontSize: '10px',
            fontStyle: 'italic',
            color: s.text,
            margin: '5px 0 0',
          }}
        >
          {s.warning}
        </p>
      )}
    </div>
  );
}
