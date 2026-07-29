import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { TiltCard } from '../ui/TiltCard';
import { profile } from '../../data/profile';

type SkillCategory = 'frontend' | 'backend' | 'aiAutomation' | 'tools';

const CATEGORIES: { label: string; key: SkillCategory }[] = [
  { label: 'Frontend Architecture', key: 'frontend' },
  { label: 'Backend & Cloud Systems', key: 'backend' },
  { label: 'AI Agents & Automation', key: 'aiAutomation' },
  { label: 'Infrastructure & Tools', key: 'tools' },
];

export function SkillsMatrix() {
  const [activeTab, setActiveTab] = useState<SkillCategory>('frontend');

  const activeSkills = profile.skills[activeTab];

  return (
    <div className="flex flex-col gap-8">
      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Skill categories"
        className="flex flex-wrap gap-2.5 p-1.5 surface rounded-xl border border-[var(--color-border)] w-fit"
      >
        {CATEGORIES.map(({ label, key }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={[
              'px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all duration-300',
              activeTab === key
                ? 'bg-[var(--color-accent)] text-black shadow-md'
                : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Skills Grid for Selected Category */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {activeSkills.map((skill, index) => (
            <TiltCard key={skill} cursorLabel="SKILL" className="p-6 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0 animate-pulse" />
                <span className="type-sm font-semibold text-[var(--color-text-primary)] truncate">
                  {skill}
                </span>
              </div>
              <Badge variant="accent" className="font-mono text-[10px] flex-shrink-0">
                0{index + 1}
              </Badge>
            </TiltCard>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
