import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/DevPortfolio.css';

gsap.registerPlugin(ScrollTrigger);

const DevPortfolio = () => {
    const mainRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.from(".main-header", { y: '-100%', duration: 1, ease: 'expo.out' })
            .from('.main-heading .line', { y: 100, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out' }, '-=0.5')
            .from('.hero-subtext', { opacity: 0, y: 20, duration: 1, ease: 'expo.out' }, '-=0.8');

        // Scroll Progress
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            const updateProgress = () => {
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                progressBar.style.width = scrollHeight > clientHeight ? `${(scrollTop / (scrollHeight - clientHeight)) * 100}%` : '0%';
            };
            window.addEventListener('scroll', updateProgress);
            return () => window.removeEventListener('scroll', updateProgress);
        }

        // Reveal Fade Up
        gsap.utils.toArray('.reveal-fade-up').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 90%' },
                y: 50, opacity: 0, duration: 1, ease: 'power3.out'
            });
        });

        // Background Graphics Parallax
        const parallaxLayers = {
            '.hero-blob': 25,
            '.hero-graphic': 50,
            '.floating-symbol': 80
        };
        const handleMouseMove = (e) => {
            let x = (e.clientX / window.innerWidth) - 0.5;
            let y = (e.clientY / window.innerHeight) - 0.5;
            for (const layer in parallaxLayers) {
                gsap.to(layer, { x: x * parallaxLayers[layer], y: y * parallaxLayers[layer], duration: 1, ease: 'power2.out', overwrite: 'auto' });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Floating Image
        const imageContainer = document.querySelector('.floating-image-container');
        if (imageContainer) {
            const moveImg = (e) => {
                const rect = imageContainer.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(imageContainer, { duration: 0.8, rotationX: -y / 20, rotationY: x / 20, ease: 'power2.out' });
            };
            const leaveImg = () => {
                gsap.to(imageContainer, { duration: 1, rotationX: 0, rotationY: 0, ease: 'elastic.out(1, 0.5)' });
            };
            imageContainer.addEventListener('mousemove', moveImg);
            imageContainer.addEventListener('mouseleave', leaveImg);
        }

        // Header Inversion
        const mainHeader = document.querySelector('.main-header');
        const darkSections = gsap.utils.toArray('.bg-dark');
        const triggers = [];
        darkSections.forEach(section => {
            triggers.push(ScrollTrigger.create({
                trigger: section,
                start: 'top 100px',
                end: 'bottom 100px',
                onEnter: () => mainHeader?.classList.add('header-is-inverted'),
                onLeave: () => mainHeader?.classList.remove('header-is-inverted'),
                onEnterBack: () => mainHeader?.classList.add('header-is-inverted'),
                onLeaveBack: () => mainHeader?.classList.remove('header-is-inverted')
            }));
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            triggers.forEach(t => t.kill());
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, []);

    const projects = [
        {
            title: "MCD HRMS",
            description: "An enterprise-grade HR management system for tracking employee attendance, payroll, and performance metrics.",
            image: "images/projects/mcd-hrms.png",
            link: "https://mcd-hrms.web.app",
            github: "https://github.com/kuberbassi/mcd-hrms",
        },
        {
            title: "AcadHub",
            description: "A comprehensive academic management system dashboard for streamlining educational workflows and student data tracking.",
            image: "images/projects/acadhub.png",
            link: "https://acadhub.kuberbassi.com",
            github: "https://github.com/kuberbassi/acadhub",
        },
        {
            title: "IndiaOnRoaming",
            description: "A vibrant travel portal showcasing diverse Indian landscapes and simplifying travel bookings with a modern interface.",
            image: "images/projects/indiaonroaming.png",
            link: "https://indiaonroaming.com",
            github: null,
        },
        {
            title: "Sugandhmaya",
            description: "A premium e-commerce platform for a luxury fragrance brand, featuring an elegant design and seamless shopping experience.",
            image: "images/projects/sugandhmaya.png",
            link: "https://sugandhmaya.com",
            github: "https://github.com/kuberbassi/sugandhmaya.com",
        }
    ];

    return (
        <div className="dev-portfolio-root">
            <div id="scroll-progress-bar"></div>

            <header className="main-header">
                <a href="#" className="logo">KuberB.</a>
                <nav className="main-nav">
                    <ul>
                        <li><a href="#about">About</a></li>
                        <li><a href="#works">Works</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <Link to="/" className="nav-cta-button">
                        <i className="fas fa-arrow-left"></i> Back to Choices
                    </Link>
                </nav>
            </header>

            <main id="main-content" ref={mainRef}>
                <section id="hero" className="hero-section section-padding">
                    {/* Graphics */}
                    <div className="hero-graphic large-circle-accent"></div>
                    <div className="hero-graphic large-square-muted"></div>
                    <div className="hero-graphic line-v-large"></div>

                    <h1 className="main-heading">
                        <span className="line">System Architect</span>
                        <span className="line">& Python Developer</span>
                    </h1>
                    <div className="hero-subtext">
                        <p>Turning Chaos into Clarity | Based in Delhi, India</p>
                    </div>
                </section>

                <section id="about" className="about-section section-padding bg-dark">
                    <div className="container about-layout">
                        <div className="about-text-content reveal-fade-up">
                            <p className="about-intro">
                                I don't just write code; I build <span className="highlight">systems</span>. As a System Architect,
                                I optimize flows using the Clarity Engine approach.
                            </p>
                        </div>
                        <div className="about-skills-content reveal-fade-up">
                            <div className="floating-image-container">
                                <img src="/dev-portfolio/images/Kuber.png" alt="Kuber Bassi" />
                            </div>
                            <div className="skills-grid">
                                <div className="skills-category">
                                    <h3><i className="fas fa-microchip"></i> Architecture</h3>
                                    <div className="skill-tags">
                                        <span className="skill-tag">System Design</span>
                                        <span className="skill-tag">Python</span>
                                        <span className="skill-tag">React</span>
                                        <span className="skill-tag">Node.js</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="works" className="works-section section-padding">
                    <h2 className="section-title reveal-fade-up">Latest Projects</h2>
                    <div className="projects-grid">
                        {projects.map((project, index) => (
                            <article className="project-card reveal-fade-up" key={index}>
                                <div className="card-image-wrapper">
                                    <img src={`/dev-portfolio/${project.image}`} alt={project.title} className="card-image" loading="lazy" />
                                </div>
                                <div className="card-content">
                                    <span className="card-number">0{index + 1}</span>
                                    <h3 className="card-title">{project.title}</h3>
                                    <p className="card-description">{project.description}</p>
                                    <div className="card-links">
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="card-link"><i className="fas fa-external-link-alt"></i> Live Site</a>
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link"><i className="fab fa-github"></i> Code</a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="contact" className="contact-section section-padding bg-dark">
                    <div className="contact-content-wrapper">
                        <h2 className="contact-title">
                            <span className="line">Have a project?</span>
                            <span className="line">Let's create.</span>
                        </h2>
                        <a href="mailto:kuberbassi2007@gmail.com" className="contact-button">Say Hello</a>
                    </div>
                    <footer className="site-footer">
                        <div className="social-links">
                            <a href="https://linkedin.com/in/kuberbassi" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                            <a href="https://github.com/kuberbassi" className="social-icon"><i className="fab fa-github"></i></a>
                        </div>
                        <p className="footer-note">&copy; 2025 Kuber Bassi.</p>
                    </footer>
                </section>
            </main>
        </div>
    );
};

export default DevPortfolio;
