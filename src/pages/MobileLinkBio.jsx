import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import SpellText from '../components/SpellText';
import { identity } from '../data/identity';
import { musicChannels } from '../data/music';
import { getInitialProjects, enrichProjects } from '../data/projects';
import { fetchGitHubProfile } from '../utils/githubProfile';
import audioSynth from '../utils/audioSynth';
import '../styles/MobileLinkBio.css';

export default function MobileLinkBio({ onViewDesktop }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem('v6_github_cache');
      if (cached) {
        const { data } = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }
    return getInitialProjects();
  });
  const [soundOn, setSoundOn] = useState(false);
  const [activeChannel, setActiveChannel] = useState('SCANNING FREQUENCIES');
  const [sysTime, setSysTime] = useState('');

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSysTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch GitHub profile info for avatar
  useEffect(() => {
    let mounted = true;
    fetchGitHubProfile(identity.githubUser)
      .then((profileData) => {
        if (mounted && profileData) {
          setProfile(profileData);
        }
      })
      .catch(() => null);

    const fetchGitHubData = async () => {
      const _cacheKey = 'v6_github_cache';
      try {
        const enriched = await enrichProjects();
        if (mounted) {
          setProjects(enriched);
        }
      } catch {
        // ignore
      }
    };

    fetchGitHubData();

    return () => {
      mounted = false;
      audioSynth.stopDrone();
    };
  }, []);

  // Toggle ambient music drone
  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    if (nextState) {
      audioSynth.startDrone();
      setActiveChannel('LP v4.0 • TRANSMITTING');
    } else {
      audioSynth.stopDrone();
      setActiveChannel('SCANNING FREQUENCIES');
    }
  };

  // Play chime and open link
  const handleLinkTap = (url, name) => {
    const frequencies = [329.63, 440.00, 493.88, 659.25, 783.99, 987.77];
    const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
    audioSynth.triggerChime(freq);
    
    if (soundOn) {
      setActiveChannel(`TUNED: ${name.toUpperCase()}`);
    }

    // Delay slightly to let the audio play before opening
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 150);
  };

  return (
    <div className="ml-container">
      <SEO
        title="Kuber Bassi | Software Architect & Music Producer"
        description="Portfolio of Kuber Bassi, a Software Architect & Music Producer crafting high-performance full-stack applications, automation systems, and original instrumentals."
        keywords="Kuber Bassi, Software Architect, Software Engineer, Music Producer, Full-Stack Developer, Systems Engineering, UI/UX, Web Dev, React, Node, Guitarist, Artist"
        ogType="website"
        url="https://kuberbassi.com/"
      />

      <div className="ml-grid-overlay" />
      <div className="ml-orb ml-orb-green" />
      <div className="ml-orb ml-orb-red" />
      <div className="ml-orb ml-orb-purple" />

      <div className="ml-content">
        {/* System Bar */}
        <div className="ml-system-bar">
          <span className="status-active">
            <span className="status-dot" />
            [PORTAL SYSTEM ACTIVE]
          </span>
          <span>{sysTime || '00:00:00'} // UTC+5.5</span>
        </div>

        {/* Profile Section */}
        <motion.div 
          className="ml-profile"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="ml-avatar-container">
            <div className="ml-avatar-ring" />
            <div className="ml-avatar-ring-inner" />
            <div className="ml-avatar-hud-corners" />
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={identity.name} 
                className="ml-avatar"
              />
            ) : (
              <div className="ml-avatar-fallback">
                <span>KB</span>
              </div>
            )}
          </div>

          <div className="ml-name-container">
            <h1>
              <SpellText text={identity.name} triggerSound={false} />
            </h1>
            <div className="ml-handle">@{identity.handle}</div>
            <div className="ml-role">{identity.role}</div>
            <p className="ml-intro">{identity.intro}</p>
          </div>
        </motion.div>

        {/* Skewomorphic Sound Module */}
        <motion.div 
          className="ml-audio-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="audio-header">
            <div className="audio-title-group">
              <span className="audio-label">ATMOSPHERIC FREQUENCY</span>
              <span className="audio-channel-name">{activeChannel}</span>
            </div>
            <div className={`audio-wave-anim ${soundOn ? 'is-active' : ''}`}>
              <div className="audio-wave-bar" />
              <div className="audio-wave-bar" />
              <div className="audio-wave-bar" />
              <div className="audio-wave-bar" />
              <div className="audio-wave-bar" />
            </div>
          </div>

          <button 
            onClick={handleToggleSound}
            className={`audio-toggle-btn ${soundOn ? 'is-active' : ''}`}
          >
            <span className="led" />
            <span>{soundOn ? 'MUTED / OFF' : 'ACTIVATE AMBIENT AUDIO'}</span>
          </button>
        </motion.div>

        {/* Section: Channels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="ml-section-header">
            <span className="ml-section-num">01</span>
            <h2 className="ml-section-title">Resonance</h2>
            <div className="ml-section-line" />
          </div>
        </motion.div>

        {/* Platforms Grid */}
        <motion.div 
          className="ml-links-grid"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {/* GitHub Link */}
          <button 
            onClick={() => handleLinkTap('https://github.com/kuberbassi', 'GitHub')}
            className="ml-link-card" 
            data-platform="github"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-brands fa-github"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">GitHub</span>
              <span className="ml-link-card-desc">Code & repos</span>
            </div>
          </button>

          {/* LinkedIn Link */}
          <button 
            onClick={() => handleLinkTap('https://www.linkedin.com/in/kuberbassi/', 'LinkedIn')}
            className="ml-link-card" 
            data-platform="linkedin"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">LinkedIn</span>
              <span className="ml-link-card-desc">Professional network</span>
            </div>
          </button>

          {/* YouTube Link */}
          <button 
            onClick={() => handleLinkTap(musicChannels[0].url, 'YouTube')}
            className="ml-link-card" 
            data-platform="youtube"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-brands fa-youtube"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>TRANSMITTING</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">YouTube</span>
              <span className="ml-link-card-desc">Performances & clips</span>
            </div>
          </button>

          {/* Spotify Link */}
          <button 
            onClick={() => handleLinkTap(musicChannels[1].url, 'Spotify')}
            className="ml-link-card" 
            data-platform="spotify"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-brands fa-spotify"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">Spotify</span>
              <span className="ml-link-card-desc">Studio releases</span>
            </div>
          </button>

          {/* Apple Music Link */}
          <button 
            onClick={() => handleLinkTap(musicChannels[2].url, 'Apple Music')}
            className="ml-link-card" 
            data-platform="apple"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-brands fa-apple"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>ACTIVE</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">Apple Music</span>
              <span className="ml-link-card-desc">High-quality audio</span>
            </div>
          </button>

          {/* Amazon Music Link */}
          <button 
            onClick={() => handleLinkTap(musicChannels[4].url, 'Amazon')}
            className="ml-link-card" 
            data-platform="amazon"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-brands fa-amazon"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">Amazon Music</span>
              <span className="ml-link-card-desc">Extended catalog</span>
            </div>
          </button>

          {/* Instagram Link */}
          <button 
            onClick={() => handleLinkTap('https://www.instagram.com/kuber.bassi/', 'Instagram')}
            className="ml-link-card" 
            data-platform="instagram"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-brands fa-instagram"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>ACTIVE</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">Instagram</span>
              <span className="ml-link-card-desc">Creative updates</span>
            </div>
          </button>

          {/* Email Link */}
          <button 
            onClick={() => handleLinkTap(`mailto:${identity.email}`, 'Email')}
            className="ml-link-card" 
            data-platform="email"
          >
            <div className="ml-link-card-header">
              <div className="ml-link-icon-container">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <span className="ml-link-status">
                <span className="ml-link-status-dot" />
                <span>DIRECT</span>
              </span>
            </div>
            <div className="ml-link-card-info">
              <span className="ml-link-card-title">Email</span>
              <span className="ml-link-card-desc">me@kuberbassi.com</span>
            </div>
          </button>
        </motion.div>

        {/* Section: Projects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="ml-section-header">
            <span className="ml-section-num">02</span>
            <h2 className="ml-section-title">Arsenal</h2>
            <div className="ml-section-line" />
          </div>
        </motion.div>

        {/* Featured Projects Stack */}
        <motion.div 
          className="ml-projects-list"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {projects.slice(0, 4).map((project, i) => (
            <div key={project.projectId || i} className="ml-project-card">
              <div className="project-card-header">
                <span className="project-card-id">{project.projectId || `PROJ-${100 + i}`}</span>
                <span className="project-stars">
                  <i className="fa-solid fa-star"></i>
                  {project.stars}
                </span>
              </div>
              
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              
              <div className="project-meta">
                <div className="project-tags">
                  {(project.tech || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="project-links">
                  {project.github && (
                    <button 
                      onClick={() => handleLinkTap(project.github, project.title)}
                      className="project-link-btn"
                      aria-label="GitHub Repository"
                    >
                      <i className="fa-brands fa-github"></i>
                    </button>
                  )}
                  {project.link && (
                    <button 
                      onClick={() => handleLinkTap(project.link, project.title)}
                      className="project-link-btn"
                      aria-label="Live Site"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Telemetry/System Stats */}
        <motion.div 
          className="ml-stats-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stat-row">
            <span>PUBLIC WORKFLOW SIGNALS:</span>
            <span className="stat-value">{profile?.public_repos || 8} ENERGETIC NODES</span>
          </div>
          <div className="stat-row">
            <span>GITHUB FOLLOWERS:</span>
            <span className="stat-value">{profile?.followers || 0} DELEGATES</span>
          </div>
          <div className="stat-row">
            <span>COGNITIVE PLATFORM:</span>
            <span className="stat-value">REACT 19 + VITE</span>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="ml-footer">
          <button 
            onClick={onViewDesktop}
            className="ml-desktop-btn"
          >
            <i className="fa-solid fa-laptop"></i>
            <span>VIEW DESKTOP SITE</span>
          </button>
          
          <div className="ml-copyright">
            © {new Date().getFullYear()} KUBER BASSI. ALL RIGHTS RESERVED.
          </div>
          
          <div className="ml-sigil">✦</div>
        </div>
      </div>
    </div>
  );
}
