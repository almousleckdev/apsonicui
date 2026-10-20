# Message catalogs

`en.json` is the reference structure; `fr.json` and `zh.json` must stay key-for-key identical to it (same namespaces, same nesting). These are AI-assisted translations, not reviewed by a native speaker of each language — get one to check `fr.json`/`zh.json` before treating the copy as final.

## What's covered so far

Migrated to real per-request translations: the global shell (`Header`, `Navigation`, `Footer`, `MobileMenuButton`, `SearchInput`, `LanguageSelector`, `RightSidebar`), the admin login page, and the Contact and Services pages (including the `contact`/`auth` zod validation messages and the `FEATURE_CARDS` data in `lib/data/service-page.ts`).

**Not yet migrated** (still hardcoded, mostly Chinese, in the component/data file directly): the About and Products page bodies, the News section, the entire admin dashboard/products/users/news/categories/settings pages, and most of `lib/data/*`. This was a deliberate scope decision, not an oversight — see the Phase 2/3 plan.

## Pattern for migrating another component

1. Add the new keys to `en.json` under a sensible namespace, then translate the same keys into `fr.json` and `zh.json` (any zh source text already in the component is the reference translation for that key).
2. In the component: `const t = useTranslations('namespace');` (or `getTranslations` in a Server Component / a `<head>`-generating function), replace the literal string with `t('key')`.
3. For data files (the `lib/data/*` pattern): turn the static export into a function that takes `t` and returns the array/object, e.g. `getFeatureCards(t: ReturnType<typeof useTranslations>)` — see `lib/data/service-page.ts` for the worked example. Keep non-text fields (ids, hrefs, image paths) outside the translated object.
4. For form validation messages (zod): turn the static schema export into a factory function taking `t`, e.g. `createContactSchema(t)` — see `lib/schemas/contact.ts`. The hook that uses `zodResolver` calls `useTranslations()` and passes it into the factory.

## Why there's no `[locale]` URL segment

Locale is stored in a `NEXT_LOCALE` cookie (see `i18n/request.ts`), not a URL prefix — this avoided restructuring the entire `app/` route tree during the initial rollout.

Two accepted trade-offs came with that choice, confirmed via a production build:
- **No per-locale indexable URLs** — worse for SEO than one URL per language.
- **Every route lost static rendering.** Next.js cannot statically prerender a page whose render path reads a per-request cookie, and `getLocale()` does exactly that on every request. Before this change, most marketing routes were static (and `/products/[id]` was prerendered via `generateStaticParams`); after, all 21 routes are server-rendered on every request. This was a known cost, explicitly accepted rather than discovered later — see `app/layout.tsx`.

If/when either of these matters enough to revisit (SEO reach, or render latency at higher traffic), migrating to `next-intl`'s URL-based routing (`/en/...`, `/fr/...`, `/zh/...`) restores both, since each locale's pages become independently statically prerenderable again. That migration touches every route, every internal link, `proxy.ts`, `sitemap.ts`, and `robots.ts` — see https://next-intl.dev for that setup.


## The admin portal is bilingual (中文 / English) and has its own catalog

The admin does **not** use `en.json`/`zh.json`. Every admin label is written once, as an `[English, 中文]` pair, in `lib/i18n/admin/catalog/*.ts`, so the two languages can never drift apart (`tests/unit/admin-text.test.ts` also checks placeholders and that no Chinese entry is just English).

- In components: `<T id="pages.title" />` renders both languages (Chinese first and drawn larger, see `.admin-bi` in `app/globals.css`); `const { t } = useAdminText()` gives one plain string for placeholders, tooltips and toasts. Keys are type-checked.
- A person can show both, English only or Chinese only (cookie `ADMIN_TEXT`, set from the switch in the admin header; CSS hides the other language, so nothing re-renders).
- Texts that arrive from the server in English (page-builder section and field names) are translated by `lib/i18n/admin/glossary/builder.ts`, keyed by the English text. `tests/unit/admin-glossary.test.ts` checks it against `tests/fixtures/section-registry.json`, a snapshot of the server's `SectionRegistry`: when you add a field on the server, refresh the snapshot and add the Chinese.
- Validation problems are returned as `{ key, values }` (`lib/i18n/admin/problem.ts`) so forms can show them in the display language.

This is separate from the languages of the *content* (English / Français / 中文 tabs on pages, news, categories...), which editors write per language; the "Copy from English" buttons (`components/admin/shared/CopyFromLanguage.tsx`) help start a translation.
