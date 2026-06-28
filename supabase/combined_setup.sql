-- ================================================================
-- US Holding — полная настройка базы данных Supabase
-- Запусти этот файл в Supabase Dashboard → SQL Editor → New Query
-- Можно вставить весь файл целиком и нажать Run.
-- ================================================================

-- ============================================================
-- 1. Trigger function: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. Table: companies (17 записей)
-- ============================================================
CREATE TABLE public.companies (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL,
  tagline     TEXT,
  description TEXT,
  card_tagline TEXT,
  card_description TEXT,
  services    TEXT[]      DEFAULT '{}',
  tags        TEXT[]      DEFAULT '{}',
  logo_file   TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 3. Table: portfolio_projects
-- ============================================================
CREATE TABLE public.portfolio_projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  title       TEXT        NOT NULL,
  tag         TEXT        NOT NULL,
  location    TEXT        NOT NULL,
  builder     TEXT        NOT NULL,
  year        TEXT        NOT NULL,
  image_url   TEXT,
  image_alt   TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 4. Table: leads (заявки с контактной формы)
-- ============================================================
CREATE TABLE public.leads (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  message     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'in_progress', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 5. Table: user_profile_extra (профили из Clerk)
-- ============================================================
CREATE TABLE public.user_profile_extra (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT        UNIQUE NOT NULL,
  phone         TEXT,
  position      TEXT,
  department    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER user_profile_extra_updated_at
  BEFORE UPDATE ON public.user_profile_extra
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 6. RLS policies
-- ============================================================

-- companies: public read, service_role write
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies_public_read" ON public.companies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "companies_service_role_insert" ON public.companies FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "companies_service_role_update" ON public.companies FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "companies_service_role_delete" ON public.companies FOR DELETE TO service_role USING (true);

-- portfolio_projects: public read, service_role write
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_projects_public_read" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "portfolio_projects_service_role_insert" ON public.portfolio_projects FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "portfolio_projects_service_role_update" ON public.portfolio_projects FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "portfolio_projects_service_role_delete" ON public.portfolio_projects FOR DELETE TO service_role USING (true);

-- leads: public insert, service_role everything else
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "leads_service_role_select" ON public.leads FOR SELECT TO service_role USING (true);
CREATE POLICY "leads_service_role_update" ON public.leads FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "leads_service_role_delete" ON public.leads FOR DELETE TO service_role USING (true);

-- user_profile_extra: own row only, service_role for insert/delete
ALTER TABLE public.user_profile_extra ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_profile_extra_own_select" ON public.user_profile_extra FOR SELECT TO authenticated USING (auth.uid()::text = clerk_user_id);
CREATE POLICY "user_profile_extra_own_update" ON public.user_profile_extra FOR UPDATE TO authenticated USING (auth.uid()::text = clerk_user_id) WITH CHECK (auth.uid()::text = clerk_user_id);
CREATE POLICY "user_profile_extra_service_role_insert" ON public.user_profile_extra FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "user_profile_extra_service_role_delete" ON public.user_profile_extra FOR DELETE TO service_role USING (true);

-- ============================================================
-- 7. Seed data: 17 companies
-- ============================================================
INSERT INTO public.companies
  (slug, name, tagline, description, card_tagline, card_description, services, tags, logo_file, sort_order)
VALUES
  ('us-holding', 'Holding', 'Центр стратегического управления группой', 'US Holding — головная компания группы. Обеспечивает финансовую устойчивость холдинга, осуществляет аудит, юридическую защиту активов и распределение инвестиционных потоков. Формирует единую миссию и ценности бренда на строительном рынке.', 'Головная компания', 'Центр стратегического планирования и корпоративного управления всей группой компаний.', ARRAY['Стратегическое планирование','Корпоративное управление','Финансовый аудит','Юридическая защита активов','Управление инвестиционными потоками','Развитие бренда'], ARRAY[]::TEXT[], '/logo/US Holding.svg', 1),
  ('us-development', 'Development', 'Девелопер полного цикла', 'US Development — подразделение по развитию строительных проектов. Специализируется на поиске перспективных участков, разработке концепций застройки и расчете экономической эффективности. Берет на себя полный цикл разрешительной документации и взаимодействие с государственными органами.', 'Девелопмент', 'Поиск перспективных участков, разработка концепций и полный цикл разрешительной документации.', ARRAY['Поиск и анализ участков','Разработка концепций застройки','Технико-экономическое обоснование','Разрешительная документация','Взаимодействие с госорганами'], ARRAY[]::TEXT[], '/logo/US Development.svg', 2),
  ('us-capital', 'Capital', 'Инвестиционный департамент', 'US Capital — финансовое ядро группы, отвечающее за привлечение капитала и управление инвестициями. Работает с банковскими инструментами, частными инвесторами и государственными программами финансирования. Обеспечивает бесперебойный денежный поток для реализации масштабных объектов.', 'Инвестиции', 'Привлечение капитала и управление инвестициями. Банковские инструменты и частные инвесторы.', ARRAY['Привлечение капитала','Проектное финансирование','Работа с банками','Частные инвесторы','Государственные программы финансирования','Управление денежными потоками'], ARRAY[]::TEXT[], '/logo/US Capital.svg', 3),
  ('us-academy', 'Academy', 'Корпоративный университет', 'US Academy — центр подготовки и развития профессиональных кадров. Готовит инженеров, прорабов и топ-менеджеров по уникальным внутренним стандартам качества US. Позволяет холдингу не зависеть от дефицита на рынке труда и гарантирует единство технологий на всех площадках.', 'Корпоративный университет', 'Подготовка инженеров, прорабов и менеджеров по внутренним стандартам качества US.', ARRAY['Подготовка инженеров','Обучение прорабов','Развитие топ-менеджеров','Внутренние стандарты качества US','Корпоративный HR'], ARRAY[]::TEXT[], '/logo/US Academy.svg', 4),
  ('us-project', 'Project', 'Проектный институт', 'US Project — единый центр архитектурных и инженерных решений. Разрабатывает полный пакет проектно-сметной документации: от первых эскизов до сложнейших конструктивных расчетов. Сопровождает проекты в Госэкспертизе и осуществляет авторский надзор за точностью реализации идей.', 'Проектирование', 'Полный пакет проектно-сметной документации от первых эскизов до сложнейших конструктивных расчётов.', ARRAY['Архитектурное проектирование','Конструктивные расчеты','Проектно-сметная документация','Прохождение Госэкспертизы','Авторский надзор'], ARRAY[]::TEXT[], '/logo/US Project.svg', 5),
  ('us-design', 'Design', 'Бюро интерьера и ландшафта', 'US Design — бюро интерьера и ландшафта. Создает эстетический облик и коммерческую привлекательность объектов. Разрабатывает дизайн-проекты холлов, типовых квартир и офисных пространств. Отвечает за концепции благоустройства и ландшафтный дизайн.', 'Дизайн', 'Дизайн интерьеров, холлов и офисных пространств. Концепции ландшафтного благоустройства.', ARRAY['Дизайн интерьеров','Ландшафтный дизайн','Дизайн холлов и общественных пространств','Концепции благоустройства','Типовые квартиры и офисы'], ARRAY[]::TEXT[], '/logo/US Design.svg', 6),
  ('us-quality', 'Quality', 'Служба технического надзора', 'US Quality — независимое подразделение контроля качества. Осуществляет жесткий мониторинг на всех этапах строительства, проверяя соответствие работ СНиПам и проектным решениям. Гарантирует надежность, безопасность и долговечность каждого здания.', 'Контроль качества', 'Независимый мониторинг на всех этапах строительства. Соответствие СНиПам и проектным решениям.', ARRAY['Технический надзор','Проверка соответствия СНиПам','Мониторинг на всех этапах','Контроль проектных решений','Независимая инспекция'], ARRAY[]::TEXT[], '/logo/US Quality.svg', 7),
  ('us-construction', 'Construction', 'Генеральный подрядчик', 'US Construction — главное строительное подразделение, координирующее все процессы на площадке. Управляет возведением объектов, координирует работу профильных подразделений и субподрядчиков. Отвечает за соблюдение графиков, технику безопасности и финальный ввод здания в эксплуатацию.', 'Генподряд', 'Координация всех процессов на площадке. Соблюдение графиков и ввод объектов в эксплуатацию.', ARRAY['Генеральный подряд','Управление строительством','Координация субподрядчиков','Техника безопасности','Ввод объектов в эксплуатацию'], ARRAY[]::TEXT[], '/logo/US Construction.svg', 8),
  ('us-engineering', 'Engineering', 'Инфраструктурное строительство', 'US Engineering специализируется на создании внешней среды и магистральных сетей. Строит дороги, мосты и подводит коммуникации к объектам. Отвечает за энергетическую инфраструктуру: установку подстанций и прокладку ЛЭП.', 'Инфраструктура', 'Дороги, мосты, коммуникации и энергетическая инфраструктура объектов.', ARRAY['Строительство дорог и мостов','Водоснабжение и теплотрассы','Электроподстанции','Прокладка ЛЭП','Внешние инженерные сети'], ARRAY[]::TEXT[], '/logo/US Engineering.svg', 9),
  ('us-systems', 'Systems', 'Центр внутренних систем', 'US Systems — эксперт в области «интеллектуальной начинки» зданий. Занимается монтажом систем отопления, вентиляции, водопровода и канализации. Реализует цифровую инфраструктуру: слаботочные сети, скоростной интернет и системы безопасности.', 'Инженерные системы', 'Монтаж ОВК, водопровода, канализации, слаботочных сетей и систем безопасности.', ARRAY['Отопление и вентиляция','Водоснабжение и канализация','Слаботочные сети','Интернет-инфраструктура','Системы безопасности'], ARRAY[]::TEXT[], '/logo/US Systems.svg', 10),
  ('us-industry', 'Industry', 'Промышленное строительство', 'US Industry — подразделение по возведению индустриальных объектов: заводов, логистических хабов и складов. Специализируется на быстровозводимых конструкциях и промышленных полах. Учитывает специфические технологические требования производственных предприятий.', 'Промышленность', 'Заводы, логистические хабы и склады. Быстровозводимые конструкции и промышленные полы.', ARRAY['Промышленное строительство','Логистические хабы','Складские комплексы','Быстровозводимые конструкции','Промышленные полы'], ARRAY[]::TEXT[], '/logo/US Industry.svg', 11),
  ('us-prime', 'Prime', 'Фит-аут и чистовая отделка', 'US Prime — компания фит-аута и отделки. Реализует финальный этап создания объекта. Выполняет стандартизированную чистовую отделку квартир и офисов «под ключ». Обеспечивает высокое качество материалов и эстетику финишных покрытий в классах Comfort и Business.', 'Фит-аут и отделка', 'Чистовая отделка квартир и офисов под ключ в классах Comfort и Business.', ARRAY['Чистовая отделка квартир','Отделка офисов под ключ','Класс Comfort','Класс Business','Финишные покрытия'], ARRAY[]::TEXT[], '/logo/US Prime.svg', 12),
  ('us-trade', 'Trade', 'Торговый дом и снабжение', 'US Trade — централизованный закупочный центр всей группы компаний. За счет прямого сотрудничества с заводами-изготовителями и больших объемов закупок обеспечивает холдинг материалами по минимальной себестоимости. Контролирует качество поставок и оптимизирует расходы на ресурсы.', 'Снабжение', 'Централизованные закупки напрямую у заводов-изготовителей. Минимальная себестоимость для всей группы.', ARRAY['Централизованные закупки','Прямые контракты с заводами','Оптовые поставки','Контроль качества поставок','Оптимизация расходов'], ARRAY[]::TEXT[], '/logo/US Trade.svg', 13),
  ('us-logistics', 'Logistics', 'Механизация и логистика', 'US Logistics — технологическое ядро группы, владеющее собственным парком спецтехники. Обеспечивает объекты башенными кранами, экскаваторами и бетоносмесителями. Управляет цепочками поставок материалов, гарантируя техническую автономность холдинга.', 'Механизация', 'Собственный парк спецтехники: краны, экскаваторы, бетоносмесители. Управление цепочками поставок.', ARRAY['Башенные краны','Экскаваторы и спецтехника','Бетоносмесители','Управление цепочками поставок','Логистика на объектах'], ARRAY[]::TEXT[], '/logo/US Logistics.svg', 14),
  ('us-sales', 'Sales', 'Департамент реализации', 'US Sales — внутреннее агентство недвижимости, ответственное за продажи и аренду построенных площадей. Эксперты подразделения сопровождают клиентов на всех этапах сделки, помогают с выбором планировок и оформлением ипотечных программ.', 'Продажи', 'Продажи и аренда построенных площадей. Сопровождение сделок и ипотечные программы.', ARRAY['Продажи жилья','Аренда коммерческих площадей','Ипотечные программы','Юридическое сопровождение сделок','Брокеридж'], ARRAY[]::TEXT[], '/logo/US Sales.svg', 15),
  ('us-media', 'Media', 'Маркетинговое агентство', 'US Media — творческий центр по продвижению бренда и проектов холдинга. Занимается позиционированием объектов на рынке, брендингом ЖК, рекламой и PR-сопровождением. Создает визуальный контент и управляет репутацией группы компаний в информационном пространстве.', 'Маркетинг', 'Брендинг, реклама и PR. Визуальный контент и управление репутацией группы.', ARRAY['Позиционирование объектов','Брендинг ЖК','Реклама и PR','Визуальный контент','Управление репутацией'], ARRAY[]::TEXT[], '/logo/US Media.svg', 16),
  ('us-service', 'Service', 'Управляющая компания', 'US Service — сервисная служба по обслуживанию объектов после ввода в эксплуатацию. Обеспечивает безупречную работу всех систем ЖК и бизнес-центров, следит за чистотой, безопасностью и уютом. Работает в формате современного сервиса, оперативно решая любые бытовые вопросы жителей.', 'Эксплуатация', 'Обслуживание ЖК и бизнес-центров. Чистота, безопасность и современный сервис для жителей.', ARRAY['Управляющая компания','Техническое обслуживание систем','Клининг','Охрана объектов','Сервис для жителей'], ARRAY[]::TEXT[], '/logo/US Service.svg', 17);

-- ============================================================
-- 8. Seed data: 6 portfolio projects
-- ============================================================
INSERT INTO public.portfolio_projects
  (slug, title, tag, location, builder, year, image_url, image_alt, sort_order)
VALUES
  ('azhar', 'ЖК «Ажар»', 'Жилая', 'г. Уральск', 'US Construction', '2025', NULL, 'ЖК «Ажар»', 1),
  ('prime-office', 'Офисный центр «Прайм»', 'Коммерческая', 'Астана', 'US Construction', '2025', NULL, 'Офисный центр «Прайм»', 2),
  ('logistics-complex', 'Логистический комплекс', 'Промышленная', 'г. Караганда', 'US Industry', '2025', NULL, 'Логистический комплекс', 3),
  ('apartments-design', 'Дизайнерская отделка апартаментов', 'Отделка', 'Астана', 'US Prime', '2025', NULL, 'Дизайнерская отделка апартаментов', 4),
  ('mfk-central', 'МФК «Центральный»', 'Девелопмент', 'г. Караганда', 'US Development', 'В работе', NULL, 'МФК «Центральный»', 5),
  ('new-city', 'Квартал «Новый город»', 'Проектирование', 'Астана', 'US Design', 'В работе', NULL, 'Квартал «Новый город»', 6);

-- ============================================================
-- 9. Storage bucket (создай вручную через Dashboard → Storage,
--    если этот запрос не выполнится)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;
