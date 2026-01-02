import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONFIG } from '../config.ts';

export const initNavigationActiveState = (): void => {
    const sections = gsap.utils.toArray<HTMLElement>(['#hero', '.section', '.footer']);
    const navLinks = gsap.utils.toArray<HTMLAnchorElement>('.nav__link');

    const navLine = document.querySelector<HTMLElement>('.nav__line');
    const updateNavLine = (link: HTMLAnchorElement | null): void => {
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
        const navList = link.closest('.nav__list');
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

    const navList = document.querySelector<HTMLElement>('.nav__list');
    if (navList) {
        navList.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector<HTMLAnchorElement>('.nav__link--active');
            updateNavLine(activeLink);
        });
    }
};

export const initMobileMenu = (): void => {
    const burger = document.querySelector<HTMLElement>('.nav__burger');
    const navList = document.querySelector<HTMLElement>('.nav__list');
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav__link');

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
            burger.classList.remove('nav__burger--active');
            navList.classList.remove('active');
        });
    });
};

export const initHeaderScroll = (): void => {
    const nav = document.querySelector<HTMLElement>('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > CONFIG.SCROLL_TRIGGER.HERO_TOP_OFFSET) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    });
};
