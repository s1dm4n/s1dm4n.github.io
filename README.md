**Работа с проетом**
- Выгружаем проект: открываем VS code в терминале (Ctrl + ~) пишем - `git clone https://github.com/s1dm4n/s1dm4n.github.io.git`
- Устанавливаем Node.js (если не установлено) - `node --version npm --version` (проверка версии) или скачать с сайта [nodejs.org](nodejs.org)
- Установим зависимости `npm ci` - это установит luxon, @sindresorhus/slugify и другие зависимости из package.json (как в вашем .eleventy.js).
- Проверим сборку - соберем сайт локально `npm run build` (убедитесь, что папка _site создалась (dir _site) и содержит index.html)

**Аутентификация**


**Релизы**
- Выгружаешь проект на гитхаб
- Создаешь тег `git tag v1.0.1`
- Пушишь его на гитхаб `git push origin v1.0.1`
