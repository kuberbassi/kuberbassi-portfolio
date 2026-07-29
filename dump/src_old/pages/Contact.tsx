import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { profile } from '../data/profile';
import { socials } from '../data/socials';
import { Mail, Send, CheckCircle2, ArrowUpRight, MessageSquare, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <Badge variant="crimson">✦ INITIATE TRANSMISSION ✦</Badge>
          <h1 className="text-display font-heading font-extrabold text-white">
            Get in <span className="text-gradient-crimson">Touch</span>.
          </h1>
          <p className="text-body-lg text-slate-300 leading-relaxed">
            Available for software architecture, AI workflow automation, product engineering, full-stack applications, and technical consulting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <Card className="p-8 space-y-6 border-slate-800 bg-slate-950/80">
              <h2 className="text-title-2 font-heading text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-400" />
                <span>Send a Direct Message</span>
              </h2>

              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="font-heading font-bold text-xl text-white">Transmission Received!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. I will review your message and reply to <strong className="text-emerald-400 font-mono">{formData.email}</strong> shortly.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                    SEND ANOTHER TRANSMISSION
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 font-bold uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Kuber Bassi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500/60"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300 font-bold uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-bold uppercase">Subject / Project Scope</label>
                    <input
                      type="text"
                      placeholder="Full-Stack Web App / AI Automation / Consulting"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-bold uppercase">Message Details</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your project requirements, timeline, or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500/60 resize-none"
                    />
                  </div>

                  <Button variant="crimson" size="lg" type="submit" icon={<Send className="w-4 h-4" />}>
                    SEND TRANSMISSION
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Sidebar Channels */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-4 border-slate-800 bg-slate-950/80 p-6">
              <h3 className="font-heading font-bold text-lg text-white border-b border-slate-900 pb-3">
                Direct Contact
              </h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 text-slate-200 hover:text-rose-400 transition-all"
                >
                  <Mail className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <span className="block font-heading font-bold text-sm">{profile.email}</span>
                    <span className="text-[11px] font-mono text-slate-400">Direct Email Inbox</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block font-heading font-bold text-sm">{profile.location}</span>
                    <span className="text-[11px] font-mono text-slate-400">Location</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="space-y-4 border-slate-800 bg-slate-950/80 p-6">
              <h3 className="font-heading font-bold text-lg text-white border-b border-slate-900 pb-3">
                Social Profiles & Networks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-white transition-all flex items-center justify-between text-xs font-mono"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
