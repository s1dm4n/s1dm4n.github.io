**Установка и настройка проекта**
- Выгружаем проект: открываем VS code в терминале (Ctrl + ~) пишем - `git clone https://github.com/s1dm4n/s1dm4n.github.io.git`
- Устанавливаем Node.js (если не установлено) - `node --version npm --version` (проверка версии) или скачать с сайта [nodejs.org](nodejs.org)
- Установим зависимости `npm ci` - это установит luxon, @sindresorhus/slugify и другие зависимости из package.json (как в вашем .eleventy.js).
- Проверим сборку - соберем сайт локально `npm run build` (убедитесь, что папка _site создалась (dir _site) и содержит index.html)

**Аутентификация**
- Сгенерируйте SSH-ключ: ssh-keygen -t ed25519 -C "your_email@example.com"
- Нажмите Enter для дефолтного пути C:\Users\<YourUser>\.ssh\id_ed25519
- Добавьте публичный ключ в GitHub: Скопируйте id_ed25519.pub (откройте в текстовом редакторе) --> В GitHub → Settings → SSH and GPG keys → New SSH key → вставьте ключ.
- git remote set-url origin git@github.com:s1dm4n/s1dm4n.github.io.git
- Проверьте: ssh -T git@github.com (должно вывести `Hi s1dm4n!`).

**Создание релиза (как продолжение)**
- Обновите контент (например, добавьте новость в src/news/new-post.md):

  `---`
  
  `title: Новый пост`
  
  `date: 2025-10-04`
  
  `---`
  
  `Контент новости...`
  
- Соберите и протестируйте: `npm run build`
- Запушьте изменения:
  `git add .
  git commit -m "Add new news post"
  git push origin main`
  Это обновит сайт на s1dm4n.github.io через deploy.yml.
- Создайте тег для релиза:
  `git tag v1.0.1
  git push origin v1.0.1`
  Это запустит release.yml, создаст релиз "Release v1.0.1" с архивом stroi.etos.ru-v1.0.1.zip в Releases.

**Релизы**
- Выгружаешь проект на гитхаб
- Создаешь тег `git tag v1.0.1`
- Пушишь его на гитхаб `git push origin v1.0.1`
