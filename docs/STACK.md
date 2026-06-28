# Stack — US Holding Site v2

## Контекст: что было и что меняется

Текущая прод-версия (`main`, `index.html`) — один HTML-файл ~820 строк,
весь CSS в `<head>`, весь JS перед `</body>`, без сборки и зависимостей.
Это и есть причина жалоб на скорость и подвисания:

- Hero-секция грузит `images/astana.jpg` (825 КБ) + `start1.jpg` (262 КБ) +
  `start2.jpg` (203 КБ) синхронно, без `lazy`, без responsive-вариантов —
  ~1.3 МБ только на первом экране
- About-секция добавляет ещё `holding1.jpg` (291 КБ) + `holding2.jpg` (160 КБ) +
  `holding3.webp` (256 КБ)
- Clerk грузится через `clerk.usholding.kz/.../clerk-js@latest/...` —
  версия не закреплена (`@latest`), скрипт блокирующий
- Нет `<meta name="description">`, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`
- `favicon.ico` лежит в репозитории, но ни на что не подключён (фактически используется `<link rel="icon" href="logo/US.png">`) — не баг, но при переносе в `public/`/Next.js icon-конвенцию стоит свести к одному источнику
- `functions/api/update-profile.js` написана в формате Cloudflare Pages Functions
  (`onRequestPost`), но проект деплоится на Netlify — функция никогда не вызывалась;
  данные профиля (`phone/position/dept`) в итоге сохраняются прямо в
  `unsafeMetadata` Clerk напрямую с клиента, без проверки сервером
- `.reveal`/`.reveal.visible` в CSS — идентичные правила, анимация появления не работает (мёртвый код)
- Контент (17 компаний, портфолио) хардкоднут в JS-объекте `COS` и инлайн-разметке — любое изменение текста требует правки сырого HTML

Ниже — выбранный стек для устранения этих проблем и перехода на полноценную
систему (фронтенд + бэкенд + БД).

## Frontend
- Фреймворк: **Next.js 15**, App Router, React Server Components
- Язык: TypeScript 5 (strict mode)
- Стили: Tailwind CSS (цветовые токены — `--navy`/`--orange`/... переносятся в `tailwind.config.ts`)
- Изображения: `next/image` (автоматический responsive + AVIF/WebP + lazy loading)
- Шрифты: `next/font` для Raleway + Playfair Display (вместо блокирующего Google Fonts CDN — self-host через next/font устраняет внешний запрос и FOIT/FOUT)
- Тесты: Vitest (unit) + Playwright (e2e)

## Backend
- Слой: Next.js Route Handlers (`app/api/*/route.ts`) — отдельный сервис не нужен при таком объёме логики (профиль, формы, вебхуки)
- Валидация: `zod` на входных данных Route Handlers
- Вебхуки: Clerk webhook (`user.created`/`user.updated`) → `app/api/webhooks/clerk/route.ts` → запись в Supabase

## База данных и хранилище — Supabase
- Postgres: таблицы `companies`, `portfolio_projects`, `leads`, `user_profile_extra`
- Storage: bucket для фото портфолио и компаний (замена статичных файлов в `images/`)
- RLS: публичное чтение `companies`/`portfolio_projects`; запись — только service role (из Route Handlers, не из браузера)
- Встроенная веб-панель Supabase — резервный способ посмотреть/поправить данные руками, отдельно от собственной `/admin` (Фаза 7)
- Клиенты: `@supabase/ssr` — разделение server client (Route Handlers, Server Components) и browser client

## Аутентификация — Clerk
- Пакет `@clerk/nextjs` вместо CDN-скрипта `clerk.browser.js`
- `<ClerkProvider>` в `app/layout.tsx`, защита роутов через `middleware.ts`
- Сервер: `auth()` / `currentUser()` вместо клиентского `window.Clerk`
- Кастомный домен `clerk.usholding.kz` (Cloudflare CNAME) — без изменений
- `unsafeMetadata` (редактируется с клиента) — больше не источник истины для `phone/position/dept`; источник истины — таблица `user_profile_extra` в Supabase, синхронизируемая через вебхук и серверный Route Handler

## Формы
- Web3Forms (`api.web3forms.com/submit`) — без изменений, письма на `info@usholding.kz`
- Дублирование заявки в таблицу `leads` (Supabase) через собственный Route Handler — страховка на случай сбоя Web3Forms

## Почта
- Microsoft 365 / Outlook Web (`outlook.office.com`) — без изменений, просто внешняя ссылка. Бэкенд-интеграция (например, отправка уведомлений о заявках через Microsoft Graph API) — в backlog, не в текущем скоупе

## Инфраструктура
- Хостинг: **Hetzner VPS** (62.238.25.150) — Next.js standalone + PM2 (process manager) + nginx (reverse proxy)
- DNS: Cloudflare (`usholding.kz`) — A-запись на Hetzner IP, Proxy mode (оранжевое облако) для SSL/CDN
- CI/CD: GitHub Actions (lint + typecheck + unit + e2e на PR) + деплой через `deploy.sh` на сервере
- Мониторинг: Sentry (ошибки), Lighthouse CI (регрессии производительности)
- Репозиторий: `github.com/KAZmake/usholding-site`, рабочая ветка `rebuild`

## Деплой на Hetzner

```bash
# Первоначальная настройка (от root):
sudo apt install -y nginx
sudo npm install -g pm2
sudo cp nginx/usholding.conf /etc/nginx/sites-available/usholding
sudo ln -s /etc/nginx/sites-available/usholding /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
pm2 startup  # следовать инструкциям

# Деплой (от claude или CI):
./deploy.sh
```

> `netlify.toml` оставлен минимальным — обслуживает только legacy `index.html`
> из `main` до момента переключения DNS на Hetzner.

## Структура репозитория (целевая, после Фазы 1)

```
usholding-site/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 — главная (hero/about/companies/portfolio/why/contact)
│   ├── profile/page.tsx         — личный кабинет (защищён Clerk middleware)
│   ├── admin/                   — админ-панель (Фаза 7)
│   ├── api/
│   │   ├── profile/route.ts
│   │   ├── leads/route.ts
│   │   └── webhooks/clerk/route.ts
│   ├── sitemap.ts
│   └── globals.css
├── components/
│   ├── Nav.tsx, Hero.tsx, About.tsx, CompanyCard.tsx, CompanyModal.tsx,
│   │   PortfolioCard.tsx, WhySection.tsx, ContactForm.tsx, Footer.tsx, UserMenu.tsx
├── lib/
│   ├── supabase/ (server.ts, client.ts)
│   └── validation/ (zod-схемы)
├── public/
│   ├── images/, logo/, favicon.ico, manifest.json
├── supabase/
│   └── migrations/
├── tests/
│   ├── unit/, e2e/
├── docs/
│   ├── STACK.md
│   └── index.html               — дашборд прогресса (GitHub Pages, branch rebuild)
├── .claude/
│   ├── settings.json
│   └── agents/
├── CLAUDE.md, ROADMAP.md, BOARD.md
├── ecosystem.config.cjs          — PM2 конфигурация
├── deploy.sh                     — скрипт деплоя на Hetzner
├── nginx/usholding.conf          — nginx reverse proxy конфиг
├── netlify.toml                  — legacy, только для статического index.html
└── logs/                         — PM2 логи (gitignored)
```

## Зависимости между фазами

Фаза 0 блокирует все остальные (без неё нет проекта Next.js). Фаза 2
(БД) должна завершиться до Фазы 3.3 (синхронизация профиля) и до Фазы 7
(админка читает/пишет в те же таблицы). Фаза 1 (вёрстка) может идти
параллельно с Фазой 2 — разные агенты, разные файлы. Фаза 5 (SEO/perf)
и Фаза 6 (тесты/CI) можно начинать, как только готов скелет из Фазы 0–1,
и вести параллельно с Фазами 2–4. Фаза 8 — всегда последняя.
