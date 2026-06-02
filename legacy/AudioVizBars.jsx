import React from 'react';

export const AudioVizBars = () => {
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

export default AudioVizBars;
