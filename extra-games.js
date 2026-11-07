/* Three replayable, browser-local experiments: personality, story and memory. */
(() => {
    'use strict';
    const root = document.getElementById('extra-game');
    if (!root) return;

    const t = (en, ru) => ({ en, ru });
    const pick = value => value[getCurrentLang() === 'ru' ? 'ru' : 'en'];
    const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
    const words = {
        en: {
            start: 'Start investigation', restart: 'Play again', next: 'Continue', question: 'Decision', of: 'of',
            record: 'Personal record', none: 'No record yet', score: 'Score', best: 'Best', moves: 'Moves', pairs: 'Pairs',
            time: 'Time', timeLeft: 'Time left', minutes: 'min', seconds: 'sec', relaxed: 'No timer', timed: '90 seconds',
            sixPairs: '6 pairs · 12 cards', tenPairs: '10 pairs · 20 cards', instructions: 'Your progress is saved in this browser. You can switch languages or return to the game list and continue later.',
            noWrong: 'There are no wrong answers. Pick what you would actually do; your strongest pattern determines the result.',
            fanCase: 'Fan-made side story. This is an original scenario, not a canonical event from a specific game.',
            inventory: 'SUPPLIES', health: 'Condition', ammo: 'Ammo', medkits: 'First-aid kits', signals: 'Evidence',
            discovered: 'Collected', matched: 'matched', firstReveal: 'Choose one more portrait to check the pair.',
            memoryDone: 'All evidence matched. Case closed.', timeout: 'The trail went cold. Start another round and try again.',
            relaxedResult: 'Every pair found', timedResult: 'Time remaining',
            noSession: 'No saved investigation was found. Start a fresh one.', review: 'A few decisions changed what was possible later. Here is how this run ended.',
            newRun: 'Start a new investigation', fanNote: 'Original fan-made side case; character and game histories are not being rewritten.',
            dominant: 'Your clearest instinct', affinity: 'choices leaned this way', style: 'Your survivor style',
            radio: 'Radio', map: 'Service-route map', ally: 'Officer rescued', evidenceFound: 'Lab notes', key: 'Service key',
            actions: 'Choose your next move', case: 'CASE FILE / RACCOON CITY',
            replayNote: 'Your previous run is saved in this browser. A fresh run starts from the beginning.',
            timerMode: 'Round mode', size: 'Case size', openCard: 'Reveal portrait', closedCard: 'Sealed evidence',
            notEnoughAmmo: 'You do not have a round for this.', medUnavailable: 'Your first-aid kit is empty.'
        },
        ru: {
            start: 'Начать расследование', restart: 'Пройти ещё раз', next: 'Дальше', question: 'Решение', of: 'из',
            record: 'Личный рекорд', none: 'Рекордов пока нет', score: 'Счёт', best: 'Лучший', moves: 'Ходы', pairs: 'Пары',
            time: 'Время', timeLeft: 'Осталось', minutes: 'мин', seconds: 'сек', relaxed: 'Без таймера', timed: '90 секунд',
            sixPairs: '6 пар · 12 карточек', tenPairs: '10 пар · 20 карточек', instructions: 'Прогресс сохраняется в этом браузере. Можно сменить язык или вернуться к списку игр и продолжить позже.',
            noWrong: 'Неправильных ответов нет. Выбирай то, что сделал бы сам: результат покажет твой главный стиль поведения.',
            fanCase: 'Авторская история по мотивам серии. Это отдельный вымышленный эпизод, а не событие конкретной игры.',
            inventory: 'ЗАПАСЫ', health: 'Состояние', ammo: 'Патроны', medkits: 'Аптечки', signals: 'Улики',
            discovered: 'Собрано', matched: 'совпало', firstReveal: 'Открой ещё один портрет и проверь, есть ли пара.',
            memoryDone: 'Все пары собраны. Дело закрыто.', timeout: 'След остыл. Начни новый раунд и попробуй ещё раз.',
            relaxedResult: 'Найдено пар', timedResult: 'Осталось времени',
            noSession: 'Сохранённое расследование не найдено. Начни новое.', review: 'Некоторые решения изменили то, что было доступно дальше. Вот чем закончился этот поход.',
            newRun: 'Начать новое расследование', fanNote: 'Авторский эпизод по мотивам серии. Он не переписывает историю игр и персонажей.',
            dominant: 'Твой ярче всего выраженный инстинкт', affinity: 'решений привели к этому выбору', style: 'Твой стиль выживания',
            radio: 'Рация', map: 'Карта служебных ходов', ally: 'Полицейский спасён', evidenceFound: 'Записи лаборатории', key: 'Служебный ключ',
            actions: 'Выбери следующий шаг', case: 'ДЕЛО / РАККУН-СИТИ',
            replayNote: 'Прошлый поход сохранён в этом браузере. Новый начнётся с самого начала.',
            timerMode: 'Режим раунда', size: 'Размер дела', openCard: 'Показать портрет', closedCard: 'Запечатанная улика',
            notEnoughAmmo: 'Патроны закончились.', medUnavailable: 'Аптечка пуста.'
        }
    };
    const lang = () => getCurrentLang() === 'ru' ? 'ru' : 'en';
    const ui = () => words[lang()];
    const id = document.body.dataset.extraGame;
    const sessionKey = `re-extra-${id}-v1`;
    const recordKey = `re-extra-${id}-record-v1`;
    let state = null, timerInterval = 0, mismatchTimer = 0;

    const portraits = new Map();
    const photoList = [...(window.RE_GAME_DATA?.characters || []), ...(window.RE_PHOTO_CHARACTERS || [])];
    for (const character of photoList) portraits.set(character.id, {
        id: character.id,
        name: character.name,
        label: window.RE_GAME_DATA?.optionLabels?.[character.name] || character.name,
        image: window.RE_CHARACTER_PHOTOS?.[character.id] || character.image
    });
    const personalityPortraits = {
        ada: 'assets/images/minigames/personality/results/ada.jpg',
        chris: 'assets/images/minigames/personality/results/chris.jpg',
        claire: 'assets/images/minigames/personality/results/claire.jpg',
        ethan: 'assets/images/minigames/personality/results/ethan.jpg',
        hunk: 'assets/images/minigames/personality/results/hunk.jpg',
        jill: 'assets/images/minigames/personality/results/jill.jpg',
        leon: 'assets/images/minigames/personality/results/leon.jpg',
        rebecca: 'assets/images/minigames/personality/results/rebecca.jpg'
    };
    const characterName = character => character ? (lang() === 'ru' ? character.label : character.name) : '';

    const questions = [
        { en: 'A crash echoes from the next street. What comes first?', ru: 'Со следующей улицы доносится грохот. Что ты сделаешь первым?', options: [
            [t('Check the injured person before moving on.', 'Сначала проверю, не ранен ли кто-то.'), 'claire'],
            [t('Find the clearest route out.', 'Найду самый безопасный путь отсюда.'), 'jill'],
            [t('Get between the danger and the group.', 'Встану между опасностью и группой.'), 'chris'],
            [t('Stay in cover and work out what caused it.', 'Останусь в укрытии и выясню, что случилось.'), 'ada']
        ] },
        { en: 'A stranger offers to guide you through a building.', ru: 'Незнакомец предлагает провести тебя через здание.', options: [
            [t('Ask what they know, then make a cautious plan.', 'Выясню, что ему известно, и составлю план.'), 'leon'],
            [t('Keep watch while another person checks the map.', 'Буду следить за обстановкой, пока проверяют карту.'), 'rebecca'],
            [t('Accept if it helps the group move together.', 'Соглашусь, если группа сможет идти вместе.'), 'claire'],
            [t('Go alone and keep a second exit in mind.', 'Пойду один и заранее найду запасной выход.'), 'ada']
        ] },
        { en: 'You find one first-aid kit and two injured people.', ru: 'Ты находишь одну аптечку и двух раненых.', options: [
            [t('Stabilize the person in immediate danger.', 'Помогу тому, кому хуже прямо сейчас.'), 'rebecca'],
            [t('Split the supplies so both can keep moving.', 'Разделю лекарства, чтобы оба могли идти.'), 'claire'],
            [t('Secure an exit, then return with more supplies.', 'Сначала обеспечу выход и вернусь за припасами.'), 'leon'],
            [t('Ask each person what they can still do.', 'Спрошу, чем каждый ещё может помочь.'), 'chris']
        ] },
        { en: 'The direct route is blocked. A narrow service passage is open.', ru: 'Прямой проход перекрыт. Открыт узкий служебный лаз.', options: [
            [t('Inspect it for traps before entering.', 'Осмотрю лаз на ловушки перед входом.'), 'jill'],
            [t('Go first and keep the way back clear.', 'Пойду первым и не перекрою путь назад.'), 'ethan'],
            [t('Send the lightest person to check the other side.', 'Пошлю проверить другую сторону самого лёгкого.'), 'ada'],
            [t('Lead the group through without splitting up.', 'Проведу группу, не разделяя её.'), 'chris']
        ] },
        { en: 'You hear someone calling for help behind a locked door.', ru: 'За закрытой дверью зовут на помощь.', options: [
            [t('Look for a key or a way to open it safely.', 'Поищу ключ или безопасный способ открыть дверь.'), 'leon'],
            [t('Answer and make sure the voice is really human.', 'Отвечу и сначала проверю, кто там.'), 'jill'],
            [t('Open it now. Every second matters.', 'Сразу открою. Каждая секунда на счету.'), 'ethan'],
            [t('Cover the corridor while someone tries the lock.', 'Прикрою коридор, пока другой возится с замком.'), 'hunk']
        ] },
        { en: 'The group is arguing about whether to wait for rescue.', ru: 'Группа спорит: ждать помощь или двигаться дальше.', options: [
            [t('Set a short deadline, then move if nobody arrives.', 'Подожду немного и уйду, если никто не придёт.'), 'leon'],
            [t('Make a backup plan and check our supplies.', 'Составлю запасной план и проверю припасы.'), 'jill'],
            [t('Keep the group together and calm everyone down.', 'Не дам группе разделиться и успокою остальных.'), 'claire'],
            [t('Leave quietly while the route is still open.', 'Тихо уйду, пока путь ещё открыт.'), 'ada']
        ] },
        { en: 'You discover notes that might explain the outbreak.', ru: 'Ты находишь записи, которые могут объяснить вспышку.', options: [
            [t('Take them. People should know the truth.', 'Заберу записи: люди должны знать правду.'), 'claire'],
            [t('Check whether the information can help us escape.', 'Проверю, помогут ли они выбраться.'), 'rebecca'],
            [t('Hide them until everyone is safe.', 'Спрячу их, пока все не окажутся в безопасности.'), 'leon'],
            [t('Leave the evidence and stay focused on the mission.', 'Оставлю улики и сосредоточусь на задаче.'), 'hunk']
        ] },
        { en: 'The only way across is a damaged fire escape.', ru: 'Перебраться можно только по повреждённой пожарной лестнице.', options: [
            [t('Test each step before the others follow.', 'Проверю каждую ступень перед остальными.'), 'jill'],
            [t('Cross first and help the next person down.', 'Переберусь первым и помогу следующему.'), 'chris'],
            [t('Find another way, even if it takes longer.', 'Найду другой путь, даже если это займёт время.'), 'ethan'],
            [t('Move quickly before the structure gives way.', 'Пройду быстро, пока лестница не рухнула.'), 'hunk']
        ] },
        { en: 'A teammate freezes when danger appears.', ru: 'Напарник замирает, заметив опасность.', options: [
            [t('Give them one clear thing to do.', 'Поручу ему одно простое дело.'), 'leon'],
            [t('Stay beside them until they can move.', 'Останусь рядом, пока он не придёт в себя.'), 'claire'],
            [t('Create a distraction so the group can leave.', 'Отвлеку опасность и помогу группе уйти.'), 'ada'],
            [t('Cover them and guide everyone to safety.', 'Прикрою его и выведу всех в безопасное место.'), 'chris']
        ] },
        { en: 'There is time to take one final action before leaving.', ru: 'Перед уходом есть время на одно последнее действие.', options: [
            [t('Check once more that nobody was left behind.', 'Ещё раз проверю, что никто не остался.'), 'claire'],
            [t('Count supplies and choose the safest exit.', 'Пересчитаю припасы и выберу безопасный выход.'), 'jill'],
            [t('Go back for the person who helped us.', 'Вернусь за тем, кто помог нам.'), 'ethan'],
            [t('Leave immediately while the objective is clear.', 'Уйду немедленно, пока задача не изменилась.'), 'hunk']
        ] }
    ];

    const personalityProfiles = {
        leon: t('You read the room, adapt quickly and make practical choices when plans change.', 'Ты быстро оцениваешь обстановку и находишь практичный выход, даже когда план меняется.'),
        jill: t('You stay observant, weigh risks and trust preparation under pressure.', 'Ты замечаешь детали, оцениваешь риск и сохраняешь самообладание.'),
        claire: t('You notice who needs help and give the group a reason to keep going.', 'Ты замечаешь, кому нужна помощь, и помогаешь группе не сдаваться.'),
        chris: t('You step up when others need support and take responsibility for the group.', 'Ты берёшь ответственность и прикрываешь тех, кто рядом.'),
        ada: t('You value independence, keep an exit in mind and reveal only what is needed.', 'Ты ценишь самостоятельность, продумываешь запасной путь и не раскрываешь лишнего.'),
        rebecca: t('You look for useful details and solve the problem in front of you with a clear head.', 'Ты замечаешь полезные детали и спокойно решаешь задачу, которая стоит перед тобой.'),
        ethan: t('You keep moving when things get personal and do not abandon someone who needs you.', 'Ты продолжаешь идти даже в тяжёлой ситуации и не бросаешь тех, кому нужна помощь.'),
        hunk: t('You focus on the objective, use resources carefully and stay composed under pressure.', 'Ты сосредоточен на задаче, бережёшь ресурсы и не теряешь хладнокровия.')
    };

    const story = [
        { title: t('The service gate', 'Служебные ворота'), body: t('A siren cuts out halfway through its warning. The exit gate is chained; a maintenance hatch is barely open beside it.', 'Сирена обрывает предупреждение на полуслове. Выходные ворота закованы цепью, а рядом едва приоткрыт служебный люк.'), choices: [
            { id: 'shoot', title: t('Break the chain with one shot', 'Сбить цепь выстрелом'), outcome: t('The shot breaks the chain, but echoes carry across the block.', 'Цепь падает, но выстрел разносится по всему кварталу.'), can: s => s.ammo >= 1, unavailable: t('You need a round for this.', 'Для этого нужен патрон.'), effect: s => { s.ammo--; s.alarm = true; } },
            { id: 'hatch', title: t('Squeeze through the service hatch', 'Протиснуться через люк'), outcome: t('You slip inside and find a small key on the other side.', 'Ты пробираешься внутрь и находишь с другой стороны небольшой ключ.'), effect: s => { s.health--; s.key = true; s.route = true; } }
        ] },
        { title: t('The stalled bus', 'Заглохший автобус'), body: t('A city bus blocks the street. A police officer is stuck behind its jammed door while shadows move between parked cars.', 'Городской автобус перегородил улицу. Полицейский зажат за заклинившей дверью, а между машинами мелькают тени.'), choices: [
            { id: 'officer', title: t('Pull the officer out', 'Вытащить полицейского'), outcome: t('You get him free. A scrape on your arm stings, but he can walk with the group.', 'Ты вытаскиваешь его. Рука ободрана, зато он сможет идти с группой.'), effect: s => { s.health--; s.ally = true; } },
            { id: 'supplies', title: t('Search the bus for supplies', 'Поискать припасы в автобусе'), outcome: t('There are two usable rounds in the dashboard emergency kit.', 'В аварийном наборе приборной панели нашлись два патрона.'), effect: s => { s.ammo = Math.min(5, s.ammo + 2); } }
        ] },
        { title: t('The shuttered pharmacy', 'Аптека за ставнями'), body: t('The pharmacy sign still glows over a narrow gap in the metal shutters. A voice from the street says the way to the station is almost clear.', 'Над щелью в ставнях всё ещё светится вывеска аптеки. С улицы кричат, что путь к станции почти свободен.'), choices: [
            { id: 'pharmacy', title: t('Look inside for medical supplies', 'Проверить аптеку на лекарства'), outcome: t('A first-aid kit is still on the counter. The search costs precious time.', 'На прилавке осталась аптечка. Поиск отнимает драгоценное время.'), effect: s => { s.medkits = Math.min(2, s.medkits + 1); s.alarm = true; } },
            { id: 'street', title: t('Take the clear street', 'Идти по свободной улице'), outcome: t('You reach the precinct before the street fills again.', 'Ты успеваешь дойти до участка, пока улица снова не заполнилась.'), effect: s => { s.route = true; } }
        ] },
        { title: t('The records room', 'Комната архивов'), body: t('A portable radio sits under a stack of incident reports. The exit corridor is still passable, though something is moving behind the records shelves.', 'Под стопкой отчётов о происшествиях лежит переносная рация. Коридор пока свободен, но за шкафами с делами кто-то движется.'), choices: [
            { id: 'records', title: t('Unlock the records room and take the radio', 'Открыть архив ключом и забрать рацию'), outcome: s => s.alarm ? t('The radio works, but the earlier noise has drawn something into the corridor.', 'Рация работает, но шум привёл что-то в коридор.') : t('The radio works. A map inside the case file shows the service tunnels.', 'Рация работает. В материалах дела найдена карта служебных тоннелей.'), can: s => s.key, unavailable: t('The service hatch may have a key.', 'Поищи ключ у служебного люка.'), effect: s => { s.radio = true; s.evidence = true; s.route = true; if (s.alarm) s.health--; } },
            { id: 'courtyard', title: t('Cross the courtyard while it is quiet', 'Пересечь тихий внутренний двор'), outcome: t('You leave before the movement behind the shelves reaches the door.', 'Ты уходишь до того, как существо добирается до двери.'), effect: s => { s.ammo = Math.min(5, s.ammo + 1); } }
        ] },
        { title: t('An empty clinic', 'Пустой медпункт'), body: t('The clinic has been abandoned in a hurry. There is just enough light to check the cupboards or treat the group.', 'Медпункт покинули в спешке. Света хватает, чтобы осмотреть шкафы или перевязать группу.'), choices: [
            { id: 'heal', title: t('Use a first-aid kit', 'Использовать аптечку'), outcome: t('You clean and bind the worst injuries. Everyone can keep moving.', 'Ты обрабатываешь самые серьёзные раны. Теперь группа может идти дальше.'), can: s => s.medkits > 0, unavailable: t('Your first-aid kit is empty.', 'Аптечка пуста.'), effect: s => { s.medkits--; s.health = Math.min(5, s.health + 2); } },
            { id: 'files', title: t('Search the duty desk for a map', 'Поискать карту на дежурном столе'), outcome: t('A hand-drawn tunnel map shows a way around the blocked streets.', 'На нарисованной от руки карте тоннелей отмечен путь в обход улиц.'), effect: s => { s.route = true; s.evidence = true; } }
        ] },
        { title: t('A call from the roof', 'Сигнал с крыши'), body: t('From the roof you can see a rescue light beyond the quarantine line. Radio contact would make it possible to guide the group there.', 'С крыши виден спасательный огонь за линией карантина. С помощью рации можно направить туда группу.'), choices: [
            { id: 'signal', title: t('Contact the rescue team by radio', 'Связаться со спасателями по рации'), outcome: t('A reply crackles back. They will wait briefly at the east checkpoint.', 'В ответ слышится треск. Спасатели ненадолго задержатся у восточного кордона.'), can: s => s.radio, unavailable: t('You need the portable radio from the records room.', 'Найди переносную рацию в архиве участка.'), effect: s => { s.evac = true; } },
            { id: 'flare', title: t('Signal with a flare', 'Подать сигнал ракетницей'), outcome: t('The flare rises above the rooftops. Someone on the far side answers with a light.', 'Ракета взмывает над крышами. На другом берегу кто-то отвечает светом.'), can: s => s.ammo >= 1, unavailable: t('You need a round for the flare.', 'Для ракетницы нужен патрон.'), effect: s => { s.ammo--; s.evac = true; } },
            { id: 'stairs', title: t('Take the fire stairs back down', 'Спуститься по пожарной лестнице'), outcome: t('The stairs reach a service lane marked on the map.', 'Лестница выводит в служебный проезд, отмеченный на карте.'), effect: s => { s.route = true; } }
        ] },
        { title: t('The quarantine checkpoint', 'Карантинный кордон'), body: t('Floodlights sweep the avenue. A responder shouts that the next signal will be the last before they have to leave.', 'Прожекторы пересекают проспект. Спасатель кричит, что это последний сигнал перед их уходом.'), choices: [
            { id: 'cross', title: t('Lead the group toward the light', 'Повести группу к огням'), outcome: t('The group crosses together. If you rescued the officer, he helps carry supplies.', 'Группа перебирается вместе. Если ты спас полицейского, он помогает нести припасы.'), effect: s => { if (s.health <= 1) s.health--; s.rescue = true; } },
            { id: 'tunnel', title: t('Use the service tunnels', 'Уйти через служебные тоннели'), outcome: t('The route is dark, but the map keeps the group away from the infected streets.', 'В тоннелях темно, но карта уводит группу от заражённых улиц.'), effect: s => { if (!s.route) s.health--; s.route = true; } }
        ] },
        { title: t('The final crossing', 'Последний переход'), body: t('The barricade is in sight, but an open stretch of road separates you from it. Make one final plan for the group.', 'Кордон уже виден, но до него — открытый участок дороги. Придумай последний план для группы.'), choices: [
            { id: 'map-crossing', title: t('Follow the marked service route', 'Пойти по отмеченному служебному пути'), outcome: t('The map leads the group to cover. The last stretch is clear.', 'Карта приводит группу к укрытию. Последний участок свободен.'), can: s => s.route, unavailable: t('A tunnel map would help here.', 'Здесь пригодилась бы карта тоннелей.'), effect: s => { s.finalCrossing = true; } },
            { id: 'cover-crossing', title: t('Cover the crossing with one round', 'Прикрыть переход одним выстрелом'), outcome: t('The noise draws attention away long enough for the group to reach cover.', 'Шум отвлекает опасность, и группа успевает добраться до укрытия.'), can: s => s.ammo >= 1, unavailable: t('You need a round to cover the crossing.', 'Чтобы прикрыть переход, нужен патрон.'), effect: s => { s.ammo--; s.finalCrossing = true; } },
            { id: 'dash-crossing', title: t('Run the last stretch', 'Преодолеть последний участок бегом'), outcome: t('You lead the group to the barricade, but the rough crossing leaves a new injury.', 'Ты доводишь группу до кордона, но переход заканчивается новой раной.'), effect: s => { s.health--; s.finalCrossing = true; } }
        ] }
    ];

    function readStored(storage, key) {
        try { const raw = storage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
    }
    try { state = readStored(sessionStorage, sessionKey); } catch { state = null; }
    function saveSession() {
        try { if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state)); else sessionStorage.removeItem(sessionKey); } catch { /* The current run still works in memory. */ }
    }
    function getRecord() { try { return readStored(localStorage, recordKey); } catch { return null; } }
    function saveRecord(value) {
        try { localStorage.setItem(recordKey, JSON.stringify(value)); } catch { /* Personal bests are optional. */ }
    }
    function setState(next) { state = next; saveSession(); render(); }
    function label(buttonText) { return `<button type="button" class="site-button" data-action="${escapeHTML(buttonText.action)}" ${buttonText.disabled ? 'disabled' : ''}>${escapeHTML(buttonText.title)}</button>`; }
    function bar(labelText, current, maximum) {
        const value = Math.max(0, Math.min(100, Math.round(current / maximum * 100)));
        return `<div class="extra-meter"><div><span>${escapeHTML(labelText)}</span><b>${current}/${maximum}</b></div><span class="extra-meter-track"><i style="width:${value}%"></i></span></div>`;
    }
    function introCard(note, action = 'start', button = ui().start, additional = '') {
        return `<div class="extra-start"><p class="extra-kicker">${escapeHTML(ui().case)}</p><p class="extra-description">${escapeHTML(note)}</p>${additional}<div class="extra-actions">${label({ action, title: button })}</div><p class="extra-save-note">${escapeHTML(ui().instructions)}</p></div>`;
    }

    function readPortraits() {
        return Array.from(portraits.values()).filter(character => character.id && character.image);
    }
    function profilePercent(score) { return Math.round(score / questions.length * 100); }
    function getPersonalityWinner(scores) {
        return Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
    }
    function finishPersonality() {
        const record = getRecord() || { bestAffinity: 0, attempts: 0 };
        record.bestAffinity = Math.max(record.bestAffinity || 0, state.affinity || 0);
        record.attempts = (record.attempts || 0) + 1;
        saveRecord(record);
        state.status = 'complete';
        saveSession();
    }
    function renderPersonality() {
        if (!state) {
            const record = getRecord();
            const personalBest = record?.attempts ? `<p class="extra-record">${escapeHTML(ui().record)} · ${escapeHTML(ui().dominant)}: ${record.bestAffinity}/${questions.length}</p>` : `<p class="extra-record">${escapeHTML(ui().record)} · ${escapeHTML(ui().none)}</p>`;
            return introCard(ui().noWrong, 'start', ui().start, personalBest);
        }
        if (state.status === 'complete') {
            const character = portraits.get(state.winner);
            const portrait = personalityPortraits[state.winner] || character?.image;
            const record = getRecord();
            return `<div class="extra-result"><p class="extra-kicker">${escapeHTML(ui().style)}</p><div class="personality-result">${character ? `<img src="${escapeHTML(portrait)}" alt="${escapeHTML(characterName(character))}">` : ''}<div><h3 tabindex="-1">${escapeHTML(characterName(character))}</h3><p>${escapeHTML(pick(personalityProfiles[state.winner]))}</p></div></div><p class="extra-result-score">${escapeHTML(ui().dominant)}: ${state.affinity}/${questions.length} ${escapeHTML(ui().affinity)}</p><p class="extra-record">${escapeHTML(ui().record)} · ${record?.bestAffinity || state.affinity}/${questions.length}</p>${label({ action: 'replay', title: ui().restart })}</div>`;
        }
        const question = questions[state.index];
        if (!question) { finishPersonality(); return renderPersonality(); }
        return `<div class="extra-progress"><span>${escapeHTML(ui().question)} ${state.index + 1} ${escapeHTML(ui().of)} ${questions.length}</span><span>${state.index + 1}/${questions.length}</span></div>${bar('', state.index + 1, questions.length)}<h3 class="extra-question" tabindex="-1">${escapeHTML(pick(question))}</h3><div class="extra-choices personality-choices">${question.options.map((option, i) => `<button type="button" class="extra-choice" data-action="personality-answer" data-choice="${i}"><span>${String.fromCharCode(65 + i)}</span><b>${escapeHTML(pick(option[0]))}</b></button>`).join('')}</div>`;
    }

    function shuffle(items) {
        const result = [...items];
        for (let i = result.length - 1; i > 0; i--) {
            const other = Math.floor(Math.random() * (i + 1));
            [result[i], result[other]] = [result[other], result[i]];
        }
        return result;
    }
    function makeCards(pairs) {
        const available = shuffle(readPortraits()).slice(0, pairs);
        return shuffle(available.flatMap((character, pair) => [0, 1].map(copy => ({ key: `${pair}-${copy}`, id: character.id }))));
    }
    function formatTime(milliseconds) {
        const total = Math.max(0, Math.ceil(milliseconds / 1000));
        return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    }
    function secondsLeft() { return state.deadline ? Math.max(0, state.deadline - Date.now()) : null; }
    function beginMemory() {
        const pairCount = Number(root.querySelector('[name="memory-size"]')?.value) === 10 ? 10 : 6;
        const mode = root.querySelector('[name="memory-mode"]')?.value === 'timed' ? 'timed' : 'relaxed';
        const characters = readPortraits();
        if (characters.length < pairCount) return;
        const begin = () => setState({ status: 'playing', pairCount, mode, cards: makeCards(pairCount), flipped: [], matched: [], moves: 0, startedAt: Date.now(), deadline: mode === 'timed' ? Date.now() + 90000 : 0, lockedUntil: 0 });
        if (window.RE_PROFILE) window.RE_PROFILE.requireName(begin); else begin();
    }
    function finishMemory(expired = false) {
        if (!state || state.status !== 'playing') return;
        clearTimeout(mismatchTimer); clearInterval(timerInterval);
        state.status = expired ? 'expired' : 'complete';
        state.finishedAt = Date.now();
        if (!expired) {
            const record = getRecord() || { pairs: {} };
            const key = `${state.mode}-${state.pairCount}`;
            const previous = record.pairs[key];
            const left = state.mode === 'timed' ? Math.ceil(secondsLeft() / 1000) : 0;
            if (!previous || (state.mode === 'timed' ? left > previous.timeLeft || (left === previous.timeLeft && state.moves < previous.moves) : state.moves < previous.moves)) {
                record.pairs[key] = { moves: state.moves, timeLeft: left };
            }
            saveRecord(record);
        }
        saveSession(); render();
        root.querySelector('.extra-result h3')?.focus();
    }
    function updateMemoryStatus() {
        if (!state || state.status !== 'playing') return;
        const left = secondsLeft();
        const timeNode = root.querySelector('[data-memory-time]');
        if (timeNode) timeNode.textContent = state.mode === 'timed' ? formatTime(left) : '∞';
        if (state.mode === 'timed' && left <= 0) finishMemory(true);
    }
    function paintMemoryCards() {
        if (!state?.cards) return;
        for (const card of state.cards) {
            const button = root.querySelector(`[data-card-key="${card.key}"]`);
            if (!button) continue;
            const visible = state.flipped.includes(card.key) || state.matched.includes(card.id);
            const character = portraits.get(card.id);
            button.classList.toggle('is-open', visible);
            button.classList.toggle('is-matched', state.matched.includes(card.id));
            button.setAttribute('aria-pressed', String(visible));
            button.setAttribute('aria-label', visible ? characterName(character) : ui().closedCard);
            button.innerHTML = visible && character ? `<img src="${escapeHTML(character.image)}" alt=""><span>${escapeHTML(characterName(character))}</span>` : '<span class="memory-seal" aria-hidden="true">☣</span>';
            button.disabled = state.matched.includes(card.id) || state.lockedUntil > 0;
        }
        const matches = root.querySelector('[data-memory-matches]');
        const moves = root.querySelector('[data-memory-moves]');
        if (matches) matches.textContent = `${state.matched.length}/${state.pairCount}`;
        if (moves) moves.textContent = String(state.moves);
        const status = root.querySelector('.extra-status');
        if (status) status.textContent = state.matched.length
            ? `${state.matched.length}/${state.pairCount} ${ui().matched}`
            : state.flipped.length ? ui().firstReveal : ui().instructions;
    }
    function drawMemory() {
        const record = getRecord() || { pairs: {} };
        if (!state) {
            root.innerHTML = introCard(ui().replayNote, 'start', ui().start, `<div class="extra-settings"><label>${escapeHTML(ui().size)}<select name="memory-size"><option value="6">${escapeHTML(ui().sixPairs)}</option><option value="10">${escapeHTML(ui().tenPairs)}</option></select></label><label>${escapeHTML(ui().timerMode)}<select name="memory-mode"><option value="relaxed">${escapeHTML(ui().relaxed)}</option><option value="timed">${escapeHTML(ui().timed)}</option></select></label></div><div class="extra-record-grid"><p>${escapeHTML(ui().record)} · 6: ${escapeHTML(record.pairs['relaxed-6'] ? `${record.pairs['relaxed-6'].moves} ${ui().moves.toLowerCase()}` : ui().none)}</p><p>${escapeHTML(ui().record)} · 10: ${escapeHTML(record.pairs['relaxed-10'] ? `${record.pairs['relaxed-10'].moves} ${ui().moves.toLowerCase()}` : ui().none)}</p></div>`);
            return;
        }
        if (state.status !== 'playing') {
            const complete = state.status === 'complete';
            const result = record.pairs[`${state.mode}-${state.pairCount}`];
            root.innerHTML = `<div class="extra-result"><p class="extra-kicker">${escapeHTML(ui().case)}</p><h3 tabindex="-1">${escapeHTML(complete ? ui().memoryDone : ui().timeout)}</h3><div class="extra-result-stats"><span>${escapeHTML(ui().pairs)} <b>${state.matched.length}/${state.pairCount}</b></span><span>${escapeHTML(ui().moves)} <b>${state.moves}</b></span>${state.mode === 'timed' ? `<span>${escapeHTML(ui().timeLeft)} <b>${formatTime(complete ? state.deadline - state.finishedAt : 0)}</b></span>` : ''}</div>${result ? `<p class="extra-record">${escapeHTML(ui().record)} · ${result.moves} ${escapeHTML(ui().moves.toLowerCase())}${state.mode === 'timed' ? ` · ${formatTime(result.timeLeft * 1000)}` : ''}</p>` : ''}${label({ action: 'replay', title: ui().restart })}</div>`;
            return;
        }
        const shown = state.flipped.length + state.matched.length * 2;
        root.innerHTML = `<div class="extra-progress"><span>${escapeHTML(ui().pairs)} <b data-memory-matches></b></span><span>${escapeHTML(ui().moves)} <b data-memory-moves></b></span><span>${escapeHTML(ui().timeLeft)} <b data-memory-time></b></span></div>${bar(ui().discovered, shown, state.pairCount * 2)}<div class="memory-grid memory-grid-${state.pairCount}" aria-label="${escapeHTML(ui().openCard)}">${state.cards.map(card => `<button type="button" class="memory-card" data-card-key="${escapeHTML(card.key)}"></button>`).join('')}</div><p class="extra-status" role="status" aria-live="polite">${state.matched.length ? `${state.matched.length} ${escapeHTML(ui().matched)}` : escapeHTML(ui().instructions)}</p>`;
        paintMemoryCards();
        updateMemoryStatus();
        clearInterval(timerInterval);
        if (state.mode === 'timed') timerInterval = setInterval(updateMemoryStatus, 1000);
        if (state.lockedUntil && state.flipped.length === 2) {
            clearTimeout(mismatchTimer);
            mismatchTimer = setTimeout(() => { if (!state || state.status !== 'playing') return; state.flipped = []; state.lockedUntil = 0; saveSession(); paintMemoryCards(); }, Math.max(0, state.lockedUntil - Date.now()));
        }
    }
    function chooseMemoryCard(key) {
        if (!state || state.status !== 'playing' || state.lockedUntil || state.flipped.includes(key)) return;
        const card = state.cards.find(item => item.key === key);
        if (!card || state.matched.includes(card.id)) return;
        state.flipped.push(key);
        if (state.flipped.length === 2) {
            state.moves++;
            const first = state.cards.find(item => item.key === state.flipped[0]);
            if (first.id === card.id) {
                state.matched.push(card.id);
                state.flipped = [];
                if (state.matched.length === state.pairCount) { finishMemory(false); return; }
            } else {
                state.lockedUntil = Date.now() + 720;
                saveSession(); paintMemoryCards();
                clearTimeout(mismatchTimer);
                mismatchTimer = setTimeout(() => { if (!state || state.status !== 'playing') return; state.flipped = []; state.lockedUntil = 0; saveSession(); paintMemoryCards(); }, 720);
                return;
            }
        }
        saveSession(); paintMemoryCards();
    }

    function storyEnding() {
        const s = state;
        if (s.health <= 0) return { id: 'overrun', rank: 0,
            title: t('The last light fades', 'Последний огонь гаснет'),
            body: t('The group is forced to leave without you. Your final signal gives the others a chance to reach the checkpoint.', 'Группе приходится уйти без тебя. Последний сигнал помогает остальным добраться до кордона.') };
        if (s.rescue && s.finalCrossing && s.ally) return { id: 'together', rank: 5,
            title: t('Nobody left behind', 'Никого не бросили'),
            body: t('The rescue team gets the whole group across the line. The officer keeps a hand on your shoulder until the gate closes.', 'Спасатели выводят всю группу. Полицейский держит тебя за плечо, пока ворота не закрываются.') };
        if (s.rescue && s.finalCrossing && s.evidence) return { id: 'evidence', rank: 4,
            title: t('The record gets out', 'Улики выбрались из города'),
            body: t('The files and the survivors reach the quarantine line. There are questions to answer once everyone is safe.', 'Материалы дела и выжившие добираются до кордона. Когда все будут в безопасности, предстоит ответить на вопросы.') };
        if (s.rescue && s.finalCrossing) return { id: 'rescued', rank: 3,
            title: t('A signal answered', 'На сигнал ответили'),
            body: t('The light guides you to the rescue team. You leave the block behind, though some of its story remains a mystery.', 'Огонь приводит тебя к спасателям. Ты покидаешь квартал, но часть его истории остаётся загадкой.') };
        if (s.route && s.finalCrossing && s.health >= 2) return { id: 'tunnels', rank: 2,
            title: t('A way beneath the streets', 'Путь под улицами'),
            body: t('The service map leads the group around the blocked avenue. At dawn, you emerge beyond the quarantine zone.', 'Карта служебных ходов помогает обойти перекрытый проспект. На рассвете группа выходит за пределы карантина.') };
        if (s.health >= 2) return { id: 'alone', rank: 1,
            title: t('One more night survived', 'Ещё одна ночь позади'),
            body: t('You make it to a guarded checkpoint alone. The others may still be somewhere behind the barricades.', 'Ты добираешься до охраняемого кордона. Остальные могут всё ещё находиться за заграждениями.') };
        return { id: 'captured', rank: 0,
            title: t('Behind the barricade', 'По другую сторону кордона'),
            body: t('The way out closes before you reach it. You find shelter, but the radio goes silent.', 'Выход закрывается раньше, чем ты успеваешь добраться до него. Укрытие найдено, но рация молчит.') };
    }
    function finishStory() {
        const ending = storyEnding();
        state.status = 'complete'; state.endingId = ending.id; state.endingRank = ending.rank;
        const record = getRecord() || { bestEnding: -1, attempts: 0 };
        record.bestEnding = Math.max(record.bestEnding ?? -1, ending.rank);
        record.attempts = (record.attempts || 0) + 1;
        saveRecord(record); saveSession();
    }
    function renderStory() {
        if (!state) {
            const record = getRecord();
            const note = record?.attempts ? `${ui().fanCase} ${ui().record}: ${record.bestEnding + 1}/6` : ui().fanCase;
            return introCard(note, 'start', ui().start);
        }
        if (state.status === 'complete') {
            const ending = storyEnding();
            const record = getRecord();
            return `<div class="extra-result"><p class="extra-kicker">${escapeHTML(ui().case)}</p><h3 tabindex="-1">${escapeHTML(pick(ending.title))}</h3><p>${escapeHTML(pick(ending.body))}</p><div class="extra-result-stats"><span>${escapeHTML(ui().health)} <b>${state.health}/5</b></span><span>${escapeHTML(ui().ammo)} <b>${state.ammo}</b></span><span>${escapeHTML(ui().record)} <b>${(record?.bestEnding ?? state.endingRank) + 1}/6</b></span></div>${label({ action: 'replay', title: ui().restart })}</div>`;
        }
        const scene = story[state.sceneIndex];
        if (!scene) { finishStory(); return renderStory(); }
        const inventory = `<div class="story-inventory">${bar(ui().health, state.health, 5)}<div class="inventory-pills"><span>▣ ${escapeHTML(ui().ammo)} <b>${state.ammo}</b></span><span>✚ ${escapeHTML(ui().medkits)} <b>${state.medkits}</b></span>${state.key ? `<span>⚿ ${escapeHTML(ui().key)}</span>` : ''}${state.radio ? `<span>◉ ${escapeHTML(ui().radio)}</span>` : ''}${state.ally ? `<span>♟ ${escapeHTML(ui().ally)}</span>` : ''}${state.evidence ? `<span>▤ ${escapeHTML(ui().evidenceFound)}</span>` : ''}</div></div>`;
        if (state.choice) {
            const chosen = scene.choices.find(choice => choice.id === state.choice);
            const outcome = typeof chosen?.outcome === 'function' ? chosen.outcome(state) : chosen?.outcome;
            return `<div class="extra-progress"><span>${escapeHTML(ui().question)} ${state.sceneIndex + 1} ${escapeHTML(ui().of)} ${story.length}</span><span>${state.sceneIndex + 1}/${story.length}</span></div>${inventory}<div class="story-scene"><p class="extra-kicker">${escapeHTML(ui().case)}</p><h3>${escapeHTML(pick(scene.title))}</h3><p>${escapeHTML(pick(scene.body))}</p></div><div class="story-outcome" role="status"><b>${escapeHTML(pick(outcome || t('', '')))}</b><p>${escapeHTML(ui().review)}</p></div><div class="extra-actions">${label({ action: 'story-next', title: ui().next })}</div>`;
        }
        return `<div class="extra-progress"><span>${escapeHTML(ui().question)} ${state.sceneIndex + 1} ${escapeHTML(ui().of)} ${story.length}</span><span>${state.sceneIndex + 1}/${story.length}</span></div>${inventory}<div class="story-scene"><p class="extra-kicker">${escapeHTML(ui().case)}</p><h3>${escapeHTML(pick(scene.title))}</h3><p>${escapeHTML(pick(scene.body))}</p></div><h4 class="extra-section-label">${escapeHTML(ui().actions)}</h4><div class="story-choices">${scene.choices.map(choice => { const available = choice.can ? choice.can(state) : true; return `<button type="button" class="extra-choice" data-action="story-choice" data-choice="${escapeHTML(choice.id)}" ${available ? '' : 'disabled'}><b>${escapeHTML(pick(choice.title))}</b>${!available && choice.unavailable ? `<small>${escapeHTML(pick(choice.unavailable))}</small>` : ''}</button>`; }).join('')}</div>`;
    }

    function render() {
        clearInterval(timerInterval);
        if (id === 'memory') drawMemory();
        else if (id === 'personality') root.innerHTML = renderPersonality();
        else root.innerHTML = renderStory();
    }
    function begin() {
        const start = () => {
            if (id === 'personality') setState({ status: 'playing', index: 0, scores: Object.fromEntries(Object.keys(personalityProfiles).map(key => [key, 0])), choices: [] });
            else if (id === 'survival') setState({ status: 'playing', sceneIndex: 0, health: 4, ammo: 3, medkits: 1, radio: false, evidence: false, route: false, ally: false, rescue: false, finalCrossing: false, key: false, alarm: false, choice: null });
            else beginMemory();
        };
        if (id === 'memory') beginMemory();
        else if (window.RE_PROFILE) window.RE_PROFILE.requireName(start); else start();
    }
    function replay() {
        const previous = state;
        state = null; saveSession(); render();
        if (id === 'memory') {
            const size = root.querySelector('[name="memory-size"]'), mode = root.querySelector('[name="memory-mode"]');
            if (size) size.value = String(previous?.pairCount || 6);
            if (mode) mode.value = previous?.mode || 'relaxed';
        }
        begin();
        const focus = root.querySelector('.extra-question, .memory-card');
        focus?.focus();
    }
    root.addEventListener('click', event => {
        const card = event.target.closest('[data-card-key]');
        if (card) { chooseMemoryCard(card.dataset.cardKey); return; }
        const button = event.target.closest('[data-action]');
        if (!button || button.disabled) return;
        const action = button.dataset.action;
        if (action === 'start') { begin(); return; }
        if (action === 'replay') { replay(); return; }
        if (action === 'personality-answer') {
            const question = questions[state.index], option = question.options[Number(button.dataset.choice)];
            if (!option) return;
            state.scores[option[1]]++;
            state.choices.push(option[1]); state.index++;
            if (state.index >= questions.length) {
                state.winner = getPersonalityWinner(state.scores);
                state.affinity = state.scores[state.winner]; finishPersonality();
            }
            saveSession(); render();
            root.querySelector(state.status === 'complete' ? '.extra-result h3' : '.personality-choices button')?.focus();
            return;
        }
        if (action === 'story-choice') {
            const scene = story[state.sceneIndex], choice = scene?.choices.find(item => item.id === button.dataset.choice);
            if (!choice || choice.effect(state) === false) return;
            for (const key of ['health']) state[key] = Math.max(0, state[key]);
            state.choice = choice.id; saveSession(); render();
            root.querySelector('[data-action="story-next"]')?.focus();
            return;
        }
        if (action === 'story-next') {
            state.sceneIndex++; state.choice = null;
            if (state.sceneIndex >= story.length) finishStory();
            saveSession(); render();
            root.querySelector(state.status === 'complete' ? '.extra-result h3' : '.story-choices button:not(:disabled)')?.focus();
        }
    });
    document.addEventListener('languagechange', render);
    document.addEventListener('profilechange', () => { /* The shared shell already refreshes the nickname. */ });
    if (state && id === 'memory' && state.status === 'playing' && state.lockedUntil && state.lockedUntil <= Date.now()) {
        state.flipped = []; state.lockedUntil = 0; saveSession();
    }
    if (id === 'personality' && state?.status === 'playing' && (!state.scores || state.index > questions.length)) state = null;
    if (id === 'survival' && state?.status === 'playing' && (!Number.isInteger(state.sceneIndex) || state.sceneIndex >= story.length)) state = null;
    render();
})();


