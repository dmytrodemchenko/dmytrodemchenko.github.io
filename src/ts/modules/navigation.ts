import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONFIG } from '../config.ts';

export const initNavigationActiveState = (): void => {
    const sections = gsap.utils.toArray<HTMLElement>(CONFIG.SELECTORS.SECTIONS);
    const navLinks = gsap.utils.toArray<HTMLAnchorElement>(CONFIG.SELECTORS.NAV_LINK);

    const navLine = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV_LINE);
    const updateNavLine = (link: HTMLAnchorElement | null): void => {
        if (!navLine || !link) {
             if (navLine) navLine.style.opacity = '0';
             return;
        }
        
        // Don't show line for CTA button (Contact)
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
                        link.classList.remove(CONFIG.SELECTORS.NAV_LINK_ACTIVE);
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add(CONFIG.SELECTORS.NAV_LINK_ACTIVE);
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

    if (!burger || !navList) return;

    burger.addEventListener('click', () => {
        const isActive = burger.classList.toggle(CONFIG.SELECTORS.NAV_BURGER_ACTIVE);
        navList.classList.toggle('active');

        if (isActive) {
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
