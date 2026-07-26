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
