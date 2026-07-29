import type { SimpleIcon } from 'simple-icons';
import type { CSSProperties } from 'react';
import {
  siC,
  siClaude,
  siCloudflare,
  siCplusplus,
  siCss,
  siDocker,
  siExpress,
  siFirebase,
  siFlask,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMongodb,
  siN8n,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSqlite,
  siSupabase,
  siTypescript,
  siVercel,
} from 'simple-icons';
import './SkillObservatory.css';

interface Skill {
  label: string;
  icon: SimpleIcon;
}

const groups: { label: string; code: string; skills: Skill[] }[] = [
  {
    label: 'Languages',
    code: '01',
    skills: [
      { label: 'JavaScript', icon: siJavascript },
      { label: 'TypeScript', icon: siTypescript },
      { label: 'Python', icon: siPython },
      { label: 'C++', icon: siCplusplus },
      { label: 'C', icon: siC },
      { label: 'HTML', icon: siHtml5 },
      { label: 'CSS', icon: siCss },
      { label: 'SQL', icon: siSqlite },
    ],
  },
  {
    label: 'Product layer',
    code: '02',
    skills: [
      { label: 'React', icon: siReact },
      { label: 'Node.js', icon: siNodedotjs },
      { label: 'Express', icon: siExpress },
      { label: 'Flask', icon: siFlask },
    ],
  },
  {
    label: 'Data systems',
    code: '03',
    skills: [
      { label: 'PostgreSQL', icon: siPostgresql },
      { label: 'MongoDB', icon: siMongodb },
      { label: 'Supabase', icon: siSupabase },
      { label: 'Firebase', icon: siFirebase },
    ],
  },
  {
    label: 'AI & automation',
    code: '04',
    skills: [
      { label: 'AI Agents', icon: siClaude },
      { label: 'n8n', icon: siN8n },
    ],
  },
  {
    label: 'Infrastructure',
    code: '05',
    skills: [
      { label: 'Git', icon: siGit },
      { label: 'GitHub', icon: siGithub },
      { label: 'Docker', icon: siDocker },
      { label: 'Vercel', icon: siVercel },
      { label: 'Cloudflare', icon: siCloudflare },
    ],
  },
];

function iconColor(icon: SimpleIcon) {
  return ['000000', '181717'].includes(icon.hex) ? '#eeeae2' : `#${icon.hex}`;
}

export function SkillObservatory() {
  return (
    <div className="skill-observatory" aria-label="Technology toolkit">
      <div className="skill-observatory__axis" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {groups.map((group) => (
        <section className="skill-orbit" key={group.label}>
          <header>
            <span>{group.code}</span>
            <h3>{group.label}</h3>
          </header>
          <div className="skill-orbit__nodes">
            {group.skills.map(({ label, icon }) => (
              <article
                className="skill-node"
                key={label}
                style={{ '--brand': iconColor(icon) } as CSSProperties}
                title={icon.title}
              >
                <span className="skill-node__icon">
                  <svg viewBox="0 0 24 24" role="img" aria-label={`${label} official icon`}>
                    <path d={icon.path} />
                  </svg>
                </span>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
