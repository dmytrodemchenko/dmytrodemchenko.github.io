import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONFIG } from '../config.ts';

export const initNavigationActiveState = (): void => {
    const sections = gsap.utils.toArray<HTMLElement>(CONFIG.SELECTORS.SECTIONS);
    const navLinks = gsap.utils.toArray<HTMLAnchorElement>(CONFIG.SELECTORS.NAV_LINK);

    const navLine = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV_LINE);
    const updateNavLine = (link: HTMLAnchorElement | null): void => {
        const burger = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV_BURGER);
        const isMobile = burger && window.getComputedStyle(burger).display !== 'none';

        if (!navLine || !link || isMobile) {
             if (navLine) navLine.style.opacity = '0';
             return;
        }

        if (link.classList.contains(CONFIG.SELECTORS.NAV_LINK_CTA)) {
            navLine.style.opacity = '0';
            return;
        }

        const rect = link.getBoundingClientRect();
        const navList = link.closest(CONFIG.SELECTORS.NAV_LIST);
        if (!navList) return;
        
        const listRect = navList.getBoundingClientRect();
        
        navLine.style.width = `${rect.width}px`;
        navLine.style.left = `${rect.left - listRect.left}px`;
        navLine.style.opacity = '1';
    };

    const setActiveLink = (id: string | null): void => {
        let hasMatch = false;
        navLinks.forEach(link => {
            link.classList.remove(CONFIG.SELECTORS.NAV_LINK_ACTIVE);
            if (id && link.getAttribute('href') === `#${id}`) {
                link.classList.add(CONFIG.SELECTORS.NAV_LINK_ACTIVE);
                updateNavLine(link);
                hasMatch = true;
            }
        });
        
        if (!hasMatch) {
            updateNavLine(null);
        }
    };

    sections.forEach(section => {
        const id = section.getAttribute('id');
        if (!id) return;

        const startTrigger = id === 'contact' ? 'top 75%' : 'top 50%';
        const endTrigger = id === 'contact' ? 'bottom 0%' : 'bottom 50%';

        ScrollTrigger.create({
            trigger: section,
            start: startTrigger,
            end: endTrigger,
            onEnter: () => setActiveLink(id),
            onEnterBack: () => setActiveLink(id),
        });
    });

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: '+=100',
        onEnterBack: () => setActiveLink(null),
        onToggle: self => {
            if (self.isActive && window.scrollY < 50) {
                setActiveLink(null);
            }
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => updateNavLine(link));
    });

    let resizeTimer: number;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            const activeLink = document.querySelector<HTMLAnchorElement>(`.${CONFIG.SELECTORS.NAV_LINK_ACTIVE}`);
            updateNavLine(activeLink);
        }, 100);
    });

    const navList = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV_LIST);
    if (navList) {
        navList.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector<HTMLAnchorElement>(`.${CONFIG.SELECTORS.NAV_LINK_ACTIVE}`);
            updateNavLine(activeLink);
        });
    }
};

export const initMobileMenu = (): void => {
    const burger = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV_BURGER);
    const navList = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV_LIST);
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(CONFIG.SELECTORS.NAV_LINK);
    const navLine = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV_LINE);

    if (!burger || !navList) return;

    burger.addEventListener('click', () => {
        const isActive = burger.classList.toggle(CONFIG.SELECTORS.NAV_BURGER_ACTIVE);
        navList.classList.toggle('active');

        if (isActive) {
            if (navLine) navLine.style.opacity = '0';

            // Animate items in
            gsap.fromTo(`${CONFIG.SELECTORS.NAV_LIST} li`, 
                { x: 50, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: CONFIG.ANIMATION.DURATION_SHORT, 
                    stagger: CONFIG.ANIMATION.STAGGER_MEDIUM, 
                    delay: 0.2, // Wait for menu bg to slide in
                    ease: CONFIG.ANIMATION.EASE_POWER2
                }
            );
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove(CONFIG.SELECTORS.NAV_BURGER_ACTIVE);
            navList.classList.remove('active');
        });
    });
};

export const initHeaderScroll = (): void => {
    const nav = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV);
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > CONFIG.SCROLL_TRIGGER.HERO_TOP_OFFSET) {
            nav.classList.add(CONFIG.SELECTORS.NAV_ACTIVE);
        } else {
            nav.classList.remove(CONFIG.SELECTORS.NAV_ACTIVE);
        }
    });
};

export const initHashScroll = (): void => {
    const handleInitialHash = () => {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', href);
            }
        });
    });

    window.addEventListener('load', handleInitialHash);
};
