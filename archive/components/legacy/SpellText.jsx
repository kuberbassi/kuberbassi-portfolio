import React, { useState, useEffect } from 'react';
import audioSynth from '../utils/audioSynth';

export const SpellText = ({ text, className, style, triggerSound = true }) => {
    const [display, setDisplay] = useState(text);
    const isAnimating = React.useRef(false);
    const runes = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟ✦✧◆◇✶";

    const scramble = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        if (triggerSound) {
            // Trigger a quick pentatonic chime note from our synth engine
            const scales = [329.63, 440.00, 493.88, 659.25, 783.99, 987.77]; // E4, A4, B4, E5, G5, B5
            const chimeFreq = scales[Math.floor(Math.random() * scales.length)];
            audioSynth.triggerChime(chimeFreq);
        }

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(
                text
                    .split("")
                    .map((letter, index) => {
                        if (letter === " ") return " ";
                        if (index < iteration) {
                            return text[index];
                        }
                        return runes[Math.floor(Math.random() * runes.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                isAnimating.current = false;
                setDisplay(text); // ensure perfect resolution
            }
            iteration += 1.5; // Scramble resolve step size increased for speed
        }, 20);
    };

    // Scramble on text changes / mount
    useEffect(() => {
        scramble();
    }, [text]);

    return (
        <span 
            className={`spell-text ${className || ''}`} 
            style={{ 
                ...style,
                position: 'relative',
                display: 'inline-block'
            }} 
            onMouseEnter={scramble}
        >
            {display}
        </span>
    );
};

export default SpellText;
