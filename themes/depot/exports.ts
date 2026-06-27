/**
 * Depot Theme — Standardized Exports
 *
 * This barrel file provides a consistent export contract for the build-time
 * @theme alias. Every theme folder MUST export the same names from this file.
 *
 * If a component doesn't exist yet for this theme, it re-exports a placeholder.
 */

// ── Page-level components ─────────────────────────────────────────────
export { default as ThemeLayout } from './layout';
export { default as ThemeHomepage } from './homepage';
export { default as ThemeContact } from './contact';
export { default as ThemeAbout } from './about';

// ── Shop components ───────────────────────────────────────────────────
export { default as ThemeShopContent } from './components/shop/depot-shop-content';
export { default as ThemeCategoryContent } from './components/shop/depot-category-content';

// ── Product page ──────────────────────────────────────────────────────
export { default as ThemeProductPage } from './components/utils/product-page';

// ── Auth layout ───────────────────────────────────────────────────────
// Depot uses the shared default auth layout (no theme-specific override)
export { default as ThemeAuthLayout } from './auth-layout-stub';
