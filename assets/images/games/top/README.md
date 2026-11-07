# Ваши изображения для подборки лучших игр

Здесь подключены пять постеров, присланных владельцем 7 ноября 2026. Они скопированы без изменений из Downloads: без обрезки, перекодирования и растягивания. В карточках постеры целиком вписываются в широкий блок 16:9; несовпадение пропорций заполняется тёмными полями.

Подключённые файлы и пути:

| Карточка | Путь в атрибуте `src` |
| --- | --- |
| Resident Evil 4 Remake | `assets/images/games/top/re4-remake.jpg` |
| Resident Evil 2 Remake | `assets/images/games/top/re2-remake.jpg` |
| Resident Evil Village | `assets/images/games/top/village.jpg` |
| Resident Evil 7 Biohazard | `assets/images/games/top/re7.jpg` |
| Resident Evil Requiem | `assets/images/games/top/requiem.jpg` |

После добавления файла откройте `Resident Evil (Project)/top-games.html` и измените `src` соответствующего тега `<img>` внутри `.top-game-image`. Над каждым тегом оставлен комментарий с предлагаемым путём.

Например, для RE4 Remake:

```html
<img src="assets/images/games/top/re4-remake.jpg" alt="Resident Evil 4 Remake">
```

Если файл называется иначе или имеет расширение `.jpg` либо `.png`, укажите его настоящее имя и расширение. Пути считаются от HTML-страницы. На Live Server обновите `top-games.html` через Ctrl+F5. Одного добавления файла в папку недостаточно: необходимо также заменить `src`.

Для текущих широких карточек удобно использовать горизонтальные изображения. Эта папка независима от фотографий мини-игры и галереи персонажей.
