'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  BASE_DESIGN,
  FONT_PRESETS,
  TEAM_ORDER,
  clamp,
  mergeDesign,
  normalizeHex,
} from '@/lib/scoreboard-data';
import type { Design, StudioTab, Team, TeamId } from '@/lib/scoreboard-data';

interface StudioProps {
  open: boolean;
  design: Design;
  teams: Record<TeamId, Team>;
  auto: boolean;
  sound: boolean;
  onChange: (updater: (current: Design) => Design) => void;
  onClose: () => void;
  onToggleAuto: () => void;
  onToggleSound: () => void;
  onPreview: (teamId: TeamId) => void;
}

const TABS: Array<{ id: StudioTab; label: string }> = [
  { id: 'brand', label: 'Brand' },
  { id: 'teams', label: 'Teams' },
  { id: 'type', label: 'Type' },
  { id: 'motion', label: 'Motion' },
];

const SWATCHES = ['#f2c75c', '#65f0bf', '#65d8ff', '#ff7d6e', '#c7b5ff'];

export function Studio({ open, design, teams, auto, sound, onChange, onClose, onToggleAuto, onToggleSound, onPreview }: StudioProps) {
  const [tab, setTab] = useState<StudioTab>('brand');
  const [activeTeam, setActiveTeam] = useState<TeamId>('jdt');
  const [status, setStatus] = useState('Saved in this browser');
  const [statusError, setStatusError] = useState(false);

  const logoInput = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const logoTeam = useRef<TeamId>('jdt');

  const patch = (updater: (current: Design) => Design) => onChange(updater);

  const setStatusMessage = (message: string, isError = false) => {
    setStatus(message);
    setStatusError(isError);
  };

  const patchBrand = (key: keyof Design['brand'], value: string) =>
    patch((current) => ({ ...current, brand: { ...current.brand, [key]: value } }));

  const patchTeam = (id: TeamId, key: keyof Design['teams'][TeamId], value: string) =>
    patch((current) => ({
      ...current,
      teams: { ...current.teams, [id]: { ...current.teams[id], [key]: value } },
    }));

  /* ------------------------------ crest upload ------------------------------ */
  const pickLogo = (id: TeamId) => {
    logoTeam.current = id;
    logoInput.current?.click();
  };

  const handleLogoFile = async (file: File | undefined) => {
    if (!file) return;
    const id = logoTeam.current;
    try {
      const url = URL.createObjectURL(file);
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
      const max = 512;
      const ratio = Math.min(1, max / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round((image.naturalWidth || image.width) * ratio);
      canvas.height = Math.round((image.naturalHeight || image.height) * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no 2d context');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      patchTeam(id, 'logo', canvas.toDataURL('image/png'));
      setStatusMessage(`${teams[id].code} crest replaced`);
    } catch {
      setStatusMessage('That image could not be read', true);
    }
  };

  /* -------------------------------- export/import -------------------------------- */
  const exportConfig = () => {
    try {
      const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'yedok-sport-cup-design.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatusMessage('Config exported');
    } catch {
      setStatusMessage('Export failed', true);
    }
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as { design?: unknown };
      const payload = parsed && typeof parsed === 'object' && 'design' in parsed ? parsed.design : parsed;
      onChange(() => mergeDesign(payload));
      setStatusMessage('Config imported');
    } catch {
      setStatusMessage('That file is not a valid config', true);
    }
  };

  const resetAll = () => {
    onChange(() => mergeDesign(null));
    setStatusMessage('Reset to the supplied design');
  };

  const current = teams[activeTeam];
  const cfg = design.teams[activeTeam];
  const hold = clamp(Number(design.motion.holdMs) || 2650, 2200, 4200);
  const gap = clamp(Number(design.motion.autoGapMs) || 3800, 1600, 6000);
  const nameSize = clamp(Number(design.type.teamNameSize) || 28, 20, 34);

  const fontOptions = (group: keyof typeof FONT_PRESETS, value: string) => {
    const list = FONT_PRESETS[group].slice();
    if (!list.some((item) => item.value === value)) list.push({ label: 'Custom / imported', value });
    return list;
  };

  return (
    <>
      <aside className={`studio${open ? ' is-open' : ''}`} aria-label="Design studio" aria-hidden={!open}>
        <header className="studio__head">
          <div>
            <div className="studio__eyebrow">
              <i />
              LOCAL CONTROL ROOM
            </div>
            <h2>Design Studio</h2>
          </div>
          <button className="studio__close" type="button" aria-label="Close design studio" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="studio__tabs" role="tablist" aria-label="Design sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              className={`studio__tab${tab === item.id ? ' is-active' : ''}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="studio__scroll">
          {/* ------------------------------- brand ------------------------------- */}
          <section className="studio__panel" role="tabpanel" hidden={tab !== 'brand'}>
            <div className="studio__section">Identity</div>
            <label className="studio-field">
              <span>Interface accent</span>
              <span className="studio-colorrow">
                <input
                  type="color"
                  value={normalizeHex(design.accent, BASE_DESIGN.accent)}
                  aria-label="Interface accent colour"
                  onChange={(event) => patch((c) => ({ ...c, accent: normalizeHex(event.target.value) }))}
                />
                <input
                  type="text"
                  maxLength={7}
                  spellCheck={false}
                  aria-label="Interface accent hex code"
                  value={design.accent.toUpperCase()}
                  onChange={(event) => {
                    const raw = event.target.value.trim();
                    patch((c) => ({ ...c, accent: raw }));
                  }}
                  onBlur={(event) => patch((c) => ({ ...c, accent: normalizeHex(event.target.value, BASE_DESIGN.accent) }))}
                />
              </span>
            </label>

            <div className="studio-swatches" aria-label="Accent presets">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  className="studio-swatch"
                  type="button"
                  style={{ '--sw': swatch } as CSSProperties}
                  aria-label={`${swatch} accent`}
                  onClick={() => patch((c) => ({ ...c, accent: swatch }))}
                />
              ))}
            </div>

            <div className="studio-grid2">
              <label className="studio-field">
                <span>Title line A</span>
                <input
                  type="text"
                  maxLength={18}
                  value={design.brand.titleA}
                  onChange={(event) => patchBrand('titleA', event.target.value)}
                />
              </label>
              <label className="studio-field">
                <span>Title line B</span>
                <input
                  type="text"
                  maxLength={18}
                  value={design.brand.titleB}
                  onChange={(event) => patchBrand('titleB', event.target.value)}
                />
              </label>
            </div>

            <label className="studio-field">
              <span>Tagline lead</span>
              <input
                type="text"
                maxLength={36}
                value={design.brand.taglineLead}
                onChange={(event) => patchBrand('taglineLead', event.target.value)}
              />
            </label>
            <label className="studio-field">
              <span>Tagline highlight</span>
              <input
                type="text"
                maxLength={42}
                value={design.brand.taglineAccent}
                onChange={(event) => patchBrand('taglineAccent', event.target.value)}
              />
            </label>

            <p className="studio-hint">
              The accent recolours interface lines, highlights and the league mark. Each team keeps its own rail
              colours under <b>Teams</b>.
            </p>
          </section>

          {/* ------------------------------- teams ------------------------------- */}
          <section className="studio__panel" role="tabpanel" hidden={tab !== 'teams'}>
            <div className="studio__section">Team controls</div>

            <div className="studio-team-tabs" aria-label="Select team">
              {TEAM_ORDER.map((id) => (
                <button
                  key={id}
                  className={`studio-team-tab${activeTeam === id ? ' is-active' : ''}`}
                  type="button"
                  aria-pressed={activeTeam === id}
                  aria-label={`Edit ${teams[id].name}`}
                  onClick={() => setActiveTeam(id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={teams[id].logo} alt="" />
                  <span>{teams[id].code}</span>
                </button>
              ))}
            </div>

            <div>
              <div className="studio-team-profile">
                <div className="studio-team-profile__crest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={current.logo} alt="" />
                </div>
                <div className="studio-team-profile__meta">
                  <strong>{current.name}</strong>
                  <span>
                    {current.code} · {current.sub}
                  </span>
                </div>
              </div>

              <div className="studio-grid2">
                <label className="studio-field">
                  <span>Code</span>
                  <input
                    type="text"
                    maxLength={4}
                    spellCheck={false}
                    value={cfg.code}
                    onChange={(event) =>
                      patchTeam(activeTeam, 'code', event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))
                    }
                  />
                </label>
                <label className="studio-field">
                  <span>Display name</span>
                  <input
                    type="text"
                    maxLength={28}
                    value={cfg.name}
                    onChange={(event) => patchTeam(activeTeam, 'name', event.target.value)}
                  />
                </label>
              </div>

              <label className="studio-field">
                <span>Subtitle / city</span>
                <input
                  type="text"
                  maxLength={38}
                  value={cfg.sub}
                  onChange={(event) => patchTeam(activeTeam, 'sub', event.target.value)}
                />
              </label>

              <div className="studio__section" style={{ marginTop: 16 }}>
                Rail colours
              </div>
              <div className="studio-grid2">
                <label className="studio-field">
                  <span>Primary</span>
                  <input
                    type="color"
                    value={normalizeHex(cfg.primary, '#e21b2d')}
                    aria-label="Primary rail colour"
                    onChange={(event) => patchTeam(activeTeam, 'primary', normalizeHex(event.target.value))}
                  />
                </label>
                <label className="studio-field">
                  <span>Deep shade</span>
                  <input
                    type="color"
                    value={normalizeHex(cfg.deep, '#510a14')}
                    aria-label="Deep rail colour"
                    onChange={(event) => patchTeam(activeTeam, 'deep', normalizeHex(event.target.value))}
                  />
                </label>
              </div>
              <label className="studio-field">
                <span>Signature accent</span>
                <input
                  type="color"
                  value={normalizeHex(cfg.accent, '#f2c75c')}
                  aria-label="Signature accent colour"
                  onChange={(event) => patchTeam(activeTeam, 'accent', normalizeHex(event.target.value))}
                />
              </label>

              <div className="studio-actions">
                <button className="studio-button" type="button" onClick={() => pickLogo(activeTeam)}>
                  Replace crest
                </button>
                <button
                  className="studio-button"
                  type="button"
                  onClick={() => patchTeam(activeTeam, 'logo', BASE_DESIGN.teams[activeTeam].logo)}
                >
                  Supplied crest
                </button>
              </div>
              <div className="studio-actions">
                <button className="studio-button studio-button--gold" type="button" onClick={() => onPreview(activeTeam)}>
                  Preview {current.code} goal
                </button>
              </div>

              <p className="studio-hint">
                Use a transparent PNG or WebP for the crest. Uploads are scaled to 512px and stored with this browser&apos;s
                design settings.
              </p>
            </div>
          </section>

          {/* -------------------------------- type -------------------------------- */}
          <section className="studio__panel" role="tabpanel" hidden={tab !== 'type'}>
            <div className="studio__section">Typography</div>

            <label className="studio-field">
              <span>
                Display face <em>hero + GOAL</em>
              </span>
              <select
                value={design.fonts.display}
                onChange={(event) => patch((c) => ({ ...c, fonts: { ...c.fonts, display: event.target.value } }))}
              >
                {fontOptions('display', design.fonts.display).map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span>
                Broadcast face <em>teams + score</em>
              </span>
              <select
                value={design.fonts.condensed}
                onChange={(event) => patch((c) => ({ ...c, fonts: { ...c.fonts, condensed: event.target.value } }))}
              >
                {fontOptions('condensed', design.fonts.condensed).map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span>Interface face</span>
              <select
                value={design.fonts.ui}
                onChange={(event) => patch((c) => ({ ...c, fonts: { ...c.fonts, ui: event.target.value } }))}
              >
                {fontOptions('ui', design.fonts.ui).map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span>
                Team-name size <output>{nameSize}px</output>
              </span>
              <input
                type="range"
                min={20}
                max={34}
                step={1}
                value={nameSize}
                onChange={(event) => patch((c) => ({ ...c, type: { ...c.type, teamNameSize: Number(event.target.value) } }))}
              />
            </label>

            <p className="studio-hint">
              The first three options are the site&apos;s self-hosted faces; the rest are local system faces, so a page
              still renders offline.
            </p>
          </section>

          {/* ------------------------------- motion ------------------------------- */}
          <section className="studio__panel" role="tabpanel" hidden={tab !== 'motion'}>
            <div className="studio__section">Motion timing</div>

            <label className="studio-field">
              <span>
                Goal takeover hold <output>{(hold / 1000).toFixed(2)}s</output>
              </span>
              <input
                type="range"
                min={2200}
                max={4200}
                step={50}
                value={hold}
                onChange={(event) => patch((c) => ({ ...c, motion: { ...c.motion, holdMs: Number(event.target.value) } }))}
              />
            </label>

            <label className="studio-field">
              <span>
                Auto-demo gap <output>{(gap / 1000).toFixed(1)}s</output>
              </span>
              <input
                type="range"
                min={1600}
                max={6000}
                step={100}
                value={gap}
                onChange={(event) => patch((c) => ({ ...c, motion: { ...c.motion, autoGapMs: Number(event.target.value) } }))}
              />
            </label>

            <label className="studio-toggle">
              <input
                type="checkbox"
                checked={design.motion.particles !== false}
                onChange={(event) => patch((c) => ({ ...c, motion: { ...c.motion, particles: event.target.checked } }))}
              />{' '}
              Goal particles / confetti
            </label>

            <div className="studio-actions">
              <button className="studio-button studio-button--gold" type="button" onClick={() => onPreview(activeTeam)}>
                Preview {current.code} goal
              </button>
              <button className="studio-button" type="button" onClick={onToggleAuto}>
                {auto ? 'Pause auto demo' : 'Start auto demo'}
              </button>
              <button className={`studio-button${sound ? ' studio-button--gold' : ''}`} type="button" onClick={onToggleSound}>
                Sound {sound ? 'on' : 'off'}
              </button>
            </div>

            <p className="studio-hint">
              The four motion signatures stay tied to the four teams. Timing changes apply the next time a goal is
              triggered.
            </p>
          </section>
        </div>

        <div className="studio__foot">
          <div className="studio__foot-actions">
            <button className="studio-button" type="button" onClick={exportConfig}>
              Export config
            </button>
            <button className="studio-button" type="button" onClick={() => importInput.current?.click()}>
              Import
            </button>
            <button className="studio-button studio-button--danger" type="button" onClick={resetAll}>
              Reset
            </button>
          </div>
          <div className="studio__status" style={statusError ? { color: 'var(--gold-hi)' } : undefined}>
            {status}
          </div>
        </div>
      </aside>

      <input
        ref={logoInput}
        type="file"
        accept="image/png,image/webp,image/jpeg"
        hidden
        onChange={(event) => {
          void handleLogoFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      <input
        ref={importInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          void handleImport(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
    </>
  );
}
