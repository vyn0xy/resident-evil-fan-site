/* The selected gallery entry supplies the dossier, with display translations
   from characters-l10n.js. Canonical identities and image paths stay stable. */
(() => {
    'use strict';
    const cards = Array.from(document.querySelectorAll('.character-card'));
    if (!cards.length) return;
    const copy = {
        en: { more: 'Open character card', close: 'Close dossier', file: 'CHARACTER FILE', role: 'Role in this game', game: 'Game / edition', appearances: 'Other appearances in this gallery', related: 'Other characters from this game', previous: 'Previous', next: 'Next', counter: 'File', missing: 'Portrait unavailable' },
        ru: { more: 'Открыть карточку', close: 'Закрыть досье', file: 'ДОСЬЕ ПЕРСОНАЖА', role: 'Роль в этой игре', game: 'Игра / версия', appearances: 'Другие появления в этой галерее', related: 'Другие персонажи этой игры', previous: 'Предыдущее', next: 'Следующее', counter: 'Досье', missing: 'Портрет недоступен' }
    };
    const t = () => copy[getCurrentLang() === 'ru' ? 'ru' : 'en'];
    const entries = cards.map(card => ({
        card,
        id: card.dataset.characterId,
        identity: card.dataset.characterName,
        title: card.querySelector('.card-content h3'),
        description: card.querySelector('.card-content > p'),
        originalTitle: card.querySelector('.card-content h3').textContent,
        originalDescription: card.querySelector('.card-content > p').textContent,
        originalAlt: card.querySelector('img').alt,
        image: card.querySelector('img'),
        era: card.closest('.game-era').querySelector('.era-title'),
        button: card.querySelector('.card-btn')
    }));
    const dialog = document.createElement('dialog');
    dialog.id = 'character-dossier'; dialog.className = 'character-dossier';
    dialog.setAttribute('aria-labelledby', 'dossier-title');
    dialog.innerHTML = '<div class="dossier-toolbar"><p class="game-eyebrow dossier-file"></p><button type="button" class="dossier-close" autofocus>×</button></div><div class="dossier-layout"><div class="dossier-portrait"><img width="320" height="400"><p class="dossier-missing" hidden></p></div><div class="dossier-content"><p class="dossier-game"></p><h2 id="dossier-title" tabindex="-1"></h2><h3 class="dossier-role-label"></h3><p class="dossier-description"></p><section class="dossier-appearances"><h3></h3><div class="dossier-links"></div></section><section class="dossier-related"><h3></h3><div class="dossier-links"></div></section></div></div><div class="dossier-navigation"><button type="button" class="site-button secondary" data-dossier-prev></button><span class="dossier-counter" role="status"></span><button type="button" class="site-button secondary" data-dossier-next></button></div>';
    document.body.append(dialog);
    let index = 0, opener = null, scrollPosition = 0;
    let originalBodyPadding = '', scrollbarWidth = 0, locked = false;
    const portrait = dialog.querySelector('img');
    portrait.addEventListener('error', () => { portrait.hidden = true; dialog.querySelector('.dossier-missing').hidden = false; });

    function text(selector, value) { dialog.querySelector(selector).textContent = value; }
    function titleFor(entry) { return entry.era.textContent.replace(/^\s*☣\s*/, '').trim(); }
    function links(sectionSelector, matches, label) {
        const section = dialog.querySelector(sectionSelector);
        section.hidden = matches.length === 0;
        section.querySelector('h3').textContent = label;
        const container = section.querySelector('.dossier-links'); container.replaceChildren();
        matches.forEach(entry => {
            const button = document.createElement('button'); button.type = 'button'; button.className = 'dossier-link';
            button.textContent = sectionSelector === '.dossier-appearances' ? titleFor(entry) : entry.title.textContent;
            button.addEventListener('click', () => { index = entries.indexOf(entry); render(true); }); container.append(button);
        });
    }
    function render(focus = false) {
        const entry = entries[index];
        dialog.dataset.characterId = entry.id;
        text('.dossier-file', t().file);
        const close = dialog.querySelector('.dossier-close'); close.setAttribute('aria-label', t().close); close.title = t().close;
        text('.dossier-game', `${t().game}: ${titleFor(entry)}`);
        text('#dossier-title', entry.title.textContent);
        text('.dossier-role-label', t().role);
        text('.dossier-description', entry.description.textContent);
        portrait.alt = entry.image.alt || entry.title.textContent;
        if (portrait.getAttribute('src') !== entry.image.getAttribute('src')) {
            portrait.hidden = false; dialog.querySelector('.dossier-missing').hidden = true;
            portrait.src = entry.image.getAttribute('src');
        }
        text('.dossier-missing', t().missing);
        links('.dossier-appearances', entries.filter(other => other !== entry && other.identity === entry.identity), t().appearances);
        links('.dossier-related', entries.filter(other => other !== entry && other.era === entry.era), t().related);
        text('[data-dossier-prev]', `← ${t().previous}`);
        text('[data-dossier-next]', `${t().next} →`);
        text('.dossier-counter', `${t().counter} ${index + 1} / ${entries.length}`);
        dialog.querySelector('[data-dossier-prev]').disabled = index === 0;
        dialog.querySelector('[data-dossier-next]').disabled = index === entries.length - 1;
        if (focus) { dialog.scrollTop = 0; dialog.querySelector('#dossier-title').focus({ preventScroll: true }); }
    }
    function open(entry, button) {
        index = entries.indexOf(entry); opener = button; render();
        if (!locked) {
            scrollPosition = window.scrollY; originalBodyPadding = document.body.style.paddingRight;
            scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
            document.body.classList.add('dossier-open'); locked = true;
        }
        dialog.showModal(); dialog.scrollTop = 0;
    }
    function restorePage() {
        if (dialog.open || !locked) return;
        locked = false;
        document.body.classList.remove('dossier-open'); document.body.style.paddingRight = originalBodyPadding;
        window.scrollTo({ top: scrollPosition, behavior: 'instant' });
        opener?.focus({ preventScroll: true });
    }
    function close() { dialog.close(); restorePage(); }
    dialog.querySelector('.dossier-close').addEventListener('click', close);
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
    });
    dialog.addEventListener('close', restorePage);
    dialog.querySelector('[data-dossier-prev]').addEventListener('click', () => { if (index > 0) { index--; render(true); } });
    dialog.querySelector('[data-dossier-next]').addEventListener('click', () => { if (index < entries.length - 1) { index++; render(true); } });
    entries.forEach(entry => {
        entry.button.setAttribute('aria-haspopup', 'dialog'); entry.button.setAttribute('aria-controls', dialog.id);
        entry.button.addEventListener('click', () => open(entry, entry.button));
    });
    function translate() {
        const russian = getCurrentLang() === 'ru';
        const locale = window.RE_CHARACTER_TRANSLATIONS || { names: {}, descriptions: {} };
        entries.forEach(entry => {
            entry.title.textContent = russian ? locale.names[entry.originalTitle] || entry.originalTitle : entry.originalTitle;
            entry.description.textContent = russian ? locale.descriptions[entry.id] || entry.originalDescription : entry.originalDescription;
            entry.image.alt = russian ? locale.names[entry.originalAlt] || locale.names[entry.identity] || entry.originalAlt : entry.originalAlt;
            entry.button.textContent = t().more;
            entry.button.setAttribute('aria-label', `${t().more}: ${entry.title.textContent} — ${titleFor(entry)}`);
        });
        document.title = russian ? 'Персонажи — Resident Evil' : 'Resident Evil Characters';
        if (dialog.open) render();
    }
    document.addEventListener('languagechange', translate);
    translate();
})();
