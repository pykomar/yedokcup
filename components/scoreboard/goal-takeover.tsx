'use client';

import { SIGNATURES } from '@/lib/data';
import type { SignatureKey, Team } from '@/lib/types';

interface GoalTakeoverProps {
  team: Team;
  signature: SignatureKey;
  score: [number, number];
  ordinal: number;
  leaving: boolean;
  preview?: boolean;
}

function Deco({ signature }: { signature: SignatureKey }) {
  if (signature === 'tiger-slash') {
    return (
      <>
        <i className="goal__slash goal__slash--a" />
        <i className="goal__slash goal__slash--b" />
        <i className="goal__slash goal__slash--c" />
      </>
    );
  }

  if (signature === 'city-pulse') {
    return (
      <>
        <i className="goal__ring goal__ring--a" />
        <i className="goal__ring goal__ring--b" />
        <i className="goal__ring goal__ring--c" />
        <i className="goal__scan" />
      </>
    );
  }

  if (signature === 'red-tide') {
    return (
      <>
        <i className="goal__wave goal__wave--a" />
        <i className="goal__wave goal__wave--b" />
        <i className="goal__flare" />
      </>
    );
  }

  return (
    <div className="goal__tiles">
      {Array.from({ length: 24 }, (_, index) => (
        <i key={index} className="goal__tile" style={{ '--i': index } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function GoalTakeover({ team, signature, score, ordinal, leaving, preview }: GoalTakeoverProps) {
  const { cssClass, name } = SIGNATURES[signature];

  return (
    <div
      className={`goal ${cssClass}${leaving ? ' is-leaving' : ''}`}
      style={
        {
          '--team-primary': team.colours.primary,
          '--team-deep': team.colours.deep,
          '--team-accent': team.colours.accent,
        } as React.CSSProperties
      }
      role="status"
      aria-live="assertive"
    >
      <div className="goal__deco" aria-hidden="true">
        <Deco signature={signature} />
      </div>

      <div className="goal__body">
        <span className="goal__kicker">{preview ? 'Signature preview' : 'Goal'}</span>
        <strong className="goal__code">{team.code}</strong>
        <span className="goal__sig">{name}</span>
        <span className="goal__score">
          <b>{score[0]}</b>
          <em>–</em>
          <b>{score[1]}</b>
        </span>
        <span className="goal__meta">
          {team.name} · {preview ? 'played back on the board' : `goal number ${ordinal}`}
        </span>
      </div>

      <div className="goal__wipe" aria-hidden="true" />
    </div>
  );
}
