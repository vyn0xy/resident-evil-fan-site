function initializeProfileForm() {
    const profile = window.RE_PROFILE, form = document.getElementById('register-form'), input = document.getElementById('name');
    const error = document.getElementById('name-error'), status = document.getElementById('profile-status');
    const next = new URLSearchParams(location.search).get('next');
    const returnPage = ['trivia.html','guess.html','photo.html','games.html','personality.html','survival-story.html','memory.html'].includes(next) ? next : null;
    input.value = profile.getName(); input.setAttribute('aria-describedby', 'name-error profile-hint');
    function message(key) { status.dataset.message = key; status.textContent = profile.ui()[key]; status.hidden = false; }
    form.addEventListener('submit', event => {
        event.preventDefault();
        const result = profile.setName(input.value);
        error.hidden = result.ok; error.style.display = result.ok ? 'none' : 'block'; input.setAttribute('aria-invalid', String(!result.ok));
        if (!result.ok) { error.textContent = profile.ui().invalid; input.focus(); return; }
        input.value = profile.getName();
        if (returnPage && result.stored) { location.href = returnPage; return; }
        message(result.stored ? 'saved' : 'temporary');
    });
    input.addEventListener('input', () => { error.hidden = true; error.style.display = 'none'; input.removeAttribute('aria-invalid'); status.hidden = true; });
    document.getElementById('clear-profile').addEventListener('click', () => { profile.clear(); input.value = ''; message('removed'); input.focus(); });
    document.addEventListener('languagechange', () => { if (!status.hidden) status.textContent = profile.ui()[status.dataset.message]; if (!error.hidden) error.textContent = profile.ui().invalid; });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeProfileForm, { once: true });
else initializeProfileForm();
