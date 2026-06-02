import React from 'react';

export const TerminalWidget = () => {
    return (
        <div className="v4-terminalWidget" style={{ animation: 'fadeIn 2s ease forwards 1s' }}>
            <div className="v4-termHeader">
                <div className="v4-termDot red"></div>
                <div className="v4-termDot yellow"></div>
                <div className="v4-termDot green"></div>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">kuber@system:~$</span>
                <span>init_protocol --no-legacy --ai-native</span>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">system:</span>
                <span>Optimizing Neural Networks... [OK]</span>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">info:</span>
                <span>Contact: me@kuberbassi.com</span>
            </div>
            <div className="v4-termLine">
                <span className="v4-termPrompt">system:</span>
                <span>Accessing Portfolio... <span className="v4-termCursor"></span></span>
            </div>
        </div>
    );
};

export default TerminalWidget;
