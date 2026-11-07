/* Last ordered, render-blocking deferred script: reveal only the final saved UI. */
(() => {
    'use strict';
    function prepareUI() {
        const language = getCurrentLang();
        applyLang(language);
        updateLangButtons(language);
        updateUserProfile();
        document.dispatchEvent(new Event('languagechange'));
    }
    try {
        prepareUI();
    } finally {
        document.documentElement.dataset.uiReady = 'true';
    }
    window.addEventListener('pageshow', event => {
        if (!event.persisted) return;
        // A restored document can predate a language change in another section.
        let savedLanguage;
        try { savedLanguage = localStorage.getItem('lang'); } catch { /* Keep page-local language. */ }
        if (savedLanguage === 'ru' || savedLanguage === 'en') setLang(savedLanguage);
        else prepareUI();
    });
    window.RE_ENTRY_INTRO?.start();
    // Older browsers keep the same small content motion without intercepting links.
    if (!('onpagereveal' in window) && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelector('main')?.animate([
            { opacity: .9, transform: 'translateY(3px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 260, easing: 'ease-out' });
    }
})();
