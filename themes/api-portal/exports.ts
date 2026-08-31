/**
 * API Portal Theme — Standardized Exports
 */

export { default as ThemeLayout } from './layout';
export { default as ThemeHomepage } from './homepage';

// ── Stub exports required by the app shell ────────────────────────────
// These pages are not used by the API Portal theme but must be exported
// to satisfy the module resolver.
export { default as ThemeProductPage } from './stubs/product-page-stub';
export { default as ThemeContact } from './stubs/contact-stub';
export { default as ThemeAbout } from './stubs/about-stub';
export { default as ThemeShopContent } from './stubs/shop-content-stub';
export { default as ThemeCategoryContent } from './stubs/category-content-stub';
export { default as ThemeAuthLayout } from './stubs/auth-layout-stub';
