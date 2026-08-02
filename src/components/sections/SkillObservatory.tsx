import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import {
  SiCss,
  SiDiscord,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiFramer,
  SiGodaddy,
  SiGooglesearchconsole,
  SiHtml5,
  SiMysql,
  SiNeon,
  SiNotion,
  SiObsidian,
  SiPrisma,
  SiReplit,
  SiStackoverflow,
} from 'react-icons/si';
import {
  TbApi,
  TbBrandOffice,
  TbCodeAi,
  TbPrompt,
  TbRipple,
} from 'react-icons/tb';
import { VscVscode } from 'react-icons/vsc';
import './SkillObservatory.css';

interface Technology {
  label: string;
  logo?: string;
  src?: string;
  icon?: IconType;
  href: string;
  tone?: 'light';
  color?: string;
}

const rows: readonly Technology[][] = [
  // Languages and frontend
  [
    { label: 'HTML5', icon: SiHtml5, color: '#E34F26', href: 'https://developer.mozilla.org/docs/Web/HTML' },
    { label: 'CSS3', icon: SiCss, color: '#663399', href: 'https://developer.mozilla.org/docs/Web/CSS' },
    { label: 'TypeScript', logo: 'typescript', href: 'https://www.typescriptlang.org/docs/' },
    { label: 'JavaScript', logo: 'javascript', href: 'https://developer.mozilla.org/docs/Web/JavaScript' },
    { label: 'Python', logo: 'python', href: 'https://docs.python.org/3/' },
    { label: 'C', logo: 'c', href: 'https://en.cppreference.com/w/c' },
    { label: 'C++', logo: 'cplusplus', href: 'https://en.cppreference.com/w/cpp' },
    { label: 'React', logo: 'react', href: 'https://react.dev/' },
    { label: 'Vite', logo: 'vite', href: 'https://vite.dev/guide/' },
    { label: 'Tailwind CSS', logo: 'tailwind', href: 'https://tailwindcss.com/docs' },
    { label: 'GSAP', logo: 'gsap', href: 'https://gsap.com/docs/v3/' },
    { label: 'Three.js', logo: 'threejs', href: 'https://threejs.org/docs/', tone: 'light' },
    { label: 'Framer Motion', icon: SiFramer, color: '#EDEDED', href: 'https://motion.dev/docs/react' },
    { label: 'Lenis', icon: TbRipple, color: '#D5B27E', href: 'https://lenis.darkroom.engineering/' },
  ],
  // Backend, data, and infrastructure
  [
    { label: 'Node.js', logo: 'nodejs', href: 'https://nodejs.org/docs/latest/api/' },
    { label: 'Express.js', icon: SiExpress, color: '#EDEDED', href: 'https://expressjs.com/' },
    { label: 'Flask', logo: 'flask', href: 'https://flask.palletsprojects.com/', tone: 'light' },
    { label: 'FastAPI', logo: 'fastapi', href: 'https://fastapi.tiangolo.com/' },
    { label: 'REST APIs', icon: TbApi, color: '#D5B27E', href: 'https://developer.mozilla.org/docs/Glossary/REST' },
    { label: 'Supabase', logo: 'supabase', href: 'https://supabase.com/docs' },
    { label: 'PostgreSQL', logo: 'postgresql', href: 'https://www.postgresql.org/docs/' },
    { label: 'MySQL', icon: SiMysql, color: '#4479A1', href: 'https://dev.mysql.com/doc/' },
    { label: 'MongoDB', logo: 'mongodb', href: 'https://www.mongodb.com/docs/' },
    { label: 'Neon DB', icon: SiNeon, color: '#00E699', href: 'https://neon.com/docs' },
    { label: 'Prisma', icon: SiPrisma, color: '#EDEDED', href: 'https://www.prisma.io/docs' },
    { label: 'Firebase', icon: SiFirebase, color: '#FFCA28', href: 'https://firebase.google.com/docs' },
    { label: 'Docker', icon: SiDocker, color: '#2496ED', href: 'https://docs.docker.com/' },
    { label: 'Git', logo: 'git', href: 'https://git-scm.com/doc' },
    { label: 'GitHub', logo: 'github', href: 'https://docs.github.com/', tone: 'light' },
    { label: 'Linux', logo: 'linux', href: 'https://www.kernel.org/doc/html/latest/' },
    { label: 'Vercel', logo: 'vercel', href: 'https://vercel.com/docs', tone: 'light' },
    { label: 'Render', logo: 'render', href: 'https://render.com/docs' },
    { label: 'Cloudflare', logo: 'cloudflare', href: 'https://developers.cloudflare.com/' },
    { label: 'GoDaddy', icon: SiGodaddy, color: '#1BDBDB', href: 'https://www.godaddy.com/help' },
    { label: 'Google Search Console', icon: SiGooglesearchconsole, color: '#458CF5', href: 'https://support.google.com/webmasters/' },
  ],
  // AI, tools, and design
  [
    { label: 'ChatGPT', logo: 'openai', href: 'https://help.openai.com/', tone: 'light' },
    { label: 'OpenAI Codex', logo: 'codex', href: 'https://developers.openai.com/codex/' },
    { label: 'GitHub Copilot', logo: 'copilot', href: 'https://docs.github.com/copilot', tone: 'light' },
    { label: 'Gemini', logo: 'gemini', href: 'https://ai.google.dev/gemini-api/docs' },
    { label: 'Claude', logo: 'claude', href: 'https://platform.claude.com/docs/' },
    { label: 'Prompt Engineering', icon: TbPrompt, color: '#D5B27E', href: 'https://platform.openai.com/docs/guides/prompt-engineering' },
    { label: 'Figma', logo: 'figma', href: 'https://help.figma.com/' },
    { label: 'Canva', logo: 'canva', href: 'https://www.canva.com/help/' },
    { label: 'Notion', icon: SiNotion, color: '#EDEDED', href: 'https://www.notion.com/help' },
    { label: 'Obsidian', icon: SiObsidian, color: '#A88BFA', href: 'https://help.obsidian.md/' },
    { label: 'VS Code', icon: VscVscode, color: '#23A8F2', href: 'https://code.visualstudio.com/docs' },
    { label: 'Google Antigravity', src: '/brands/wall/antigravity.png', href: 'https://antigravity.google/' },
    { label: 'Microsoft Office', icon: TbBrandOffice, color: '#EA3E23', href: 'https://support.microsoft.com/microsoft-365' },
    { label: 'Replit', icon: SiReplit, color: '#F26207', href: 'https://docs.replit.com/' },
    { label: 'Discord Developer', icon: SiDiscord, color: '#5865F2', href: 'https://discord.com/developers/docs/' },
    { label: 'Stack Overflow', icon: SiStackoverflow, color: '#F58025', href: 'https://stackoverflow.com/' },
  ],
];

const rowDurations = ['48s', '52s', '44s'] as const;

function LogoSequence({
  technologies,
  duplicate = false,
  shouldLoad = false,
}: {
  technologies: readonly Technology[];
  duplicate?: boolean;
  shouldLoad?: boolean;
}) {
  return (
    <div className="tech-wall__sequence" aria-hidden={duplicate || undefined}>
      {technologies.map(({ label, logo, src, icon: Icon, href, tone, color }) => (
        <a
          className="tech-wall__logo"
          href={href}
          key={`${duplicate ? 'duplicate-' : ''}${label}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={duplicate ? undefined : `${label} official documentation`}
          tabIndex={duplicate ? -1 : undefined}
        >
          {Icon ? (
            <Icon aria-hidden="true" data-tone={tone} style={{ color }} />
          ) : (
            <img
              src={shouldLoad ? (src ?? `/brands/wall/${logo}.svg`) : undefined}
              alt=""
              loading="lazy"
              decoding="async"
              data-tone={tone}
            />
          )}
          <span role="tooltip">{label}</span>
        </a>
      ))}
    </div>
  );
}

export function SkillObservatory({ active = true }: { active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (active && !shouldLoad) {
      setShouldLoad(true);
      return;
    }

    if (shouldLoad) return;
    const container = containerRef.current;
    if (!container || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px' },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [active, shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={`tech-wall${active ? ' is-active' : ''}`}
      aria-label="Technology toolkit"
    >
      {rows.map((technologies, index) => (
        <div
          className="tech-wall__rail"
          data-direction={index === 1 ? 'reverse' : 'forward'}
          key={index}
          style={{ '--wall-duration': rowDurations[index] } as CSSProperties}
        >
          <div className="tech-wall__track">
            <LogoSequence technologies={technologies} shouldLoad={shouldLoad} />
            <LogoSequence technologies={technologies} duplicate shouldLoad={shouldLoad} />
          </div>
        </div>
      ))}
    </div>
  );
}
