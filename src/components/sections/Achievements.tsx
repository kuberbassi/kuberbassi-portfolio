import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, Zap, Award, Star, Activity } from 'lucide-react';
import { TiltCard } from '../ui/TiltCard';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { staggerContainer, staggerItem } from '../../lib/motion';

interface MetricItem {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}

const METRICS: MetricItem[] = [
  {
    id: 'm1',
    label: 'SYSTEM ARCHITECTURE',
    value: '10+',
    subtitle: 'Production web platforms & AI agents engineered',
    icon: Cpu,
  },
  {
    id: 'm2',
    label: 'GITHUB REPOSITORY TELEMETRY',
    value: '100%',
    subtitle: 'Automated signals & public proof of work',
    icon: Code2,
  },
  {
    id: 'm3',
    label: 'PERFORMANCE BENCHMARK',
    value: '99/100',
    subtitle: 'Lighthouse & Core Web Vitals optimized',
    icon: Zap,
  },
  {
    id: 'm4',
    label: 'CODEBASE TYPE SAFETY',
    value: 'Strict TS',
    subtitle: 'Zero compromises on static typing & resilience',
    icon: Activity,
  },
];

export function Achievements() {
  const { playHover } = useSoundEngine();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {METRICS.map((metric) => {
        const Icon = metric.icon;
        return (
          <motion.div key={metric.id} variants={staggerItem}>
            <TiltCard
              cursorLabel="METRIC"
              className="p-7 sm:p-8 rounded-2xl h-full flex flex-col justify-between gap-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="type-xs font-mono font-bold text-[var(--color-accent)]">
                  {metric.label}
                </span>
                <Icon size={18} className="text-[var(--color-text-muted)]" />
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--color-text-primary)] tracking-tighter">
                  {metric.value}
                </span>
                <p className="type-sm text-[var(--color-text-secondary)]">
                  {metric.subtitle}
                </p>
              </div>
            </TiltCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
