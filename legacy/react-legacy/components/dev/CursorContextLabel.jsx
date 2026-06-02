import React, { useEffect, useRef } from 'react';

export const CursorContextLabel = () => {
    const labelRef = useRef(null);

    useEffect(() => {
        const label = labelRef.current;
        if (!label) return;

        const onMove = (e) => {
            label.style.left = `${e.clientX}px`;
            label.style.top  = `${e.clientY}px`;
        };

        const onEnterCard = (e) => {
            const card = e.target.closest('.v4-projectCardNew');
            const link = e.target.closest('a, button:not(.v4-navArrow)');
            if (card) {
                label.textContent = card.classList.contains('is-active') ? '◈ FLIP' : '◈ FOCUS';
                label.classList.add('visible');
            } else if (link && !e.target.closest('.v4-cardBack')) {
                label.textContent = 'GO →';
                label.classList.add('visible');
            } else {
                label.classList.remove('visible');
            }
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseover', onEnterCard);
        return () => {
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onEnterCard);
        };
    }, []);

    return <div ref={labelRef} className="v4-cursorLabel" />;
};

export default CursorContextLabel;
