(() => {
    'use strict';
    const data = window.RE_TOP_GAME_HISTORY;
    const cards = document.querySelectorAll('.top-game-item');
    if (!data || !cards.length) return;

    const language = () => getCurrentLang() === 'ru' ? 'ru' : 'en';
    const ui = () => data.ui[language()];
    const bindings = [];
    const text = (node, value) => { bindings.push(() => { node.textContent = value(); }); return node; };
    const element = (tag, className) => { const node = document.createElement(tag); if (className) node.className = className; return node; };
    const heading = (key, className) => text(element('h4', className), () => ui()[key]);
    const localizedDate = date => new Intl.DateTimeFormat(language() === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

    text(document.querySelector('.page-intro h2'), () => ui().title);
    text(document.querySelector('.page-intro p'), () => ui().subtitle);

    cards.forEach((card, index) => {
        const game = data.games[index];
        if (!game) return;
        card.dataset.game = game.id;
        const info = card.querySelector('.top-game-info');
        text(info.querySelector('.top-game-year'), () => `${game.release.slice(0, 4)} · ${game.platforms}`);
        text(info.querySelector(':scope > p:not(.top-game-year)'), () => game.description[language()]);
        text(info.querySelector('.top-game-votes'), () => ui().tags[index]);

        const details = element('details', 'game-history');
        const summary = element('summary', 'history-button');
        const summaryLabel = text(element('span'), () => details.open ? ui().close : ui().history);
        summary.append(summaryLabel);
        const title = card.querySelector('h3');
        title.id = `title-${game.id}`;
        summary.id = `history-button-${game.id}`;
        summary.setAttribute('aria-describedby', title.id);
        const panel = element('div', 'history-panel');
        panel.id = `history-${game.id}`;
        summary.setAttribute('aria-controls', panel.id);
        const facts = element('dl', 'history-facts');
        function fact(label, value) {
            const pair = element('div');
            pair.append(text(element('dt'), () => ui()[label]));
            const description = element('dd');
            if (typeof value === 'function') text(description, value); else description.append(value);
            pair.append(description); facts.append(pair);
        }
        const date = text(element('time'), () => localizedDate(game.release));
        date.dateTime = game.release;
        fact('release', date);
        fact('edition', () => game.edition[language()]);
        fact('publisher', () => 'Capcom');
        fact('platforms', () => game.platforms);
        panel.append(facts, heading('development'), text(element('p', 'history-prose'), () => game.development[language()]), heading('story'), text(element('p', 'history-prose'), () => game.story[language()]), text(element('p', 'history-note'), () => ui().note));
        const sources = element('ul', 'history-sources');
        game.sources.forEach(source => {
            const item = element('li');
            const link = text(element('a'), () => source[language()]);
            link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
            item.append(link); sources.append(item);
        });
        panel.append(heading('sources', 'history-sources-title'), sources);
        details.append(summary, panel); info.append(details);
        details.addEventListener('toggle', () => { summaryLabel.textContent = details.open ? ui().close : ui().history; });
    });

    // Translate existing nodes so open histories and keyboard focus survive EN/RU.
    const translate = () => { bindings.forEach(update => update()); document.title = language() === 'ru' ? 'Лучшие игры — Resident Evil' : 'Top Games — Resident Evil'; };
    document.addEventListener('languagechange', translate);
    translate();
})();
