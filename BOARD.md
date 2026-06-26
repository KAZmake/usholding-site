# BOARD — текущий статус работы

## Active work
| Agent   | Task | Status | Started |
|---------|------|--------|---------|
| orchestrator | Фаза 8: ожидание ручной проверки владельцем (blockers posted) | blocked | 2026-06-22 |

## Decisions
<!-- Ключевые технические решения -->
- 2026-06-21: Фреймворк — Next.js 15 (App Router). Альтернатива (Astro) отклонена ради предсказуемости автономных агентов.
- 2026-06-21: БД/бекенд — Supabase (Postgres + Storage + встроенная панель данных). Альтернатива (чистый Neon Postgres) отклонена — нужна возможность смотреть/править данные без кода.
- 2026-06-21: В план включена собственная админ-панель `/admin` (Фаза 7) для управления портфолио/компаниями/заявками без участия программистов.
- 2026-06-21: Вся разработка — в ветке `rebuild`, `main` не трогаем до Фазы 8 (прод-сайт живой).
- 2026-06-21: GitHub Pages дашборд — источник `rebuild`/`docs`, не `main`/корень (см. CLAUDE.md, конфликт с прод index.html).
- 2026-06-21: Репозиторий `usholding-site` сделан публичным (был приватным) — иначе GitHub Pages недоступен без платного плана. Перед сменой видимости вся история (27 коммитов, все ветки) проверена на секреты — найдены только публичные ключи Clerk (`pk_live_`/`pk_test_`, по дизайну предназначены для клиента) и одно упоминание имени переменной `env.CLERK_SECRET_KEY` без значения. Реального риска утечки нет.

## Blockers
<!-- Что блокирует работу. Каждый блокер пересылается в Telegram-бота —
     пиши конкретно: что нужно сделать человеку и что вернуть в ответ. -->

### ⚠️ ВНИМАНИЕ: Telegram-relay не работает (сетевой таймаут к api.telegram.org). Эти блокеры НЕ были доставлены в Telegram. Проверьте этот файл и ответьте в секции "Human Input" ниже.

### Фаза 8 — требуется ручная проверка и действия владельца

**Все 38 из 38 технических задач (Фазы 0-7) выполнены.** Осталось 4 задачи Фазы 8 — все требуют действий человека.

**8.1 — Визуальное сравнение:**
Открой Netlify Deploy Preview (ссылка появится при создании PR `rebuild → main`) и сравни с текущим https://usholding.kz:
- Все 6 секций (hero, about, companies, portfolio, why, contact)
- Все 17 модалок компаний (клик → текст, услуги, теги)
- Мобильная адаптивность
- Если есть визуальные расхождения — опиши их здесь, я исправлю.
Верни: «Визуально ОК» или список расхождений.

**8.2 — Мердж в main:**
После подтверждения 8.1:
1. Создай PR `rebuild → main` на GitHub
2. Убедись что Netlify Deploy Preview работает
3. Нажми Merge
Верни: «Замержено» или ссылку на PR.

**8.3 — Проверка домена после релиза:**
После мерджа проверь:
- https://usholding.kz загружается (новая Next.js версия)
- https://clerk.usholding.kz работает (Clerk auth)
- Форма обратной связи отправляет (Web3Forms + Supabase)
Верни: «Домен ОК» или описание проблемы.

**8.4 — Ветка cloudflare/workers-autoconfig:**
Эта ветка содержит старую историю разработки (Netlify Identity → Clerk CDN → Cloudflare Workers для профиля). Вся функциональность уже переписана в `rebuild` (Next.js Route Handlers). Рекомендация: **удалить ветку**. Команда: `git push origin --delete cloudflare/workers-autoconfig`
Верни: «Удалить» или «Оставить (причина)».

## Human Input
<!-- Ответы пользователя на блокеры, приходят сюда автоматически из Telegram.
     Перед началом новой задачи проверяй эту секцию: если есть ответ на твой
     блокер — используй его, реализуй и убери соответствующий пункт из Blockers. -->

### Ответ на вопрос «поясни детальнее что надо сделать»

PR создан: https://github.com/KAZmake/usholding-site/pull/2

**Пошаговая инструкция:**

**Шаг 1 — Визуальная проверка (задача 8.1):**
1. Открой PR: https://github.com/KAZmake/usholding-site/pull/2
2. Внизу PR будет комментарий от Netlify с ссылкой «Deploy Preview» — кликни по ней
3. Если Deploy Preview ещё нет — подожди 2-3 минуты, Netlify строит сайт
4. Открой в соседней вкладке текущий сайт: https://usholding.kz
5. Сравни визуально:
   - Шапка (hero-секция с логотипом и слоганом)
   - Секция «О компании»
   - Секция «Компании» — кликни на каждую из 17 карточек, проверь модалку (текст, услуги, теги)
   - Секция «Портфолио»
   - Секция «Почему мы»
   - Секция «Контакты» (форма)
   - Проверь на мобильном (или сужай окно браузера)
6. Ответь в Telegram: «Визуально ОК» или опиши что не совпадает

**Шаг 2 — Мердж (задача 8.2):**
1. Если визуально всё ОК — в PR нажми зелёную кнопку «Merge pull request»
2. Ответь в Telegram: «Merged»

**Шаг 3 — Проверка домена (задача 8.3):**
После мерджа подожди 2-5 минут и проверь:
1. https://usholding.kz — должен открыться новый сайт
2. Форма обратной связи — попробуй отправить тестовое сообщение
3. Ответь в Telegram: «Домен ОК» или опиши проблему

**Шаг 4 — Старая ветка (задача 8.4):**
Ветка `cloudflare/workers-autoconfig` больше не нужна (весь код переписан). 
Ответь: «Удалить» или «Оставить»

## Completed today
- Задача 0.1: Создать проект Next.js 15 (App Router, TS strict, Tailwind CSS v4) — Next.js 15.5.19, React 19, src/ layout
- Задача 0.2: Перенести статику в public/, настроить app/favicon.ico и app/icon.png
- Задача 0.3: ESLint 9 (flat config) + Prettier + prettier-plugin-tailwindcss + Husky pre-commit + lint-staged — lint, format:check, typecheck все проходят
- Задача 0.4: .env.example со всеми переменными (Clerk, Supabase, Web3Forms)
- Задача 0.5: netlify.toml → Next.js Runtime (`npm run build`, @netlify/plugin-nextjs)
- Задача 0.6: Удалена functions/api/update-profile.js (орфанный Cloudflare код)
- Задача 1.1: CSS-переменные перенесены в Tailwind v4 @theme + Google Fonts (Raleway, Playfair Display)
- Задача 1.2+1.3: 12 компонентов + data files; все 17 компаний, 6 портфолио, все секции перенесены 1:1
- Задача 1.4: PortfolioCard использует next/image (gradient fallback для отсутствующих фото)
- Задача 1.5: Все изображения через next/image с fill/sizes/priority
- Задача 1.6: .reveal CSS не перенесён (dead code eliminated)
- Задача 2.1: Схема Postgres (4 таблицы: companies, portfolio_projects, leads, user_profile_extra)
- Задача 2.2: Seed-скрипт (17 компаний + 6 портфолио проектов)
- Задача 2.3: Storage bucket `media` (public read, service_role write)
- Задача 2.4: RLS-политики для всех таблиц
- Задача 2.5: Supabase client (server/browser) + TypeScript типы
- Задача 3.1: @clerk/nextjs установлен, ClerkProvider в layout
- Задача 3.2: Clerk middleware защищает /profile
- Задача 3.3: Webhook handler (user.created/updated → user_profile_extra)
- Задача 3.4: Route Handler GET/PUT /api/profile с серверной проверкой сессии
- Задача 3.5: Route Handler PUT /api/profile/password с русскими сообщениями об ошибках
- Задача 4.1-4.3: Route Handler /api/contact (Web3Forms + Supabase leads + zod + rate-limit + honeypot)
- Задача 5.1: robots.ts, sitemap.ts, manifest.json
- Задача 5.2: Open Graph, Twitter Card, JSON-LD Organization (17 subOrganizations)
- Задача 5.3: Core Web Vitals verified (priority images, font-display swap, no blocking scripts)
- Задача 5.4: Lighthouse CI GitHub Action (perf >= 0.8, SEO >= 0.9)
- Задача 5.5: Sentry (client + server + edge + global-error handler)
- Задача 6.1: Vitest (16 unit tests для contact validation)
- Задача 6.2: Playwright e2e (4 smoke tests, chromium)
- Задача 6.3: GitHub Actions CI (lint + typecheck + test)
- Задача 6.4: Netlify Deploy Preview задокументирован
- Задача 7.1: /admin защищён через Clerk (admin role check в layout)
- Задача 7.2: CRUD portfolio_projects (pages + API routes + zod validation)
- Задача 7.3: CRUD companies (pages + API routes)
- Задача 7.4: Leads table с pagination, status filter, inline status change
