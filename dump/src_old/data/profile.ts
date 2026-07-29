import { Profile, ExperienceItem } from '../types';

export const profile: Profile = {
  name: 'Kuber Bassi',
  handle: 'kuberbassi',
  role: 'Software Architect & Systems Engineer',
  location: 'New Delhi, India',
  email: 'me@kuberbassi.com',
  availability: 'Available for software architecture, AI agent systems, product engineering, and technical consulting.',
  intro:
    'I architect high-performance full-stack web applications, AI automation tools, and responsive digital interfaces with a focus on product thinking, system reliability, and clean engineering.',
  signature:
    'Software engineering is an exercise in precision: structure, performance, resilient state management, and cohesive design systems.',
  focusAreas: [
    'Full-Stack Architecture & Cloud Systems',
    'AI Agents, RAG & LLM Integration',
    'High-Performance Web Graphics & Animations',
    'Automation Workflows & API Engineering',
  ],
  principles: [
    {
      title: 'Public Data, Automated Signals',
      text: 'GitHub repository telemetry syncs automatically to provide real-time proof of work and updated project metrics.',
    },
    {
      title: 'Resilient System Architecture',
      text: 'Prioritizing low-latency API handshakes, type safety, modular design tokens, and graceful fallback states.',
    },
    {
      title: 'Product-First Craft',
      text: 'Every interface is engineered for speed, intuitive user flows, crisp visual hierarchy, and robust performance.',
    },
  ],
  identityBridge: [
    {
      label: 'Systems',
      title: 'Engineering.',
      text: 'Full-stack web applications, cloud architecture, type-safe APIs, and responsive frontend interfaces.',
    },
    {
      label: 'Intelligence',
      title: 'AI Agents.',
      text: 'Retrieval-augmented generation (RAG), prompt engineering, LLM tooling, and workflow automation.',
    },
    {
      label: 'Method',
      title: 'Precision.',
      text: 'Clean codebases, strict TypeScript interfaces, reusable UI components, and maintainable systems.',
    },
  ],
  skills: {
    frontend: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS v4', 'Framer Motion', 'WebGL / Canvas', 'GSAP'],
    backend: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'Supabase', 'REST & GraphQL APIs', 'Redis'],
    aiAutomation: ['AI Agents & LLM Tooling', 'RAG Pipelines', 'Prompt Engineering', 'n8n Workflow Automation', 'LangChain'],
    tools: ['Git / GitHub', 'Docker', 'Vercel', 'Postman', 'Figma', 'Linux / Bash Scripting'],
  },
};

export const journeyExperience: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Software Architect & Engineer',
    role: 'Lead Systems Architect',
    period: '2023 - Present',
    organization: 'Kuber Bassi Labs',
    description: 'Designing and building high-performance full-stack web applications, AI automation tools, and interactive WebGL components.',
    highlights: [
      'Architected Zenith academic collaboration platform using React & Node.js',
      'Engineered YT Music Scrobbler Chrome extension & background automation daemon',
      'Built 3D Scroll-Linked & Button-Navigated Book Codex open-source component for React',
    ],
  },
  {
    id: 'exp-2',
    title: 'Hackathon Systems Engineering',
    role: 'Full-Stack Developer',
    period: '2024',
    organization: 'Vanguard Logic',
    description: 'Collaborative engineering focused on rapid MVP delivery, AI legal assistance RAG, and scalable frontend UI components.',
    highlights: [
      'Designed AI-driven legal info platform Adhikar AI',
      'Implemented real-time data streaming & response rendering',
      'Standardized reusable UI component libraries for team builds',
    ],
  },
];
