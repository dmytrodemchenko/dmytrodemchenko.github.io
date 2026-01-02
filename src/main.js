import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initScrollAnimations();
    initNavigationActiveState();
    initMobileMenu();
    initHeaderScroll();
    initCanvasAnimation();
    initContactAnimation();
    
    // Refresh ScrollTrigger to ensure all calculations are correct
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});

// --- Hero Text Animation ---
const initHeroAnimation = () => {
    const tl = gsap.timeline();

    tl.from('.nav', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out'
    })
    .from('.hero__subtitle', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.hero__title-line', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out'
    }, '-=1')
    .from('.hero__location, .hero__actions', {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.hero__scroll-indicator', {
        opacity: 0,
        duration: 1
    }, '-=0.5');
};

// --- Scroll Animations ---
const initScrollAnimations = () => {
    // Fade in sections
    gsap.utils.toArray('.section').forEach(section => {
        const elements = section.querySelectorAll('.section__title, .about__text, .experience__item, .skills__category');
        
        if (elements.length > 0) {
            gsap.fromTo(elements, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power3.out',
                    overwrite: 'auto'
                }
            );
        }

        // Specific Skills Animation
        const skillItems = section.querySelectorAll('.skills__list li');
        if (skillItems.length > 0) {
            gsap.fromTo(skillItems,
                { opacity: 0, scale: 0.8 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 70%'
                    },
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'back.out(1.7)'
                }
            );
        }
    });

    // Stat numbers animation
    gsap.utils.toArray('.stat__number').forEach(stat => {
        const val = parseInt(stat.innerText);
        gsap.fromTo(stat, 
            { innerHTML: 0 },
            {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 95%'
                },
                innerHTML: val,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power1.inOut'
            }
        );
    });
};

// --- Navigation Active State ---
const initNavigationActiveState = () => {
    const sections = gsap.utils.toArray(['#hero', '.section', '.footer']);
    const navLinks = gsap.utils.toArray('.nav__link');

    const navLine = document.querySelector('.nav__line');
    const updateNavLine = (link) => {
        if (!navLine || !link) {
             if (navLine) navLine.style.opacity = '0';
             return;
        }
        
        // Don't show line for CTA button (Contact)
        if (link.classList.contains('nav__link--cta')) {
            navLine.style.opacity = '0';
            return;
        }

        const rect = link.getBoundingClientRect();
        const listRect = link.closest('.nav__list').getBoundingClientRect();
        
        navLine.style.width = `${rect.width}px`;
        navLine.style.left = `${rect.left - listRect.left}px`;
        navLine.style.opacity = '1';
    };

    sections.forEach(section => {
        const id = section.getAttribute('id');
        if (!id) return;

        // Custom trigger for Contact section
        const startTrigger = id === 'contact' ? 'top 75%' : 'top 50%';
        const endTrigger = id === 'contact' ? 'bottom 0%' : 'bottom 50%';

        ScrollTrigger.create({
            trigger: section,
            start: startTrigger,
            end: endTrigger,
            onToggle: self => {
                if (self.isActive) {
                    navLinks.forEach(link => {
                        link.classList.remove('nav__link--active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('nav__link--active');
                            updateNavLine(link);
                        }
                    });
                }
            }
        });
    });

    // Handle hover effects for line
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => updateNavLine(link));
    });

    const navList = document.querySelector('.nav__list');
    if (navList) {
        navList.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav__link--active');
            updateNavLine(activeLink);
        });
    }
};

// --- Mobile Navigation ---
const initMobileMenu = () => {
    const burger = document.querySelector('.nav__burger');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!burger || !navList) return;

    burger.addEventListener('click', () => {
        const isActive = burger.classList.toggle('nav__burger--active');
        navList.classList.toggle('active');

        if (isActive) {
            // Animate items in
            gsap.fromTo('.nav__list li', 
                { x: 50, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    stagger: 0.1, 
                    delay: 0.2, // Wait for menu bg to slide in
                    ease: 'power2.out'
                }
            );
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('nav__burger--active');
            navList.classList.remove('active');
        });
    });
};

// --- Header Scroll State ---
const initHeaderScroll = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    });
};

// --- Canvas Animation (Tech Constellation) ---
const initCanvasAnimation = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    
    // JS/TS Symbols
    const syntax = [
        { text: 'const', type: 'keyword' },
        { text: 'let', type: 'keyword' },
        { text: '=>', type: 'operator' },
        { text: '{}', type: 'structure' },
        { text: '[]', type: 'structure' },
        { text: '()', type: 'structure' },
        { text: 'import', type: 'keyword' },
        { text: 'export', type: 'keyword' },
        { text: 'interface', type: 'keyword' },
        { text: 'type', type: 'keyword' },
        { text: 'any', type: 'type' },
        { text: 'void', type: 'type' },
        { text: '===', type: 'operator' },
        { text: '?:', type: 'operator' },
        { text: 'as', type: 'keyword' },
        { text: '...', type: 'operator' },
        { text: 'async', type: 'keyword' },
        { text: 'await', type: 'keyword' },
        { text: '<T>', type: 'type' }
    ];

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initParticles();
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.0; 
            this.vy = (Math.random() - 0.5) * 1.0;
            this.size = Math.random() * 12 + 10;
            
            const item = syntax[Math.floor(Math.random() * syntax.length)];
            this.symbol = item.text;
            
            // Syntax coloring
            if (item.type === 'keyword') this.color = '#ccff00'; // Shock Green
            else if (item.type === 'type') this.color = '#aacc00'; // Darker Green
            else this.color = '#ffffff'; // White for operators/structure

            this.opacity = Math.random() * 0.5 + 0.1;
            this.pulseSpeed = Math.random() * 0.05 + 0.01;
            this.pulse = Math.random() * Math.PI;
        }

        update() {
            // Movement
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Pulse opacity
            this.pulse += this.pulseSpeed;
            this.currentOpacity = this.opacity + Math.sin(this.pulse) * 0.1;

            // Mouse interaction (Repulsion)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelDist = 200;

            if (dist < repelDist) {
                const angle = Math.atan2(dy, dx);
                const force = (repelDist - dist) / repelDist;
                const moveX = Math.cos(angle) * force * 2;
                const moveY = Math.sin(angle) * force * 2;
                
                this.x -= moveX;
                this.y -= moveY;
                
                // Glow on hover
                this.currentOpacity = 1; 
            }
        }

        draw() {
            ctx.font = `${this.size}px "Courier New", monospace`;
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, this.currentOpacity)); // Clamp opacity
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    const initParticles = () => {
        particles = [];
        // Fewer particles for cleaner look with text
        const count = Math.floor((width * height) / 15000); 
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        // Clear with fade effect for trails? 
        // No, let's keep it crisp for tech look.
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y - p.size/3); // Adjust for text center approx
                    ctx.lineTo(p2.x, p2.y - p2.size/3);
                    ctx.strokeStyle = '#ccff00';
                    // Opacity based on distance and particle opacity
                    ctx.globalAlpha = (1 - dist / 120) * 0.15;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    });

    resize();
    animate();
};

// --- Contact Animation (Star Wars Warp Speed) ---
const initContactAnimation = () => {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Star properties
    let stars = [];
    const starCount = 400;
    const speed = 0.1; // Base Z speed

    const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initStars();
    };

    class Star {
        constructor() {
            this.x = (Math.random() - 0.5) * width; // Centered
            this.y = (Math.random() - 0.5) * height; // Centered
            this.z = Math.random() * width; // Depth
            this.pz = this.z; // Previous z for streak
        }

        update() {
            // Move star towards camera (decrease z)
            // accelerate as it gets closer
            this.z -= 15; 

            // Reset if behind camera
            if (this.z <= 0) {
                this.x = (Math.random() - 0.5) * width;
                this.y = (Math.random() - 0.5) * height;
                this.z = width;
                this.pz = this.z;
            }
        }

        draw() {
            // Project 3D coordinates to 2D
            // x' = x / z * d (where d is distance to screen)
            // We use simple perspective
            
            const sx = (this.x / this.z) * width/2 + width/2;
            const sy = (this.y / this.z) * height/2 + height/2;
            
            // Previous position for streak/trail
            const px = (this.x / this.pz) * width/2 + width/2;
            const py = (this.y / this.pz) * height/2 + height/2;

            // Update previous z after calculating projection
            this.pz = this.z;

            // Draw streak
            if (this.z < width - 100) { // Don't draw initially spawned stars
                const opacity = (1 - this.z / width);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.lineWidth = opacity * 2;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.stroke();
            }
        }
    }

    const initStars = () => {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
    };

    const animate = () => {
        ctx.fillStyle = '#0a0a0a'; // Background matching footer
        ctx.fillRect(0, 0, width, height);
        
        // Only draw if element is in view (optimization)
        const rect = canvas.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            stars.forEach(star => {
                star.update();
                star.draw();
            });
        }

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
};
