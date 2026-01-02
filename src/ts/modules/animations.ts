import gsap from 'gsap';
import { CONFIG } from '../config.ts';

export const initHeroAnimation = (): void => {
    const tl = gsap.timeline();

    tl.from('.nav', {
        y: -100,
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_EXTRA_LONG,
        ease: CONFIG.ANIMATION.EASE_POWER4
    })
    .from('.hero__subtitle', {
        y: 20,
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_LONG,
        ease: CONFIG.ANIMATION.EASE_SMOOTH
    }, '-=0.8')
    .from('.hero__title-line', {
        y: 100,
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_HERO_LINE,
        stagger: CONFIG.ANIMATION.STAGGER_HERO_LINE,
        ease: CONFIG.ANIMATION.EASE_POWER4
    }, '-=1')
    .from('.hero__location, .hero__actions', {
        y: 20,
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_LONG,
        stagger: CONFIG.ANIMATION.STAGGER_HERO_LINE,
        ease: CONFIG.ANIMATION.EASE_SMOOTH
    }, '-=0.8')
    .from('.hero__scroll-indicator', {
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_LONG
    }, '-=0.5');
};

export const initScrollAnimations = (): void => {
    // Fade in sections
    gsap.utils.toArray<HTMLElement>('.section').forEach(section => {
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
                    duration: CONFIG.ANIMATION.DURATION_EXTRA_LONG,
                    stagger: CONFIG.ANIMATION.STAGGER_LARGE,
                    ease: CONFIG.ANIMATION.EASE_SMOOTH,
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
                    duration: CONFIG.ANIMATION.DURATION_MEDIUM,
                    stagger: CONFIG.ANIMATION.STAGGER_SMALL,
                    ease: CONFIG.ANIMATION.EASE_BOUNCY
                }
            );
        }
    });

    // Stat numbers animation
    gsap.utils.toArray<HTMLElement>('.stat__number').forEach(stat => {
        const val = parseInt(stat.innerText) || 0;
        gsap.fromTo(stat, 
            { innerHTML: 0 },
            {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 95%'
                },
                innerHTML: val,
                duration: 2, // Keep 2s for counting effect
                snap: { innerHTML: 1 },
                ease: CONFIG.ANIMATION.EASE_INOUT
            }
        );
    });
};
