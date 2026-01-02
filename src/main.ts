import './scss/main.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeroAnimation, initScrollAnimations } from './ts/modules/animations.ts';
import { initNavigationActiveState, initMobileMenu, initHeaderScroll, initHashScroll } from './ts/modules/navigation.ts';
import { initCanvasAnimation, initContactAnimation } from './ts/modules/canvas.ts';

gsap.registerPlugin(ScrollTrigger);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initScrollAnimations();
    initNavigationActiveState();
    initMobileMenu();
    initHeaderScroll();
    initHashScroll();
    initCanvasAnimation();
    initContactAnimation();
    
    // Refresh ScrollTrigger to ensure all calculations are correct
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
