import React, { useState, useEffect } from 'react';

export const HyperText = ({ text, className, style }) => {
    const [display, setDisplay] = useState(text);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#&";

    const scramble = () => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 30);
    };

    // Scramble on mount
    useEffect(() => {
        scramble();
    }, [text]);

    return (
        <span className={className} style={style} onMouseOver={scramble}>
            {display}
        </span>
    );
};

export default HyperText;
