/* Native links and history stay intact. The entry intro runs only once per tab. */
(() => {
    'use strict';
    let intro, timeout;
    function closeIntro() {
        clearTimeout(timeout);
        if (!intro) return;
        if (intro.open) intro.close();
        intro.remove();
        intro = null;
    }
    function start() {
        if (!document.querySelector('.hero') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        try {
            if (sessionStorage.getItem('re-entry-intro-v2')) return;
            sessionStorage.setItem('re-entry-intro-v2', 'seen');
        } catch { return; }
        const ru = getCurrentLang() === 'ru';
        intro = document.createElement('dialog');
        intro.className = 'site-intro';
        intro.setAttribute('aria-labelledby', 'entry-brand');
        intro.setAttribute('aria-describedby', 'entry-caption');
        intro.innerHTML = '<div class="intro-content"><span class="intro-mark" aria-hidden="true">RE / ARCHIVE</span><h2 id="entry-brand">RESIDENT EVIL</h2><p id="entry-caption"></p><div class="intro-line" aria-hidden="true"></div></div><button type="button" class="intro-skip"></button>';
        intro.querySelector('p').textContent = ru ? 'Открываем архив…' : 'Opening the archive…';
        intro.querySelector('button').textContent = ru ? 'Пропустить' : 'Skip';
        intro.querySelector('button').addEventListener('click', closeIntro);
        intro.addEventListener('cancel', event => { event.preventDefault(); closeIntro(); });
        document.body.append(intro);
        intro.showModal();
        timeout = setTimeout(closeIntro, 1200);
    }
    window.RE_ENTRY_INTRO = Object.freeze({ start });
    window.addEventListener('pagehide', closeIntro);
})();
