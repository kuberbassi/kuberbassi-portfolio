import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './BookCodex.css';

export default function BookCodex({ projectData = [] }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const bookContainerRef = useRef(null);
  const [currentSheet, setCurrentSheet] = useState(0);
  const isAnimatingRef = useRef(false);
  
  const sheetRefs = useRef([]);
  sheetRefs.current = [];

  const coverRef = useRef(null);
  const outsideSpineRef = useRef(null);
  const insideSpineRef = useRef(null);

  const displayProjects = projectData && projectData.length > 0 ? projectData : [];

  const INDEX_ITEMS_PER_PAGE = 10;
  const indexChunks = [];
  for (let i = 0; i < displayProjects.length; i += INDEX_ITEMS_PER_PAGE) {
    indexChunks.push({
      chunk: displayProjects.slice(i, i + INDEX_ITEMS_PER_PAGE),
      startIndex: i
    });
  }

  const pagesList = [];
  let currentPageNumber = 1;

  if (indexChunks.length > 1) {
    for (let i = 1; i < indexChunks.length; i++) {
      pagesList.push({
        type: 'index',
        projects: indexChunks[i].chunk,
        startIndex: indexChunks[i].startIndex,
        pageNumber: currentPageNumber++
      });
    }
  }

  const projectChapters = [];
  for (let i = 0; i < displayProjects.length; i += 2) {
    projectChapters.push(displayProjects.slice(i, i + 2));
  }

  projectChapters.forEach((chapter, index) => {
    pagesList.push({
      type: 'projects',
      projects: chapter,
      pageNumber: currentPageNumber++,
      chapterNumber: index + 1
    });
  });

  pagesList.push({
    type: 'end',
    pageNumber: currentPageNumber++
  });

  const bookSheets = [];
  for (let i = 0; i < pagesList.length; i += 2) {
    bookSheets.push({
      front: pagesList[i],
      back: pagesList[i + 1] || null
    });
  }

  const totalSheets = bookSheets.length + 1;

  const handleOpenLink = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    const sheetsCount = bookSheets.length;
    const coverMaxZ = (sheetsCount + 2) * 4;
    const maxZIndex = sheetsCount + 20;

    gsap.set(coverRef.current, { rotateY: 0, z: coverMaxZ, zIndex: maxZIndex });

    sheetRefs.current.forEach((sheetEl, index) => {
      if (!sheetEl) return;
      const initialZ = (sheetsCount - index + 1) * 4;
      const initialZIndex = sheetsCount - index + 5;
      gsap.set(sheetEl, { rotateY: 0, z: initialZ, zIndex: initialZIndex });
    });

    if (outsideSpineRef.current) gsap.set(outsideSpineRef.current, { opacity: 1 });
    if (insideSpineRef.current) gsap.set(insideSpineRef.current, { opacity: 0 });
  }, [bookSheets.length]);

  const flipToSheet = (targetIndex) => {
    if (isAnimatingRef.current) return;
    if (targetIndex < 0 || targetIndex > totalSheets) return;

    isAnimatingRef.current = true;
    const sheetsCount = bookSheets.length;
    const isGoingForward = targetIndex > currentSheet;

    let targetEl = null;
    let targetZIndex = 1;
    let finalRotate = 0;
    let finalZ = 0;

    if (isGoingForward) {
      if (currentSheet === 0) {
        targetEl = coverRef.current;
        finalRotate = -180;
        finalZ = 4;
        targetZIndex = 1;

        if (outsideSpineRef.current) gsap.to(outsideSpineRef.current, { opacity: 0, duration: 0.4 });
        if (insideSpineRef.current) gsap.to(insideSpineRef.current, { opacity: 1, duration: 0.4 });
      } else {
        const sheetIdx = currentSheet - 1;
        targetEl = sheetRefs.current[sheetIdx];
        finalRotate = -180;
        finalZ = (sheetIdx + 2) * 4;
        targetZIndex = sheetIdx + 2;
      }
    } else {
      if (targetIndex === 0) {
        targetEl = coverRef.current;
        finalRotate = 0;
        finalZ = (sheetsCount + 2) * 4;
        targetZIndex = sheetsCount + 20;

        if (outsideSpineRef.current) gsap.to(outsideSpineRef.current, { opacity: 1, duration: 0.4 });
        if (insideSpineRef.current) gsap.to(insideSpineRef.current, { opacity: 0, duration: 0.4 });
      } else {
        const sheetIdx = targetIndex - 1;
        targetEl = sheetRefs.current[sheetIdx];
        finalRotate = 0;
        finalZ = (sheetsCount - sheetIdx + 1) * 4;
        targetZIndex = sheetsCount - sheetIdx + 5;
      }
    }

    if (targetEl) {
      gsap.to(targetEl, {
        rotateY: finalRotate,
        z: finalZ,
        duration: 0.75,
        ease: "power2.inOut",
        onUpdate: function() {
          if (this.progress() > 0.5) {
            gsap.set(targetEl, { zIndex: targetZIndex });
          }
        },
        onComplete: () => {
          setCurrentSheet(targetIndex);
          isAnimatingRef.current = false;
        }
      });
    } else {
      isAnimatingRef.current = false;
    }
  };

  const handleNext = () => flipToSheet(currentSheet + 1);
  const handlePrev = () => flipToSheet(currentSheet - 1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSheet]);

  const renderProjectSpread = (chapterProjects, pageNumber, chapterNumber) => (
    <div className="mp-parchmentPage project-ledger-page">
      <span className="page-number">{String(pageNumber).padStart(2, '0')}</span>
      <span className="page-project-kicker">PROJECT LEDGER {String(chapterNumber).padStart(2, '0')}</span>
      <div className="book-project-ledger">
        {chapterProjects.length > 0 ? chapterProjects.map((project, index) => (
          <article className="book-project-entry" key={project.projectId || `${project.title}-${index}`}>
            <span className="book-entry-number">
              {String(pageNumber).padStart(2, '0')}.{index + 1}
            </span>
            <h2>{project.title}</h2>
            <p>{project.desc || 'GitHub repository details are syncing.'}</p>
            <div className="book-project-actions">
              {project.link && (
                <button onClick={(e) => { e.stopPropagation(); handleOpenLink(project.link); }} className="book-text-btn">
                  LIVE
                </button>
              )}
              <button onClick={(e) => { e.stopPropagation(); handleOpenLink(project.github || '#'); }} className="book-text-btn">
                SOURCE
              </button>
              <div className="page-tech-tags" style={{ marginLeft: 'auto' }}>
                {(project.tech || []).slice(0, 2).map((t, idx) => <span key={idx}>{t}</span>)}
              </div>
            </div>
          </article>
        )) : (
          <article className="book-project-entry is-empty">
            <span className="book-entry-number">{String(pageNumber).padStart(2, '0')}.0</span>
            <h2>Awaiting Signal</h2>
            <p>More public repositories will appear here automatically when GitHub syncs.</p>
          </article>
        )}
      </div>
    </div>
  );

  const renderPage = (page) => {
    if (!page) {
      return (
        <div className="mp-parchmentPage book-empty-page">
          <div className="book-runes" style={{ margin: 'auto', fontSize: '1.2rem', color: 'rgba(139, 107, 61, 0.25)', letterSpacing: '4px' }}>
            ✦ ✧ ✦
          </div>
        </div>
      );
    }
    if (page.type === 'index') {
      return (
        <div className="mp-parchmentPage book-index project-ledger-page">
          <span className="page-number">{String(page.pageNumber).padStart(2, '0')}</span>
          <span className="page-project-kicker">THE INVENTORY (CONT.)</span>
          <ul className="book-index-list" style={{ maxHeight: 'none', marginTop: '24px' }}>
            {page.projects.map((project, idx) => {
              const actualIdx = page.startIndex + idx;
              return (
                <li key={project.projectId || `${project.title}-${actualIdx}`}>
                  {String(actualIdx + 1).padStart(2, '0')}. {project.title}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    if (page.type === 'projects') {
      return renderProjectSpread(page.projects, page.pageNumber, page.chapterNumber);
    }
    if (page.type === 'end') {
      return (
        <div className="mp-parchmentPage book-end">
          <h3>THE PACT</h3>
          <p>An ongoing record of systems, experiments, music, and creative exploration.</p>
          <div className="book-runes" style={{ margin: '30px 0', fontSize: '1.2rem', color: 'var(--mp-gold)', letterSpacing: '4px' }}>
            ✦ ✧ ✶ ✵ ✧ ✦
          </div>
          <div style={{ fontSize: '0.62rem', opacity: 0.5, fontFamily: "'JetBrains Mono', monospace" }}>
            ARCHIVE COMPILER • ACTIVE
          </div>
        </div>
      );
    }
    return null;
  };

  const reversedSheets = [...bookSheets].reverse();

  return (
    <div className="mp-bookSection">
      <div className="mp-bookSticky">
        <div ref={bookContainerRef} className="mp-bookContainer">
          <div ref={outsideSpineRef} className="mp-bookSpine" />
          <div ref={insideSpineRef} className="mp-bookSpine-inside" />
          
          <div className="mp-bookBackCover" style={{ transformStyle: 'preserve-3d' }}>
            <div className="mp-pageSide page-front" style={{ transform: 'translateZ(-1px)' }}>
              <div className="mp-parchmentPage book-end-cover">
                <div className="book-runes" style={{ margin: 'auto', fontSize: '1.2rem', color: 'rgba(139, 107, 61, 0.25)', letterSpacing: '4px' }}>
                  ✦ ✧ ✶ ✵ ✧ ✦
                </div>
              </div>
            </div>
          </div>

          {reversedSheets.map((sheet, index) => {
            const originalIndex = bookSheets.length - 1 - index;
            return (
              <div 
                key={originalIndex}
                ref={el => { sheetRefs.current[originalIndex] = el; }}
                className="mp-bookSheet" 
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="mp-pageSide page-front" style={{ transform: 'translateZ(1px)' }}>
                  <div className="page-turn-zone right-zone" onClick={handleNext}>
                    <span className="page-turn-arrow">›</span>
                  </div>
                  {renderPage(sheet.front)}
                </div>
                <div className="mp-pageSide page-back" style={{ transform: 'rotateY(180deg) translateZ(1px)' }}>
                  <div className="page-turn-zone left-zone" onClick={handlePrev}>
                    <span className="page-turn-arrow">‹</span>
                  </div>
                  {renderPage(sheet.back)}
                </div>
              </div>
            );
          })}

          <div 
            ref={coverRef}
            className="mp-bookSheet book-cover-sheet" 
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mp-pageSide cover-front" style={{ transform: 'translateZ(1px)' }} onClick={handleNext}>
              <div className="mp-bookCoverDesign">
                <div className="cover-filigree-border" />
                <div className="cover-corner top-left" />
                <div className="cover-corner top-right" />
                <div className="cover-corner bottom-left" />
                <div className="cover-corner bottom-right" />
                
                <div className="cover-magical-symbol">
                  <div className="symbol-outer-ring">
                    <svg viewBox="0 0 100 100" className="runic-text-path">
                      <path id="circlePath" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
                      <text>
                        <textPath href="#circlePath" startOffset="0%">
                          ✦ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ✦ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ✦ ᛈ ᛉ ᛋ ᛏ ᛒ ✦ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ✦
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <div className="symbol-inner-pentagram">
                    <svg viewBox="0 0 100 100">
                      <polygon points="50,12 19,87 91,40 9,40 81,87" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
                      <circle cx="50" cy="53" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mp-pageSide cover-back" style={{ transform: 'rotateY(180deg) translateZ(1px)' }}>
              <div className="page-turn-zone left-zone" onClick={handlePrev}>
                <span className="page-turn-arrow">‹</span>
              </div>
              <div className="mp-parchmentPage book-index">
                <h3>THE INVENTORY</h3>
                <p>An evolving archive of systems, tools, experiments, and creative builds.</p>
                <ul className="book-index-list" style={{ maxHeight: 'none' }}>
                  {(indexChunks[0]?.chunk || []).map((project, idx) => (
                    <li key={project.projectId || `${project.title}-${idx}`}>
                      {String(idx + 1).padStart(2, '0')}. {project.title}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '40px', fontSize: '0.62rem', opacity: 0.5, fontFamily: "'JetBrains Mono', monospace" }}>
                  COMPILER: NODE_PROCESS • READY
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Button Navigation Control Bar */}
      <div className="book-nav-bar">
        <button 
          className="book-nav-btn" 
          onClick={handlePrev} 
          disabled={currentSheet === 0}
        >
          ‹ PREVIOUS
        </button>

        <span className="book-nav-indicator">
          {currentSheet === 0 ? 'COVER CLOSED' : `SHEET ${currentSheet} OF ${totalSheets - 1}`}
        </span>

        <button 
          className="book-nav-btn" 
          onClick={handleNext} 
          disabled={currentSheet === totalSheets - 1}
        >
          NEXT ›
        </button>
      </div>
    </div>
  );
}
