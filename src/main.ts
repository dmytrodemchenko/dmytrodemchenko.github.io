import './scss/main.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeroAnimation, initScrollAnimations } from './ts/modules/animations.ts';
import { initNavigationActiveState, initMobileMenu, initHeaderScroll, initHashScroll } from './ts/modules/navigation.ts';
import { initCanvasAnimation, initContactAnimation } from './ts/modules/canvas.ts';
import { initDynamicYear } from './ts/modules/ui.ts';
import { CONFIG } from './ts/config.ts';

gsap.registerPlugin(ScrollTrigger);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initDynamicYear();
    initHeroAnimation();
    initScrollAnimations();
    initNavigationActiveState();
    initMobileMenu();
    initHeaderScroll();
    initHashScroll();
    initCanvasAnimation();
    initContactAnimation();

    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        const nav = document.querySelector<HTMLElement>(CONFIG.SELECTORS.NAV);
        if (nav) {
            const opacity = window.getComputedStyle(nav).opacity;
            if (opacity === '0') {
                gsap.to(nav, { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' });
            }
        }
    });
});
