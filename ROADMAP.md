# Roadmap — US Holding Site v2

> Миграция сайта usholding.kz с монолитного `index.html` на полноценную
> систему: Next.js 15 + Supabase (Postgres/Storage) + Clerk SDK, с сохранением
> текущего домена, дизайна и интеграций (Clerk, Web3Forms, Microsoft 365).
>
> Текущая прод-версия (`index.html`, ветка `main`) не трогается до тех пор,
> пока новая версия не пройдёт Фазу 8. Вся разработка — в ветке `rebuild`
> с Netlify Deploy Preview, мердж в `main` только после ручной проверки.

## Фаза 0: Аудит и инфраструктура репозитория
- [x] Задача 0.1: Создать в ветке `rebuild` проект Next.js 15 (App Router, TypeScript strict, Tailwind CSS) рядом с текущими файлами, не удаляя прод `index.html`
- [x] Задача 0.2: Перенести статику (`images/`, `logo/`, `favicon.ico`) в `public/`; настроить иконки через Next.js (`app/icon.png` из `logo/US.png`, `app/favicon.ico` из существующего `favicon.ico` — он есть в репозитории, но сейчас ни на что не подключён)
- [x] Задача 0.3: Настроить ESLint + Prettier + TypeScript strict + Husky pre-commit (lint + typecheck перед коммитом)
- [x] Задача 0.4: Создать `.env.example` со всеми переменными: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `WEB3FORMS_ACCESS_KEY`
- [x] Задача 0.5: Настроить `netlify.toml` под Next.js Runtime (`@netlify/plugin-nextjs`): build command `next build`, без `publish = "."`
- [x] Задача 0.6: Удалить орфанную `functions/api/update-profile.js` (формат Cloudflare Pages Functions, не выполняется на Netlify; функциональность переписывается заново в Фазе 3 как Next.js Route Handler)

## Фаза 1: Дизайн-система и вёрстка
- [ ] Задача 1.1: Перенести CSS-переменные (`--navy`, `--orange`, `--gray` и т.д.) из инлайн `<style>` в `tailwind.config.ts` (`theme.extend.colors`) и `app/globals.css`
- [ ] Задача 1.2: Собрать компоненты: `Nav`, `Hero`, `About`, `CompanyCard`, `CompanyModal`, `PortfolioCard`, `WhySection`, `ContactForm`, `Footer`, `UserMenu`
- [ ] Задача 1.3: Перенести секции `hero/about/companies/portfolio/why/contact` 1:1 по содержанию, копирайтингу и вёрстке — визуальной регрессии быть не должно
- [ ] Задача 1.4: Заменить инлайн base64-SVG плейсхолдеры портфолио на реальные фото через `next/image`
- [ ] Задача 1.5: Все изображения → `next/image` с явными `width/height`, `sizes`, `priority` для hero-изображений — устранить текущие ~2 МБ незжатых JPG на первом экране (`astana.jpg` 825 КБ, `start1.jpg` 262 КБ, `start2.jpg` 203 КБ и т.д.)
- [ ] Задача 1.6: Убрать мёртвый CSS `.reveal`/`.reveal.visible` (сейчас оба правила идентичны и не дают эффекта) — либо реализовать анимацию появления через `IntersectionObserver`, либо удалить класс

## Фаза 2: Данные и БД (Supabase)
- [ ] Задача 2.1: Спроектировать схему Postgres: `companies` (17 записей), `portfolio_projects`, `leads`, `user_profile_extra`
- [ ] Задача 2.2: Написать миграции (Supabase CLI) + seed-скрипт, перенести 17 компаний из JS-объекта `COS` и 6 портфолио-проектов из текущего `index.html` без потери данных
- [ ] Задача 2.3: Настроить Supabase Storage bucket для фото портфолио/компаний, перенести текущие файлы из `images/`
- [ ] Задача 2.4: Настроить RLS-политики: публичное чтение `companies`/`portfolio_projects`, запись только через service role (серверные Route Handlers)
- [ ] Задача 2.5: Подключить Supabase client (отдельные клиенты для server components и browser), сгенерировать типы (`supabase gen types typescript`)

## Фаза 3: Аутентификация и профиль (Clerk SDK)
- [ ] Задача 3.1: Перейти с CDN-скрипта `clerk.browser.js` (без версии, `@latest`) на пакет `@clerk/nextjs` — `<ClerkProvider>`, middleware, серверный `auth()`
- [ ] Задача 3.2: Защитить `/profile` через Clerk middleware вместо текущего client-side `showProfile()`/`showMain()` переключения видимости
- [ ] Задача 3.3: Настроить Clerk webhook (`user.created`/`user.updated`) → синхронизация в таблицу `user_profile_extra` (Supabase) вместо хранения `phone/position/dept` в `unsafeMetadata`, которое сейчас редактируется напрямую из браузера без проверки сервером
- [ ] Задача 3.4: Реализовать обновление профиля через защищённый Route Handler `app/api/profile/route.ts` с проверкой сессии на сервере
- [ ] Задача 3.5: Перепроверить смену пароля через `@clerk/nextjs` Backend SDK, сохранить текущую логику сообщений об ошибках (рус. тексты)

## Фаза 4: Формы и лиды
- [ ] Задача 4.1: Сохранить Web3Forms как основной канал писем на `info@usholding.kz` (форма `#contactForm`, ключ из `access_key`)
- [ ] Задача 4.2: Добавить дублирующую запись каждой заявки в таблицу `leads` (Supabase) через Route Handler — заявки не теряются, если письмо Web3Forms не дойдёт
- [ ] Задача 4.3: Добавить серверную валидацию (`zod`) и rate-limit по IP в дополнение к существующему honeypot-полю `botcheck`

## Фаза 5: SEO, производительность и надёжность
- [ ] Задача 5.1: Добавить `robots.txt`, `app/sitemap.ts`, `manifest.json` (иконки уже перенесены в Задаче 0.2)
- [ ] Задача 5.2: Добавить `<meta name="description">`, Open Graph/Twitter Card, JSON-LD `Organization` (+ `subOrganization` на каждую из 17 компаний) — сейчас в `<head>` нет ни одного из этих тегов
- [ ] Задача 5.3: Добиться бюджета Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms) за счёт `next/image`, `font-display: swap`, предзагрузки hero-изображения, переноса Clerk-скрипта на `@clerk/nextjs` (убирает блокирующий `<script src=".../latest/...">`)
- [ ] Задача 5.4: Подключить Lighthouse CI в GitHub Actions с порогом производительности — провал сборки при регрессии
- [ ] Задача 5.5: Подключить Sentry (frontend + Route Handlers) для отслеживания ошибок на проде

## Фаза 6: Тесты и CI/CD
- [ ] Задача 6.1: Настроить Vitest для unit-тестов утилит и Route Handler'ов
- [ ] Задача 6.2: Настроить Playwright для smoke e2e: главная страница, открытие карточки компании, вход через Clerk, отправка формы заявки, сохранение профиля
- [ ] Задача 6.3: Настроить GitHub Actions: lint + typecheck + unit + e2e на каждый PR в `rebuild`/`main`, блокировать merge при провале
- [ ] Задача 6.4: Включить Netlify Deploy Preview на PR для визуальной проверки перед мерджем

## Фаза 7: Админ-панель
- [ ] Задача 7.1: Защищённый раздел `/admin`, доступ только роли `admin` (Clerk Organizations/Roles)
- [ ] Задача 7.2: CRUD для `portfolio_projects` (создание/редактирование/удаление, загрузка фото в Supabase Storage)
- [ ] Задача 7.3: CRUD для карточек `companies` (описание, услуги, теги — сейчас правится только через хардкод объекта `COS` в JS)
- [ ] Задача 7.4: Просмотр и управление статусом заявок `leads` (Новая / В работе / Закрыта)

## Фаза 8: Запуск и пост-релиз
- [ ] Задача 8.1: Финальное визуальное сравнение старой и новой версии по всем секциям и всем 17 модалкам компаний
- [ ] Задача 8.2: Netlify Deploy Preview → ручная проверка владельцем → мердж `rebuild` → `main` → прод
- [ ] Задача 8.3: Проверить домен `usholding.kz` и поддомен `clerk.usholding.kz` после релиза (DNS/TLS не менялись, но проверить обязательно)
- [ ] Задача 8.4: Решить судьбу заброшенной ветки `cloudflare/workers-autoconfig` — удалить либо явно задокументировать, почему она не используется

## Completed
<!-- Оркестратор перемещает сюда выполненные задачи -->
