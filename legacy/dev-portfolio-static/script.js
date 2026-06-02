document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    const mainContent = document.getElementById('main-content');

    // --- SETUP FUNCTIONS ---
    setupInteractiveText();
    setupMobileNav();
    renderProjects();
    setupInteractiveImage();
    setupScrollBasedAnimations();
    setupCustomCursor();
    setupHeaderInversion();
    setupAdvancedAnimations();
    createFloatingSymbols();
    setupParallax();

    // --- PRELOADER TIMELINE ---
    const tl = gsap.timeline();
    tl.to('.loading-bar', { width: '100%', duration: 2.5, ease: 'power3.inOut' })
        .to('.loading-percent', { innerText: 100, duration: 2.5, ease: 'power3.inOut', snap: 'innerText' }, '<')
        .to('.preloader-content', { opacity: 0, duration: 0.5, ease: 'power1.in' }, '-=0.5')
        .to('.top-gate', { height: 0, duration: 1.2, ease: 'expo.inOut' })
        .to('.bottom-gate', { height: 0, duration: 1.2, ease: 'expo.inOut' }, '<')
        .set('#preloader', { display: 'none' })
        .set(mainContent, { visibility: 'visible' })
        .from('.main-header', { y: '-100%', duration: 1, ease: 'expo.out' }, '-=0.8')
        .from('#hero .main-heading .char', { y: '100%', opacity: 0, stagger: 0.02, duration: 1, ease: 'expo.out' }, '-=1')
        .from('.hero-subtext', { opacity: 0, y: 20, duration: 1, ease: 'expo.out' }, '-=0.8')
        .from(['.hero-graphic', '.hero-blob'], { opacity: 0, scale: 0.5, stagger: 0.05, duration: 1.2, ease: 'expo.out' }, '<');


    // --- FUNCTION DEFINITIONS ---

    function setupMobileNav() {
        const toggleButton = document.querySelector('.mobile-nav-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const navLinks = document.querySelectorAll('.mobile-nav-link');

        if (!toggleButton || !mobileNav) return;

        const closeMenu = () => {
            toggleButton.classList.remove('is-active');
            mobileNav.classList.remove('is-active');
            document.body.classList.remove('no-scroll');
        };

        toggleButton.addEventListener('click', () => {
            toggleButton.classList.toggle('is-active');
            mobileNav.classList.toggle('is-active');
            document.body.classList.toggle('no-scroll');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                closeMenu();
            }
        });
    }

    function createFloatingSymbols() {
        const symbols = ['{}', '/>', ';', '+', '0', '1', 'Σ', '>', '<', '#', '&', '*', '@', '$', '%'];
        document.querySelectorAll('.symbol-container').forEach(container => {
            const symbolCount = container.parentElement.id === 'hero' ? 80 : 20;
            for (let i = 0; i < symbolCount; i++) {
                const span = document.createElement('span');
                span.classList.add('floating-symbol');
                span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                span.style.top = `${Math.random() * 100}%`;
                span.style.left = `${Math.random() * 100}%`;
                span.style.fontSize = `${Math.random() * 16 + 10}px`;
                span.style.opacity = Math.random() * 0.6 + 0.2;
                container.appendChild(span);
            }
        });
    }

    function setupParallax() {
        const parallaxLayers = {
            '.hero-blob': 25,
            '.hero-graphic': 50,
            '.floating-symbol': 80
        };
        window.addEventListener('mousemove', (e) => {
            let x = (e.clientX / window.innerWidth) - 0.5;
            let y = (e.clientY / window.innerHeight) - 0.5;
            for (const layer in parallaxLayers) {
                if (document.querySelector(layer)) {
                    const speed = parallaxLayers[layer];
                    gsap.to(layer, { x: x * speed, y: y * speed, duration: 1, ease: 'power2.out' });
                }
            }
        });
    }

    function setupInteractiveText(scope = document) {
        scope.querySelectorAll(".interactive-text").forEach(element => {
            if (element.classList.contains('js-processed')) return;
            element.classList.add('js-processed');
            const lines = element.querySelectorAll('.line');
            if (lines.length > 0) {
                lines.forEach(line => {
                    const originalText = line.textContent.trim();
                    line.innerHTML = originalText.split("").map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join("");
                });
            } else {
                const originalText = element.textContent.trim();
                element.innerHTML = originalText.split("").map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join("");
            }
            gsap.utils.toArray(element.querySelectorAll('.char')).forEach(char => {
                char.addEventListener('mouseenter', () => gsap.to(char, { y: -5, scale: 1.2, duration: 0.3, ease: 'power3.out' }));
                char.addEventListener('mouseleave', () => gsap.to(char, { y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }));
            });
        });
    }

    // ──────────────────────────────────────────────────────────────────────
    //  PROJECTS CAROUSEL
    // ──────────────────────────────────────────────────────────────────────

    function renderProjects() {
        const projects = [
            {
                title: "Adhikar AI",
                subtitle: "Legal AI · LegalTech",
                description: "AI-powered legal assistant simplifying Indian law into plain language for every citizen.",
                image: "images/projects/adhikar.ai.png",
                link: "https://adhikar.ai.kuberbassi.com/",
                github: "https://github.com/kuberbassi/adhikar-ai",
                tags: ["Llama 3.3 70B", "Groq API", "React", "Serverless"],
                gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                accent: "#a78bfa"
            },
            {
                title: "MCD HRMS",
                subtitle: "Enterprise · HR Tech",
                description: "Enterprise-grade HR management for tracking employee attendance, payroll & performance.",
                image: "images/projects/mcd-hrms.png",
                link: "https://mcd-hrms.web.app",
                github: "https://github.com/kuberbassi/mcd-hrms",
                tags: ["Enterprise", "HR Tech", "React"],
                gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #1a1a2e 100%)",
                accent: "#38bdf8"
            },
            {
                title: "AcadHub",
                subtitle: "Dashboard · Education",
                description: "Comprehensive academic management dashboard for streamlining educational workflows.",
                image: "images/projects/mcd-hrms.png",
                link: "https://acadhub.kuberbassi.com",
                github: "https://github.com/kuberbassi/acadhub",
                tags: ["Dashboard", "Education", "Node.js"],
                gradient: "linear-gradient(135deg, #0b3d2e 0%, #0d5940 50%, #062a1f 100%)",
                accent: "#34d399"
            },
            {
                title: "IndiaOnRoaming",
                subtitle: "Travel · Portal",
                description: "Vibrant travel portal showcasing diverse Indian landscapes with modern UX.",
                image: "images/projects/indiaonroaming.png",
                link: "https://indiaonroaming.com",
                github: null,
                tags: ["Travel", "Portal", "UX/UI"],
                gradient: "linear-gradient(135deg, #3d1515 0%, #5c1e1e 50%, #2a0d0d 100%)",
                accent: "#fb923c"
            },
            {
                title: "Sugandhmaya",
                subtitle: "E-commerce · Luxury",
                description: "Premium e-commerce platform for a luxury fragrance brand — elegant design, seamless UX.",
                image: "images/projects/sugandhmaya.png",
                link: "https://sugandhmaya.com",
                github: "https://github.com/kuberbassi/sugandhmaya.com",
                tags: ["E-commerce", "Luxury", "Design"],
                gradient: "linear-gradient(135deg, #2d1b00 0%, #4a2d00 50%, #1f1300 100%)",
                accent: "#fbbf24"
            }
        ];

        const section = document.querySelector('#works');
        if (!section) return;

        // Build carousel HTML
        const carouselHTML = `
            <div class="carousel-wrapper reveal-fade-up">
                <div class="carousel-track" id="carouselTrack">
                    ${projects.map((p, i) => buildCard(p, i)).join('')}
                </div>
                <div class="carousel-nav">
                    <button class="carousel-btn prev-btn" id="prevBtn" aria-label="Previous project">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div class="carousel-dots" id="carouselDots">
                        ${projects.map((_, i) => `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to project ${i + 1}"></button>`).join('')}
                    </div>
                    <button class="carousel-btn next-btn" id="nextBtn" aria-label="Next project">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>
            </div>
        `;

        // Inject carousel into the carousel-container that already exists in HTML
        const carouselContainer = section.querySelector('.carousel-container');
        if (!carouselContainer) return;
        carouselContainer.innerHTML = carouselHTML;

        setupCarousel(projects.length);
    }

    function buildCard(project, index) {
        const githubBtn = project.github
            ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="proj-btn github-btn">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 17.07 3.633 16.7 3.633 16.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                   Code
               </a>`
            : '';

        return `
            <article class="project-card-new" style="--card-gradient: ${project.gradient}; --card-accent: ${project.accent};">
                <div class="pcn-image-area">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" class="pcn-img">
                    <div class="pcn-image-overlay"></div>
                    <div class="pcn-chip">
                        <span class="pcn-chip-dot"></span>
                        ${project.subtitle}
                    </div>
                    <div class="pcn-number">0${index + 1}</div>
                </div>
                <div class="pcn-body">
                    <div class="pcn-body-top">
                        <h3 class="pcn-title">${project.title}</h3>
                        <p class="pcn-desc">${project.description}</p>
                    </div>
                    <div class="pcn-footer">
                        <div class="pcn-tags">
                            ${project.tags.map(t => `<span class="pcn-tag">${t}</span>`).join('')}
                        </div>
                        <div class="pcn-actions">
                            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="proj-btn live-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                Live
                            </a>
                            ${githubBtn}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    function setupCarousel(count) {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dots = document.querySelectorAll('.carousel-dot');
        if (!track) return;

        let current = 0;
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;

        const getCardWidth = () => {
            const card = track.querySelector('.project-card-new');
            if (!card) return 0;
            return card.offsetWidth + parseInt(getComputedStyle(track).gap || '0');
        };

        const goTo = (index) => {
            current = Math.max(0, Math.min(index, count - 1));
            track.scrollTo({ left: current * getCardWidth(), behavior: 'smooth' });
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            if (prevBtn) prevBtn.disabled = current === 0;
            if (nextBtn) nextBtn.disabled = current === count - 1;
        };

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

        // Drag to scroll
        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            scrollStart = track.scrollLeft;
            track.style.cursor = 'grabbing';
        });
        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            track.scrollLeft = scrollStart - (e.pageX - startX);
        });
        const stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.cursor = 'grab';
            const newIndex = Math.round(track.scrollLeft / getCardWidth());
            goTo(newIndex);
        };
        track.addEventListener('mouseup', stopDrag);
        track.addEventListener('mouseleave', stopDrag);

        // Touch support
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollStart = track.scrollLeft;
        }, { passive: true });
        track.addEventListener('touchmove', (e) => {
            track.scrollLeft = scrollStart - (e.touches[0].pageX - startX);
        }, { passive: true });
        track.addEventListener('touchend', () => {
            const newIndex = Math.round(track.scrollLeft / getCardWidth());
            goTo(newIndex);
        });

        // Sync dots on scroll
        track.addEventListener('scroll', () => {
            const idx = Math.round(track.scrollLeft / getCardWidth());
            if (idx !== current) {
                current = idx;
                dots.forEach((d, i) => d.classList.toggle('active', i === current));
            }
        });

        goTo(0);
    }

    // ──────────────────────────────────────────────────────────────────────

    function setupHeaderInversion() {
        const mainHeader = document.querySelector('.main-header');
        if (!mainHeader) return;
        const darkSections = gsap.utils.toArray('.bg-dark');
        const headerHeight = mainHeader.offsetHeight;
        darkSections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: `top ${headerHeight}px`,
                end: `bottom ${headerHeight}px`,
                onEnter: () => mainHeader.classList.add('header-is-inverted'),
                onLeave: () => mainHeader.classList.remove('header-is-inverted'),
                onEnterBack: () => mainHeader.classList.add('header-is-inverted'),
                onLeaveBack: () => mainHeader.classList.remove('header-is-inverted')
            });
        });
    }

    function setupInteractiveImage() {
        const imageContainer = document.querySelector('.floating-image-container');
        if (!imageContainer) return;
        imageContainer.addEventListener('mousemove', (e) => {
            const rect = imageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(imageContainer, { duration: 0.8, rotationX: -y / 20, rotationY: x / 20, ease: 'power2.out' });
        });
        imageContainer.addEventListener('mouseleave', () => {
            gsap.to(imageContainer, { duration: 1, rotationX: 0, rotationY: 0, ease: 'elastic.out(1, 0.5)' });
        });
    }

    function setupScrollBasedAnimations() {
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                progressBar.style.width = scrollHeight > clientHeight ? `${(scrollTop / (scrollHeight - clientHeight)) * 100}%` : '0%';
            });
        }
        gsap.utils.toArray('.reveal-fade-up').forEach(el => {
            gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 90%' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
        });
        gsap.utils.toArray('.bg-graphic:not(.hero-graphic)').forEach(el => {
            gsap.to(el, {
                scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
                opacity: el.classList.contains('contact-graphic-pulse') ? 0.25 : 1,
                y: (i, target) => (target.parentElement.offsetHeight * 0.1) * (Math.random() - 0.5)
            });
        });
    }

    function setupAdvancedAnimations() {
        if (document.querySelector('.works-graphic-line.line-v')) {
            gsap.from('.works-graphic-line.line-v', {
                scrollTrigger: { trigger: '#works', start: 'top 80%', end: 'bottom top', scrub: 1 },
                scaleY: 0, transformOrigin: 'top'
            });
        }
        if (document.querySelector('.works-graphic-line.line-h')) {
            gsap.from('.works-graphic-line.line-h', {
                scrollTrigger: { trigger: '#works', start: 'top 80%', end: 'bottom top', scrub: 1 },
                scaleX: 0, transformOrigin: 'left'
            });
        }
        if (document.querySelector('.contact-graphic-blob')) {
            gsap.to('.contact-graphic-blob', {
                duration: 20, x: 'random(-50, 50)', y: 'random(-50, 50)', rotation: 'random(-45, 45)',
                repeat: -1, yoyo: true, ease: 'none'
            });
        }
        if (document.querySelector('.floating-symbol')) {
            gsap.utils.toArray('.floating-symbol').forEach(symbol => {
                gsap.to(symbol, {
                    x: `random(-20, 20)`, y: `random(-20, 20)`, duration: `random(10, 20)`,
                    repeat: -1, yoyo: true, ease: 'sine.inOut'
                });
            });
        }

        // Stack row animations
        const stackRows = document.querySelectorAll('.stack-row');
        stackRows.forEach((row, i) => {
            gsap.from(row.querySelectorAll('.stack-pill'), {
                scrollTrigger: { trigger: row, start: 'top 88%' },
                opacity: 0, y: 20, scale: 0.9,
                stagger: 0.07, duration: 0.6, ease: 'back.out(1.7)',
                delay: i * 0.15
            });
        });
    }

    function setupCustomCursor() {
        const cursorOutline = document.querySelector('.cursor-outline');
        const cursorDot = document.querySelector('.cursor-dot');
        if (!cursorOutline || !cursorDot) return;
        if (window.matchMedia("(pointer: fine)").matches) {
            gsap.set([cursorOutline, cursorDot], { xPercent: -50, yPercent: -50 });
            window.addEventListener('mousemove', e => {
                gsap.to(cursorDot, { duration: 0.2, x: e.clientX, y: e.clientY });
                gsap.to(cursorOutline, { duration: 0.7, x: e.clientX, y: e.clientY, ease: 'power2.out' });
            });
            document.querySelectorAll('a, button, .skill-tag, .stack-pill').forEach(el => {
                el.addEventListener('mouseenter', () => gsap.to(cursorOutline, { scale: 1.8, duration: 0.3 }));
                el.addEventListener('mouseleave', () => gsap.to(cursorOutline, { scale: 1, duration: 0.3 }));
            });
        } else {
            cursorOutline.style.display = 'none';
            cursorDot.style.display = 'none';
        }
    }
});