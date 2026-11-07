(() => {
    'use strict';
    const panel = document.querySelector('.game-panel');
    const content = document.getElementById('game-content');
    const isTrivia = panel.dataset.mode === 'trivia';
    const isPhoto = panel.dataset.format === 'photo';
    const data = window.RE_GAME_DATA;
    const characterBank = isPhoto ? [...data.characters, ...(window.RE_PHOTO_CHARACTERS || [])] : data.characters;
    const copy = {
        en: {
            title: isTrivia ? 'The Umbrella archive' : 'Classified identities', eyebrow: isTrivia ? 'LORE CHALLENGE / 01' : 'CHARACTER DOSSIERS / 02',
            intro: isTrivia ? 'Details, experiments and forgotten files. Every question names its game and version. How much do you really remember?' : 'A name has been removed from each dossier. Identify the character from a clue. Reveal more intel if you need it — each extra clue costs one point.',
            bank: 'Available files', difficulty: 'Difficulty', advanced: 'Advanced', expert: 'Expert', mixed: 'Mixed', length: 'Session length', all: 'All available', rounds: 'rounds', start: 'Begin investigation',
            text: 'Text clues', photo: 'Photo identification', format: 'Choose a format', photoNote: 'Square portraits, four possible identities. Luis Serra and Jack Krauser are also in the photo archive.',
            rules: '3 points per correct answer. No timer. Questions never repeat within a session.', spoiler: 'Contains story spoilers. Game versions are specified to avoid confusing originals with remakes.',
            best: 'Best on this device', none: 'No completed sessions yet', points: 'points', round: 'FILE', score: 'SCORE', hint: 'Reveal another clue', clue: 'CLUE', value: 'Points available',
            who: 'Whose file is this?', portrait: 'Who is in this photo?', identify: 'Unidentified character portrait', next: 'Next file', finish: 'Complete investigation', correct: 'Identity confirmed', triviaCorrect: 'Answer confirmed', wrong: 'File mismatch', answer: 'Correct answer',
            done: 'Investigation complete', again: 'New random session', settings: 'Change settings', result: 'Accuracy', correctCount: 'Correct answers', hints: 'Extra clues used', perfect: 'S-rank · Archive specialist', good: 'A-rank · Field operative', practice: 'B-rank · Keep investigating',
            review: 'Files to revisit', saved: 'Personal best saved in this browser. No public leaderboard.', unavailable: 'Browser storage is unavailable. You can still play; this result could not be saved.', feedback: 'Choose an answer to declassify the file.', clueHint: 'Start with one clue. Two more are available.', back: 'Back to setup'
        },
        ru: {
            title: isTrivia ? 'Архив Umbrella' : 'Засекреченные личности', eyebrow: isTrivia ? 'ПРОВЕРКА ЗНАНИЙ / 01' : 'ДОСЬЕ ПЕРСОНАЖЕЙ / 02',
            intro: isTrivia ? 'Детали, эксперименты и забытые документы. У каждого вопроса указана игра и её версия. Многое ли вы помните на самом деле?' : 'Из каждого досье удалено имя. Узнайте персонажа по подсказке. Можно запросить дополнительные сведения, но каждая новая подсказка стоит одного очка.',
            bank: 'Доступно досье', difficulty: 'Сложность', advanced: 'Знаток', expert: 'Эксперт', mixed: 'Смешанная', length: 'Длина сессии', all: 'Все доступные', rounds: 'раундов', start: 'Начать расследование',
            text: 'По тексту', photo: 'По фотографии', format: 'Выберите формат', photoNote: 'Квадратные портреты и четыре варианта ответа. Луис Серра и Джек Краузер тоже в фотоархиве.',
            rules: '3 очка за верный ответ. Без таймера. В одной сессии вопросы не повторяются.', spoiler: 'Есть сюжетные спойлеры. Версии игр указаны отдельно, чтобы не путать оригиналы с ремейками.',
            best: 'Рекорд на этом устройстве', none: 'Завершённых сессий пока нет', points: 'очков', round: 'ДОСЬЕ', score: 'СЧЁТ', hint: 'Открыть ещё подсказку', clue: 'ПОДСКАЗКА', value: 'Очков за ответ',
            who: 'Чьё это досье?', portrait: 'Кто на фотографии?', identify: 'Портрет неизвестного персонажа', next: 'Следующее досье', finish: 'Завершить расследование', correct: 'Личность установлена', triviaCorrect: 'Ответ подтверждён', wrong: 'Данные не совпадают', answer: 'Правильный ответ',
            done: 'Расследование завершено', again: 'Новая случайная сессия', settings: 'Изменить настройки', result: 'Точность', correctCount: 'Верных ответов', hints: 'Дополнительных подсказок', perfect: 'Ранг S · Специалист архива', good: 'Ранг A · Полевой агент', practice: 'Ранг B · Продолжайте расследование',
            review: 'Досье для повторения', saved: 'Рекорд сохранён в этом браузере. Общего рейтинга пока нет.', unavailable: 'Хранилище браузера недоступно. Играть можно, но результат не сохранён.', feedback: 'Выберите ответ, чтобы рассекретить досье.', clueHint: 'Начните с одной подсказки. Ещё две можно открыть.', back: 'К настройкам'
        }
    };
    if (isPhoto) {
        Object.assign(copy.en, { title: 'Visual identification', eyebrow: 'PHOTO ARCHIVE / 03', intro: 'Recognize a character from a portrait. Four possible identities, one answer. This is a separate challenge from the text dossiers.' });
        Object.assign(copy.ru, { title: 'Опознать по фотографии', eyebrow: 'ФОТОАРХИВ / 03', intro: 'Узнайте персонажа по портрету. Четыре возможные личности и один верный ответ. Это отдельное испытание, независимое от текстовых досье.' });
    }
    Object.assign(copy.en, { yourAnswer: 'Your answer', imageFallback: 'Photo unavailable. Showing the demo portrait.', imageMissing: 'Portrait unavailable. Check the image path or try the text dossiers.', session: 'Progress stays in this tab when you switch games.', newSetup: 'Set up a new session', textFile: 'ARCHIVE / CLASSIFIED', photoFile: 'PHOTO / CLASSIFIED' });
    Object.assign(copy.ru, { yourAnswer: 'Ваш ответ', imageFallback: 'Фото недоступно. Показан демонстрационный портрет.', imageMissing: 'Портрет недоступен. Проверьте путь к файлу или откройте текстовые досье.', session: 'Прогресс сохраняется в этой вкладке при переходе между играми.', newSetup: 'Настроить новую сессию', textFile: 'АРХИВ / ЗАСЕКРЕЧЕНО', photoFile: 'ФОТО / ЗАСЕКРЕЧЕНО' });
    const format = isPhoto ? 'photo' : 'text';
    let difficulty = 'advanced', length = '10';
    let rounds = [], index = 0, score = 0, hints = 0, selected = null, revealed = 1, screen = 'intro', busy = false, history = [], storageOK = true;
    const lang = () => getCurrentLang() === 'ru' ? 'ru' : 'en';
    const t = () => copy[lang()];
    const label = value => lang() === 'ru' ? (data.optionLabels[value] || value.replace(/ years$/, ' лет')) : value;
    const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sessionKey = `re-session-v3-${isTrivia ? 'trivia' : format}`;
    let heightAnimation;
    const photoPath = item => window.RE_CHARACTER_PHOTOS?.[item.id] || item.image;
    const explanation = round => round.item.explanation?.[lang()] || round.item.clues[lang()][2];
    const shuffle = items => {
        const result = [...items];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    };
    const pool = () => isTrivia ? data.trivia.filter(q => difficulty === 'mixed' || q.level === difficulty) : isPhoto ? characterBank.filter(photoPath) : characterBank;
    const size = () => length === 'all' ? pool().length : Math.min(Number(length), pool().length);
    const recordSize = () => screen === 'intro' ? size() : rounds.length;
    const key = () => `re-v2-${isTrivia ? `trivia-${difficulty}` : `guess-${format}`}-${recordSize()}`;
    const best = () => { try { return Math.max(0, Math.min(recordSize() * 3, Number(localStorage.getItem(key())) || 0)); } catch { storageOK = false; return 0; } };
    function el(tag, text, className) {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    }
    function button(text, action, className = 'game-action') {
        const node = el('button', text, className);
        node.type = 'button'; node.addEventListener('click', action); return node;
    }
    function select(label, values, value, action) {
        const wrapper = el('label', undefined, 'game-setting');
        wrapper.append(el('span', label));
        const input = el('select');
        values.forEach(([id, text]) => { const option = el('option', text); option.value = id; input.append(option); });
        input.value = value; input.addEventListener('change', () => action(input.value)); wrapper.append(input); return wrapper;
    }
    function intro() {
        content.append(el('p', t().intro, 'game-lead'));
        if (!isTrivia) {
            content.append(el('p', format === 'photo' ? t().photoNote : t().clueHint, 'game-helper'));
        }
        const settings = el('div', undefined, 'game-settings');
        if (isTrivia) settings.append(select(t().difficulty, ['advanced','expert','mixed'].map(d => [d,t()[d]]), difficulty, value => { difficulty = value; render(); }));
        settings.append(select(t().length, [['10',`10 ${t().rounds}`],['20',`20 ${t().rounds}`],['all',`${t().all} (${pool().length})`]], length, value => { length = value; render(); }));
        content.append(settings, el('p', `${t().bank}: ${pool().length} · ${t().best}: ${best()}/${size()*3}`, 'game-best'), el('p', t().rules, 'game-helper'), el('p', t().session, 'game-helper'), el('p', t().spoiler, 'game-spoiler'), button(t().start, start));
    }
    // Session progress is local to this browser tab. Record keys from v2 stay unchanged.
    function saveSession() {
        try {
            sessionStorage.setItem(sessionKey, JSON.stringify({ difficulty, length, index, score, hints, selected, revealed, screen,
                rounds: rounds.map(round => ({ id: round.item.id, options: round.options })),
                history: history.map(entry => ({ correct: entry.correct, earned: entry.earned, selected: entry.selected })) }));
        } catch { /* Games remain playable when session storage is unavailable. */ }
    }
    function restoreSession() {
        try {
            const saved = JSON.parse(sessionStorage.getItem(sessionKey));
            if (!saved || !['advanced','expert','mixed'].includes(saved.difficulty) || !['10','20','all'].includes(saved.length) || !['intro','playing','result'].includes(saved.screen)) return;
            const bank = isTrivia ? data.trivia : characterBank;
            const restored = saved.rounds.map(round => {
                const item = bank.find(item => item.id === round.id);
                const answer = isTrivia ? item?.answer : item?.name;
                const allowed = isTrivia ? item?.choices : bank.map(item => item.name);
                if (!item || round.options.length !== 4 || new Set(round.options).size !== 4 || !round.options.includes(answer) || !round.options.every(value => allowed.includes(value))) throw new Error('Stale session');
                return { item, answer, options: round.options };
            });
            if (new Set(restored.map(round => round.item.id)).size !== restored.length || !Number.isInteger(saved.index) || saved.index < 0 || saved.index >= Math.max(1, restored.length) || !Number.isInteger(saved.revealed) || saved.revealed < 1 || saved.revealed > 3 || !Number.isFinite(saved.score) || saved.score < 0 || saved.score > restored.length * 3 || !Number.isInteger(saved.hints) || saved.hints < 0) return;
            if (saved.screen !== 'intro' && (!restored.length || saved.history.length !== (saved.screen === 'result' ? restored.length : saved.index + (saved.selected === null ? 0 : 1)))) return;
            if (saved.screen === 'playing' && saved.selected !== null && !restored[saved.index].options.includes(saved.selected)) return;
            difficulty = saved.difficulty; length = saved.length; rounds = restored;
            index = saved.index; score = saved.score; hints = saved.hints; selected = saved.selected; revealed = saved.revealed; screen = saved.screen;
            history = saved.history.map((entry, i) => ({ ...entry, round: rounds[i] }));
        } catch { /* Ignore obsolete or incomplete session data. */ }
    }
    function start() {
        if (!window.RE_PROFILE.getName()) { window.RE_PROFILE.requireName(start); return; }
        rounds = shuffle(pool()).slice(0, size()).map(item => ({ item, answer: isTrivia ? item.answer : item.name, options: isTrivia ? shuffle(item.choices) : shuffle([item.name, ...shuffle(characterBank.filter(other => other !== item)).slice(0,3).map(other => other.name)]) }));
        index = 0; score = 0; hints = 0; revealed = 1; selected = null; history = []; screen = 'playing'; render(true);
    }
    function animateIn() {
        content.classList.remove('round-enter');
        void content.offsetWidth;
        content.classList.add('round-enter');
    }
    function answer(option) {
        if (!window.RE_PROFILE.getName()) { window.RE_PROFILE.requireName(() => answer(option)); return; }
        if (selected !== null || busy) return;
        selected = option;
        const round = rounds[index], correct = option === round.answer;
        const earned = correct ? (isTrivia || format === 'photo' ? 3 : 4-revealed) : 0;
        score += earned;
        history.push({ round, correct, earned, selected: option });
        // Keep the same answer nodes alive so CSS can interpolate their states.
        content.querySelectorAll('.game-answer').forEach(node => {
            node.disabled = true;
            node.classList.toggle('answer-selected', node.dataset.answer === option);
            node.classList.toggle('answer-correct', node.dataset.answer === round.answer);
            node.classList.toggle('answer-wrong', node.dataset.answer === option && !correct);
            node.classList.toggle('answer-muted', node.dataset.answer !== option && node.dataset.answer !== round.answer);
        });
        const hint = content.querySelector('.clue-hint'); if (hint) hint.disabled = true;
        updateFeedback();
        const portrait = content.querySelector('.mystery-portrait'); if (portrait) portrait.alt = label(round.answer);
        saveSession();
        content.querySelector('.game-next').focus({ preventScroll: true });
    }
    function updateFeedback() {
        const round = rounds[index], correct = selected === round.answer;
        content.querySelector('.score-value').textContent = `${score}`;
        const feedback = content.querySelector('.game-feedback');
        feedback.classList.add('is-revealed'); feedback.classList.toggle('feedback-correct', correct);
        feedback.querySelector('.feedback-heading').textContent = correct ? (isTrivia ? t().triviaCorrect : t().correct) : t().wrong;
        feedback.querySelector('.feedback-answer').textContent = `${t().answer}: ${label(round.answer)}`;
        feedback.querySelector('.feedback-explanation').textContent = explanation(round);
        const next = content.querySelector('.game-next'); next.hidden = false;
    }
    function next() {
        if (!window.RE_PROFILE.getName()) { window.RE_PROFILE.requireName(next); return; }
        if (busy || selected === null) return;
        busy = true;
        content.setAttribute('aria-busy', 'true');
        content.classList.remove('round-enter');
        void content.offsetWidth;
        content.classList.add('round-leave');
        setTimeout(() => {
            if (index === rounds.length-1) {
                screen = 'result';
                const record = Math.max(best(), score);
                try { localStorage.setItem(key(), String(record)); storageOK = true; } catch { storageOK = false; }
            } else { index++; selected = null; revealed = 1; }
            busy = false; content.removeAttribute('aria-busy'); content.classList.remove('round-leave'); render(true);
        }, reduced() ? 0 : 180);
    }
    function addClue() {
        if (!window.RE_PROFILE.getName()) { window.RE_PROFILE.requireName(addClue); return; }
        if (busy || selected !== null || revealed >= 3) return;
        const list = content.querySelector('.clue-list');
        list.append(clueNode(revealed)); revealed++; hints++;
        content.querySelector('.points-available').textContent = `${t().value}: ${4-revealed}`;
        const hint = content.querySelector('.clue-hint');
        hint.disabled = revealed === 3;
        saveSession();
    }
    function clueNode(i) {
        const node = el('li', undefined, 'dossier-clue');
        node.append(el('span', `${t().clue} 0${i+1}`, 'clue-label'), el('p', rounds[index].item.clues[lang()][i])); return node;
    }
    function playing() {
        const round = rounds[index];
        const meta = el('div', undefined, 'round-meta');
        meta.append(el('span', `${t().round} ${String(index+1).padStart(2,'0')} / ${rounds.length}`));
        const scoreNode = el('span', `${t().score} `); scoreNode.append(el('b', String(score), 'score-value')); meta.append(scoreNode);
        const track = el('div', undefined, 'round-track');
        const fill = el('span'); fill.style.width = `${index/rounds.length*100}%`; track.append(fill); track.setAttribute('role','progressbar'); track.setAttribute('aria-valuemin','0'); track.setAttribute('aria-valuemax',String(rounds.length)); track.setAttribute('aria-valuenow',String(index)); track.setAttribute('aria-label',t().round);
        content.append(meta, track);
        content.append(el('p', isTrivia ? `${round.item.game} / ${t()[round.item.level]}` : format === 'text' ? t().textFile : t().photoFile, 'file-tag'));
        const heading = el('h3', isTrivia ? round.item.question[lang()] : format === 'text' ? t().who : t().portrait); heading.tabIndex = -1; content.append(heading);
        if (!isTrivia && format === 'photo') {
            const frame = el('div', undefined, 'portrait-frame');
            const img = el('img'); img.alt = selected === null ? t().identify : label(round.answer); img.className = 'mystery-portrait'; img.width = 400; img.height = 400;
            const note = el('p', '', 'game-helper portrait-note'); note.hidden = true;
            let triedDemo = false;
            img.addEventListener('error', () => {
                note.hidden = false;
                if (!triedDemo && photoPath(round.item) !== round.item.image) {
                    triedDemo = true; note.textContent = t().imageFallback; img.src = round.item.image;
                } else { img.hidden = true; note.textContent = t().imageMissing; }
            });
            img.src = photoPath(round.item); frame.append(img, note); content.append(frame);
        } else if (!isTrivia) {
            const list = el('ol', undefined, 'clue-list'); list.setAttribute('aria-live','polite'); for (let i=0;i<revealed;i++) list.append(clueNode(i));
            const hint = button(t().hint, addClue, 'hint-button clue-hint'); hint.disabled = selected !== null || revealed === 3;
            content.append(list, el('p', `${t().value}: ${4-revealed}`, 'points-available'), hint);
        }
        const answers = el('div', undefined, 'game-answers');
        round.options.forEach((option,i) => {
            const node = button('', () => answer(option), 'game-answer'); node.dataset.answer = option;
            node.append(el('span', String.fromCharCode(65+i), 'answer-letter'), el('span',label(option))); answers.append(node);
        }); content.append(answers);
        const feedback = el('div', undefined, 'game-feedback'); feedback.setAttribute('role','status'); feedback.setAttribute('aria-live','polite'); feedback.setAttribute('aria-atomic','true');
        // Invisible text reserves exactly the space the revealed explanation needs.
        feedback.append(el('strong', selected === null ? t().feedback : '', 'feedback-heading'), el('p', `${t().answer}: ${label(round.answer)}`, 'feedback-answer'), el('p', explanation(round), 'feedback-explanation'));
        const advance = button(index === rounds.length-1 ? t().finish : t().next, next, 'game-action game-next'); advance.hidden = true;
        content.append(feedback,advance);
        const setup = button(t().newSetup, () => { if (!busy) { screen = 'intro'; render(true); } }, 'hint-button game-setup');
        content.append(setup);
        if (selected !== null) {
            content.querySelectorAll('.game-answer').forEach(node => {
                node.disabled = true;
                node.classList.toggle('answer-selected',node.dataset.answer===selected);
                node.classList.toggle('answer-correct',node.dataset.answer===round.answer);
                node.classList.toggle('answer-wrong',node.dataset.answer===selected && selected!==round.answer);
                node.classList.toggle('answer-muted',node.dataset.answer!==selected && node.dataset.answer!==round.answer);
            }); updateFeedback();
        }
    }
    function result() {
        const correct = history.filter(item=>item.correct).length;
        const percentage = Math.round(correct/rounds.length*100);
        const heading = el('h3',t().done); heading.tabIndex=-1;
        content.append(heading,el('p',`${score} / ${rounds.length*3}`, 'game-result'),el('p',score>=rounds.length*3*.9?t().perfect:score>=rounds.length*3*.6?t().good:t().practice,'result-rank'));
        const stats=el('div',undefined,'result-stats');
        [[t().result,`${percentage}%`],[t().correctCount,`${correct}/${rounds.length}`],[t().hints,String(hints)]].forEach(([label,value])=>{const stat=el('p');stat.append(el('strong',value),el('span',label));stats.append(stat);});
        content.append(stats,el('p',`${t().best}: ${best()}/${rounds.length*3}`, 'game-best'),el('p',storageOK?t().saved:t().unavailable,'game-helper'));
        const actions=el('div',undefined,'result-actions');actions.append(button(t().again,start),button(t().settings,()=>{screen='intro';render(true);},'hint-button'));content.append(actions);
        const wrong=history.filter(item=>!item.correct);
        if(wrong.length){
            const review=el('details',undefined,'game-review');
            review.append(el('summary',`${t().review} (${wrong.length})`));
            wrong.forEach(({round,selected:chosen})=>{
                const entry=el('div');
                entry.append(el('p',isTrivia?round.item.question[lang()]:isPhoto?t().portrait:round.item.clues[lang()][0]));
                if(isPhoto){const img=el('img',undefined,'review-portrait');img.src=photoPath(round.item);img.alt=label(round.answer);img.width=96;img.height=96;img.loading='lazy';entry.append(img);}
                entry.append(el('p',`${t().yourAnswer}: ${label(chosen)}`, 'review-wrong'),el('strong',`${t().answer}: ${label(round.answer)}`),el('p',explanation(round)));
                review.append(entry);
            });
            content.append(review);
        }
    }
    function render(focus=false) {
        heightAnimation?.cancel();
        const previousHeight = content.getBoundingClientRect().height;
        document.getElementById('game-title').textContent=t().title;
        let eyebrow=panel.querySelector('.game-eyebrow');
        if(!eyebrow){eyebrow=el('p',undefined,'game-eyebrow');panel.prepend(eyebrow);}eyebrow.textContent=t().eyebrow;
        content.replaceChildren();
        if (screen !== 'intro' && !window.RE_PROFILE.getName()) {
            content.append(el('p', window.RE_PROFILE.ui().required, 'game-lead'), button(window.RE_PROFILE.ui().resume, () => window.RE_PROFILE.requireName(() => render(true))));
        } else if(screen==='intro')intro();else if(screen==='playing')playing();else result();
        if (!busy && (focus || !previousHeight)) animateIn();
        const nextHeight = content.getBoundingClientRect().height;
        if (previousHeight && !reduced() && focus) {
            heightAnimation = content.animate([{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }], { duration: 320, easing: 'ease-in-out' });
        }
        saveSession();
        if(focus){
            const target=content.querySelector('h3')||document.getElementById('game-title');
            target.tabIndex=-1;target.focus({preventScroll:true});
            const header = document.querySelector('header');
            const topInset = getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().height + 24 : 24;
            const bounds = target.getBoundingClientRect();
            if (bounds.top < topInset || bounds.bottom > innerHeight) target.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'start' });
        }
    }
    document.addEventListener('languagechange',()=>render());
    document.addEventListener('profilechange',()=>{ if (!busy) render(); });
    restoreSession();
    render();
})();
