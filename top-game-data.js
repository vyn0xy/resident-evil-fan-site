/* Editorial history notes. Dates refer to the first release of this edition;
   later ports and expansions have their own release dates. Sources checked
   on 2026-11-07. Replace card images in top-games.html independently. */
window.RE_TOP_GAME_HISTORY = {
    ui: {
        en: {
            title: '🏆 Top Resident Evil Games',
            subtitle: 'Our editorial picks from the series — ratings are illustrative, not collected votes.',
            history: 'Game history', close: 'Close history', release: 'First release', edition: 'Edition',
            development: 'How it was made', story: 'The story begins', sources: 'Official sources',
            note: 'Story setup only. Major twists and endings are left for you to discover.',
            platforms: 'Platforms at first release', publisher: 'Developer / publisher',
            tags: ['👥 Fan Favorite', '👥 Critics Choice', '👥 Most Popular', '👥 Best Horror', '👥 Best of 2026']
        },
        ru: {
            title: '🏆 Лучшие игры Resident Evil',
            subtitle: 'Авторская подборка игр серии. Оценки иллюстративные и не основаны на голосовании.',
            history: 'История игры', close: 'Свернуть историю', release: 'Первый выход', edition: 'Версия игры',
            development: 'История создания', story: 'Завязка сюжета', sources: 'Официальные источники',
            note: 'Только завязка. Крупные повороты и финалы оставлены для самостоятельного прохождения.',
            platforms: 'Платформы первого релиза', publisher: 'Разработчик / издатель',
            tags: ['👥 Любимец фанатов', '👥 Выбор критиков', '👥 Популярная игра', '👥 Лучший хоррор', '👥 Выбор 2026 года']
        }
    },
    games: [
        {
            id: 're4-remake', release: '2023-03-24', platforms: 'PS4 / PS5 / Xbox Series X|S / PC',
            edition: { en: '2023 remake of Resident Evil 4 (2005)', ru: 'Ремейк 2023 года. Оригинал — Resident Evil 4 (2005)' },
            description: {
                en: 'A new take on the 2005 classic, combining a rescue mission, survival horror and tense action.',
                ru: 'Новое прочтение классики 2005 года: спасательная миссия, хоррор и напряжённые сражения.'
            },
            development: {
                en: 'Capcom rebuilt the 2005 game with RE Engine. The team aimed to retain its resource management, weapon upgrades and combat rhythm while revising the story, characters and controls. New knife actions, including parrying, gave Leon more ways to survive close encounters.',
                ru: 'Capcom пересоздала игру 2005 года на RE Engine. Команда сохранила управление ресурсами, улучшение оружия и основу боёв, но переработала историю, персонажей и управление. Новые действия с ножом, включая парирование, расширили возможности Леона в ближнем бою.'
            },
            story: {
                en: 'Six years after the Raccoon City disaster, Leon S. Kennedy is a government agent. His mission to rescue the president’s kidnapped daughter leads to an isolated European village whose inhabitants behave alarmingly. An extraction turns into a fight for survival.',
                ru: 'Через шесть лет после катастрофы в Раккун-Сити Леон Кеннеди работает правительственным агентом. Поиски похищенной дочери президента приводят его в отдалённую европейскую деревню, жители которой ведут себя пугающе. Спасательная операция превращается в борьбу за выживание.'
            },
            sources: [
                { url: 'https://www.capcom.co.jp/ir/english/news/html/e250425.html', en: 'Capcom: edition and release dates', ru: 'Capcom: версии и даты выхода' },
                { url: 'https://blog.playstation.com/2022/06/02/resident-evil-4-comes-to-ps5-next-year-first-gameplay-and-story-details/', en: 'Capcom: remake concept and story', ru: 'Capcom: замысел ремейка и сюжет' },
                { url: 'https://blog.playstation.com/2022/10/20/new-resident-evil-4-trailer-resident-evil-village-gold-edition-demo-and-more-revealed-in-todays-resident-evil-showcase/', en: 'Capcom: updated combat', ru: 'Capcom: обновлённая боевая система' }
            ]
        },
        {
            id: 're2-remake', release: '2019-01-25', platforms: 'PS4 / Xbox One / PC',
            edition: { en: '2019 remake of Resident Evil 2 (1998)', ru: 'Ремейк 2019 года. Оригинал — Resident Evil 2 (1998)' },
            description: {
                en: 'Raccoon City reimagined with an over-the-shoulder camera, new puzzles and the constant threat of the infected.',
                ru: 'Раккун-Сити с камерой из-за плеча, обновлёнными головоломками и постоянной угрозой заражённых.'
            },
            development: {
                en: 'Fan demand helped bring this remake into production. Capcom used RE Engine to redesign the city and police station rather than simply update their textures. The over-the-shoulder camera, revised puzzles and changed encounters let returning players face uncertainty again.',
                ru: 'Запросы поклонников помогли запустить разработку ремейка. На RE Engine команда заново спроектировала город и полицейский участок. Камера из-за плеча, переработанные головоломки и изменённые встречи с противниками вернули ощущение неизвестности даже тем, кто помнил оригинал.'
            },
            story: {
                en: 'Rookie officer Leon Kennedy arrives in Raccoon City as an outbreak overwhelms it. Claire Redfield comes looking for her brother. Their separate journeys intersect as they search for shelter, help other survivors and try to escape the infected city.',
                ru: 'Новичок полиции Леон Кеннеди прибывает в Раккун-Сити в разгар эпидемии. Клэр Редфилд приезжает искать брата. Их самостоятельные истории пересекаются: герои ищут укрытие, помогают выжившим и пытаются выбраться из заражённого города.'
            },
            sources: [
                { url: 'https://www.capcom.co.jp/ir/english/news/html/e250425.html', en: 'Capcom: edition and release dates', ru: 'Capcom: версии и даты выхода' },
                { url: 'https://blog.playstation.com/archive/2018/06/12/stunning-resident-evil-2-remake-announced-for-ps4-with-january-2019-release-date/', en: 'Capcom: announcement and story', ru: 'Capcom: анонс и сюжет' },
                { url: 'https://blog.playstation.com/archive/2018/12/13/the-creators-of-resident-evil-2-medievil-spyro-crash-bandicoot-on-remastering-their-classics-for-ps4/', en: 'The creators on rebuilding the classic', ru: 'Создатели о переработке классики' }
            ]
        },
        {
            id: 'village', release: '2021-05-07', platforms: 'PS4 / PS5 / Xbox One / Xbox Series X|S / PC',
            edition: { en: 'Eighth main entry; original campaign', ru: 'Восьмая основная часть. Базовая сюжетная кампания' },
            description: {
                en: 'Ethan Winters enters a snow-covered village to find his daughter, facing a new cast of unsettling inhabitants.',
                ru: 'В поисках дочери Итан Уинтерс попадает в заснеженную деревню с пугающими обитателями.'
            },
            development: {
                en: 'Announced in June 2020, Village continued Ethan’s story using RE Engine and a first-person perspective. Compared with the confined Baker house in Resident Evil 7, the team placed more emphasis on combat and exploration. The village itself was conceived as a setting with a distinct, threatening presence.',
                ru: 'Village анонсировали в июне 2020 года как продолжение истории Итана на RE Engine с видом от первого лица. По сравнению с тесным домом Бейкеров в Resident Evil 7 команда усилила роль сражений и исследования. Сама деревня задумывалась как место с собственным характером и постоянно ощущаемой угрозой.'
            },
            story: {
                en: 'A few years after Louisiana, Ethan and Mia are trying to build a peaceful life. A new tragedy draws Ethan to an isolated village in search of his daughter, Rose. A castle, unfamiliar creatures and powerful local rulers stand in his way.',
                ru: 'Спустя несколько лет после событий в Луизиане Итан и Мия пытаются жить спокойно. Новая трагедия приводит Итана в отдалённую деревню на поиски дочери Розы. На его пути — замок, незнакомые существа и могущественные хозяева этих мест.'
            },
            sources: [
                { url: 'https://www.capcom.co.jp/ir/english/news/html/e250916.html', en: 'Capcom: original release and later ports', ru: 'Capcom: первый релиз и поздние порты' },
                { url: 'https://blog.playstation.com/2020/06/11/fear-surrounds-you-in-resident-evil-village-coming-to-ps5-in-2021/', en: 'Capcom: setting and design direction', ru: 'Capcom: мир игры и замысел разработки' },
                { url: 'https://blog.playstation.com/2022/06/13/resident-evil-village-dlc-winters-expansion-launches-october-28/', en: 'The producer on Ethan’s journey', ru: 'Продюсер о путешествии Итана' }
            ]
        },
        {
            id: 're7', release: '2017-01-24', platforms: 'PS4 / Xbox One / PC',
            edition: { en: 'Seventh main entry; original campaign', ru: 'Седьмая основная часть. Базовая сюжетная кампания' },
            description: {
                en: 'A first-person survival horror story about a missing wife and a seemingly abandoned house in Louisiana.',
                ru: 'Хоррор от первого лица о поисках пропавшей жены и доме в Луизиане, который кажется заброшенным.'
            },
            development: {
                en: 'Capcom revealed Resident Evil 7 at E3 2016 alongside the Beginning Hour demo. A new protagonist and first-person perspective were intended to make the horror unfamiliar again. RE Engine supported the detailed environments, and an optional PlayStation VR mode offered another way to experience the full game.',
                ru: 'Capcom представила Resident Evil 7 на E3 2016 вместе с демоверсией Beginning Hour. Новый герой и вид от первого лица должны были вновь сделать страх незнакомым. RE Engine позволил создать детализированные окружения, а необязательный режим PlayStation VR — пройти всю игру в виртуальной реальности.'
            },
            story: {
                en: 'Ethan Winters follows a lead about his missing wife, Mia, to Dulvey, Louisiana. His search takes him to the run-down Baker property. The residents have been cut off from the outside world, and finding Mia is only the beginning of his struggle to get out alive.',
                ru: 'Итан Уинтерс получает зацепку о пропавшей жене Мии и отправляется в Далви, штат Луизиана. Поиски приводят его в обветшавшее поместье Бейкеров. Его обитатели давно отрезаны от внешнего мира, а найти Мию — лишь начало борьбы за спасение.'
            },
            sources: [
                { url: 'https://blog.playstation.com/2017/01/24/resident-evil-vii-out-today-on-ps4-first-dlc-launches-january-31/', en: 'Capcom: launch and story setup', ru: 'Capcom: выход игры и завязка' },
                { url: 'https://blog.playstation.com/archive/2016/06/14/resident-evil-7-biohazard-unveiled-for-ps4-ps-vr-play-the-demo-now/', en: 'Capcom: reveal and first-person horror', ru: 'Capcom: анонс и хоррор от первого лица' },
                { url: 'https://blog.playstation.com/2022/06/13/ps5-versions-of-resident-evil-7-resident-evil-2-and-resident-evil-3-launch-today/', en: 'The producer on the fear of the unknown', ru: 'Продюсер о страхе перед неизвестным' }
            ]
        },
        {
            id: 'requiem', release: '2026-02-27', platforms: 'PS5 / Xbox Series X|S / Nintendo Switch 2 / PC',
            edition: { en: 'Ninth main entry', ru: 'Девятая основная часть серии' },
            description: {
                en: 'Grace Ashcroft and Leon Kennedy face a new investigation tied to the legacy of Raccoon City.',
                ru: 'Грейс Эшкрофт и Леон Кеннеди оказываются в центре нового расследования, связанного с наследием Раккун-Сити.'
            },
            development: {
                en: 'Director Koshi Nakanishi described the project as a return to the series’ overarching story after Ethan’s two games. The team developed contrasting experiences for Grace and Leon: vulnerability and evasion alongside more confident action. Their alternating perspectives create a rhythm of tension and relief.',
                ru: 'Режиссёр Коси Наканиси описывал проект как возвращение к сквозной истории серии после двух игр об Итане. Для Грейс и Леона создали контрастный игровой опыт: уязвимость и уклонение от угроз сменяются более уверенным экшеном. Их чередование задаёт ритм напряжения и передышки.'
            },
            story: {
                en: 'FBI analyst Grace Ashcroft receives an assignment that draws her into a new nightmare. Veteran agent Leon Kennedy faces a return to the place where his struggle against bioterror began. Their stories connect a new investigation with the lasting consequences of Raccoon City.',
                ru: 'Аналитик ФБР Грейс Эшкрофт получает задание, которое втягивает её в новый кошмар. Опытному агенту Леону Кеннеди предстоит вернуться к месту, где началась его борьба с биотерроризмом. Их истории связывают новое расследование с последствиями катастрофы Раккун-Сити.'
            },
            sources: [
                { url: 'https://www.capcom.co.jp/ir/english/news/pdf/e260304.pdf', en: 'Capcom: release date and platforms', ru: 'Capcom: дата выхода и платформы' },
                { url: 'https://blog.playstation.com/2026/01/29/resident-evil-requiem-interview-chainsaws-reinvented-zombies-fear-balancing-and-more/', en: 'Interview with director Koshi Nakanishi', ru: 'Интервью с режиссёром Коси Наканиси' },
                { url: 'https://blog.playstation.com/2025/06/26/resident-evil-requiem-producer-masato-kumazawa-qa/', en: 'Interview with producer Masato Kumazawa', ru: 'Интервью с продюсером Масато Кумадзавой' }
            ]
        }
    ]
};
