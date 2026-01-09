import gsap from 'gsap';
import { CONFIG } from '../config.ts';

export const initHeroAnimation = (): void => {
    const tl = gsap.timeline();

    tl.fromTo(CONFIG.SELECTORS.NAV, 
        { y: -100, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: CONFIG.ANIMATION.DURATION_EXTRA_LONG,
            ease: CONFIG.ANIMATION.EASE_POWER4,
            clearProps: 'opacity,transform',
            overwrite: true
        }
    )
    .from(CONFIG.SELECTORS.HERO_SUBTITLE, {
        y: 20,
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_LONG,
        ease: CONFIG.ANIMATION.EASE_SMOOTH
    }, '-=0.8')
    .from(CONFIG.SELECTORS.HERO_TITLE_LINE, {
        y: 100,
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_HERO_LINE,
        stagger: CONFIG.ANIMATION.STAGGER_HERO_LINE,
        ease: CONFIG.ANIMATION.EASE_POWER4
    }, '-=1')
    .from(`${CONFIG.SELECTORS.HERO_LOCATION}, ${CONFIG.SELECTORS.HERO_ACTIONS}`, {
        y: 20,
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_LONG,
        stagger: CONFIG.ANIMATION.STAGGER_HERO_LINE,
        ease: CONFIG.ANIMATION.EASE_SMOOTH
    }, '-=0.8')
    .from(CONFIG.SELECTORS.HERO_INDICATOR, {
        opacity: 0,
        duration: CONFIG.ANIMATION.DURATION_LONG
    }, '-=0.5');
};

export const initScrollAnimations = (): void => {
    gsap.utils.toArray<HTMLElement>(CONFIG.SELECTORS.SECTION).forEach(section => {
        const elements = section.querySelectorAll(CONFIG.SELECTORS.SECTION_REVEAL);
        
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

        const skillItems = section.querySelectorAll(CONFIG.SELECTORS.SKILLS_LIST_ITEM);
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

    gsap.utils.toArray<HTMLElement>(CONFIG.SELECTORS.STAT_NUMBER).forEach(stat => {
        const val = parseInt(stat.innerText, 10) || 0;
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
                ease: CONFIG.ANIMATION.EASE_INOUT
            }
        );
    });
};
