/* Shared navigation and browser-local nickname. This is not server login. */
(() => {
    'use strict';
    const copy = {
        en: {
            back: '← Back', home: 'Home', top: 'Top games', profile: 'Local profile', enter: 'Choose a nickname', title: 'Before you play', editTitle: 'Your nickname',
            note: 'Enter a nickname to begin. This is a local player profile, not a registered account.', label: 'Nickname', placeholder: '2–30 characters', save: 'Save and play', cancel: 'Cancel',
            invalid: 'Use 2–30 characters. A nickname cannot contain only spaces.', temporary: 'Browser storage is unavailable. The nickname will last until this page is closed.',
            required: 'Choose a nickname to continue your investigation.', resume: 'Enter nickname and continue', saved: 'Nickname saved in this browser.', clear: 'Remove nickname', removed: 'Nickname removed. Enter a new one before playing.',
            continue: 'Go to mini-games', saveProfile: 'Save nickname', hint: 'No email or password is needed. Scores stay in this browser and are not tied to an online account.'
        },
        ru: {
            back: '← Назад', home: 'На главную', top: 'Лучшие игры', profile: 'Локальный профиль', enter: 'Указать ник', title: 'Перед началом игры', editTitle: 'Ваш ник',
            note: 'Введите ник, чтобы начать. Это локальный профиль игрока, а не зарегистрированный аккаунт.', label: 'Ник', placeholder: 'От 2 до 30 символов', save: 'Сохранить и играть', cancel: 'Отмена',
            invalid: 'Введите от 2 до 30 символов. Ник не может состоять только из пробелов.', temporary: 'Хранилище браузера недоступно. Ник будет действовать до закрытия этой страницы.',
            required: 'Укажите ник, чтобы продолжить расследование.', resume: 'Ввести ник и продолжить', saved: 'Ник сохранён в этом браузере.', clear: 'Удалить ник', removed: 'Ник удалён. Перед игрой введите новый.',
            continue: 'К мини-играм', saveProfile: 'Сохранить ник', hint: 'Почта и пароль не нужны. Рекорды остаются в этом браузере и не привязаны к сетевому аккаунту.'
        }
    };
    const ui = () => copy[getCurrentLang() === 'ru' ? 'ru' : 'en'];
    const normalize = value => String(value || '').trim().replace(/\s+/g, ' ');
    const validName = value => { const name = normalize(value); return name.length >= 2 && name.length <= 30 && !/[\u0000-\u001f\u007f]/.test(name); };
    let memoryName = '';
    function getName() {
        for (const storage of ['localStorage', 'sessionStorage']) {
            try { const name = window[storage].getItem('userName'); if (validName(name)) return normalize(name); } catch { /* Try another storage or page memory. */ }
        }
        return validName(memoryName) ? memoryName : '';
    }
    function changed() { updateUserProfile(); document.dispatchEvent(new Event('profilechange')); }
    function setName(value) {
        const name = normalize(value);
        if (!validName(name)) return { ok: false, stored: false };
        memoryName = name;
        let stored = false;
        for (const storage of ['localStorage', 'sessionStorage']) {
            try {
                window[storage].setItem('userName', name);
                // Legacy compatibility only; this is not server authentication.
                window[storage].setItem('isLoggedIn', 'true');
                window[storage].removeItem('userEmail'); stored = true;
                if (storage === 'localStorage') { try { sessionStorage.removeItem('userName'); sessionStorage.removeItem('isLoggedIn'); } catch { /* Persistent nickname already saved. */ } }
                break;
            } catch { /* Entered nicknames still work in page memory. */ }
        }
        changed(); return { ok: true, stored };
    }
    function clear() {
        memoryName = '';
        for (const storage of ['localStorage', 'sessionStorage']) {
            for (const key of ['userName', 'isLoggedIn', 'userEmail']) { try { window[storage].removeItem(key); } catch { /* Preserve scores and progress. */ } }
        }
        changed();
    }
    let dialog, pending, editing = false;
    function translateDialog() {
        if (!dialog) return;
        dialog.querySelector('h2').textContent = editing ? ui().editTitle : ui().title;
        dialog.querySelector('.nickname-description').textContent = ui().note;
        dialog.querySelector('label').textContent = ui().label;
        dialog.querySelector('input').placeholder = ui().placeholder;
        dialog.querySelector('[type="submit"]').textContent = ui().save;
        dialog.querySelector('[data-cancel]').textContent = ui().cancel;
        const error = dialog.querySelector('.nickname-error'); if (!error.hidden) error.textContent = ui().invalid;
    }
    function openDialog(action, edit = false) {
        pending = action; editing = edit;
        if (!dialog) {
            dialog = document.createElement('dialog'); dialog.className = 'nickname-dialog';
            dialog.setAttribute('aria-labelledby', 'nickname-title'); dialog.setAttribute('aria-describedby', 'nickname-description');
            dialog.innerHTML = '<form novalidate><p class="game-eyebrow">RESIDENT EVIL / PLAYER</p><h2 id="nickname-title"></h2><p id="nickname-description" class="nickname-description"></p><label for="player-nickname"></label><input id="player-nickname" name="nickname" autocomplete="nickname" minlength="2" maxlength="30" required aria-describedby="nickname-error"><p id="nickname-error" class="nickname-error" role="alert" hidden></p><div class="nickname-actions"><button type="submit" class="site-button"></button><button type="button" class="site-button secondary" data-cancel></button></div></form>';
            document.body.append(dialog);
            dialog.querySelector('form').addEventListener('submit', event => {
                event.preventDefault();
                const input = dialog.querySelector('input'), result = setName(input.value), error = dialog.querySelector('.nickname-error');
                error.hidden = result.ok; input.setAttribute('aria-invalid', String(!result.ok));
                if (!result.ok) { error.textContent = ui().invalid; input.focus(); return; }
                const action = pending; pending = undefined; dialog.close(); if (action) action();
            });
            dialog.querySelector('[data-cancel]').addEventListener('click', () => { pending = undefined; dialog.close(); });
            dialog.addEventListener('cancel', () => { pending = undefined; });
            dialog.querySelector('input').addEventListener('input', () => { dialog.querySelector('.nickname-error').hidden = true; dialog.querySelector('input').removeAttribute('aria-invalid'); });
        }
        dialog.querySelector('input').value = getName(); dialog.querySelector('.nickname-error').hidden = true; dialog.querySelector('input').removeAttribute('aria-invalid');
        translateDialog(); if (!dialog.open) dialog.showModal(); dialog.querySelector('input').focus();
    }
    function requireName(action) { if (getName()) { action(); return true; } openDialog(action); return false; }
    window.RE_PROFILE = Object.freeze({ getName, setName, clear, validName, requireName, editName: action => openDialog(action, true), ui });
    const allowedPages = ['index.html','games.html','characters.html','top-games.html','register.html','trivia.html','guess.html','photo.html','personality.html','survival-story.html','memory.html'];
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const gamePages = ['trivia.html','guess.html','photo.html','personality.html','survival-story.html','memory.html'];
    const currentNav = gamePages.includes(currentPage) ? 'games.html' : currentPage;
    document.querySelectorAll('header a[href]').forEach(link => { if (link.getAttribute('href') === currentNav && !link.classList.contains('site-brand')) link.setAttribute('aria-current', 'page'); });
    document.querySelectorAll('.profile-link').forEach(link => { link.href = gamePages.includes(currentPage) ? `register.html?next=${currentPage}` : 'register.html'; });
    document.querySelectorAll('[data-page-back]').forEach(link => {
        link.addEventListener('click', event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            try {
                const previous = new URL(document.referrer), here = new URL(location.href);
                const sameFolder = previous.pathname.slice(0, previous.pathname.lastIndexOf('/')) === here.pathname.slice(0, here.pathname.lastIndexOf('/'));
                if (previous.origin === here.origin && sameFolder && allowedPages.includes(previous.pathname.split('/').pop()) && previous.pathname !== here.pathname && history.length > 1) {
                    event.preventDefault(); event.stopImmediatePropagation(); history.back();
                }
            } catch { /* Direct opening uses the explicit parent link. */ }
        });
    });
    function translateShell() {
        document.querySelectorAll('[data-site-copy]').forEach(node => { node.textContent = ui()[node.dataset.siteCopy]; });
        translateDialog(); updateUserProfile();
    }
    document.addEventListener('languagechange', translateShell);
    window.addEventListener('pageshow', event => {
        if (!event.persisted) return;
        // Clear stale page memory if the profile was changed in a later document.
        try { localStorage.getItem('userName'); memoryName = ''; } catch { /* Keep memory when storage is blocked. */ }
        changed();
    });
    window.addEventListener('storage', event => {
        if (event.key === 'userName' || event.key === null) {
            memoryName = '';
            if (event.newValue === null) { try { sessionStorage.removeItem('userName'); sessionStorage.removeItem('isLoggedIn'); } catch { /* No tab-local fallback. */ } }
            changed();
        }
    });
    translateShell();
})();
