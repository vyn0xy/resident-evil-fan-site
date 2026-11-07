/* Original fan scenarios. Text, scoring and branching data are separate from UI. */
(() => {
    'use strict';
    const text = (en, ru) => ({ en, ru });
    const answer = (en, ru, traits) => ({ text: text(en, ru), traits });
    // Traits: resolve, empathy, analysis, ingenuity. Every answer contributes 3 points.
    const personality = [
        ['door', text('Someone is knocking behind a locked laboratory door. Your team needs to move.', 'За закрытой дверью лаборатории кто-то стучит. Группе нужно двигаться дальше.'), [
            answer('Force the door before the corridor fills up.', 'Выбить дверь, пока коридор не заполнили заражённые.', [2,1,0,0]),
            answer('Talk to the person and check for injuries.', 'Поговорить с человеком и выяснить, нужна ли ему помощь.', [0,2,1,0]),
            answer('Check the access log and the observation window.', 'Проверить журнал доступа и смотровое окно.', [0,0,2,1]),
            answer('Find another way into the room through maintenance.', 'Найти вход через технический коридор.', [1,0,0,2])]],
        ['supplies', text('The supply case has room for one more item. What do you take?', 'В ящике снабжения осталось место для одного предмета. Что возьмёте?'), [
            answer('Extra ammunition. I will hold the exit.', 'Дополнительные патроны. Я прикрою выход.', [2,0,1,0]),
            answer('A medical kit for whoever needs it.', 'Аптечку для того, кому она понадобится.', [0,2,0,1]),
            answer('A map marked with security systems.', 'План с расположением систем охраны.', [0,1,2,0]),
            answer('A tool kit. Locked routes may be safer.', 'Инструменты. Закрытый проход может оказаться безопаснее.', [1,0,0,2])]],
        ['stranger', text('An armed stranger offers a shortcut but will not give their name.', 'Вооружённый незнакомец предлагает короткий путь, но не называет своего имени.'), [
            answer('Take point and keep the route under control.', 'Пойти первым и держать маршрут под контролем.', [2,0,0,1]),
            answer('Agree if they also help the injured civilian.', 'Согласиться, если он поможет раненому гражданскому.', [1,2,0,0]),
            answer('Ask questions and compare the route with our map.', 'Задать вопросы и сверить маршрут с картой.', [0,0,2,1]),
            answer('Negotiate a signal and keep a second exit ready.', 'Договориться о сигнале и подготовить запасной выход.', [0,1,0,2])]],
        ['signal', text('A radio transmission contains a distress call and a repeated number.', 'По рации передают просьбу о помощи и повторяют одно число.'), [
            answer('Move toward the signal while we still can.', 'Двигаться к источнику сигнала, пока есть возможность.', [2,1,0,0]),
            answer('Keep talking so the caller is not alone.', 'Поддерживать связь, чтобы человек не оставался один.', [0,2,1,0]),
            answer('Record the number and look for a pattern.', 'Записать число и поискать закономерность.', [0,0,2,1]),
            answer('Triangulate the signal with a second receiver.', 'Определить направление с помощью второго приёмника.', [1,0,0,2])]],
        ['mistake', text('Your partner opened the wrong shutter. Infected are approaching.', 'Напарник открыл не ту заслонку. Приближаются заражённые.'), [
            answer('Cover the team and give a clear retreat order.', 'Прикрыть группу и чётко скомандовать отход.', [2,1,0,0]),
            answer('Get the frightened partner moving first.', 'Сначала помочь растерявшемуся напарнику выбраться.', [0,2,0,1]),
            answer('Find the emergency switch on the control panel.', 'Найти аварийный переключатель на панели.', [0,1,2,0]),
            answer('Jam the shutter with a trolley.', 'Заклинить заслонку тележкой.', [1,0,0,2])]],
        ['evidence', text('A terminal holds evidence, but copying it takes precious time.', 'На терминале есть доказательства, но их копирование отнимет драгоценное время.'), [
            answer('Secure the room so the copy can finish.', 'Удерживать комнату, пока копирование не закончится.', [2,0,1,0]),
            answer('Evacuate the people first, then return if possible.', 'Сначала вывести людей, затем вернуться, если получится.', [0,2,1,0]),
            answer('Select the essential files instead of copying everything.', 'Отобрать ключевые файлы вместо копирования всего архива.', [0,0,2,1]),
            answer('Take the removable drive and read it later.', 'Забрать съёмный накопитель и прочитать его позже.', [1,0,0,2])]],
        ['leader', text('The group disagrees about the route and everyone is exhausted.', 'Группа спорит о маршруте, все вымотаны.'), [
            answer('Choose a route and take responsibility for it.', 'Выбрать маршрут и взять ответственность на себя.', [2,0,1,0]),
            answer('Hear everyone out, especially the quietest person.', 'Выслушать всех, особенно того, кто молчит.', [0,2,1,0]),
            answer('Compare the risks before making a decision.', 'Перед решением сравнить риски каждого пути.', [0,1,2,0]),
            answer('Suggest a third route nobody has considered.', 'Предложить третий путь, который никто не рассматривал.', [1,0,0,2])]],
        ['light', text('The lights fail halfway across a flooded room.', 'Свет гаснет посреди затопленной комнаты.'), [
            answer('Hold position and guide the team by voice.', 'Удерживать позицию и направлять команду голосом.', [2,1,0,0]),
            answer('Make sure everyone has someone beside them.', 'Проверить, чтобы рядом с каждым был напарник.', [0,2,0,1]),
            answer('Follow the emergency markings along the wall.', 'Идти вдоль стены по аварийным отметкам.', [0,0,2,1]),
            answer('Turn a spare battery and wire into a light.', 'Собрать фонарь из запасной батарейки и провода.', [1,0,0,2])]],
        ['deal', text('A contact demands your only antidote in exchange for an evacuation code.', 'Связной требует ваш единственный антидот в обмен на код эвакуации.'), [
            answer('Refuse the threat and find another exit.', 'Отказаться от ультиматума и искать другой выход.', [2,1,0,0]),
            answer('Keep the antidote for the person who needs it.', 'Оставить антидот тому, кому он необходим.', [0,2,1,0]),
            answer('Check whether the code is genuine before negotiating.', 'До переговоров проверить, настоящий ли код.', [0,0,2,1]),
            answer('Offer the contact something else they need.', 'Предложить связному то, в чём он сам нуждается.', [1,0,0,2])]],
        ['pursuit', text('Something powerful is tracking the noise of your footsteps.', 'Что-то сильное идёт на звук ваших шагов.'), [
            answer('Draw it away while the others escape.', 'Увести преследователя, пока остальные уходят.', [2,1,0,0]),
            answer('Keep the slowest survivor close to me.', 'Остаться рядом с самым медленным выжившим.', [1,2,0,0]),
            answer('Watch its patrol pattern and move between passes.', 'Проследить за его маршрутом и двигаться между обходами.', [0,0,2,1]),
            answer('Leave a noisy decoy on a different floor.', 'Оставить шумную приманку на другом этаже.', [1,0,0,2])]],
        ['rescue', text('The rescue vehicle has one seat left and you can still walk.', 'В спасательной машине осталось одно место, а вы ещё можете идти.'), [
            answer('Escort the vehicle on foot until it clears the gate.', 'Сопроводить машину пешком до ворот.', [2,1,0,0]),
            answer('Give the seat to the injured survivor.', 'Уступить место раненому выжившему.', [0,2,0,1]),
            answer('Check the alternate pickup point before splitting up.', 'Перед разделением проверить запасную точку эвакуации.', [0,1,2,0]),
            answer('Secure a second vehicle from the service yard.', 'Достать вторую машину со служебной стоянки.', [1,0,0,2])]],
        ['after', text('You have escaped. What is your next priority?', 'Вы выбрались. Что для вас важнее всего теперь?'), [
            answer('Prepare a team so this cannot happen again.', 'Подготовить команду, чтобы это не повторилось.', [2,0,1,0]),
            answer('Find out whether everyone made it out.', 'Узнать, все ли смогли выбраться.', [0,2,1,0]),
            answer('Preserve the evidence and reconstruct what happened.', 'Сохранить доказательства и восстановить ход событий.', [0,1,2,0]),
            answer('Follow the lead nobody else noticed.', 'Проверить зацепку, которую никто не заметил.', [1,0,0,2])]]
    ].map(([id, question, options], index) => ({ id, question, options: options.map((_, i) => options[(i + index) % options.length]) }));
    const profiles = [
        ['leon', 'Leon S. Kennedy', 'Леон С. Кеннеди', [4,2,3,4], text('You keep moving under pressure and improvise when a plan breaks. Your decisions favour a workable escape over a perfect plan.', 'Вы продолжаете действовать под давлением и находите выход, когда план рушится. В ваших решениях важнее рабочий выход, чем идеальный план.')],
        ['jill', 'Jill Valentine', 'Джилл Валентайн', [3,3,5,3], text('You look for the mechanism behind the danger. Preparation, observation and a dependable plan shape your choices.', 'Вы ищете механизм, который стоит за опасностью. Ваши решения опираются на подготовку, наблюдательность и надёжный план.')],
        ['claire', 'Claire Redfield', 'Клэр Редфилд', [3,5,2,3], text('You notice the person behind the objective. Helping someone is part of the mission, even when it complicates the route.', 'Вы замечаете человека за задачей. Помочь кому-то для вас — часть миссии, даже если маршрут становится сложнее.')],
        ['ada', 'Ada Wong', 'Ада Вонг', [3,1,5,5], text('You value information and keep another route open. Unusual solutions and careful negotiation give you room to act.', 'Вы цените информацию и держите открытым запасной путь. Необычные решения и осторожные переговоры дают вам свободу действий.')],
        ['rebecca', 'Rebecca Chambers', 'Ребекка Чемберс', [1,5,5,2], text('You combine care with careful analysis. You would rather understand a problem and keep someone safe than win a reckless confrontation.', 'Вы сочетаете заботу с внимательным анализом. Вам важнее разобраться в проблеме и уберечь человека, чем победить в рискованном столкновении.')],
        ['chris', 'Chris Redfield', 'Крис Редфилд', [5,4,2,2], text('You take responsibility and hold the line for your team. Your choices put protection and decisive action first.', 'Вы берёте ответственность на себя и прикрываете команду. В ваших решениях на первом месте защита людей и решительные действия.')]
    ].map(([id, en, ru, vector, description]) => ({ id, name: text(en, ru), vector, description }));

    const choice = (en, ru, next, effect, noteEn, noteRu, requires = {}) => ({ text: text(en, ru), next, effect, note: text(noteEn, noteRu), requires });
    const scene = (titleEn, titleRu, en, ru, choices) => ({ title: text(titleEn, titleRu), text: text(en, ru), choices });
    const story = {
        arrival: scene('Last transmission', 'Последний сигнал', 'A quarantine siren cuts through the rain. In sixteen minutes the district will be sealed. You reach a deserted reception desk with three rounds, one medical kit and no clear route out.', 'Сирена карантина прорезает дождь. Через шестнадцать минут район перекроют. Вы у пустой стойки регистрации: три патрона, одна аптечка и ни одного надёжного пути наружу.', [
            choice('Study the evacuation plan', 'Изучить план эвакуации', 'lobby', { time:1, map:true }, 'You mark a service corridor. A quiet route is now possible.', 'Вы отмечаете технический коридор. Теперь можно пройти незаметно.'),
            choice('Take the damaged radio', 'Забрать повреждённую рацию', 'lobby', { time:1, radio:true }, 'The receiver still works. With the right connection you can call for rescue.', 'Приёмник ещё работает. При подходящем подключении можно вызвать спасателей.'),
            choice('Move before the infected arrive', 'Уйти до появления заражённых', 'lobby', { hp:-10 }, 'Broken glass cuts your arm, but you lose no time.', 'Осколки ранят руку, зато вы не теряете времени.')]),
        lobby: scene('Three open doors', 'Три открытые двери', 'The lobby leads to a clinic, a maintenance workshop and a residential wing. You only have time to search one before the fire doors close.', 'Из вестибюля можно пройти в медпункт, мастерскую или жилое крыло. До закрытия противопожарных дверей вы успеете осмотреть только одно место.', [
            choice('Enter the clinic', 'Войти в медпункт', 'clinic', { time:1 }, 'You follow the medical signs. Supplies may still be inside.', 'Вы идёте по медицинским указателям. Внутри ещё могут быть припасы.'),
            choice('Enter the workshop', 'Войти в мастерскую', 'workshop', { time:1 }, 'Oil and metal filings cover the floor. There may be tools here.', 'На полу масло и металлическая стружка. Здесь могут быть инструменты.'),
            choice('Check the residential wing', 'Проверить жилое крыло', 'residential', { time:1 }, 'A voice answers from behind a barricade.', 'Из-за баррикады отвечает человеческий голос.')]),
        clinic: scene('Emergency supplies', 'Экстренная помощь', 'A medic is pinned beneath a cabinet. A sealed locker and a medical case are within reach, but the ceiling is beginning to give way.', 'Шкаф придавил медика. Рядом закрытый оружейный шкафчик и медицинский кейс, но потолок начинает обрушаться.', [
            choice('Free the medic', 'Освободить медика', 'corridor', { time:1, hp:-10, companion:true }, 'You pull them free. Your new companion can help during a pursuit.', 'Вы освобождаете медика. Новый спутник сможет помочь при погоне.'),
            choice('Take the medical case', 'Взять медицинский кейс', 'corridor', { time:2, meds:1 }, 'You recover a sealed kit. Use it when your health is low.', 'Вы находите целую аптечку. Используйте её при ранении.'),
            choice('Break open the locker', 'Вскрыть шкафчик', 'corridor', { time:1, ammo:2 }, 'Two usable rounds remain in the locker.', 'В шкафчике остаются два пригодных патрона.')]),
        workshop: scene('Tools or fuel', 'Инструменты или топливо', 'The workshop is filling with smoke. A tool roll hangs beside a generator. A jerrycan sits beyond a patch of burning floor.', 'Мастерская заполняется дымом. У генератора висит набор инструментов. За горящим участком пола стоит канистра.', [
            choice('Take the tool roll', 'Забрать инструменты', 'corridor', { time:1, tools:true }, 'You can repair equipment and open mechanical locks.', 'Теперь можно чинить оборудование и вскрывать механические замки.'),
            choice('Recover the fuel', 'Добраться до канистры', 'corridor', { time:2, hp:-5, fuel:true }, 'You get the fuel, with a minor burn. It may power a vehicle or serve as a decoy.', 'Вы забираете топливо и получаете небольшой ожог. Оно пригодится для машины или отвлекающего манёвра.'),
            choice('Find the service stairwell', 'Найти служебную лестницу', 'corridor', { quiet:true }, 'The stairwell gives you a quiet way around the next obstruction.', 'По лестнице можно незаметно обойти следующее препятствие.')]),
        residential: scene('Behind the barricade', 'За баррикадой', 'A resident has the service keys. Their neighbour is trapped upstairs. They ask you to help before the stairwell collapses.', 'У жильца есть служебные ключи. Его сосед застрял наверху. Он просит помочь, пока лестница не рухнула.', [
            choice('Rescue the neighbour', 'Вытащить соседа', 'corridor', { time:2, hp:-15, companion:true }, 'You gain a companion, but falling debris injures you.', 'У вас появляется спутник, но обломки ранят вас.'),
            choice('Trade a medical kit for the keys', 'Обменять аптечку на ключи', 'corridor', { meds:-1, keys:true }, 'The resident can treat the neighbour. You take the service keys.', 'Жилец сможет помочь соседу. Вы забираете служебные ключи.', { meds:1 }),
            choice('Take the offered ammunition and leave', 'Взять предложенные патроны и уйти', 'corridor', { time:1, ammo:1 }, 'You accept one spare round and continue alone.', 'Вы берёте один запасной патрон и продолжаете путь в одиночку.')]),
        corridor: scene('A blocked passage', 'Перекрытый проход', 'Two infected block the narrow corridor. A fire extinguisher lies near the wall. The maintenance route is difficult to spot without a plan.', 'Узкий коридор перекрывают двое заражённых. У стены лежит огнетушитель. Без плана технический обход трудно заметить.', [
            choice('Clear the passage with two shots', 'Освободить проход двумя выстрелами', 'safehouse', { ammo:-2 }, 'The way is clear, but your reserve is smaller.', 'Путь свободен, но запас патронов уменьшился.', { ammo:2 }),
            choice('Use the quiet maintenance route', 'Пройти тихим техническим обходом', 'safehouse', { time:2 }, 'Your earlier reconnaissance pays off. You avoid the fight.', 'Предыдущая разведка пригодилась. Вы избегаете боя.', { any:['map','quiet'] }),
            choice('Push through with the extinguisher', 'Прорваться с огнетушителем', 'safehouse', { time:1, hp:-20 }, 'The extinguisher buys an opening. You escape with bruises.', 'Огнетушитель позволяет прорваться. Вы уходите с ушибами.')]),
        safehouse: scene('A brief shelter', 'Короткая передышка', 'A security office has a working antenna socket, a bench and a box of ammunition. There is time for one task. A medical kit can be used here or later.', 'В комнате охраны есть рабочий антенный разъём, скамья и коробка патронов. Времени хватит на одно дело. Аптечку можно использовать здесь или позже.', [
            choice('Activate an evacuation beacon', 'Включить эвакуационный маяк', 'junction', { time:1, beacon:true }, 'A rescue frequency answers. The roof is now a possible exit.', 'Спасательная частота отвечает. Теперь возможна эвакуация с крыши.', { any:['radio','tools'] }),
            choice('Rest and bind your wounds', 'Отдохнуть и перевязать раны', 'junction', { time:2, hp:15 }, 'A short rest restores some health but costs time.', 'Короткий отдых восстанавливает часть здоровья, но отнимает время.'),
            choice('Take two rounds', 'Забрать два патрона', 'junction', { time:1, ammo:2 }, 'You replenish your reserve before moving on.', 'Вы пополняете запас перед дальнейшим переходом.')]),
        junction: scene('Across the district', 'Через район', 'The direct road is blocked. A metro entrance, an access ladder and a bus depot offer three routes to the archive building.', 'Прямая дорога перекрыта. К зданию архива ведут три пути: вход в метро, лестница на крыши и автобусное депо.', [
            choice('Go through the metro', 'Пройти через метро', 'metro', { time:1 }, 'The stairs descend into dark water.', 'Лестница уходит в тёмную воду.'),
            choice('Climb onto the roofs', 'Подняться на крыши', 'roof', { time:1 }, 'An antenna and a stranded survivor come into view.', 'Вы замечаете антенну и выжившего, застрявшего на крыше.'),
            choice('Cross the bus depot', 'Пересечь автобусное депо', 'depot', { time:1 }, 'Abandoned vehicles conceal a few useful supplies.', 'В брошенных машинах ещё могут быть полезные припасы.')]),
        metro: scene('Flooded platform', 'Затопленная платформа', 'Water covers the platform. The pump panel is open, and a locked service gate offers a dry way around.', 'Вода залила платформу. Панель насоса открыта, а за служебной решёткой виден сухой обход.', [
            choice('Repair the pump', 'Починить насос', 'records', { time:1 }, 'The pump lowers the water enough to cross safely.', 'Насос опускает уровень воды. Можно пройти безопасно.', { all:['tools'] }),
            choice('Open the service gate', 'Открыть служебную решётку', 'records', {}, 'The service keys fit. The dry passage saves you time.', 'Служебные ключи подходят. Сухой проход экономит время.', { all:['keys'] }),
            choice('Wade through the flooded platform', 'Пройти по затопленной платформе', 'records', { time:2, hp:-25 }, 'You reach the opposite stairs, exhausted and hurt by submerged debris.', 'Вы достигаете дальней лестницы, вымотавшись и поранившись об обломки.')]),
        roof: scene('Antenna in the rain', 'Антенна под дождём', 'The archive roof is one jump away. A survivor calls from a lower ledge. The antenna could strengthen your damaged radio.', 'До крыши архива один прыжок. С нижнего карниза зовёт выживший. Антенна может усилить повреждённую рацию.', [
            choice('Connect the radio to the antenna', 'Подключить рацию к антенне', 'records', { time:1, beacon:true }, 'You transmit your location. Rescue can now find the roof.', 'Вы передаёте координаты. Спасатели теперь смогут найти крышу.', { all:['radio'] }),
            choice('Pull the survivor up', 'Подтянуть выжившего', 'records', { time:1, hp:-10, companion:true }, 'The survivor joins you. A second pair of hands may matter later.', 'Выживший присоединяется к вам. Вторая пара рук ещё пригодится.'),
            choice('Study the route to extraction', 'Изучить путь к эвакуации', 'records', { time:1, map:true }, 'You record the available extraction points and cross to the archive.', 'Вы отмечаете точки эвакуации и переходите к архиву.')]),
        depot: scene('Abandoned vehicles', 'Брошенные машины', 'An ambulance has a medical case. A bus holds a little fuel, while a jammed fence blocks a quicker route.', 'В машине скорой помощи лежит медицинский кейс. В автобусе осталось топливо, а короткий путь закрывает заклинившая ограда.', [
            choice('Recover fuel from the bus', 'Забрать топливо из автобуса', 'records', { time:1, hp:-10, fuel:true }, 'Broken metal cuts you, but the fuel can open new options.', 'Острый металл ранит вас, зато топливо откроет новые возможности.'),
            choice('Repair the fence mechanism', 'Починить механизм ограды', 'records', {}, 'Your tools open the fence. You cross without losing time.', 'Инструменты помогают открыть ограду. Вы проходите без потери времени.', { all:['tools'] }),
            choice('Search the ambulance', 'Обыскать скорую помощь', 'records', { time:2, meds:1 }, 'You recover another medical kit.', 'Вы находите ещё одну аптечку.')]),
        records: scene('The missing report', 'Исчезнувший отчёт', 'The archive terminal proves someone concealed the outbreak. You can carry the report out, transmit it, or leave it and take ammunition instead.', 'Терминал архива доказывает, что кто-то скрыл вспышку заражения. Отчёт можно вынести, передать по связи или оставить, забрав патроны.', [
            choice('Copy the report', 'Скопировать отчёт', 'pursuit', { time:2, evidence:true }, 'The report is now in your inventory. Escaping with it will change the outcome.', 'Отчёт теперь у вас. Если вынести его наружу, итог миссии изменится.'),
            choice('Transmit the report over the beacon', 'Передать отчёт через маяк', 'pursuit', { time:1, evidence:true }, 'A receipt confirms the transmission. The evidence is preserved.', 'Квитанция подтверждает передачу. Доказательства сохранены.', { all:['beacon'] }),
            choice('Leave the report and take a round', 'Оставить отчёт и взять патрон', 'pursuit', { ammo:1 }, 'You choose an immediate chance of escape over the evidence.', 'Вы предпочитаете шанс выбраться прямо сейчас сохранению доказательств.')]),
        pursuit: scene('Footsteps behind you', 'Шаги за спиной', 'A heavy shape follows you out of the archive. The street ahead is clear, but you must create enough distance to reach an exit.', 'Тяжёлый силуэт преследует вас от архива. Улица впереди свободна, но нужно оторваться, чтобы добраться до выхода.', [
            choice('Use the fuel as a burning decoy', 'Использовать топливо для горящей приманки', 'extraction', { time:1, fuel:false }, 'The pursuer follows the fire. You have no fuel left for a vehicle.', 'Преследователь отвлекается на огонь. Для машины топлива уже не осталось.', { all:['fuel'] }),
            choice('Keep it back with three shots', 'Задержать его тремя выстрелами', 'extraction', { ammo:-3 }, 'The shots buy enough distance. You conserve your time.', 'Выстрелы позволяют оторваться. Вы сохраняете время.', { ammo:3 }),
            choice('Set a distraction with your companion', 'Устроить отвлекающий манёвр со спутником', 'extraction', { time:1, hp:-5 }, 'Working together, you misdirect the pursuer and escape with minor injuries.', 'Действуя вместе, вы сбиваете преследователя со следа и уходите с лёгкими ранениями.', { all:['companion'] }),
            choice('Sprint through the wreckage', 'Бежать через обломки', 'extraction', { time:1, hp:-30 }, 'You break away, but the run takes a heavy toll.', 'Вы отрываетесь, но рывок дорого обходится здоровью.')]),
        extraction: scene('Choose your exit', 'Выберите выход', 'The blockade is almost complete. The helipad needs a beacon, the abandoned van needs fuel and tools, and the drainage canal is always open — at a cost.', 'Блокада почти завершена. Для вертолётной площадки нужен маяк, для брошенного фургона — топливо и инструменты. Дренажный канал открыт всегда, но потребует сил.', [
            choice('Head for the helipad', 'Идти к вертолётной площадке', 'helipad', { time:1 }, 'You climb toward the responding rescue aircraft.', 'Вы поднимаетесь навстречу спасательному вертолёту.', { all:['beacon'] }),
            choice('Start the abandoned van', 'Завести брошенный фургон', 'checkpoint', { time:1 }, 'The engine catches. A checkpoint still blocks the road.', 'Двигатель запускается. Дорогу ещё перекрывает блокпост.', { all:['fuel','tools'] }),
            choice('Enter the drainage canal', 'Спуститься в дренажный канал', 'waterway', { time:1 }, 'The cold canal leads beyond the quarantine fence.', 'Холодный канал ведёт за карантинное ограждение.')]),
        helipad: scene('Rotor lights', 'Огни над крышей', 'The pilot is searching the rain for your position. You can wait, use a shot as a signal, or let your companion guide the aircraft.', 'Пилот ищет вас сквозь дождь. Можно подождать, обозначить себя выстрелом или попросить спутника направить вертолёт.', [
            choice('Wait for the aircraft to line up', 'Подождать захода на посадку', 'escaped', { time:2, exit:'helicopter' }, 'The helicopter reaches the roof. You climb aboard.', 'Вертолёт выходит к крыше. Вы поднимаетесь на борт.'),
            choice('Fire a signal shot', 'Сделать сигнальный выстрел', 'escaped', { ammo:-1, exit:'helicopter' }, 'The pilot spots the flash and picks you up immediately.', 'Пилот замечает вспышку и сразу забирает вас.', { ammo:1 }),
            choice('Signal together with your companion', 'Подать сигнал вместе со спутником', 'escaped', { time:1, exit:'helicopter' }, 'Your companion guides the aircraft while you secure the landing.', 'Спутник направляет вертолёт, пока вы обеспечиваете посадку.', { all:['companion'] })]),
        checkpoint: scene('The final barrier', 'Последний шлагбаум', 'A mechanical barrier blocks the van. You can open its mechanism or force your way through and risk injury.', 'Механический шлагбаум перекрыл фургону дорогу. Можно открыть механизм или прорваться, рискуя получить ранения.', [
            choice('Open the mechanism', 'Открыть механизм', 'escaped', { time:1, exit:'van' }, 'The barrier lifts. The van clears the quarantine line.', 'Шлагбаум поднимается. Фургон пересекает карантинную линию.', { any:['keys','tools'] }),
            choice('Ram the barrier', 'Протаранить шлагбаум', 'escaped', { hp:-25, exit:'van' }, 'The van breaks through. The impact injures you.', 'Фургон прорывается. Удар ранит вас.')]),
        waterway: scene('Beyond the fence', 'За ограждением', 'The last stretch is clogged with debris. You can build a small raft with tools, or climb through the freezing water on foot.', 'Последний участок забит обломками. С инструментами можно собрать небольшой плот, иначе придётся пробираться пешком через ледяную воду.', [
            choice('Build a makeshift raft', 'Собрать импровизированный плот', 'escaped', { time:1, exit:'canal' }, 'The raft carries you beyond the fence. You have escaped.', 'Плот выносит вас за ограждение. Вы выбрались.', { all:['tools'] }),
            choice('Climb through the flooded channel', 'Пробраться по затопленному каналу', 'escaped', { time:2, hp:-20, exit:'canal' }, 'You reach the far side, injured and soaked, but outside the district.', 'Вы добираетесь до другого берега — ранены и промокли, зато за пределами района.')])
    };
    window.RE_EXTRA_DATA = { personality, profiles, story };
})();
