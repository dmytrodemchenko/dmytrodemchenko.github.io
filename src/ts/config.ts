export interface Config {
    ANIMATION: {
        DURATION_SHORT: number;
        DURATION_MEDIUM: number;
        DURATION_LONG: number;
        DURATION_EXTRA_LONG: number;
        DURATION_HERO_LINE: number;
        STAGGER_SMALL: number;
        STAGGER_MEDIUM: number;
        STAGGER_LARGE: number;
        STAGGER_HERO_LINE: number;
        EASE_BOUNCY: string;
        EASE_SMOOTH: string;
        EASE_POWER2: string;
        EASE_POWER4: string;
        EASE_INOUT: string;
    };
    COLORS: {
        ACCENT: string;
        ACCENT_DARK: string;
        WHITE: string;
        BG_DARK: string;
    };
    HERO_PARTICLES: {
        COUNT_DIVISOR: number;
        CONNECTION_DISTANCE: number;
        REPEL_DISTANCE: number;
        SIZE_MIN: number;
        SIZE_MAX: number;
    };
    CONTACT_STARS: {
        COUNT: number;
        SPEED_Z_DECAY: number;
        SIZE_CHECK: number;
    };
    SCROLL_TRIGGER: {
        HERO_TOP_OFFSET: number;
    };
}

export const CONFIG: Config = {
    ANIMATION: {
        DURATION_SHORT: 0.4,
        DURATION_MEDIUM: 0.5,
        DURATION_LONG: 1,
        DURATION_EXTRA_LONG: 1.2,
        DURATION_HERO_LINE: 1.5,
        STAGGER_SMALL: 0.05,
        STAGGER_MEDIUM: 0.1,
        STAGGER_LARGE: 0.15,
        STAGGER_HERO_LINE: 0.2,
        EASE_BOUNCY: 'back.out(1.7)',
        EASE_SMOOTH: 'power3.out',
        EASE_POWER2: 'power2.out',
        EASE_POWER4: 'power4.out',
        EASE_INOUT: 'power1.inOut'
    },
    COLORS: {
        ACCENT: '#ccff00',
        ACCENT_DARK: '#aacc00',
        WHITE: '#ffffff',
        BG_DARK: '#0a0a0a'
    },
    HERO_PARTICLES: {
        COUNT_DIVISOR: 15000,
        CONNECTION_DISTANCE: 120,
        REPEL_DISTANCE: 200,
        SIZE_MIN: 10,
        SIZE_MAX: 12
    },
    CONTACT_STARS: {
        COUNT: 400,
        SPEED_Z_DECAY: 15,
        SIZE_CHECK: 100
    },
    SCROLL_TRIGGER: {
        HERO_TOP_OFFSET: 50
    }
};

export interface SyntaxToken {
    text: string;
    type: 'keyword' | 'operator' | 'structure' | 'type';
}

export const SYNTAX_TOKENS: SyntaxToken[] = [
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
