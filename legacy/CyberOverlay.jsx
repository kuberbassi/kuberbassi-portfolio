import React, { useState, useEffect } from 'react';

// --- AUDIO VISUALIZER BARS ---
const AudioVizBars = () => {
    const bars = [
        { speed: '0.6s', max: '10px' },
        { speed: '0.9s', max: '14px' },
        { speed: '0.7s', max: '8px'  },
        { speed: '1.1s', max: '12px' },
        { speed: '0.8s', max: '11px' },
        { speed: '0.5s', max: '9px'  },
    ];
    return (
        <div className="v4-audioViz">
            {bars.map((b, i) => (
                <div
                    key={i}
                    className="v4-audioBar"
                    style={{ '--bar-speed': b.speed, '--bar-max': b.max }}
                />
            ))}
        </div>
    );
};

export const CyberOverlay = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [latency, setLatency] = useState(12);
    const [uptime, setUptime] = useState(0);
    const [scrollPct, setScrollPct] = useState(0);
    const [fps, setFps] = useState(60);

    useEffect(() => {
        const start = Date.now();

        // Clock + Uptime + Latency
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setUptime(Math.floor((Date.now() - start) / 1000));
            setLatency(Math.max(4, Math.min(28, 12 + Math.round((Math.random() - 0.5) * 8))));
        }, 1000);

        // Scroll depth
        const onScroll = () => {
            const doc = document.documentElement;
            const pct = Math.round((doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100) || 0;
            setScrollPct(pct);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // FPS counter
        let frames = 0;
        let lastFps = performance.now();
        let raf;
        const countFps = () => {
            frames++;
            const now = performance.now();
            if (now - lastFps >= 1000) {
                setFps(frames);
                frames = 0;
                lastFps = now;
            }
            raf = requestAnimationFrame(countFps);
        };
        raf = requestAnimationFrame(countFps);

        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const fmtUptime = `${String(Math.floor(uptime / 60)).padStart(2, '0')}:${String(uptime % 60).padStart(2, '0')}`;
    const mono = { fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' };

    return (
        <div className="v4-cyberOverlay">
            <div className="v4-scanline"></div>

            {/* TOP LEFT — Identity */}
            <div className="v4-hudCorner top-left" style={{ padding: '10px 0 0 10px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'Anton', fontSize: '1.2rem', lineHeight: 1 }}>KUBER BASSI</span>
                <span style={{ ...mono, opacity: 0.7 }}>SYSTEM ARCHITECT</span>
            </div>

            {/* TOP RIGHT — Status */}
            <div className="v4-hudCorner top-right" style={{ padding: '20px 40px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <span style={{ ...mono, whiteSpace: 'nowrap' }}>CMD: //ROOT_ACCESS</span>
                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e', animation: 'pulse 2s infinite' }}></div>
            </div>

            {/* BOTTOM LEFT — Telemetry */}
            <div className="v4-hudCorner bottom-left" style={{ padding: '0 0 10px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                <span style={mono}>LOC: 28.61° N, 77.20° E</span>
                <span style={{ ...mono, opacity: 0.7 }}>LATENCY: {latency}ms &nbsp;|&nbsp; {fps} FPS</span>
                <span style={{ ...mono, opacity: 0.5 }}>DEPTH: {scrollPct}% &nbsp;|&nbsp; UP {fmtUptime}</span>
            </div>

            {/* BOTTOM RIGHT — Clock + Audio Viz */}
            <div className="v4-hudCorner bottom-right" style={{ padding: '0 10px 10px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <AudioVizBars />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>{time}</span>
                <span style={mono}>SECURE CONNECTION</span>
            </div>
        </div>
    );
};

export default CyberOverlay;
