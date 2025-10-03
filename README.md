# Лендинг сайта ЭТОС

Это лендинг для сайта [stroi.etos-pro.ru](https://stroi.etos-pro.ru), размещённый на [s1dm4n.github.io](https://s1dm4n.github.io). Проект построен с использованием [Eleventy](https://www.11ty.dev/) и деплоится на GitHub Pages через GitHub Actions. Релизы с ZIP-архивами (`stroi.etos.ru-vX.Y.Z.zip`) создаются автоматически при пуше тегов (`v*`).

## Что делает проект
- Генерирует статический сайт с новостями (например, "Невский форум-2025", даты в формате "10 сентября 2025").
- Деплоится на `s1dm4n.github.io` при создании тега (например, `v1.0.1`).
- Создаёт ZIP-архив сайта для скачивания в GitHub Releases.

## Установка и настройка

### Требования
- **Git**: [Скачать](https://git-scm.com/download/win) и установить.
- **Node.js**: Версия 20.x.x, [скачать](https://nodejs.org/en/download/).
- **VS Code**: Для редактирования кода и работы в терминале (или другой редактор).
- **PowerShell**: Используется для команд (встроен в Windows).

### Клонирование репозитория
1. Откройте VS Code и терминал (Ctrl + ~).
2. Перейдите в рабочую директорию:
   ```powershell
   cd D:\work
   ```
3. Клонируйте репозиторий:
   ```powershell
   git clone https://github.com/s1dm4n/s1dm4n.github.io.git
   cd s1dm4n.github.io
   ```
4. Установите зависимости:
   ```powershell
   npm ci
   ```
   Это установит библиотеки, такие как `luxon` и `@sindresorhus/slugify`, указанные в `package.json`.

5. Проверьте сборку сайта:
   ```powershell
   npm run build
   ```
   - Папка `_site` создастся с файлами сайта (не коммитится, так как в `.gitignore`).
   - Откройте `_site/index.html` в браузере, чтобы увидеть сайт "ЭТОС" (новости, даты вроде "10 сентября 2025").

### Настройка SSH-аутентификации
Чтобы пушить изменения и теги в GitHub, настройте SSH:

1. Сгенерируйте SSH-ключ:
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   - Нажмите Enter для дефолтного пути (`C:\Users\<YourUser>\.ssh\id_ed25519`).
   - Пароль для ключа задавать необязательно (можно оставить пустым).

2. Добавьте публичный ключ в GitHub:
   - Откройте `C:\Users\<YourUser>\.ssh\id_ed25519.pub` в текстовом редакторе (например, Notepad).
   - Скопируйте содержимое.
   - Перейдите в GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** или **Add SSH key**.
   - Вставьте ключ, задайте имя (например, "My PC") и сохраните.

3. Настройте удалённый URL для SSH:
   ```powershell
   git remote set-url origin git@github.com:s1dm4n/s1dm4n.github.io.git
   ```

4. Проверьте подключение:
   ```powershell
   ssh -T git@github.com
   ```
   - Ожидаемый вывод: `Hi s1dm4n! You've successfully authenticated...`.

## Обновление сайта и создание релиза

### Обновление контента
1. Добавьте новый контент, например, новость в `src/news/new-post.md`:
   ```markdown
   ---
   title: Новый пост
   date: 2025-10-04
   ---
   Контент новости...
   ```
2. Проверьте локально:
   ```powershell
   npm run build
   ```
   - Убедитесь, что `_site/index.html` содержит обновлённый контент (например, новости с датой "4 октября 2025").

3. Запушьте изменения:
   ```powershell
   git add .
   git commit -m "Add new news post"
   git push origin main
   ```

### Создание релиза и деплоя
Сайт деплоится на `s1dm4n.github.io`, и ZIP-архив создаётся при пуше тега:

1. Создайте тег для нового релиза:
   ```powershell
   git tag v1.0.1
   git push origin v1.0.1
   ```
   - Это запустит workflow GitHub Actions, который:
     - Соберёт сайт (`_site`).
     - Создаст ZIP-архив (`stroi.etos.ru-v1.0.1.zip`).
     - Опубликует сайт на `s1dm4n.github.io`.
     - Создаст релиз в GitHub Releases с архивом.

2. Проверьте результат:
   - В **Actions** (https://github.com/s1dm4n/s1dm4n.github.io/actions) убедитесь, что workflow завершился успешно.
   - В **Releases** (https://github.com/s1dm4n/s1dm4n.github.io/releases) найдите "Release v1.0.1" с файлом `stroi.etos.ru-v1.0.1.zip`.
   - Скачайте и распакуйте ZIP:
     ```powershell
     Expand-Archive -Path .\stroi.etos.ru-v1.0.1.zip -DestinationPath .\test-unzip
     ```
     - Проверьте `test-unzip/index.html` в браузере (должен быть сайт "ЭТОС").
   - Откройте `s1dm4n.github.io` — сайт должен обновиться.

## Доступ к редактированию
- **Кто может редактировать**: Только владелец (`s1dm4n`) или добавленные коллабораторы (проверьте в **Settings** → **Manage access**).
- **Публичный репозиторий**: Другие могут форкать и предлагать изменения через Pull Requests (PR), но без вашего одобрения они не попадут в проект.
- **Ограничение доступа**: Для большей безопасности:
  - Отключите PR в **Settings** → **General** → "Allow merge commits".
  - Сделайте репо private (но GitHub Pages станет платным).

## Устранение проблем
- **Ошибка клонирования**: Убедитесь, что Git установлен (`git --version`) и URL правильный.
- **Ошибка сборки**: Проверьте зависимости (`npm install luxon @sindresorhus/slugify`) и `npm run build`.
- **Релиз не создаётся**: Проверьте логи в **Actions** → "Build, Deploy, and Release". Убедитесь, что тег в формате `v*` (`git ls-remote --tags origin`).
- **Сайт не обновился**: Проверьте **Settings** → **Pages** → Source = **GitHub Actions**.
