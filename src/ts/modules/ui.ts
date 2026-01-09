import { CONFIG } from '../config';

/**
 * Initializes the dynamic year in the footer
 * Best practice: Separation of concerns and safety checks
 */
export const initDynamicYear = (): void => {
    const yearEl = document.querySelector<HTMLElement>(CONFIG.SELECTORS.FOOTER_YEAR);
    
    if (!yearEl) {
        console.warn(`Dynamic Year: Element ${CONFIG.SELECTORS.FOOTER_YEAR} not found`);
        return;
    }

    const currentYear = new Date().getFullYear().toString();
    yearEl.textContent = currentYear;
};
