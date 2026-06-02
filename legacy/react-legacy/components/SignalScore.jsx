import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const lanes = [
  {
    label: 'code',
    cells: [1, 0, 1, 1, 0, 1, 0, 1],
  },
  {
    label: 'music',
    cells: [0, 1, 0, 1, 1, 0, 1, 0],
  },
  {
    label: 'auto',
    cells: [1, 1, 0, 0, 1, 0, 1, 1],
  },
];

function SignalScore({ profile, projectCount, liveState }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    // Mouse-light specularity
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    cardRef.current.style.setProperty('--mx', `${pctX}%`);
    cardRef.current.style.setProperty('--my', `${pctY}%`);

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: 'center center'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });
  };

  return (
    <aside 
      ref={cardRef}
      className="mp-score mp-hardware-tilt" 
      aria-label="Kuber Bassi signal score"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mp-scoreHeader">
        <span>KB SIGNAL SCORE</span>
        <span>{liveState === 'live' ? 'LIVE' : liveState === 'fallback' ? 'FALLBACK' : 'SYNCING'}</span>
      </div>

      <div className="mp-scoreStage">
        <svg viewBox="0 0 740 420" role="img" aria-label="Code and music signal visualization">
          <defs>
            <linearGradient id="scoreLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#0f0f0f" />
              <stop offset="45%" stopColor="#3a6ff8" />
              <stop offset="100%" stopColor="#d97745" />
            </linearGradient>
          </defs>
          <path className="mp-scoreStaff" d="M42 82 H704 M42 142 H704 M42 202 H704 M42 262 H704 M42 322 H704" />
          <path
            className="mp-scoreWave"
            d="M40 214 C96 82 155 82 206 213 S317 343 368 213 480 82 532 213 642 345 704 214"
          />
          <path
            className="mp-scoreCircuit"
            d="M78 326 L160 326 L160 250 L252 250 L252 144 L364 144 L364 202 L470 202 L470 92 L624 92"
          />
          <circle className="mp-scoreNode" cx="160" cy="326" r="8" />
          <circle className="mp-scoreNode" cx="252" cy="250" r="8" />
          <circle className="mp-scoreNode" cx="364" cy="144" r="8" />
          <circle className="mp-scoreNode" cx="470" cy="202" r="8" />
          <circle className="mp-scoreNode mp-scoreNodeWarm" cx="624" cy="92" r="10" />
          <text x="42" y="58">systems</text>
          <text x="522" y="356">rhythm</text>
        </svg>
      </div>

      <div className="mp-sequencer" aria-label="Identity sequencer">
        {lanes.map((lane) => (
          <div className="mp-seqLane" key={lane.label}>
            <span>{lane.label}</span>
            <div>
              {lane.cells.map((active, index) => (
                <i key={`${lane.label}-${index}`} className={active ? 'is-active' : ''} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mp-scoreStats">
        <div>
          <strong>{profile.public_repos || 'Auto'}</strong>
          <span>repos</span>
        </div>
        <div>
          <strong>{projectCount}</strong>
          <span>builds</span>
        </div>
        <div>
          <strong>2</strong>
          <span>crafts</span>
        </div>
      </div>
    </aside>
  );
}

export default SignalScore;

