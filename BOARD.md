# BOARD — текущий статус работы

## Active work
| Agent   | Task | Status | Started |
|---------|------|--------|---------|
| orchestrator | Фазы 0-4 завершены, переход к Фазе 5 | in progress | 2026-06-21 |

## Decisions
<!-- Ключевые технические решения -->
- 2026-06-21: Фреймворк — Next.js 15 (App Router). Альтернатива (Astro) отклонена ради предсказуемости автономных агентов.
- 2026-06-21: БД/бекенд — Supabase (Postgres + Storage + встроенная панель данных). Альтернатива (чистый Neon Postgres) отклонена — нужна возможность смотреть/править данные без кода.
- 2026-06-21: В план включена собственная админ-панель `/admin` (Фаза 7) для управления портфолио/компаниями/заявками без участия программистов.
- 2026-06-21: Вся разработка — в ветке `rebuild`, `main` не трогаем до Фазы 8 (прод-сайт живой).
- 2026-06-21: GitHub Pages дашборд — источник `rebuild`/`docs`, не `main`/корень (см. CLAUDE.md, конфликт с прод index.html).
- 2026-06-21: Репозиторий `usholding-site` сделан публичным (был приватным) — иначе GitHub Pages недоступен без платного плана. Перед сменой видимости вся история (27 коммитов, все ветки) проверена на секреты — найдены только публичные ключи Clerk (`pk_live_`/`pk_test_`, по дизайну предназначены для клиента) и одно упоминание имени переменной `env.CLERK_SECRET_KEY` без значения. Реального риска утечки нет.

## Blockers
<!-- Что блокирует работу -->

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
